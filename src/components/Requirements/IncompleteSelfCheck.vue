<template>
  <div class="incompleteselfcheck">
    <new-self-check-course-modal
      v-if="isCourseModalOpen"
      :subReqName="subReqName"
      :requirementId="subReqId"
      @add-course="addNewCourse"
      @close-course-modal="closeCourseModal"
    />
    <div class="separator"></div>
    <div class="top">{{ addCourseLabel }}</div>
    <div class="dropdown-select-wrapper">
      <div class="dropdown-select dropdown-input" v-click-outside="closeMenuIfOpen">
        <div class="dropdown-placeholder dropdown-wrapper" @click="showDropdown = !showDropdown">
          <span>Select Course</span>
        </div>
        <div class="dropdown-placeholder dropdown-arrow"></div>
      </div>
      <div class="dropdown-content" v-if="showDropdown">
        <div
          v-for="optionName in Object.keys(selfCheckCourses)"
          :key="optionName"
          class="dropdown-content-item"
          @click="addExistingCourse(optionName)"
        >
          <span>{{ optionName }}</span>
        </div>
        <div class="dropdown-content-item" @click="openCourseModal()">
          <span>{{ '+ Add new course to schedule' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { clickOutside, isPlaceholderCourse } from '@/utilities';
import store from '@/store';
import {
  cornellCourseRosterCourseToFirebaseSemesterCourseWithGlobalData,
  addCourseToSemester,
  updateRequirementChoice,
} from '@/global-firestore-data';
import {
  canFulfillChecker,
  getRelatedRequirementIdsForCourseOptOut,
} from '@/requirements/requirement-frontend-utils';

import NewSelfCheckCourseModal from '@/components/Modals/NewCourse/NewSelfCheckCourseModal.vue';

type Data = {
  showDropdown: boolean;
  isCourseModalOpen: boolean;
};

export default defineComponent({
  components: {
    NewSelfCheckCourseModal,
  },
  props: {
    subReqId: { type: String, required: true },
    subReqName: { type: String, required: true },
    subReqFulfillment: { type: String, required: true },
    subReqCourseId: { type: Number, required: true },
  },
  data(): Data {
    return {
      showDropdown: false,
      isCourseModalOpen: false,
    };
  },
  computed: {
    // limit self check course options to courses not already added to this requirement
    // and courses that are not already assigned to non-double countable requirements, if this req is not double countable
    // and courses that do not fulfill the requirement checker
    selfCheckCourses(): Record<string, FirestoreSemesterCourse> {
      const courses: Record<string, FirestoreSemesterCourse> = {};
      (
        store.state.plans.find(p => p === store.state.currentPlan)?.semesters ??
        store.state.plans[0].semesters
      )
        .flatMap(it => it.courses)
        .forEach(course => {
          if (
            isPlaceholderCourse(course) ||
            !canFulfillChecker(
              store.state.userRequirementsMap,
              store.state.toggleableRequirementChoices,
              this.subReqId,
              course.crseId
            )
          ) {
            // If the course can't help fulfill the checker (or is a placeholder), do not add to choices.
            return;
          }

          const currentlyMatchedRequirements = store.state.safeRequirementFulfillmentGraph.getConnectedRequirementsFromCourse(
            {
              uniqueId: course.uniqueID,
            }
          );
          if (currentlyMatchedRequirements.includes(this.subReqId)) {
            // If the course is already matched to the current requirement, do not add to choices.
            return;
          }

          /* TODO @bshen fix .allowCourseDoubleCounting flag
             we should allow the constraint violation to be broken, i.e. don't return early */
          const currentRequirementAllowDoubleCounting =
            store.state.userRequirementsMap[this.subReqCourseId]?.allowCourseDoubleCounting;
          const allOtherRequirementsAllowDoubleCounting = store.state.safeRequirementFulfillmentGraph
            .getConnectedRequirementsFromCourse({ uniqueId: course.uniqueID })
            .every(reqID => store.state.userRequirementsMap[reqID]?.allowCourseDoubleCounting);
          if (!currentRequirementAllowDoubleCounting && !allOtherRequirementsAllowDoubleCounting) {
            // At this point, we need to consider double counting issues.
            // There are 2 ways we can add the course to the requirement without double counting violations:
            // 1. This requirement allows double counting.
            // 2. All the already matched requirements allow double counting.
            // If both don't hold, we cannot add.
            return;
          }

          // All pre-conditions have been checked, we can add it as choice!
          courses[course.code] = course;
        });

      return courses;
    },
    addCourseLabel() {
      let label = 'Add Course';
      if (this.subReqFulfillment === 'courses') {
        label = `Add Course ${this.subReqCourseId + 1}`;
      }
      return label;
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  methods: {
    // filter to check if a course fulfills a requirements checker
    closeMenuIfOpen() {
      this.showDropdown = false;
    },
    addExistingCourse(option: string) {
      this.showDropdown = false;
      const { uniqueID, crseId } = this.selfCheckCourses[option];
      updateRequirementChoice(uniqueID, choice => ({
        ...choice,
        // Since we edit from a self-check requirement,
        // we know it must be `acknowledgedCheckerWarningOptIn`.
        acknowledgedCheckerWarningOptIn: Array.from(
          new Set([...choice.acknowledgedCheckerWarningOptIn, this.subReqId])
        ),
        // Keep existing behavior of keeping it connected to at most one requirement.
        optOut: getRelatedRequirementIdsForCourseOptOut(
          crseId,
          this.subReqId,
          store.state.groupedRequirementFulfillmentReport,
          store.state.toggleableRequirementChoices,
          store.state.userRequirementsMap
        ),
      }));
    },
    addNewCourse(course: CornellCourseRosterCourse, season: FirestoreSemesterSeason, year: number) {
      this.showDropdown = false;
      const newCourse = cornellCourseRosterCourseToFirebaseSemesterCourseWithGlobalData(course);
      addCourseToSemester(
        store.state.currentPlan,
        year,
        season,
        newCourse,
        // Since the course is new, we know the old choice does not exist.
        () => ({
          arbitraryOptIn: {},
          // Since we edit from a self-check requirement,
          // we know it must be `acknowledgedCheckerWarningOptIn`.
          acknowledgedCheckerWarningOptIn: [this.subReqId],
          // We also need to opt-out of all requirements without warnings,
          // because the user intention is clear that we only want to bind
          // the course to this specific requirement.
          optOut: getRelatedRequirementIdsForCourseOptOut(
            newCourse.crseId,
            this.subReqId,
            store.state.groupedRequirementFulfillmentReport,
            store.state.toggleableRequirementChoices,
            store.state.userRequirementsMap
          ),
        }),
        this.$gtag
      );
    },
    openCourseModal() {
      this.isCourseModalOpen = true;
    },
    closeCourseModal() {
      this.isCourseModalOpen = false;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_tokens.scss';

.separator {
  height: 1px;
  width: 100%;
  background-color: $cp-line;
  margin-top: 12px;
}

.top {
  @include cp-text(12px, 16px, 500);
  color: $cp-muted;
  margin: 12px 0 8px;
}

.dropdown {
  &-select {
    @include cp-input;
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    padding: 0 12px 0 0;
    cursor: pointer;

    &:hover {
      background: $cp-hover;
    }

    &-wrapper {
      position: relative;
      margin-bottom: 12px;
    }
  }
  &-placeholder {
    display: flex;
    align-items: center;
    background: transparent;
    color: $cp-muted;
  }
  &-wrapper {
    flex: 1;
    padding: 8px 12px;
  }
  &-arrow {
    @include cp-css-chevron;
  }
  &-content {
    @include cp-menu;
    z-index: 2;
    position: absolute;
    width: 100%;
    margin-top: 4px;
    max-height: 220px;
    overflow-y: auto;
    &-item {
      @include cp-menu-item;
    }
  }
}
</style>

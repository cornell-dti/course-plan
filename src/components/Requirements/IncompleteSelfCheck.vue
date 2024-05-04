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
@import '@/assets/scss/_variables.scss';

.separator {
  height: 1px;
  width: 100%;
  background-color: $inactiveGray;
  margin-top: 1rem;
}

.top {
  font-size: 14px;
  line-height: 17px;
  color: #757575;
  margin: 0.75rem 0;
}

.dropdown {
  &-select {
    display: flex;
    flex-direction: row;
    align-items: center;
    background: $white;
    border: 0.5px solid $inactiveGray;
    box-sizing: border-box;
    border-radius: 2px;
    width: 100%;
    font-size: 14px;
    line-height: 17px;
    color: $darkPlaceholderGray;
    position: relative;
    min-height: 1.625rem;

    &:not(:first-child) {
      margin-top: 0.5rem;
    }

    &-wrapper {
      position: relative;
      margin-bottom: 1rem;
    }
  }
  &-placeholder {
    height: 100%;
    font-size: 14px;
    line-height: 17px;
    margin-left: 0.5rem;
    display: flex;
    align-items: center;
    color: $lightPlaceholderGray;
    background: transparent;
    cursor: pointer;
  }
  &-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }
  &-arrow {
    border-left: 6.24px solid transparent;
    border-right: 6.24px solid transparent;
    border-top: 6.24px solid $inactiveGray;
    background: transparent;
    margin-right: 8.7px;
    margin-left: 5px;
    margin-top: auto;
    margin-bottom: auto;
  }
  &-content {
    z-index: 2;
    position: absolute;
    width: 100%;
    background: $white;
    box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
    border-radius: 7px;
    margin-top: 3px;
    max-height: 9rem;
    overflow-y: overlay;
    &-item {
      height: 2.25rem;
      font-size: 14px;
      line-height: 17px;
      display: flex;
      align-items: center;
      color: $lightPlaceholderGray;
      padding-left: 10px;
      cursor: pointer;

      &:first-child {
        border-radius: 7px 7px 0px 0px;
      }

      &:last-child {
        border-radius: 0px 0px 7px 7px;
      }
    }
  }
  &-content div:hover {
    background: rgba(50, 160, 242, 0.15);
    width: 100%;
  }
}
</style>

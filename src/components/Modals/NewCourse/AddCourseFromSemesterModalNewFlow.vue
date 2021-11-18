<template>
  <TeleportModal
    title="Add Course"
    content-class="content-add-new-course-from-semester"
    :leftButtonText="leftButtonText"
    right-button-text="Add"
    :rightButtonIsDisabled="selectedCourse == null"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backOrCancel"
    @right-button-clicked="addCourse"
  >
    <div class="add-new-course-from-semester-text">
      {{ selectedCourse === null ? 'Search Course Roster' : 'Selected Course' }}
    </div>
    <course-selector
      v-if="selectedCourse === null"
      search-box-class-name="add-new-course-from-semester-dropdown"
      :key="courseSelectorKey"
      placeholder='"CS 1110", "Multivariable Calculus", etc'
      :autoFocus="true"
      @on-escape="closeCurrentModal"
      @on-select="selectCourse"
      data-cyId="add-new-course-from-semester-dropdown"
    />
    <div v-else class="selected-course" data-cyId="add-new-course-from-semester">
      {{ selectedCourse.subject }} {{ selectedCourse.catalogNbr }}: {{ selectedCourse.titleLong }}
    </div>
    <div v-if="selectedCourse != null">
      <eligible-requirement-information
        :key="courseSelectorKey"
        :autoRequirements="requirementsThatAllowDoubleCounting"
        :nonAutoRequirements="nonAutoRequirements"
      />
    </div>
  </TeleportModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EligibleRequirementInformation from '@/components/Modals/NewCourse/EligibleRequirementInformation.vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import CourseSelector from '@/components/Modals/NewCourse/CourseSelector.vue';

import store from '@/store';
import { getAllEligibleRequirements } from '@/requirements/requirement-frontend-utils';

export default defineComponent({
  components: { CourseSelector, TeleportModal, EligibleRequirementInformation },
  emits: {
    'close-course-modal': () => true,
    'add-course': (course: CornellCourseRosterCourse, choice: FirestoreCourseOptInOptOutChoices) =>
      typeof course === 'object' && typeof choice === 'object',
  },
  data() {
    return {
      selectedCourse: null as CornellCourseRosterCourse | null,
      requirementsThatAllowDoubleCounting: [] as readonly string[],
      nonAutoRequirements: [] as readonly string[],
      courseSelectorKey: 0,
    };
  },
  computed: {
    leftButtonText(): string {
      if (this.selectedCourse == null) return 'Cancel';
      return 'Back';
    },
  },
  methods: {
    selectCourse(result: CornellCourseRosterCourse) {
      this.selectedCourse = result;
      this.getReqsRelatedToCourse(result);
    },
    closeCurrentModal() {
      this.$emit('close-course-modal');
    },
    getReqsRelatedToCourse(selectedCourse: CornellCourseRosterCourse) {
      const {
        requirementsThatAllowDoubleCounting,
        relatedRequirements,
        selfCheckRequirements,
      } = getAllEligibleRequirements(
        selectedCourse.crseId,
        store.state.groupedRequirementFulfillmentReport,
        store.state.toggleableRequirementChoices
      );
      this.requirementsThatAllowDoubleCounting = requirementsThatAllowDoubleCounting.map(
        it => it.name
      );
      this.nonAutoRequirements = [...relatedRequirements, ...selfCheckRequirements].map(
        it => it.name
      );
    },
    addCourse() {
      if (this.selectedCourse == null) return;
      this.$emit('add-course', this.selectedCourse, {
        optOut: [],
        acknowledgedCheckerWarningOptIn: [],
        arbitraryOptIn: {},
      });
      this.closeCurrentModal();
    },
    backOrCancel() {
      if (this.leftButtonText === 'Back') {
        this.selectedCourse = null;
        this.courseSelectorKey += 1;
      } else {
        this.closeCurrentModal();
      }
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
.add-new-course-from-semester {
  &-text {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
  }
  &-dropdown {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    width: 100%;
    border-radius: 3px;
    padding: 0.5rem;
    border: 0.5px solid $inactiveGray;
    &::placeholder {
      color: $darkPlaceholderGray;
    }
  }
  &-name {
    position: relative;
    border-radius: 11px;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: $darkGray;
  }
  &-title {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    margin-bottom: 6px;
  }
}

.content-add-new-course-from-semester {
  width: 27.75rem;

  .selected-course {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: $black;
    margin-bottom: 20px;
    margin-top: 8px;
  }
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-add-new-course-from-semester {
    width: 100%;
  }
}
</style>

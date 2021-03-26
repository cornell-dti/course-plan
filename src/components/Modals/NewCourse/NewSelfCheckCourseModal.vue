<template>
  <flexible-modal
    :title="modalTitle"
    content-class="content-course"
    :leftButtonText="leftButtonText"
    :rightButtonText="rightButtonText"
    :rightButtonIsDisabled="!canAddCourse"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backOrCancel"
    @right-button-clicked="addCourse"
  >
    <div class="newCourse-text">Search Course Roster</div>
    <course-selector
      search-box-class-name="newCourse-dropdown"
      :key="courseSelectorKey"
      :courseFilter="courseCanAppearInSearchResult"
      placeholder='"CS 1110", "Multivariable Calculus", etc'
      :autoFocus="true"
      @on-escape="closeCurrentModal"
      @on-select="setCourse"
    />
    <div>
      <div class="newCourse-title">Add this class to the following semester</div>
      <div class="newCourse-semester-edit">
        <new-semester
          :type="season"
          :year="year"
          :isCourseModelSelectingSemester="true"
          @updateSemProps="updateSemProps"
        />
      </div>
    </div>
  </flexible-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import FlexibleModal from '@/components/Modals/FlexibleModal.vue';
import NewSemester from '@/components/Modals/NewSemester.vue';
import CourseSelector from '@/components/Modals/NewCourse/CourseSelector.vue';
import store, { VuexStoreState } from '@/store';
import { getMatchedRequirementFulfillmentSpecification } from '@/requirements/requirement-frontend-utils';

const getFilter = (
  { userRequirementsMap, toggleableRequirementChoices }: VuexStoreState,
  requirementId: string
): ((course: CornellCourseRosterCourse) => boolean) => {
  const requirement = userRequirementsMap[requirementId];
  // If we cannot find the relevant requirement, then default to true to be permissive.
  if (requirement == null) return () => true;
  const requirementSpec = getMatchedRequirementFulfillmentSpecification(
    requirement,
    toggleableRequirementChoices
  );
  // If a requirement is truly self-check, then all courses can be used.
  if (requirementSpec == null) return () => true;
  const eligibleCourseIds = new Set(requirementSpec.eligibleCourses.flat());
  return course => eligibleCourseIds.has(course.crseId);
};

export default Vue.extend({
  components: { CourseSelector, FlexibleModal, NewSemester },
  props: {
    subReqName: { type: String, required: true },
    requirementId: { type: String, required: true },
  },
  data() {
    return {
      selectedCourse: null as CornellCourseRosterCourse | null,
      courseSelectorKey: 0,
      season: '' as FirestoreSemesterType,
      year: 0,
    };
  },
  computed: {
    modalTitle(): string {
      return `Add Course to ${this.subReqName}`;
    },
    leftButtonText(): string {
      return 'CANCEL';
    },
    rightButtonText(): string {
      return 'ADD';
    },
    canAddCourse(): boolean {
      return this.selectedCourse != null && this.year > 0 && String(this.season) !== 'Select';
    },
    courseCanAppearInSearchResult(): (course: CornellCourseRosterCourse) => boolean {
      return getFilter(store.state, this.requirementId);
    },
  },
  methods: {
    closeCurrentModal() {
      this.reset();
      this.$emit('close-course-modal');
    },
    setCourse(result: CornellCourseRosterCourse) {
      this.selectedCourse = result;
    },
    addCourse() {
      if (this.selectedCourse == null) return;
      this.$emit('add-course', this.selectedCourse, this.season, this.year);
      this.closeCurrentModal();
    },
    reset() {
      this.courseSelectorKey += 1;
      this.selectedCourse = null;
      this.year = 0;
      this.season = '' as FirestoreSemesterType;
    },
    backOrCancel() {
      this.closeCurrentModal();
    },
    updateSemProps(season: FirestoreSemesterType, year: number) {
      this.season = season;
      this.year = year;
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
.newCourse {
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
  &-semester {
    &-edit {
      width: 50%;
    }
  }
  &-title {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    margin-bottom: 6px;
  }
}

.content-course {
  width: 27.75rem;
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-course {
    width: 100%;
  }
}
</style>

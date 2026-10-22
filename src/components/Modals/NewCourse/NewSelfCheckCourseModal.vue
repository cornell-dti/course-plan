<template>
  <TeleportModal
    :title="modalTitle"
    content-class="content-course"
    :leftButtonText="leftButtonText"
    :rightButtonText="rightButtonText"
    :rightButtonIsDisabled="!canAddCourse"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backOrCancel"
    @right-button-clicked="addCourse"
  >
    <div class="newCourse-text">
      {{ selectedCourse === null ? 'Search Course Roster' : 'Selected Course' }}
    </div>
    <course-selector
      v-if="selectedCourse === null"
      search-box-class-name="newCourse-dropdown"
      :key="courseSelectorKey"
      :courseFilter="courseCanAppearInSearchResult"
      placeholder='"CS 1110", "Multivariable Calculus", etc'
      :autoFocus="true"
      @on-escape="closeCurrentModal"
      @on-select="setCourse"
      :allow-blank-card="false"
    />
    <div v-else class="selected-course">
      {{ selectedCourse.subject }} {{ selectedCourse.catalogNbr }}:
      {{ selectedCourse.titleLong }}
    </div>
    <div>
      <div class="newCourse-title">Add this class to the following semester</div>
      <div class="newCourse-semester-edit">
        <select-semester
          :season="season"
          :year="year"
          :isCourseModelSelectingSemester="true"
          @updateSemProps="updateSemProps"
        />
      </div>
    </div>
  </TeleportModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import SelectSemester from '@/components/Modals/SelectSemester.vue';
import CourseSelector from '@/components/Modals/NewCourse/CourseSelector.vue';
import store from '@/store';
import { getFilterForRequirementFulfillment } from '@/requirements/requirement-frontend-utils';

export default defineComponent({
  components: { CourseSelector, TeleportModal, SelectSemester },
  props: {
    subReqName: { type: String, required: true },
    requirementId: { type: String, required: true },
  },
  emits: {
    'close-course-modal': () => true,
    'add-course': (
      selected: CornellCourseRosterCourse,
      season: FirestoreSemesterSeason,
      year: number
    ) => typeof selected === 'object' && typeof season === 'string' && typeof year === 'number',
  },
  data() {
    return {
      selectedCourse: null as CornellCourseRosterCourse | null,
      courseSelectorKey: 0,
      season: '' as FirestoreSemesterSeason,
      year: 0,
    };
  },
  computed: {
    modalTitle(): string {
      return `Add Course to ${this.subReqName}`;
    },
    leftButtonText(): string {
      return this.selectedCourse === null ? 'Cancel' : 'Back';
    },
    rightButtonText(): string {
      return 'Add';
    },
    canAddCourse(): boolean {
      return this.selectedCourse != null && this.year > 0 && String(this.season) !== 'Select';
    },
    courseCanAppearInSearchResult(): (course: CornellCourseRosterCourse) => boolean {
      return getFilterForRequirementFulfillment(
        store.state.userRequirementsMap,
        store.state.toggleableRequirementChoices,
        this.requirementId
      );
    },
  },
  methods: {
    closeCurrentModal() {
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
    backOrCancel() {
      if (this.selectedCourse !== null) {
        this.selectedCourse = null;
        this.courseSelectorKey += 1;
      } else {
        this.closeCurrentModal();
      }
    },
    updateSemProps(season: string, year: number) {
      this.season = season as FirestoreSemesterSeason;
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

.selected-course {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
  color: $black;
  margin-bottom: 20px;
  margin-top: 8px;
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-course {
    width: 100%;
  }
}
</style>

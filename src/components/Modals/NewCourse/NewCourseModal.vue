<template>
  <TeleportModal
    title="Add Course"
    content-class="content-course"
    :leftButtonText="leftButtonText"
    :rightButtonText="rightButtonText"
    :rightButtonIsDisabled="selectedCourse == null"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backOrCancel"
    @right-button-clicked="addItem"
  >
    <div class="newCourse-text">
      {{ selectedCourse === null ? 'Search Course Roster' : 'Selected Course' }}
    </div>
    <course-selector
      v-if="selectedCourse === null"
      search-box-class-name="newCourse-dropdown"
      :key="courseSelectorKey"
      placeholder='"CS 1110", "Multivariable Calculus", etc'
      :autoFocus="true"
      @on-escape="closeCurrentModal"
      @on-select="selectCourse"
      @on-add-blank-course="addBlankCourseCard"
      data-cyId="newCourse-dropdown"
      :courses-array="courseArrayBySem"
      :allow-blank-card="!filterForRequirementID"
    />
    <div v-else class="selected-course" data-cyId="newCourse-selectedCourse">
      {{ selectedCourse.subject }} {{ selectedCourse.catalogNbr }}:
      {{ selectedCourse.titleLong }}
    </div>
    <div v-if="selectedCourse != null">
      <!-- if a course is selected -->
      <selected-requirement-editor
        :key="courseSelectorKey"
        :editMode="editMode"
        :selectedRequirementID="selectedRequirementID"
        :automaticallyFulfilledRequirements="automaticallyFulfilledRequirements"
        :relatedRequirements="relatedRequirements"
        :potentialRequirements="selfCheckRequirements"
        @on-selected-change="onSelectedChange"
        @edit-mode="toggleEditMode"
      />
    </div>

    <!-- Add a blank course card button in a fixed position at the bottom -->
    <div class="blank-course-button-container" v-if="selectedCourse === null && !filterForRequirementID">
      <button class="add-blank-course" @click="addBlankCourseCard">+ Add Blank Course Card</button>
    </div>
  </TeleportModal>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import SelectedRequirementEditor from '@/components/Modals/NewCourse/SelectedRequirementEditor.vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import CourseSelector from '@/components/Modals/NewCourse/CourseSelector.vue';

import store from '@/store';
import {
  getRelatedRequirementIdsForCourseOptOut,
  getRelatedUnfulfilledRequirements,
  getFilterForRequirementFulfillment,
} from '@/requirements/requirement-frontend-utils';
import { specificRosterCoursesArray } from '@/assets/courses/typed-full-courses';
import { seasonAndYearToRosterIdentifier } from '../../../user-data-converter';

export default defineComponent({
  props: {
    year: { type: Number, required: false, default: undefined },
    season: {
      type: String as PropType<FirestoreSemesterSeason>,
      required: false,
      default: undefined,
    },
    // An optional filter for the course selector. If set, only
    // allows for viewing (and so selecting) courses that fulfill
    // the given requirement.
    filterForRequirementID: {
      type: String as PropType<string>,
      required: false,
      default: '',
    },
  },
  components: { CourseSelector, TeleportModal, SelectedRequirementEditor },
  emits: {
    'close-course-modal': () => true,
    'select-course': (course: CornellCourseRosterCourse) => typeof course === 'object',
    'add-course': (course: CornellCourseRosterCourse, choice: FirestoreCourseOptInOptOutChoices) =>
      typeof course === 'object' && typeof choice === 'object',
    'add-blank-course-card': () => true,
  },
  data() {
    return {
      selectedCourse: null as CornellCourseRosterCourse | null,
      selectedRequirementID: '',
      automaticallyFulfilledRequirements: [] as readonly string[],
      // relatedRequirements : the requirements that don't allow double counting
      relatedRequirements: [] as readonly RequirementWithIDSourceType[],
      selfCheckRequirements: [] as readonly RequirementWithIDSourceType[],
      editMode: false,
      courseSelectorKey: 0,
      isOpen: false,
    };
  },
  computed: {
    leftButtonText(): string {
      if (this.selectedCourse == null && !this.editMode) return 'Cancel';
      return 'Back';
    },
    rightButtonText(): string {
      return this.editMode ? 'Next' : 'Add';
    },
    courseArrayBySem(): readonly CornellCourseRosterCourse[] | undefined {
      if (this.season !== undefined && this.year !== undefined) {
        const currRoster = seasonAndYearToRosterIdentifier(this.season, this.year);
        const courses = specificRosterCoursesArray(currRoster);
        if (this.filterForRequirementID) {
          return courses.filter(
            getFilterForRequirementFulfillment(
              store.state.userRequirementsMap,
              store.state.toggleableRequirementChoices,
              this.filterForRequirementID
            )
          );
        }
        return courses;
      }
      return undefined;
    },
  },
  methods: {
    // Hannah's note: only call this function for user is adding a cornell course
    selectCourse(result: CornellCourseRosterCourse) {
      this.selectedCourse = result;
      this.$emit('select-course', this.selectedCourse);
      this.getReqsRelatedToCourse(result);
    },
    closeCurrentModal() {
      this.$emit('close-course-modal');
    },
    getReqsRelatedToCourse(selectedCourse: CornellCourseRosterCourse) {
      const {
        relatedRequirements,
        selfCheckRequirements,
        automaticallyFulfilledRequirements,
      } = getRelatedUnfulfilledRequirements(
        selectedCourse,
        store.state.groupedRequirementFulfillmentReport,
        store.state.onboardingData,
        store.state.toggleableRequirementChoices,
        store.state.overriddenFulfillmentChoices,
        store.state.userRequirementsMap
      );
      const automaticallyFulfilledRequirementIds = new Set(
        automaticallyFulfilledRequirements.map(({ id }) => id)
      );

      this.automaticallyFulfilledRequirements = automaticallyFulfilledRequirements.map(
        ({ name }) => name
      );
      this.relatedRequirements = relatedRequirements.filter(
        req => !automaticallyFulfilledRequirementIds.has(req.id)
      );
      this.selfCheckRequirements = selfCheckRequirements.filter(
        req => !automaticallyFulfilledRequirementIds.has(req.id)
      );
      if (this.relatedRequirements.length > 0) {
        this.selectedRequirementID = this.relatedRequirements[0].id;
      } else {
        this.selectedRequirementID = '';
      }
    },
    addItem() {
      if (this.editMode) {
        this.editMode = false;
      } else {
        this.addCourse();
      }
    },
    // Hannah's note: check the selectedCourse type
    // if its a cornellcourseroster, then keep this code
    // else, we are adding a new blank course card, do not follow through
    addCourse() {
      if (this.selectedCourse == null) return;
      this.$emit('add-course', this.selectedCourse, {
        optOut: getRelatedRequirementIdsForCourseOptOut(
          this.selectedCourse.crseId,
          this.selectedRequirementID,
          store.state.groupedRequirementFulfillmentReport,
          store.state.toggleableRequirementChoices,
          store.state.userRequirementsMap
        ),
        // Only include the selected requirement from opt-in.
        acknowledgedCheckerWarningOptIn: this.selfCheckRequirements
          .filter(it => it.id === this.selectedRequirementID)
          .map(it => it.id),
        arbitraryOptIn: {},
      });
      this.closeCurrentModal();
    },
    onSelectedChange(selected: string) {
      this.selectedRequirementID = selected;
    },
    backOrCancel() {
      if (this.leftButtonText === 'Back') {
        if (this.editMode) {
          this.editMode = false;
        } else {
          this.selectedCourse = null;
          this.courseSelectorKey += 1;
        }
      } else {
        this.closeCurrentModal();
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    // New method for adding a blank course card
    addBlankCourseCard() {
      this.$emit('add-blank-course-card');
      this.closeCurrentModal();
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

.selected-course {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
  color: $black;
  margin-bottom: 20px;
  margin-top: 8px;
}

.content-course {
  width: 27.75rem;
}

/* New styles for the blank course card button */
.blank-course-button-container {
  position: absolute;
  left: 16px;
  bottom: 18px;
  display: flex;
  align-items: center;
  height: 28px;
}

.add-blank-course {
  background: none;
  border: none;
  color: $sangBlue;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  text-align: left;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-course {
    width: 100%;
  }
}
</style>

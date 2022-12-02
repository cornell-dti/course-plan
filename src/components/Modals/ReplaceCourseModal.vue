<template>
  <teleport-modal
    title="Replace Course"
    content-class="content-course"
    :leftButtonText="leftButtonText"
    :rightButtonText="rightButtonText"
    :rightButtonIsDisabled="selectedCourse == null"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backOrCancel"
    @right-button-clicked="addItem"
  >
    <div class="newCourse-text">
      {{ searchText }}
    </div>
    <div v-if="selectedCourse != null" class="selected-course" data-cyId="newCourse-selectedCourse">
      {{ selectedCourse.subject }} {{ selectedCourse.catalogNbr }}:
      {{ selectedCourse.titleLong }}
    </div>
    <!-- show search bar if still selecting -->
    <div v-if="selecting">
      <course-selector
        v-if="selectedCourse === null"
        search-box-class-name="newCourse-dropdown"
        :placeholder="placeholderText"
        :autoFocus="true"
        @on-escape="closeCurrentModal"
        @on-select="selectCourse"
        data-cyId="newCourse-dropdown"
      />
      <div class="newCourse-text" v-if="selectedCourse === null">
        <img
          class="requirement-checker-warning-icon"
          src="@/assets/images/warning.svg"
          alt="warning icon"
        />
        We can't check that this course correctly fulfills the requirement so check carefully before
        selecting.
      </div>
    </div>
    <!-- show add modal -->
    <div v-else-if="needToAdd && selectedCourse != null">
      <replace-requirement-editor
        :editMode="editMode"
        :selectedRequirementID="selectedRequirementID"
        :automaticallyFulfilledRequirements="automaticallyFulfilledRequirements"
        :relatedRequirements="relatedRequirements"
        :potentialRequirements="selfCheckRequirements"
        @on-selected-change="onSelectedChange"
        @edit-mode="toggleEditMode"
      />
    </div>
    <!-- show duplicate modal -->
    <div v-else-if="hasDuplicates && selectedCourse != null">
      <replace-requirement-duplicate-editor
        :editMode="editMode"
        :selectedRequirementID="selectedRequirementID"
        :automaticallyFulfilledRequirements="automaticallyFulfilledRequirements"
        :relatedRequirements="relatedRequirements"
        :potentialRequirements="selfCheckRequirements"
        :semestersTaken="semestersTaken"
        @on-selected-change="onSelectedChange"
        @edit-mode="toggleEditMode"
      />
    </div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReplaceRequirementEditor from './NewCourse/ReplaceRequirementEditor.vue';
import ReplaceRequirementDuplicateEditor from './NewCourse/ReplaceRequirementDuplicateEditor.vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import CourseSelector from '@/components/Modals/NewCourse/CourseSelector.vue';

import store from '@/store';
import { getRelatedUnfulfilledRequirements } from '@/requirements/requirement-frontend-utils';

const leftButtonState = {
  Back: 'Back',
  Cancel: 'Cancel',
} as const;
/**
 * Modal to replace course requirement, opens the modal to add course if none
 * of that course exists, else opens the modal to resolve duplicates of the
 * course if it exists, else closes the modal if one of that course exists
 */
export default defineComponent({
  components: {
    CourseSelector,
    TeleportModal,
    ReplaceRequirementEditor,
    ReplaceRequirementDuplicateEditor,
  },
  emits: {
    'close-replace-course-modal': () => true,
    'select-course': (course: CornellCourseRosterCourse) => typeof course === 'object',
    'add-course': (course: CornellCourseRosterCourse, selectableReqId: string) =>
      typeof course === 'object' && typeof selectableReqId === 'string',
  },
  data() {
    return {
      selecting: true,
      selectedCourse: null as CornellCourseRosterCourse | null,
      selectedRequirementID: '',
      automaticallyFulfilledRequirements: [] as readonly string[],
      // relatedRequirements : the requirements that don't allow double counting
      relatedRequirements: [] as readonly RequirementWithIDSourceType[],
      selfCheckRequirements: [] as readonly RequirementWithIDSourceType[],
      editMode: false,
      isOpen: false,
      hasDuplicates: false,
      needToAdd: false,
      semestersTaken: [] as FirestoreSemester[],
    };
  },
  computed: {
    placeholderText(): string {
      return '"CS 1110", "Multivariable Calculus", etc';
    },
    leftButtonText(): string {
      if (this.selectedCourse == null && !this.editMode) return leftButtonState.Cancel;
      return leftButtonState.Back;
    },
    rightButtonText(): string {
      return this.editMode ? 'Next' : 'Add';
    },

    searchText(): string {
      return this.selecting ? 'Search Course Roster' : 'Selected Course';
    },
  },
  methods: {
    // gets the semesters that the selected course exists in
    getSemestersTaken() {
      for (const semester of store.state.semesters) {
        for (const course of semester.courses) {
          if ('crseId' in course) {
            if (this.selectedCourse?.crseId === course.crseId) {
              this.semestersTaken.push(semester);
            }
          }
        }
      }
    },
    handleAdd() {
      this.selecting = false;
      this.getSemestersTaken();
      const count = this.semestersTaken.length;
      if (count === 0) {
        // opens the add modal if the course does not exist
        this.needToAdd = true;
      } else if (count > 1) {
        // opens the duplicates modal if the course exists 2+ times
        this.hasDuplicates = true;
      } else {
        // closes the modal if the course exists exactly once
        this.closeCurrentModal();
      }
    },
    selectCourse(result: CornellCourseRosterCourse) {
      this.selectedCourse = result;
      this.$emit('select-course', this.selectedCourse);
      this.getReqsRelatedToCourse(result);
      this.handleAdd();
    },
    closeCurrentModal() {
      this.$emit('close-replace-course-modal');
    },
    getReqsRelatedToCourse(selectedCourse: CornellCourseRosterCourse) {
      const {
        relatedRequirements,
        selfCheckRequirements,
        automaticallyFulfilledRequirements,
      } = getRelatedUnfulfilledRequirements(
        selectedCourse,
        store.state.groupedRequirementFulfillmentReport,
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
    addCourse() {
      if (this.selectedCourse == null) return;
      this.$emit('add-course', this.selectedCourse, this.selectedRequirementID);
      this.closeCurrentModal();
    },
    onSelectedChange(selected: string) {
      this.selectedRequirementID = selected;
    },
    backOrCancel() {
      if (this.leftButtonText === leftButtonState.Back) {
        if (this.editMode) {
          this.editMode = false;
        } else {
          this.selectedCourse = null;
          this.semestersTaken = [];
          this.selecting = true;
        }
      } else {
        this.closeCurrentModal();
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
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

.requirement-checker-warning {
  color: $warning;
  margin-top: 0.25rem;

  &-icon {
    float: left;
    margin: 0.125rem 0.25rem 0 0;
    width: 14px;
    height: 14px;
  }
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-course {
    width: 100%;
  }
}
</style>

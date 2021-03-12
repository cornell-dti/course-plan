<template>
  <flexible-modal
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
    />
    <div v-else class="selected-course">
      {{ selectedCourse.title }}
    </div>
    <div v-if="selectedCourse != null">
      <!-- if a course is selected -->
      <selected-requirement-editor
        :key="courseSelectorKey"
        :editMode="editMode"
        :selectedRequirementID="selectedRequirementID"
        :requirementsThatAllowDoubleCounting="requirementsThatAllowDoubleCounting"
        :relatedRequirements="relatedRequirements"
        :potentialRequirements="selfCheckRequirements"
        @on-selected-change="onSelectedChange"
        @edit-mode="toggleEditMode"
      />
    </div>
  </flexible-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import SelectedRequirementEditor from '@/components/Modals/NewCourse/SelectedRequirementEditor.vue';
import FlexibleModal from '@/components/Modals/FlexibleModal.vue';
import CourseSelector from '@/components/Modals/NewCourse/CourseSelector.vue';

import store from '@/store';
import { getRelatedUnfulfilledRequirements } from '@/requirements/requirement-frontend-utils';

export default Vue.extend({
  components: { CourseSelector, FlexibleModal, SelectedRequirementEditor },
  data() {
    return {
      selectedCourse: null as CornellCourseRosterCourse | null,
      selectedRequirementID: '',
      requirementsThatAllowDoubleCounting: [] as readonly string[],
      // relatedRequirements : the requirements that don't allow double counting
      relatedRequirements: [] as readonly RequirementWithIDSourceType[],
      selfCheckRequirements: [] as readonly RequirementWithIDSourceType[],
      editMode: false,
      courseSelectorKey: 0,
    };
  },
  computed: {
    leftButtonText(): string {
      if (this.selectedCourse == null && !this.editMode) return 'CANCEL';
      return 'BACK';
    },
    rightButtonText(): string {
      return this.editMode ? 'NEXT' : 'ADD';
    },
    selectableRequirementChoices(): AppSelectableRequirementChoices {
      return store.state.selectableRequirementChoices;
    },
  },
  methods: {
    selectCourse(result: CornellCourseRosterCourse) {
      this.selectedCourse = result;
      this.getReqsRelatedToCourse(result);
    },
    getReqsRelatedToCourse(selectedCourse: CornellCourseRosterCourse) {
      const {
        directlyRelatedRequirements,
        selfCheckRequirements,
      } = getRelatedUnfulfilledRequirements(
        selectedCourse,
        store.state.groupedRequirementFulfillmentReport,
        store.state.toggleableRequirementChoices
      );

      const requirementsThatAllowDoubleCounting: string[] = [];
      const relatedRequirements: RequirementWithIDSourceType[] = [];
      directlyRelatedRequirements.forEach(it => {
        if (it.allowCourseDoubleCounting) {
          requirementsThatAllowDoubleCounting.push(it.name);
        } else {
          relatedRequirements.push(it);
        }
      });

      this.requirementsThatAllowDoubleCounting = requirementsThatAllowDoubleCounting;
      this.relatedRequirements = relatedRequirements;
      this.selfCheckRequirements = selfCheckRequirements;
      this.selectedRequirementID = '';
    },
    closeCurrentModal() {
      this.reset();
      this.$emit('close-course-modal');
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
      this.reset();
      this.closeCurrentModal();
    },
    onSelectedChange(selected: string) {
      this.selectedRequirementID = selected;
    },
    reset() {
      this.editMode = false;
      this.courseSelectorKey += 1;
      this.selectedCourse = null;
      this.selectedRequirementID = '';
      this.relatedRequirements = [];
      this.selfCheckRequirements = [];
    },
    backOrCancel() {
      if (this.leftButtonText === 'BACK') {
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

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-course {
    width: 100%;
  }
}
</style>

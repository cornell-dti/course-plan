<template>
  <TeleportModal
    title="Fix Course Conflict"
    content-class="content-course"
    :rightButtonText="rightButtonText"
    :rightButtonIsHighlighted="!conflictsFullyResolved"
    @modal-closed="removeCourseAndCloseModal"
    @right-button-clicked="resolveConflicts"
  >
    <div class="courseConflict-text">Selected Course</div>
    <div class="selected-course" data-cyId="courseConflict-selectedCourse">
      {{ courseName }}
    </div>

    <div class="courseConflict-description">
      <span v-if="numTotalConflicts <= 1">
        This course can fulfill these requirements. Select one:
      </span>
      <div v-else>
        <span>Please fix the following</span
        ><span class="courseConflict--bold">{{ ` ${numTotalConflicts} ` }}</span
        ><span>conflicts</span>
      </div>
    </div>

    <div v-for="index in numTotalConflicts" :key="index" class="courseConflict-conflict">
      <div v-if="numTotalConflicts > 1">{{ `${index}. Choose only one requirement:` }}</div>
      <single-conflict-editor
        :checkedReqs="selectedReqsPerConflict[index - 1]"
        :selectableRequirements="selectableRequirements"
        :conflictNumber="index"
        @conflict-changed="handleChangedConflict"
      />
      <div v-if="shouldShowSelectableWarning(index)" class="courseConflict-warning">
        <span>*Requirements with</span>
        <img class="warning-icon" src="@/assets/images/warning.svg" alt="warning icon" />
        <span>are broad so check carefully before selecting them</span>
      </div>
    </div>
    <div v-if="!conflictsFullyResolved" class="courseConflict-error">{{ errorText }}</div>
  </TeleportModal>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import SingleConflictEditor from '@/components/Modals/NewCourse/SingleConflictEditor.vue';
import { getConstraintViolationsForSingleCourse } from '@/requirements/requirement-constraints-utils';
import { allowCourseDoubleCountingBetweenRequirements } from '@/requirements/requirement-frontend-utils';
import store from '@/store';
import { convertCourseToCourseRoster, isCourseTaken } from '@/utilities';
import { toggleRequirementChoice } from '@/global-firestore-data';

export default defineComponent({
  components: { TeleportModal, SingleConflictEditor },
  emits: {
    'close-course-modal': () => true,
    'resolve-conflicts': (course: FirestoreSemesterCourse | CourseTaken) =>
      typeof course === 'object',
    'remove-course': (uniqueID: string | number) =>
      typeof uniqueID === 'number' || typeof uniqueID === 'string',
  },
  props: {
    selectedCourse: {
      type: Object as PropType<FirestoreSemesterCourse | CourseTaken>,
      required: true,
    },
    courseConflicts: { type: Object as PropType<Set<string[]>>, required: true },
    selectableRequirements: {
      type: Object as PropType<readonly RequirementWithIDSourceType[]>,
      required: true,
    },
    relatedRequirements: {
      type: Object as PropType<readonly RequirementWithIDSourceType[]>,
      required: true,
    },
    isEditingRequirements: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    // convert the set of conflicts and selectable/related reqs to a list of dicts, where each dict is a mapping of req options to bools representing if they are selected
    // includes selectable checks and related reqs only if in conflict with the other reqs in group
    const selectedReqsPerConflict: Map<string, boolean>[] = [];
    const numSelectableReqsPerConflict: number[] = [];

    const selectableReqIds: string[] = [];
    this.selectableRequirements.forEach(singleSelectableReq => {
      selectableReqIds.push(singleSelectableReq.id);
    });

    const relatedReqIds: string[] = [];
    this.relatedRequirements.forEach(singleRelatedReq => {
      relatedReqIds.push(singleRelatedReq.id);
    });

    this.courseConflicts.forEach(singleConflictList => {
      const conflictReqIds: string[] = [];
      const singleConflictMap = new Map<string, boolean>();
      singleConflictList.forEach(req => {
        singleConflictMap.set(req, true);
        conflictReqIds.push(req);
      });

      const reqsInConflict = this.getReqsInConflict(
        this.courseUniqueId,
        conflictReqIds,
        selectableReqIds,
        relatedReqIds
      );

      // filter in related reqs that are not currently in conflict but could be
      this.relatedRequirements.forEach(singleReq => {
        if (reqsInConflict.includes(singleReq.id)) {
          singleConflictMap.set(singleReq.id, false);
        }
      });

      // filter out selectable reqs that are not in conflict with the other reqs
      let numSelectableReqs = 0;
      this.selectableRequirements.forEach(singleSelectableReq => {
        if (reqsInConflict.includes(singleSelectableReq.id)) {
          singleConflictMap.set(singleSelectableReq.id, false);
          numSelectableReqs += 1;
        }
      });

      selectedReqsPerConflict.push(singleConflictMap);
      numSelectableReqsPerConflict.push(numSelectableReqs);
    });

    if (this.isEditingRequirements) {
      this.setRequirementsCurrentlyFulfilled(selectedReqsPerConflict);
    }

    const originalReqsPerConflict = selectedReqsPerConflict.map(conflict => new Map(conflict));

    return {
      originalReqsPerConflict,
      selectedReqsPerConflict,
      numSelectableReqsPerConflict,
      hasUnresolvedConflicts: true,
      hasUnselectedConflicts: false,
    };
  },
  computed: {
    conflictsFullyResolved(): boolean {
      return !this.hasUnresolvedConflicts && !this.hasUnselectedConflicts;
    },
    rightButtonText(): string {
      return this.conflictsFullyResolved ? 'Done' : 'Save';
    },
    numTotalConflicts(): number {
      return this.selectedReqsPerConflict.length;
    },
    errorText(): string {
      // set the error text to point out no reqs are selected if none are selected for at least one conflict
      // and that all other conflicts also have no choice selected or are fulfilled
      if (this.hasUnselectedConflicts && !this.hasUnresolvedConflicts) {
        return 'Warning: No requirements are selected for a conflict';
      }
      return 'Conflict: Please only choose one requirement';
    },
    courseName(): string {
      if (isCourseTaken(this.selectedCourse)) {
        return `${this.selectedCourse.code} ${
          convertCourseToCourseRoster(this.selectedCourse).titleLong
        }`;
      }
      return `${this.selectedCourse.code} ${this.selectedCourse.name}`;
    },
    courseUniqueId(): string | number {
      return isCourseTaken(this.selectedCourse)
        ? this.selectedCourse.uniqueId
        : this.selectedCourse.uniqueID;
    },
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-course-modal');
    },
    removeCourseAndCloseModal() {
      this.closeCurrentModal();
      this.$emit('remove-course', this.courseUniqueId);
    },
    resolveConflicts() {
      // edit the requirements assigned to the course when editor saved on reqs with changes made
      for (let i = 0; i < this.selectedReqsPerConflict.length; i += 1) {
        const conflict = this.selectedReqsPerConflict[i];
        const originalConflict = this.originalReqsPerConflict[i];

        conflict.forEach((selected, reqName) => {
          if (this.isReqSelectable(reqName) && selected !== originalConflict.get(reqName)) {
            toggleRequirementChoice(
              this.courseUniqueId,
              store.state.userRequirementsMap[reqName].id,
              'acknowledgedCheckerWarningOptIn'
            );
          } else if (selected !== originalConflict.get(reqName)) {
            toggleRequirementChoice(
              this.courseUniqueId,
              store.state.userRequirementsMap[reqName].id,
              'optOut'
            );
          }
        });
      }

      this.closeCurrentModal();
      this.$emit('resolve-conflicts', this.selectedCourse);
    },
    // req is self check if present in selectableRequirements list
    isReqSelectable(reqName: string) {
      return this.selectableRequirements.filter(req => req.id === reqName).length > 0;
    },
    handleChangedConflict(selectedReq: string, index: number) {
      const conflict = this.selectedReqsPerConflict[index - 1];
      conflict.set(selectedReq, !conflict.get(selectedReq));
      this.updateConflictStatus();
    },
    // conflicts exist for each list of reqs in selectedReqsPerConflict if number of reqs selected != 1
    // there is a conflict fully unselected if all requirements within it are unselected
    updateConflictStatus() {
      let unresolved = false;
      let unselected = false;
      for (let i = 0; i < this.selectedReqsPerConflict.length; i += 1) {
        const conflict = this.selectedReqsPerConflict[i];
        const numReqsSelected = this.countNumberReqsSelected(conflict);
        if (numReqsSelected > 1) {
          unresolved = true;
        }

        if (numReqsSelected === 0) {
          unselected = true;
        }
      }
      this.hasUnresolvedConflicts = unresolved;
      this.hasUnselectedConflicts = unselected;
    },
    // count number of reqs selected for a conflict (i.e. set to true in the map)
    countNumberReqsSelected(conflict: Map<string, boolean>) {
      return Array.from(conflict.values()).filter(Boolean).length;
    },
    // only show the selectable req warning under the first req group, and only if there are selectable reqs
    shouldShowSelectableWarning(index: number): boolean {
      const maxNumSelectable = Math.max(...this.numSelectableReqsPerConflict);
      return index === 1 && maxNumSelectable > 0;
    },
    // determine if each selectable req or related req is in conflict with the reqs in conflictReqIds,
    // based on course with uniqueID.
    // return the list of conflictReqIds + selectableReqIds + relatedReqIds in conflict.
    getReqsInConflict(
      uniqueID: string | number,
      conflictReqIds: string[],
      selectableReqIds: string[],
      relatedReqIds: string[]
    ): string[] {
      const selectableReqIdsInConflict: string[] = [];
      const relatedReqIdsInConflict: string[] = [];
      selectableReqIds.forEach(selectableReqId => {
        const constraintViolations = getConstraintViolationsForSingleCourse(
          { uniqueId: uniqueID },
          [...conflictReqIds, selectableReqId],
          (reqA, reqB) =>
            allowCourseDoubleCountingBetweenRequirements(
              store.state.userRequirementsMap[reqA],
              store.state.userRequirementsMap[reqB]
            )
        );

        // if selectable req is not in conflict with conflictReqIds, it will be missing from requirementsThatDoNotAllowDoubleCounting
        if (constraintViolations.requirementsThatDoNotAllowDoubleCounting.has(selectableReqId)) {
          selectableReqIdsInConflict.push(selectableReqId);
        }
      });

      relatedReqIds.forEach(relatedReqId => {
        const constraintViolations = getConstraintViolationsForSingleCourse(
          { uniqueId: uniqueID },
          [...conflictReqIds, relatedReqId],
          (reqA, reqB) =>
            allowCourseDoubleCountingBetweenRequirements(
              store.state.userRequirementsMap[reqA],
              store.state.userRequirementsMap[reqB]
            )
        );

        // if related req is not in conflict with conflictReqIds, it will be missing from requirementsThatDoNotAllowDoubleCounting
        if (constraintViolations.requirementsThatDoNotAllowDoubleCounting.has(relatedReqId)) {
          relatedReqIdsInConflict.push(relatedReqId);
        }
      });

      return [...conflictReqIds, ...relatedReqIdsInConflict, ...selectableReqIdsInConflict];
    },
    // set requirements to true or false based on what options a course has already been assigned to
    // for courses being edited.
    setRequirementsCurrentlyFulfilled(selectedReqsPerConflict: Map<string, boolean>[]) {
      const uniqueID = isCourseTaken(this.selectedCourse)
        ? this.selectedCourse.uniqueId
        : this.selectedCourse.uniqueID;

      const existingConstraintViolations = store.state.courseToRequirementsInConstraintViolations.get(
        uniqueID
      );

      // convert conflicts to a 1d list.
      const listOfConflicts = Array.from(existingConstraintViolations ?? new Set()).flat();

      // select any reqs in conflict in the list, deselct otherwise.
      selectedReqsPerConflict.forEach(conflict => {
        conflict.forEach((_, req) => {
          conflict.set(req, listOfConflicts.includes(req));
        });
      });
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.courseConflict {
  &-text {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
  }

  &-conflict {
    margin-top: 1rem;
  }

  &-warning {
    font-size: 12px;
    color: $medium;
    margin-top: 1rem;
  }

  &--bold {
    font-weight: bold;
  }

  &-error {
    color: $error;
    margin-top: 1rem;
    font-weight: bold;
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

.warning-icon {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
  width: 14px;
  height: 14px;
}
</style>

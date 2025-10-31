<template>
  <TeleportModal
    title="Fix Course Conflict"
    content-class="content-course"
    :rightButtonText="rightButtonText"
    :rightButtonIsHighlighted="!conflictsFullyResolved"
    @modal-closed="removeCourseAndCloseModal"
    @right-button-clicked="addCourse"
  >
    <div class="courseConflict-text">Selected Course</div>
    <div class="selected-course" data-cyId="courseConflict-selectedCourse">
      {{ selectedTypedCourse.code }}:
      {{ selectedTypedCourse.name }}
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
        :conflictNumber="index"
        :numSelfChecks="numSelfChecksPerConflict[index - 1]"
        :selectedCourse="selectedCourse"
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

export default defineComponent({
  components: { TeleportModal, SingleConflictEditor },
  emits: {
    'close-course-modal': () => true,
    'resolve-conflicts': (course: FirestoreSemesterCourse) => typeof course === 'object',
    'remove-course': (uniqueID: number) => typeof uniqueID === 'number',
  },
  props: {
    selectedCourse: { type: Object as PropType<FirestoreSemesterCourse>, required: true },
    courseConflicts: { type: Object as PropType<Set<string[]>>, required: true },
    selfCheckRequirements: {
      type: Object as PropType<readonly RequirementWithIDSourceType[]>,
      required: true,
    },
  },
  data() {
    // convert the set of conflicts and self-check reqs to a list of dicts, where each dict is a mapping of req options to bools representing if they are selected
    // includes self checks only if in conflict with the other reqs in group
    const selectedReqsPerConflict: Map<string, boolean>[] = [];
    const numSelfChecksPerConflict: number[] = [];
    const selectedTypedCourse = this.selectedCourse as FirestoreSemesterCourse;

    const selectableReqIds: string[] = [];
    this.selfCheckRequirements.forEach(singleSelfCheckReq => {
      selectableReqIds.push(singleSelfCheckReq.id);
    });

    this.courseConflicts.forEach(singleConflictList => {
      const conflictReqIds: string[] = [];
      const singleConflictMap = new Map<string, boolean>();
      singleConflictList.forEach(req => {
        singleConflictMap.set(req, true);
        conflictReqIds.push(req);
      });

      const reqsInConflict = this.getReqsInConflict(
        selectedTypedCourse.uniqueID,
        conflictReqIds,
        selectableReqIds
      );

      // filter out self checks that are not in conflict with the other reqs
      let numSelfChecks = 0;
      this.selfCheckRequirements.forEach(singleSelfCheckReq => {
        if (reqsInConflict.includes(singleSelfCheckReq.id)) {
          singleConflictMap.set(singleSelfCheckReq.id, false);
          numSelfChecks += 1;
        }
      });

      selectedReqsPerConflict.push(singleConflictMap);
      numSelfChecksPerConflict.push(numSelfChecks);
    });

    return {
      selectedReqsPerConflict,
      numSelfChecksPerConflict,
      hasUnresolvedConflicts: true,
      hasUnselectedConflicts: false,
    };
  },
  computed: {
    // type-safe selected course
    selectedTypedCourse(): FirestoreSemesterCourse {
      return this.selectedCourse as FirestoreSemesterCourse;
    },
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
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-course-modal');
    },
    removeCourseAndCloseModal() {
      this.closeCurrentModal();
      this.$emit('remove-course', this.selectedTypedCourse.uniqueID);
    },
    addCourse() {
      this.closeCurrentModal();
      this.$emit('resolve-conflicts', this.selectedTypedCourse);
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
      const maxNumSelfChecks = Math.max(...this.numSelfChecksPerConflict);
      return index === 1 && maxNumSelfChecks > 0;
    },
    // determine if each selectable req in selectableReqIds is in conflict with the reqs in conflictReqIds,
    // based on course with uniqueID.
    // return the list of conflictReqIds + selectableReqIds in conflict.
    getReqsInConflict(
      uniqueID: string | number,
      conflictReqIds: string[],
      selectableReqIds: string[]
    ): string[] {
      const selectableReqIdsInConflict: string[] = [];
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

      return [...conflictReqIds, ...selectableReqIdsInConflict];
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

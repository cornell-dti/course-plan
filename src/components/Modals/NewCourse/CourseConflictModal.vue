<template>
  <TeleportModal
    title="Fix Course Conflict"
    content-class="content-course"
    :rightButtonText="rightButtonText"
    :rightButtonIsHighlighted="!conflictsFullyResolved"
    @modal-closed="closeCurrentModal"
    @right-button-clicked="addItem"
  >
    <div class="courseConflict-text">Selected Course</div>
    <div class="selected-course" data-cyId="courseConflict-selectedCourse">
      {{ selectedCourse.code }}:
      {{ selectedCourse.name }}
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
    'add-course': (course: CornellCourseRosterCourse, choice: FirestoreCourseOptInOptOutChoices) =>
      typeof course === 'object' && typeof choice === 'object',
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

    const selectableReqIds: string[] = [];
    this.selfCheckRequirements.forEach(singleSelfCheckReq => {
      selectableReqIds.push(singleSelfCheckReq.id);
    });

    this.courseConflicts.forEach(singleConflictList => {
      const conflictReqIds = [];
      const singleConflictDict = new Map<string, boolean>();
      singleConflictList.forEach(req => {
        singleConflictDict.set(req, true);
        conflictReqIds.push(req);
      });

      conflictReqIds.push(...selectableReqIds);
      const reqsInConflict = this.getReqsInConflict(this.selectedCourse.uniqueID, conflictReqIds);

      // filter out self checks that are not in conflict with the other reqs
      let numSelfChecks = 0;
      this.selfCheckRequirements.forEach(singleSelfCheckReq => {
        if (reqsInConflict.includes(singleSelfCheckReq.id)) {
          singleConflictDict.set(singleSelfCheckReq.id, true);
          numSelfChecks += 1;
        }
      });

      selectedReqsPerConflict.push(singleConflictDict);
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
    addItem() {
      this.addCourse();
    },
    addCourse() {
      // TODO @willespencer handle what happens when conflicts are saved or resolved
      this.closeCurrentModal();
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
      let count = 0;
      conflict.forEach((value: boolean) => {
        if (value) count += 1;
      });
      return count;
    },
    // only show the selectable req warning under the first req group, and only if there are selectable reqs
    shouldShowSelectableWarning(index: number): boolean {
      const maxNumSelfChecks = Math.max(...this.numSelfChecksPerConflict);
      return index === 1 && maxNumSelfChecks > 0;
    },
    // get the reqs in conflictReqIds that are in conflict, based on course with uniqueID
    // self check requirements not in conflict with the other reqs will be excluded
    getReqsInConflict(uniqueID: string | number, conflictReqIds: string[]): string[] {
      const constraintViolations = getConstraintViolationsForSingleCourse(
        { uniqueId: uniqueID },
        conflictReqIds,
        (reqA, reqB) =>
          allowCourseDoubleCountingBetweenRequirements(
            store.state.userRequirementsMap[reqA],
            store.state.userRequirementsMap[reqB]
          )
      );

      const validConflicts = constraintViolations.courseToRequirementsInConstraintViolations.get(
        this.selectedCourse.uniqueID
      );
      let firstConflict: string[] = [];
      if (validConflicts) {
        [firstConflict] = [...validConflicts];
      }

      return firstConflict;
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

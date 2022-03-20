<template>
  <TeleportModal
    title="Fix Course Conflict"
    content-class="content-course"
    :rightButtonText="rightButtonText"
    :rightButtonIsHighlighted="!conflictsFullyResolved"
    @modal-closed="closeCurrentModal"
    @right-button-clicked="addItem"
  >
    <!-- TODO @willespencer factor out selected course? -->
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
        @conflict-changed="handleChangedConflict"
      />
      <div v-if="index === 1" class="courseConflict-warning">
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
  },
  data() {
    // convert the set of conflicts to a list of dicts, where each dict is a mapping of req options to bools representing if they are selected
    const selectedReqsPerConflict: Map<string, boolean>[] = [];
    this.courseConflicts.forEach(singleConflictList => {
      const singleConflictDict = new Map<string, boolean>();
      singleConflictList.forEach(req => {
        singleConflictDict.set(req, true);
      });
      selectedReqsPerConflict.push(singleConflictDict);
    });

    console.log(selectedReqsPerConflict);
    console.log(this.courseConflicts);
    console.log(selectedReqsPerConflict[0]);

    return {
      selectedReqsPerConflict,
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

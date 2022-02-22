<template>
  <TeleportModal
    title="Fix Course Conflict"
    content-class="content-course"
    :rightButtonText="rightButtonText"
    :rightButtonIsDisabled="selectedCourse == null"
    :errorText="errorText"
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
      <single-conflict-editor :conflictNumber="index" @conflict-changed="handleChangedConflict" />
      <div v-if="index === 1" class="courseConflict-warning">
        <span>*Requirements with</span>
        <img class="warning-icon" src="@/assets/images/warning.svg" alt="warning icon" />
        <span>are broad so check carefully before selecting them</span>
      </div>
    </div>
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
  },
  data() {
    // TODO @willespencer remove hardcoded initial list of reqs
    return {
      selectedReqsPerConflict: [['req1, req2, selectableReq1'], ['req1, req2, selectableReq1']],
      numConflictsUnresolved: 2,
    };
  },
  computed: {
    conflictsResolved(): boolean {
      return this.numConflictsUnresolved === 0;
    },
    rightButtonText(): string {
      return this.conflictsResolved ? 'Done' : 'Save';
    },
    numTotalConflicts(): number {
      return this.selectedReqsPerConflict.length;
    },
    errorText(): string {
      if (!this.conflictsResolved) {
        return 'Conflict: Please only choose one requirement';
      }
      return '';
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
    handleChangedConflict(selectedReqs: string[], index: number) {
      this.selectedReqsPerConflict[index - 1] = selectedReqs;
      this.updateNumUnresolvedConflicts();
    },
    // conflicts exist for each list of reqs in selectedReqsPerConflict if number of reqs selected != 1
    updateNumUnresolvedConflicts() {
      let count = 0;
      for (let i = 0; i < this.selectedReqsPerConflict.length; i += 1) {
        if (this.selectedReqsPerConflict[i].length !== 1) {
          count += 1;
        }
      }

      this.numConflictsUnresolved = count;
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

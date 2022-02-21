<template>
  <TeleportModal
    title="Fix Course Conflict"
    content-class="content-course"
    :rightButtonText="rightButtonText"
    :rightButtonIsDisabled="selectedCourse == null"
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
      <span v-if="numConflicts <= 1"> This course can fulfill these requirements. Select one </span>
      <div v-else>
        <span>Please fix the following</span
        ><span class="courseConflict--bold">{{ ` ${numConflicts} ` }}</span
        ><span>conflicts</span>
      </div>
    </div>
  </TeleportModal>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';

export default defineComponent({
  components: { TeleportModal },
  emits: {
    'close-course-modal': () => true,
    'add-course': (course: CornellCourseRosterCourse, choice: FirestoreCourseOptInOptOutChoices) =>
      typeof course === 'object' && typeof choice === 'object',
  },
  props: {
    selectedCourse: { type: Object as PropType<FirestoreSemesterCourse>, required: true },
  },
  computed: {
    conflictsResolved(): boolean {
      // TODO @willespencer update method to determine if conflicts are fully resolved
      return true;
    },
    rightButtonText(): string {
      return this.conflictsResolved ? 'Done' : 'Save';
    },
    numConflicts(): number {
      // TODO @willespencer programatically determine this number instead of hardcoding
      return 2;
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
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
.courseConflict {
  &-text {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
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
</style>

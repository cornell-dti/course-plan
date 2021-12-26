<template>
  <course-base-tooltip
    class="progress-bar-caution"
    v-if="hasConflicts"
    :isInformation="false"
    :hideVerticalBar="true"
    :showConflictCaution="true"
  >
    {{ cautionString }}
  </course-base-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CourseBaseTooltip from '@/components/Course/CourseBaseTooltip.vue';

export default defineComponent({
  components: { CourseBaseTooltip },
  props: {
    numConflicts: { type: Number, required: true },
  },
  computed: {
    hasConflicts(): boolean {
      return this.numConflicts > 0;
    },
    cautionString(): string {
      if (this.numConflicts === 1) {
        return '1 requirement has conflicts. Fix these by hovering the warning icon on the course card.';
      }

      return `${this.numConflicts} requirements have conflicts. Fix these by hovering the warning icon on the course card.`;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.progress-bar-caution {
  font-size: 14px;
}
</style>

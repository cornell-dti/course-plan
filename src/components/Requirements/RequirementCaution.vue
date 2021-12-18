<template>
  <course-base-tooltip v-if="hasRequirementCaution" :isInformation="false" :hideVerticalBar="true">
    {{ cautionString }}
  </course-base-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CourseBaseTooltip from '@/components/Course/CourseBaseTooltip.vue';

export default defineComponent({
  components: { CourseBaseTooltip },
  props: {
    numSafelyFulfilled: { type: Number, required: true },
    numDangerouslyFulfilled: { type: Number, required: true },
  },
  computed: {
    hasRequirementCaution(): boolean {
      return this.numDangerouslyFulfilled - this.numSafelyFulfilled > 0;
    },
    cautionString(): string {
      const numConflicts = this.numDangerouslyFulfilled - this.numSafelyFulfilled;
      if (numConflicts > 1) {
        return `${numConflicts} requirements have conflicts. Fix these by hovering over the course cards' warning signs.`;
      }

      return "1 requirement has a conflict. Fix it by hovering over the course card's warning sign.";
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
</style>

<template>
  <course-base-tooltip :isInformation="false" :hideVerticalBar="true">
    {{ cautionString }}
  </course-base-tooltip>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import CourseBaseTooltip from '@/components/Course/CourseBaseTooltip.vue';

export default defineComponent({
  components: { CourseBaseTooltip },
  props: {
    course: { type: Object as PropType<CourseTaken>, required: true },
  },
  computed: {
    cautionString(): string {
      return 'This course has a conflict. FIX NOW';
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
</style>

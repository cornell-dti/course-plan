<template>
  <svg class="debugger-svg" :width="900" :height="itemSize * 48 + 36">
    <g v-for="(requirement, index) in requirementGraphForDisplay.requirements" :key="index">
      <rect :x="0" :y="index * 48 + 16" :width="300" :height="32" class="requirement-box"></rect>
      <text :x="8" :y="index * 48 + 36" :font-size="16">{{ requirement }}</text>
    </g>
    <g v-for="(course, index) in requirementGraphForDisplay.courses" :key="index">
      <rect :x="600" :y="index * 48 + 16" :width="300" :height="32" class="course-box"></rect>
      <text :x="608" :y="index * 48 + 36" :font-size="16" fill="white">{{ course }}</text>
    </g>
    <path v-for="(line, index) in lines" :key="index" :d="line" stroke="black" />
  </svg>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';

type RequirementGraphForDisplay = {
  requirements: readonly string[];
  courses: readonly string[];
  edges: readonly { readonly requirementIndex: number; readonly courseIndex: number }[];
};

function computeRequirementGraphForDisplay(): RequirementGraphForDisplay {
  const graph = store.state.requirementFulfillmentGraph;
  const requirements = graph.getAllRequirements();
  const courses = graph.getAllCourses();
  const requirementToIndexMap = new Map(requirements.map((it, index) => [it, index]));
  const courseToIndexMap = new Map(courses.map((it, index) => [it.uniqueId, index]));
  const edges = graph.getAllEdges().map(([requirement, course]) => {
    const requirementIndex = requirementToIndexMap.get(requirement);
    const courseIndex = courseToIndexMap.get(course.uniqueId);
    if (requirementIndex == null || courseIndex == null) throw new Error();
    return { requirementIndex, courseIndex };
  });

  return { requirements, courses: courses.map(it => it.code), edges };
}

export default defineComponent({
  computed: {
    requirementGraphForDisplay(): RequirementGraphForDisplay {
      return computeRequirementGraphForDisplay();
    },
    itemSize(): number {
      return Math.max(
        this.requirementGraphForDisplay.requirements.length,
        this.requirementGraphForDisplay.courses.length
      );
    },
    lines(): readonly string[] {
      return this.requirementGraphForDisplay.edges.map(
        ({ requirementIndex, courseIndex }) =>
          // See https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
          `M 300 ${requirementIndex * 48 + 32} L 600 ${courseIndex * 48 + 32}`
      );
    },
  },
});
</script>
<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.debugger-svg {
  overflow: visible;
}

.requirement-box {
  fill: $einBlue;
}

.course-box {
  fill: $yuxuanBlue;
}
</style>

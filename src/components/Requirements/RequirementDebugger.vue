<template>
  <div>
    <div class="graph-toggler">
      <label class="graph-toggler-choice">
        <input type="radio" value="dangerous" v-model="graphType" /> Dangerous Graph
      </label>
      <label class="graph-toggler-choice">
        <input type="radio" value="safe" v-model="graphType" /> Safe Graph
      </label>
    </div>
    <svg class="debugger-svg" :width="900" :height="itemSize * 48 + 36">
      <g
        v-for="(requirement, index) in requirementGraphForDisplay.requirements"
        :key="index"
        @click="setOnlyNodeToKeepEdge(requirement)"
      >
        <rect :x="0" :y="index * 48 + 16" :width="300" :height="32" class="requirement-box"></rect>
        <text :x="8" :y="index * 48 + 36" :font-size="16">{{ requirement }}</text>
      </g>
      <g
        v-for="(course, index) in requirementGraphForDisplay.courses"
        :key="index"
        @click="setOnlyNodeToKeepEdge(course.uniqueId)"
      >
        <rect :x="600" :y="index * 48 + 16" :width="300" :height="32" class="course-box"></rect>
        <text :x="608" :y="index * 48 + 36" :font-size="16" fill="white">{{ course.code }}</text>
      </g>
      <path v-for="(line, index) in lines" :key="index" :d="line" stroke="black" />
    </svg>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import RequirementFulfillmentGraph from '@/requirements/requirement-graph';

type RequirementGraphForDisplay = {
  requirements: readonly string[];
  courses: readonly CourseTaken[];
  edges: readonly { readonly requirementIndex: number; readonly courseIndex: number }[];
};

function computeRequirementGraphForDisplay(
  graph: RequirementFulfillmentGraph<string, CourseTaken>,
  onlyNodeToKeepEdge: string | number | null
): RequirementGraphForDisplay {
  const requirements = graph.getAllRequirements();
  const courses = graph.getAllCourses();
  const requirementToIndexMap = new Map(requirements.map((it, index) => [it, index]));
  const courseToIndexMap = new Map(courses.map((it, index) => [it.uniqueId, index]));
  const edges = graph.getAllEdges().flatMap(([requirement, course]) => {
    if (
      onlyNodeToKeepEdge != null &&
      onlyNodeToKeepEdge !== requirement &&
      onlyNodeToKeepEdge !== course.uniqueId
    ) {
      return [];
    }
    const requirementIndex = requirementToIndexMap.get(requirement);
    const courseIndex = courseToIndexMap.get(course.uniqueId);
    if (requirementIndex == null || courseIndex == null) throw new Error();
    return [{ requirementIndex, courseIndex }];
  });

  return { requirements, courses, edges };
}

type Data = { onlyNodeToKeepEdge: string | number | null; graphType: 'safe' | 'dangerous' };

export default defineComponent({
  data(): Data {
    return { onlyNodeToKeepEdge: null, graphType: 'dangerous' };
  },
  methods: {
    setOnlyNodeToKeepEdge(clickedNode: string | number) {
      if (clickedNode === this.onlyNodeToKeepEdge) {
        this.onlyNodeToKeepEdge = null;
      } else {
        this.onlyNodeToKeepEdge = clickedNode;
      }
    },
  },
  computed: {
    graph(): RequirementFulfillmentGraph<string, CourseTaken> {
      return this.graphType === 'safe'
        ? store.state.safeRequirementFulfillmentGraph
        : store.state.dangerousRequirementFulfillmentGraph;
    },
    requirementGraphForDisplay(): RequirementGraphForDisplay {
      return computeRequirementGraphForDisplay(this.graph, this.onlyNodeToKeepEdge);
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

.graph-toggler {
  display: flex;
  margin: 1em;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}

.graph-toggler-choice {
  margin: 0 1em;
}

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

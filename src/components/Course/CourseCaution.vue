<template>
  <course-base-tooltip v-if="hasCourseCautions" :isInformation="false">
    <div v-if="singleWarning">
      <div v-if="courseCautions.typicallyOfferedWarning">
        This class is typically offered in {{ courseCautions.typicallyOfferedWarning.join(', ') }}.
      </div>
      <div v-if="courseCautions.isCourseDuplicate">Duplicate</div>
    </div>
    <ul v-if="!singleWarning" class="warning-list">
      <li
        class="warning-item"
        v-for="(requirement, index) in doubleCountingRequirementWarning"
        :key="index"
      >
        This class is double-counted for <b>{{ requirement }}</b> requirement.
      </li>
      <li class="warning-item" v-if="courseCautions.typicallyOfferedWarning">
        This class is typically offered in {{ courseCautions.typicallyOfferedWarning.join(', ') }}.
      </li>
      <li class="warning-item" v-if="courseCautions.isCourseDuplicate">Duplicate</li>
    </ul>
  </course-base-tooltip>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import CourseBaseTooltip from '@/components/Course/CourseBaseTooltip.vue';
import store from '@/store';

type CourseCautions = {
  readonly doubleCountingRequirementWarning: readonly string[] | undefined;
  readonly typicallyOfferedWarning: readonly string[] | undefined;
  readonly isCourseDuplicate: boolean;
};

const getCourseCautions = (course: FirestoreSemesterCourse): CourseCautions => {
  const {
    derivedCoursesData: { duplicatedCourseCodeSet, courseToSemesterMap },
    userRequirementsMap,
    requirementFulfillmentGraph,
    illegallyDoubleCountedCourseUniqueIDs,
  } = store.state;
  let doubleCountingRequirementWarning: readonly string[] | undefined;
  if (illegallyDoubleCountedCourseUniqueIDs.has(course.uniqueID)) {
    illegallyDoubleCountedCourseUniqueIDs.forEach(uniqueId => {
      doubleCountingRequirementWarning = requirementFulfillmentGraph
        .getConnectedRequirementsFromCourse({ uniqueId })
        .filter(id => !userRequirementsMap[id].allowCourseDoubleCounting)
        .map(id => userRequirementsMap[id].name);
    });
  }
  const semesterOfUserCourse = courseToSemesterMap[course.uniqueID];
  const typicallyOfferedWarning =
    semesterOfUserCourse != null && !course.semesters.includes(semesterOfUserCourse.type)
      ? course.semesters
      : undefined;
  const isCourseDuplicate = duplicatedCourseCodeSet.has(course.code);
  return { doubleCountingRequirementWarning, typicallyOfferedWarning, isCourseDuplicate };
};

export default Vue.extend({
  components: { CourseBaseTooltip },
  props: {
    course: { type: Object as PropType<FirestoreSemesterCourse>, required: true },
  },
  computed: {
    courseCautions(): CourseCautions {
      return getCourseCautions(this.course);
    },
    doubleCountingRequirementWarning(): readonly string[] {
      return this.courseCautions.doubleCountingRequirementWarning || [];
    },
    hasCourseCautions(): boolean {
      const {
        doubleCountingRequirementWarning,
        typicallyOfferedWarning,
        isCourseDuplicate,
      } = this.courseCautions;
      return (
        doubleCountingRequirementWarning != null ||
        typicallyOfferedWarning != null ||
        isCourseDuplicate
      );
    },
    singleWarning(): boolean {
      return (
        this.doubleCountingRequirementWarning.length === 0 &&
        (this.courseCautions.typicallyOfferedWarning == null ||
          !this.courseCautions.isCourseDuplicate)
      );
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

ul.warning-list {
  list-style-type: circle;
  margin: 0;
  padding-left: 1rem;
}

li.warning-item {
  margin-left: 0;
  padding-left: -0.25rem;
}
</style>

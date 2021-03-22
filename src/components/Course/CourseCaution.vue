<template>
  <course-base-tooltip v-if="hasCourseCautions" :isInformation="false">
    <div v-if="singleWarning">
      <div v-if="courseCautions.noMatchedRequirement">
        This class is not matched to any requirement. Re-add this course to choose a requirement to
        bind to.
      </div>
      <div v-if="courseCautions.typicallyOfferedWarning">
        This class is typically offered in {{ courseCautions.typicallyOfferedWarning.join(', ') }}.
      </div>
      <div v-if="courseCautions.isCourseDuplicate">Duplicate</div>
    </div>
    <ul v-if="!singleWarning" class="warning-list">
      <li class="warning-item" v-if="courseCautions.noMatchedRequirement">
        This class is not matched to any requirement. Re-add this course to choose a requirement to
        bind to.
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
  readonly noMatchedRequirement: boolean;
  readonly typicallyOfferedWarning: readonly string[] | undefined;
  readonly isCourseDuplicate: boolean;
};

const getCourseCautions = (course: FirestoreSemesterCourse): CourseCautions => {
  const {
    requirementFulfillmentGraph,
    derivedCoursesData: { duplicatedCourseCodeSet, courseToSemesterMap },
  } = store.state;
  const noMatchedRequirement =
    requirementFulfillmentGraph.getConnectedRequirementsFromCourse({ uniqueId: course.uniqueID })
      .length === 0;
  const semesterOfUserCourse = courseToSemesterMap[course.uniqueID];
  const typicallyOfferedWarning =
    semesterOfUserCourse != null && !course.semesters.includes(semesterOfUserCourse.type)
      ? course.semesters
      : undefined;
  const isCourseDuplicate = duplicatedCourseCodeSet.has(course.code);
  return { noMatchedRequirement, typicallyOfferedWarning, isCourseDuplicate };
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
    hasCourseCautions(): boolean {
      const {
        noMatchedRequirement,
        typicallyOfferedWarning,
        isCourseDuplicate,
      } = this.courseCautions;
      return noMatchedRequirement || typicallyOfferedWarning != null || isCourseDuplicate;
    },
    singleWarning(): boolean {
      let warningCounter = 0;
      if (this.courseCautions.noMatchedRequirement) warningCounter += 1;
      if (this.courseCautions.typicallyOfferedWarning != null) warningCounter += 1;
      if (this.courseCautions.isCourseDuplicate) warningCounter += 1;
      return warningCounter === 1;
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

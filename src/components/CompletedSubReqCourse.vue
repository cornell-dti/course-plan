<template>
  <div class="completedsubreqcourse">
    <div
      v-for="courseObject in courseObjects"
      :key="courseObject.uniqueID"
      class="completed-reqCourses-course-wrapper"
    >
      <div id="completedSeparator" class="separator"></div>
      <div class="completed-reqCourses-course-heading-wrapper">
        <div class="completed-reqCourses-course-heading-course">
          <span class="completed-reqCourses-course-heading-check"
            ><img src="@/assets/images/checkmark-green.svg"
          /></span>
          {{ courseLabel }}
        </div>
        <div class="completed-reqCourses-course-heading-reset-button reqCourse-button">
          {{ resetText }}
        </div>
      </div>
      <div class="completed-reqCourses-course-object-wrapper">
        <course
          v-bind="courseObject"
          :courseObj="courseObject"
          :id="courseObject.subject + courseObject.number"
          :uniqueID="courseObject.uniqueID"
          :compact="true"
          :active="false"
          :isCompletedReqCourse="true"
          :isReqCourse="true"
          class="completed-reqCourses-course-object"
        />
        <div class="completed-reqCourses-course-object-semester">
          {{ semesterLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import firebase from 'firebase/app';
import Course from '@/components/Course.vue';
import { DisplayableRequirementFulfillment, CourseTaken } from '@/requirements/types';
import {
  AppCourse,
  FirestoreSemesterCourse,
  AppSemester,
  FirestoreSemesterType,
} from '@/user-data';

Vue.component('course', Course);

type CrseInfo = {
  roster: string;
  crseIds: number[];
};

type CompletedSubReqCourseSlot = {
  isCompleted: true;
  courses: readonly CourseTaken[];
};

type IncompleteSubReqCourseSlot = {
  isCompleted: false;
  courses: CrseInfo[];
};

type SubReqCourseSlot = CompletedSubReqCourseSlot | IncompleteSubReqCourseSlot;

type Data = {
  courseObjects: AppCourse[];
  semesterType: FirestoreSemesterType;
  semesterYear: number;
};

export default Vue.extend({
  props: {
    subReq: Object as PropType<DisplayableRequirementFulfillment>,
    subReqCourseId: Number,
    crsesTaken: Array as PropType<readonly CourseTaken[]>,
    semesters: Array as PropType<readonly AppSemester[]>,
  },
  data(): Data {
    return {
      semesterType: 'Fall',
      semesterYear: 1234,
      courseObjects: [],
    };
  },
  mounted() {
    const crseTaken = this.crsesTaken[0];

    for (let i = 0; this.courseObjects.length < 1 && i < this.semesters.length; i += 1) {
      const semester = this.semesters[i];
      const filteredSemesterCourses = semester.courses.filter(
        course =>
          course.crseId === crseTaken.courseId &&
          course.subject === crseTaken.subject &&
          course.number === crseTaken.number
      );
      if (filteredSemesterCourses.length > 0) {
        this.courseObjects.push(filteredSemesterCourses[0]);
        this.semesterType = semester.type;
        this.semesterYear = semester.year;
      }
    }
  },
  computed: {
    courseLabel() {
      return `Course ${this.subReqCourseId + 1}`;
    },
    resetText() {
      return 'Reset';
    },
    semesterLabel() {
      return `in ${this.$data.semesterType} ${this.$data.semesterYear}`;
    },
  },
  methods: {
    dragListener(event: { preventDefault: () => void }) {
      if (!this.$data.scrollable) event.preventDefault();
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.separator {
  height: 1px;
  width: 100%;
  background-color: $inactiveGray;
}

.completed {
  &-reqCourses {
    &-course {
      &-wrapper {
        margin-top: 4%;
        margin-bottom: 4%;
      }
      &-heading {
        &-wrapper {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-top: 2%;
        }
        &-course {
          font-size: 14px;
          line-height: 17px;
          color: $lightLabelGray;
        }
      }
      &-object {
        &-wrapper {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        &-semester {
          font-size: 14px;
          line-height: 16px;
          color: $darkLabelGray;
          margin-top: 2%;
          font-style: italic;
        }
      }
    }
  }
}

.reqCourse {
  &-button {
    font-size: 12px;
    line-height: 15px;
    color: $yuxuanBlue;
    padding: 1%;
    cursor: pointer;
  }
}
</style>

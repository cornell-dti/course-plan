<template>
  <div class="completedsubreqcourse">
    <div v-for="course in courseObjects" :key="course.uniqueID" class="completed-reqCourses-course-wrapper">
      <div class="separator"></div>
      <div class="completed-reqCourses-course-heading-wrapper">
        <div class="completed-reqCourses-course-heading-course">
          <span class="completed-reqCourses-course-heading-check"><img src="@/assets/images/checkmark-green.svg" /></span>
          {{courseLabel}}
        </div>
        <div class="completed-reqCourses-course-heading-reset-button reqCourse-button">{{ resetText }}</div>
      </div>
      <div class="completed-reqCourses-course-object-wrapper">
        <course
          v-bind="course"
          :courseObj="course"
          :id="course.subject + course.number"
          :uniqueID="course.uniqueID"
          :compact="true"
          :active="false"
          class="completed-reqCourses-course-object"
        />
        <div class="completed-reqCourses-course-object-semester">
          {{semesterLabel}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import firebase from 'firebase/app';
import Course from '@/components/Course.vue';
import { DisplayableRequirementFulfillment } from '@/requirements/types';
import { AppCourse, FirestoreSemesterCourse, FirestoreSemesterType } from '@/user-data';

Vue.component('course', Course);

type Data = {
  courseObjects: AppCourse[];
};

export default Vue.extend({
  props: {
    subReq: Object as PropType<DisplayableRequirementFulfillment>,
    subReqCourseId: Number,
    semesterType: String as PropType<FirestoreSemesterType>,
    semesterYear: Number
  },
  data(): Data {
    return {
      courseObjects: [],
    };
  },
  computed: {
    courseLabel() {
      return `Course ${this.subReqCourseId + 1}`;
    },
    resetText() {
      return 'Reset';
    },
    semesterLabel() {
      return `in ${this.semesterType} ${this.semesterYear}`;
    }
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


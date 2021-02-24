<template>
  <div class="completedsubreqcourse">
    <div class="completed-reqCourses-course-wrapper">
      <div class="separator"></div>
      <div class="completed-reqCourses-course-heading-wrapper">
        <div class="completed-reqCourses-course-heading-course">
          <span class="completed-reqCourses-course-heading-check"
            ><img src="@/assets/images/checkmark-green.svg" alt="checkmark"
          /></span>
          {{ courseLabel }}
        </div>
        <div
          class="completed-reqCourses-course-heading-reset-button reqCourse-button"
          @click="onReset"
        >
          {{ resetText }}
        </div>
      </div>
      <div class="completed-reqCourses-course-object-wrapper">
        <req-course
          :color="courseInfoAndSemesterLabel.color"
          :courseCode="courseTaken.code"
          :compact="true"
          :isCompletedReqCourse="true"
          class="completed-reqCourses-course-object"
        />
        <div class="completed-reqCourses-course-object-semester">
          in {{ courseInfoAndSemesterLabel.semesterLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ReqCourse from '@/components/Requirements/ReqCourse.vue';
import store from '@/store';
import getCurrentSeason, { getCurrentYear } from '@/utilities';

const transferCreditColor = 'DA4A4A'; // Arbitrary color for transfer credit

export default Vue.extend({
  components: { ReqCourse },
  props: {
    subReqCourseId: { type: Number, required: true },
    courseTaken: { type: Object as PropType<CourseTaken>, required: true },
  },
  computed: {
    semesters(): readonly FirestoreSemester[] {
      return store.state.semesters;
    },
    courseLabel(): string {
      return `Course ${this.subReqCourseId + 1}`;
    },
    resetText(): string {
      return 'Reset';
    },
    isTransferCredit(): boolean {
      return this.courseTaken.uniqueId === -1;
    },
    courseInfoAndSemesterLabel(): {
      readonly semesterLabel: string;
      readonly uniqueID: number;
      readonly color: string;
    } {
      if (this.isTransferCredit) {
        return { semesterLabel: 'Transfer Credits', color: transferCreditColor, uniqueID: 0 };
      }

      const course = store.state.derivedCoursesData.courseMap[this.courseTaken.uniqueId];
      const courseSemester =
        store.state.derivedCoursesData.courseToSemesterMap[this.courseTaken.uniqueId];
      const courseColor = course != null ? course.color : '';
      const semesterLabel =
        courseSemester != null
          ? `${courseSemester.type} ${courseSemester.year}`
          : `${getCurrentSeason()} ${getCurrentYear()}`;

      return { semesterLabel, uniqueID: this.courseTaken.uniqueId, color: courseColor };
    },
  },
  methods: {
    onReset() {
      this.$emit('deleteCourseFromSemesters', this.courseInfoAndSemesterLabel.uniqueID);
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
        margin-top: 0.6rem;
        margin-bottom: 0.6rem;
      }
      &-heading {
        &-wrapper {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-top: 0.6rem;
        }
        &-course {
          font-size: 14px;
          line-height: 17px;
          color: $lightPlaceholderGray;
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
          color: $lightPlaceholderGray;
          margin-top: 0.6rem;
          font-style: italic;
        }
      }
    }
  }
}

.reqCourse {
  &-button {
    font-size: 14px;
    line-height: 15px;
    color: $yuxuanBlue;
    padding: 0.2rem;
    cursor: pointer;
  }
}
</style>

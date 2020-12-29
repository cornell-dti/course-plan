<template>
  <div class="completedsubreqcourse">
    <div class="completed-reqCourses-course-wrapper">
      <div id="completedSeparator" class="separator"></div>
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
        <reqcourse
          :id="courseSubject + courseNumber"
          :color="color"
          :subject="courseSubject"
          :number="courseNumber"
          :compact="true"
          :isCompletedReqCourse="true"
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
import ReqCourse from '@/components/Requirements/ReqCourse.vue';
import { DisplayableRequirementFulfillment, CourseTaken } from '@/requirements/types';
import {
  AppCourse,
  FirestoreSemesterCourse,
  AppSemester,
  FirestoreSemesterType,
} from '@/user-data';

Vue.component('reqcourse', ReqCourse);

type CompletedSubReq = {
  color: string;
  transferCreditColor: string;
  courseSubject: string;
  courseNumber: string;
  courseUniqueId: number;
  isTransferCredit: boolean;
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
  data(): CompletedSubReq {
    return {
      semesterType: 'Fall', // 'Fall' is an arbitrary FirestoreSemesterType value that user will never see
      semesterYear: 0,
      color: '',
      transferCreditColor: 'DA4A4A', // Arbitrary color for transfer credit
      courseSubject: '',
      courseNumber: '',
      courseUniqueId: 0,
      isTransferCredit: false,
    };
  },
  mounted() {
    const crseTaken = this.crsesTaken[0];
    this.isTransferCredit = crseTaken.subject === 'AP' || crseTaken.subject === 'IB';
    if (!this.isTransferCredit) {
      this.setCourseAndSemesterForNonTransferCredits(crseTaken);
    } else {
      this.setCourseAndSemesterForTransferCredits(crseTaken);
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
      let label = `in ${this.$data.semesterType} ${this.$data.semesterYear}`;
      if (this.isTransferCredit) {
        label = 'in Transfer Credits';
      }
      return label;
    },
  },
  methods: {
    dragListener(event: { preventDefault: () => void }) {
      if (!this.$data.scrollable) event.preventDefault();
    },
    setCourseAndSemesterForNonTransferCredits(crseTaken: CourseTaken) {
      for (let i = 0; i < this.semesters.length; i += 1) {
        const semester = this.semesters[i];
        const filteredSemesterCourses = semester.courses.filter(
          course =>
            course.crseId === crseTaken.courseId &&
            course.subject === crseTaken.subject &&
            course.number === crseTaken.number
        );
        if (filteredSemesterCourses.length > 0) {
          const course = filteredSemesterCourses[0];
          this.color = course.color;
          this.courseSubject = course.subject;
          this.courseNumber = course.number;
          this.courseUniqueId = course.uniqueID;
          this.semesterType = semester.type;
          this.semesterYear = semester.year;
          break;
        }
      }
    },
    setCourseAndSemesterForTransferCredits(crseTaken: CourseTaken) {
      this.color = this.transferCreditColor;
      this.courseSubject = crseTaken.subject;
      this.courseNumber = crseTaken.number;
    },
    onReset() {
      this.$emit('deleteCourseFromSemesters', this.courseUniqueId);
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
          margin-top: 0.6rem;
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
    padding: 0.2rem;
    cursor: pointer;
  }
}
</style>

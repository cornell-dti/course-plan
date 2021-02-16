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
          :color="courseColorAndSemesterLabel.color"
          :subject="courseTaken.subject"
          :number="courseTaken.number"
          :compact="true"
          :isCompletedReqCourse="true"
          class="completed-reqCourses-course-object"
        />
        <div class="completed-reqCourses-course-object-semester">
          in {{ courseColorAndSemesterLabel.semesterLabel }}
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
      return this.courseTaken.subject === 'AP' || this.courseTaken.subject === 'IB';
    },
    courseColorAndSemesterLabel(): { readonly semesterLabel: string; readonly color: string } {
      if (this.isTransferCredit) {
        return { semesterLabel: 'Transfer Credits', color: transferCreditColor };
      }
      const courseTakenCode = `${this.courseTaken.subject} ${this.courseTaken.number}`;
      for (let i = 0; i < this.semesters.length; i += 1) {
        const semester = this.semesters[i];
        const filteredSemesterCourses = semester.courses.filter(
          course => course.crseId === this.courseTaken.courseId && course.code === courseTakenCode
        );
        if (filteredSemesterCourses.length > 0) {
          return {
            semesterLabel: `${semester.type} ${semester.year}`,
            color: filteredSemesterCourses[0].color,
          };
        }
      }
      return { semesterLabel: `${getCurrentSeason()} ${getCurrentYear()}`, color: '' };
    },
  },
  methods: {
    onReset() {
      this.$emit(
        'deleteCourseFromSemesters',
        this.isTransferCredit ? 0 : this.courseTaken.courseId
      );
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

<template>
  <div class="completedsubreqcourse">
    <reset-confirmation-modal
      :isTestReq="isTransferCredit"
      :reqName="courseTaken.code"
      v-model="resetConfirmVisible"
      @close-reset-modal="onResetConfirmClosed"
      @modal-open="modalToggled"
    />
    <div class="completed-reqCourses-course-wrapper">
      <div class="separator"></div>
      <div class="completed-reqCourses-course-heading-wrapper">
        <div class="completed-reqCourses-course-heading-course">
          <span class="completed-reqCourses-course-heading-check"
            ><img src="@/assets/images/checkmark-green.svg" alt="checkmark"
          /></span>
          {{ slotName }}
        </div>
        <button
          class="completed-reqCourses-course-heading-reset-button reqCourse-button"
          @click="onReset"
        >
          {{ resetText }}
        </button>
      </div>
      <div class="completed-reqCourses-course-object-wrapper">
        <req-course
          :color="courseColor"
          :courseCode="courseTaken.code"
          :compact="true"
          :isCompletedReqCourse="true"
          class="completed-reqCourses-course-object"
        />
        <div class="completed-reqCourses-course-object-semester">in {{ semesterLabel }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import ReqCourse from '@/components/Requirements/ReqCourse.vue';
import ResetConfirmationModal from '@/components/Modals/ResetConfirmationModal.vue';
import store from '@/store';
import { deleteCourseFromSemesters } from '@/global-firestore-data';
import { onboardingDataCollection } from '@/firebaseConfig';
import getCurrentSeason, { getCurrentYear } from '@/utilities';

const transferCreditColor = 'DA4A4A'; // Arbitrary color for transfer credit

export default defineComponent({
  components: { ReqCourse, ResetConfirmationModal },
  props: {
    slotName: { type: String, required: true },
    courseTaken: { type: Object as PropType<CourseTaken>, required: true },
  },
  data: () => ({
    resetConfirmVisible: false,
  }),
  computed: {
    semesters(): readonly FirestoreSemester[] {
      return store.state.semesters;
    },
    resetText(): string {
      return 'Reset';
    },
    isTransferCredit(): boolean {
      return this.courseTaken.uniqueId < 0;
    },
    semesterLabel(): string {
      if (this.isTransferCredit) return 'Transfer Credits';
      const courseSemester =
        store.state.derivedCoursesData.courseToSemesterMap[this.courseTaken.uniqueId];
      return courseSemester != null
        ? `${courseSemester.type} ${courseSemester.year}`
        : `${getCurrentSeason()} ${getCurrentYear()}`;
    },
    courseColor(): string {
      if (this.isTransferCredit) return transferCreditColor;
      const course = store.state.derivedCoursesData.courseMap[this.courseTaken.uniqueId];
      return course != null ? course.color : '';
    },
  },
  methods: {
    onReset(): void {
      this.resetConfirmVisible = true;
      this.$emit('modal-open', true);
    },
    onResetConfirmClosed(isReset: boolean): void {
      this.$emit('modal-open', false);
      if (isReset) {
        if (this.isTransferCredit) {
          const type = this.courseTaken.code.substr(0, 2);
          const name = this.courseTaken.code.substr(3);

          const onBoardingData = store.state.onboardingData;

          onboardingDataCollection.doc(store.state.currentFirebaseUser.email).update({
            exam: onBoardingData.exam.filter(e => !(e.type === type && e.subject === name)),
          });
        } else deleteCourseFromSemesters(this.courseTaken.uniqueId, this.$gtag);
      }
    },
    modalToggled(isOpen: boolean) {
      this.$emit('modal-open', isOpen);
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

<template>
  <div class="completedsubreqcourse">
    <delete-course-modal
      :isTransferCredit="isTransferCredit"
      :reqName="courseTaken.code"
      :reqDesc="reqDesc"
      v-if="currentModal === Modals.Delete"
      @close-delete-course-modal="onDeleteCourseModalClose"
    />
    <replace-course-modal
      v-if="currentModal === Modals.Replace"
      @close-replace-course-modal="onReplaceCourseModalClose"
    />
    <div class="completed-reqCourses-course-wrapper">
      <div class="separator"></div>
      <div class="completed-reqCourses-course-heading-wrapper">
        <div class="completed-reqCourses-course-heading-course">
          <course-caution
            v-if="isCourseConflict(courseTaken.uniqueId)"
            :course="courseTaken"
            :isCompactView="false"
          />
          <span v-else class="completed-reqCourses-course-heading-check"
            ><img src="@/assets/images/checkmark-green.svg" alt="checkmark"
          /></span>
          <span class="completed-reqCourses-course-heading-name">{{ slotName }}</span>
        </div>
        <button
          class="reqCourse-button"
          @click="openSlotMenu"
          data-cyId="gear-complete-subreq"
        ></button>
      </div>
      <div class="completed-reqCourses-course-object-wrapper">
        <req-course
          :color="courseColor"
          :courseCode="courseTaken.code"
          :compact="true"
          :isCompletedReqCourse="true"
          :isConflict="isCourseConflict(courseTaken.uniqueId)"
          class="completed-reqCourses-course-object"
        />
        <div class="completed-reqCourses-course-object-semester">in {{ semesterLabel }}</div>
      </div>
    </div>
    <slot-menu
      v-if="currentModal === Modals.SlotMenu"
      :position="slotMenuPosition"
      @open-replace-slot-modal="onReplaceModalOpen"
      @open-delete-slot-modal="onDeleteModalOpen"
      @close-slot-menu="closeSlotMenu"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import ReqCourse from '@/components/Requirements/ReqCourse.vue';
import SlotMenu from '@/components/Modals/SlotMenu.vue';
import DeleteCourseModal from '@/components/Modals/DeleteCourseModal.vue';
import ReplaceCourseModal from '@/components/Modals/ReplaceCourseModal.vue';
import CourseCaution from '@/components/Course/CourseCaution.vue';
import store, { isCourseConflict } from '@/store';
import { deleteCourseFromSemesters, deleteTransferCredit } from '@/global-firestore-data';
import { getCurrentSeason, getCurrentYear, clickOutside } from '@/utilities';

const transferCreditColor = 'DA4A4A'; // Arbitrary color for transfer credit

export default defineComponent({
  components: { ReqCourse, DeleteCourseModal, ReplaceCourseModal, SlotMenu, CourseCaution },
  props: {
    slotName: { type: String, required: true },
    courseTaken: { type: Object as PropType<CourseTaken>, required: true },
    reqDesc: { type: String, required: true },
  },
  data: () => ({
    Modals: {
      Replace: 0,
      Delete: 1,
      SlotMenu: 2,
      None: 3,
    },
    currentModal: 3,
    mousePosition: { x: 0, y: 0 },
  }),
  computed: {
    semesters(): readonly FirestoreSemester[] {
      return store.state.semesters;
    },
    isTransferCredit(): boolean {
      const { uniqueId } = this.courseTaken;
      return typeof uniqueId === 'string' || uniqueId < 0;
    },
    semesterLabel(): string {
      if (this.isTransferCredit) return 'Transfer Credits';
      const { uniqueId } = this.courseTaken;
      const courseSemester =
        (typeof uniqueId === 'number' &&
          store.state.derivedCoursesData.courseToSemesterMap[uniqueId]) ||
        null;
      return courseSemester !== null
        ? `${courseSemester.season} ${courseSemester.year}`
        : `${getCurrentSeason()} ${getCurrentYear()}`;
    },
    courseColor(): string {
      if (this.isTransferCredit) return transferCreditColor;
      const { uniqueId } = this.courseTaken;
      const course =
        (typeof uniqueId === 'number' && store.state.derivedCoursesData.courseMap[uniqueId]) ||
        null;
      return course !== null ? course.color : '';
    },
    slotMenuPosition(): { x: number; y: number } {
      return window.innerWidth > 863
        ? { x: this.mousePosition.x + 10, y: this.mousePosition.y - 14 }
        : { x: this.mousePosition.x - 120, y: this.mousePosition.y - 7 };
    },
  },
  methods: {
    onDeleteModalOpen(): void {
      this.currentModal = this.Modals.Delete;
      console.log('Current Modal:', this.currentModal);
    },
    onDeleteCourseModalClose(isDelete: boolean): void {
      this.currentModal = this.Modals.None;

      if (isDelete) {
        if (this.isTransferCredit) {
          deleteTransferCredit(this.courseTaken.code);
        } else {
          const { uniqueId } = this.courseTaken;
          if (typeof uniqueId === 'number') deleteCourseFromSemesters(uniqueId, this.$gtag);
        }
      }
    },
    onReplaceModalOpen(): void {
      console.log('Current Modal: ', this.currentModal);
      this.currentModal = this.Modals.Replace;
    },
    onReplaceCourseModalClose(): void {
      this.currentModal = this.Modals.None;
    },
    openSlotMenu(e: MouseEvent) {
      this.mousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
      this.currentModal = this.Modals.SlotMenu;
      console.log('Current Modal: ', this.currentModal);
    },
    closeSlotMenu() {
      if (this.currentModal === this.Modals.SlotMenu) {
        this.currentModal = this.Modals.None;
      }
      console.log('Current Modal: ', this.currentModal);
    },
    isCourseConflict,
  },
  directives: {
    'click-outside': clickOutside,
  },
  emits: {
    'update:modelValue': (value: boolean) => typeof value === 'boolean',
    'select-course': (course: CornellCourseRosterCourse) => typeof course === 'object',
    'add-course': (course: CornellCourseRosterCourse, choice: FirestoreCourseOptInOptOutChoices) =>
      typeof course === 'object' && typeof choice === 'object',
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
          display: flex;
        }
        &-name {
          margin-left: 5px;
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

.reqCourse-button {
  padding: 0 0.5rem 0rem;
  cursor: pointer;
  background: url('@/assets/images/gear.svg') no-repeat;
  &:hover {
    background: url('@/assets/images/settingsBlue.svg') no-repeat;
  }
}
</style>

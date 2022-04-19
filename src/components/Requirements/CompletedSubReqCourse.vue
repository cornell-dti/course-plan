<template>
  <div class="completedsubreqcourse">
    <delete-course-modal
      :isTransferCredit="isTransferCredit"
      :reqName="courseTaken.code"
      v-if="deleteModalVisible"
      @close-delete-course-modal="onDeleteCourseModalClose"
    />
    <replace-course-modal
      v-if="replaceModalVisible"
      @select-course="selectCourse"
      @add-course="addCourse"
      @close-replace-course-modal="onReplaceCourseModalClose"
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
        <button class="reqCourse-button" @click="openSlotMenu"></button>
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
    <slot-menu
      v-if="slotMenuOpen"
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
import store from '@/store';
import { deleteCourseFromSemesters, deleteTransferCredit } from '@/global-firestore-data';
import { getCurrentSeason, getCurrentYear, clickOutside } from '@/utilities';

const transferCreditColor = 'DA4A4A'; // Arbitrary color for transfer credit

export default defineComponent({
  components: { ReqCourse, DeleteCourseModal, ReplaceCourseModal, SlotMenu },
  props: {
    slotName: { type: String, required: true },
    courseTaken: { type: Object as PropType<CourseTaken>, required: true },
  },
  data: () => ({
    replaceModalVisible: false,
    deleteModalVisible: false,
    slotMenuOpen: false,
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
      this.deleteModalVisible = true;
    },
    onDeleteCourseModalClose(isDelete: boolean): void {
      this.deleteModalVisible = false;

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
      this.replaceModalVisible = true;
    },
    onReplaceCourseModalClose(): void {
      this.replaceModalVisible = false;
    },
    openSlotMenu(e: MouseEvent) {
      this.mousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
      this.slotMenuOpen = true;
    },
    closeSlotMenu() {
      this.slotMenuOpen = false;
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  emits: {
    'update:modelValue': (value: boolean) => typeof value === 'boolean',
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

.reqCourse-button {
  padding: 0 0.5rem 0rem;
  cursor: pointer;
  background: url('@/assets/images/gear.svg') no-repeat;
  &:hover {
    background: url('@/assets/images/settingsBlue.svg') no-repeat;
  }
}
</style>

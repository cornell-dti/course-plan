<template>
  <div class="completedsubreqcourse">
    <delete-course-modal
      :isTransferCredit="isTransferCredit"
      :reqName="courseTaken.code"
      v-if="deleteModalVisible"
      @close-delete-course-modal="onDeleteCourseModalClose"
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
          {{ slotName }}
        </div>
        <button class="reqCourse-button" @click="onDeleteModalOpen">Delete ></button>
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
      v-if="slotMenuOpen"
      :position="slotMenuPosition"
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
import CourseCaution from '@/components/Course/CourseCaution.vue';
import store, { isCourseConflict } from '@/store';
import { deleteCourseFromSemesters, deleteTransferCredit } from '@/global-firestore-data';
import { getCurrentSeason, getCurrentYear, clickOutside } from '@/utilities';

const transferCreditColor = 'DA4A4A'; // Arbitrary color for transfer credit

export default defineComponent({
  components: { ReqCourse, DeleteCourseModal, SlotMenu, CourseCaution },
  props: {
    slotName: { type: String, required: true },
    courseTaken: { type: Object as PropType<CourseTaken>, required: true },
  },
  data: () => ({
    deleteModalVisible: false,
    slotMenuOpen: false,
    mousePosition: { x: 0, y: 0 },
  }),
  computed: {
    semesters(): readonly FirestoreSemester[] {
      return store.getters.getCurrentPlanSemesters;
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
          if (typeof uniqueId === 'number')
            deleteCourseFromSemesters(store.state.currentPlan, uniqueId, this.$gtag);
        }
      }
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
    isCourseConflict,
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
@import '@/assets/scss/_tokens.scss';

.separator {
  height: 1px;
  width: 100%;
  background-color: $cp-line;
}

.completed {
  &-reqCourses {
    &-course {
      &-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 8px 0;
      }
      &-heading {
        &-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
        }
        &-course {
          @include cp-text(12px, 16px, 500);
          display: flex;
          align-items: center;
          gap: 6px;
          color: $cp-muted;
        }
        &-check {
          display: flex;
          img {
            width: 12px;
            height: 12px;
          }
        }
      }
      &-object {
        &-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        &-semester {
          @include cp-text(11px, 14px);
          color: $cp-muted;
          white-space: nowrap;
        }
      }
    }
  }
}

.reqCourse {
  &-button {
    @include cp-link(12px, 16px, 500);
  }
}
</style>

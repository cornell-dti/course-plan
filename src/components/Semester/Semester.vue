<template>
  <div class="semester" :class="{ 'semester--compact': compact }">
    <new-course-modal
      class="semester-modal"
      :class="{ 'modal--block': isCourseModalOpen }"
      @close-course-modal="closeCourseModal"
      @add-course="addCourse"
    />
    <confirmation
      class="confirmation-modal"
      :class="{ 'confirmation-modal--flex': isConfirmationOpen }"
      :text="confirmationText"
    />
    <delete-semester
      class="semester-modal"
      :class="{ 'modal--block': isDeleteSemesterOpen }"
      @delete-semester="deleteSemester"
      @close-delete-modal="closeDeleteModal"
      :deleteSemType="type"
      :deleteSemYear="year"
      ref="deletesemester"
    />
    <edit-semester
      class="semester-modal"
      :class="{ 'modal--block': isEditSemesterOpen }"
      @edit-semester="editSemester"
      @close-edit-modal="closeEditModal"
      :deleteSemType="type"
      :deleteSemYear="year"
      ref="modalBodyComponent"
    />
    <button
      v-if="isFirstSem"
      class="semester-addSemesterButton"
      @click="openSemesterModal"
      data-intro-group="pageTour"
      data-intro='<b>Add your past and future Semester Cards</b><br>
      <div class = "introjs-bodytext">Once you’re done setting up your current semester,
      feel free to add both past and future semesters. Try to utilize your requirements bar</div>'
      data-step="4"
      data-disable-interaction="1"
    >
      + New Semester
    </button>
    <div
      class="semester-content"
      data-intro-group="pageTour"
      data-step="2"
      :data-intro="seasonMessage()"
      data-disable-interaction="1"
    >
      <div class="semester-top" :class="{ 'semester-top--compact': compact }">
        <div class="semester-left" :class="{ 'semester-left--compact': compact }">
          <span class="semester-name"
            ><img class="season-emoji" :src="seasonImg[type]" alt="" /> {{ type }} {{ year }}</span
          >
          <span class="semester-credits">{{ creditString }}</span>
        </div>
        <div class="semester-right" :class="{ 'semester-right--compact': compact }">
          <div class="semester-dotRow" @click="openSemesterMenu">
            <img src="@/assets/images/dots/threeDots.svg" alt="dots" />
          </div>
        </div>
      </div>
      <div class="semester-courses">
        <draggable
          ref="droppable"
          class="draggable-semester-courses"
          group="draggable-semester-courses"
          v-model="coursesForDraggable"
          :style="{ height: courseContainerHeight + 'rem' }"
          :move="onDraggedCourseMove"
          @start="onDragStart"
          @sort="onDropped"
          @end="onDragEnd"
        >
          <div
            v-for="course in coursesForDraggable"
            :key="course.uniqueID"
            class="semester-courseWrapper"
          >
            <course
              :courseObj="course"
              :isReqCourse="false"
              :compact="compact"
              :active="activatedCourse.uniqueID === course.uniqueID"
              class="semester-course"
              :semesterIndex="semesterIndex + 1"
              @delete-course="deleteCourse"
              @color-course="colorCourse"
              @course-on-click="courseOnClick"
              @edit-course-credit="editCourseCredit"
            />
          </div>
        </draggable>
        <add-course-button
          :compact="compact"
          :shouldShowWalkthrough="true"
          @click="openCourseModal"
        />
      </div>
    </div>
    <semester-menu
      v-if="semesterMenuOpen"
      class="semester-menu"
      @open-delete-semester-modal="openDeleteSemesterModal"
      @open-edit-semester-modal="openEditSemesterModal"
      v-click-outside="closeSemesterMenuIfOpen"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import draggable from 'vuedraggable';
import introJs from 'intro.js';
import Course from '@/components/Course/Course.vue';
import NewCourseModal from '@/components/Modals/NewCourse/NewCourseModal.vue';
import Confirmation from '@/components/Confirmation.vue';
import SemesterMenu from '@/components/Modals/SemesterMenu.vue';
import DeleteSemester from '@/components/Modals/DeleteSemester.vue';
import EditSemester from '@/components/Modals/EditSemester.vue';
import AddCourseButton from '@/components/AddCourseButton.vue';

import { onDraggedCourseMove, clickOutside } from '@/utilities';

import fall from '@/assets/images/fallEmoji.svg';
import spring from '@/assets/images/springEmoji.svg';
import winter from '@/assets/images/winterEmoji.svg';
import summer from '@/assets/images/summerEmoji.svg';
import { chooseSelectableRequirementOption } from '@/global-firestore-data';
import { cornellCourseRosterCourseToFirebaseSemesterCourse } from '@/user-data-converter';
import store from '@/store';

const pageTour = introJs();
pageTour.setOption('exitOnEsc', 'false');
pageTour.setOption('doneLabel', 'Finish');
pageTour.setOption('skipLabel', 'Skip This Tutorial');
pageTour.setOption('nextLabel', 'Next');
pageTour.setOption('exitOnOverlayClick', 'false');

export default Vue.extend({
  components: {
    draggable,
    AddCourseButton,
    Confirmation,
    Course,
    DeleteSemester,
    EditSemester,
    NewCourseModal,
    SemesterMenu,
  },
  data() {
    return {
      confirmationText: '',
      isConfirmationOpen: false,
      scrollable: true,
      semesterMenuOpen: false,
      stopCloseFlag: false,

      isDeleteSemesterOpen: false,
      isEditSemesterOpen: false,
      isShadow: false,
      isDraggedFrom: false,
      isCourseModalOpen: false,

      seasonImg: {
        Fall: fall,
        Spring: spring,
        Winter: winter,
        Summer: summer,
      },
    };
  },
  props: {
    semesterIndex: { type: Number, required: true },
    type: {
      type: String as PropType<'Fall' | 'Spring' | 'Winter' | 'Summer'>,
      required: true,
    },
    year: { type: Number, required: true },
    courses: {
      type: Array as PropType<readonly FirestoreSemesterCourse[]>,
      required: true,
    },
    compact: { type: Boolean, required: true },
    activatedCourse: { type: Object as PropType<FirestoreSemesterCourse>, required: true },
    isFirstSem: { type: Boolean, required: true },
  },
  mounted() {
    this.$el.addEventListener('touchmove', this.dragListener, {
      passive: false,
    });
    const droppable = (this.$refs.droppable as Vue).$el as HTMLDivElement;
    droppable.addEventListener('dragenter', this.onDragEnter);
    droppable.addEventListener('dragexit', this.onDragExit);
  },
  beforeDestroy() {
    this.$el.removeEventListener('touchmove', this.dragListener);
    const droppable = (this.$refs.droppable as Vue).$el as HTMLDivElement;
    droppable.removeEventListener('dragenter', this.onDragEnter);
    droppable.removeEventListener('dragexit', this.onDragExit);
  },

  computed: {
    coursesForDraggable: {
      get(): readonly FirestoreSemesterCourse[] {
        return this.courses;
      },
      set(newCourses: readonly FirestoreSemesterCourse[]) {
        this.$emit(
          'edit-semester',
          this.year,
          this.type,
          (semester: FirestoreSemester): FirestoreSemester => ({
            ...semester,
            courses: newCourses,
          })
        );
      },
    },
    // Add space for a course if there is a "shadow" of it, decrease if it is from the current sem
    courseContainerHeight(): number {
      let factor = 6.1;
      let extraIncrementer = 0;
      if (this.isShadow) {
        extraIncrementer += 1;
      }
      if (this.isDraggedFrom) {
        extraIncrementer -= 1;
      }
      if (this.compact) {
        factor = 2.6;
      }
      return (this.courses.length + 1 + extraIncrementer) * factor;
    },
    creditString() {
      let credits = 0;
      this.courses.forEach(course => {
        credits += course.credits;
      });
      if (credits === 1) {
        return `${credits.toString()} credit`;
      }
      return `${credits.toString()} credits`;
    },
    // Note: Currently not used
    deleteDuplicateCourses(): readonly FirestoreSemesterCourse[] {
      const uniqueCoursesNames: string[] = [];
      const uniqueCourses: FirestoreSemesterCourse[] = [];
      this.courses.forEach(course => {
        if (uniqueCoursesNames.indexOf(course.name) === -1) {
          uniqueCourses.push(course);
          uniqueCoursesNames.push(course.name);
        }
      });
      return uniqueCourses;
    },
  },
  methods: {
    onDraggedCourseMove,
    onDragStart() {
      this.isDraggedFrom = true;
      this.scrollable = true;
      this.isShadow = false;
    },
    onDragEnter() {
      this.isShadow = true;
    },
    onDragExit() {
      this.isShadow = false;
    },
    onDropped() {
      this.isShadow = false;
    },
    onDragEnd() {
      this.isShadow = false;
      this.scrollable = false;
      this.isDraggedFrom = false;
    },
    openCourseModal() {
      // Delete confirmation for the use case of adding multiple courses consecutively
      this.closeConfirmationModal();
      this.isCourseModalOpen = true;
    },
    closeCourseModal() {
      this.isCourseModalOpen = false;
    },
    closeEditModal() {
      this.isEditSemesterOpen = false;
    },
    closeDeleteModal() {
      this.isDeleteSemesterOpen = false;
    },
    openSemesterModal() {
      // Delete confirmation for the use case of adding multiple semesters consecutively
      this.closeConfirmationModal();

      this.$emit('new-semester');
    },
    openConfirmationModal(msg: string) {
      // Set text and display confirmation modal, then have it disappear after 3 seconds
      this.confirmationText = msg;
      this.isConfirmationOpen = true;

      setTimeout(() => {
        this.closeConfirmationModal();
      }, 3000);
    },
    closeConfirmationModal() {
      this.isConfirmationOpen = false;
    },
    addCourse(data: CornellCourseRosterCourse, requirementID: string) {
      const newCourse = cornellCourseRosterCourseToFirebaseSemesterCourse(data);
      chooseSelectableRequirementOption({
        ...store.state.selectableRequirementChoices,
        [newCourse.uniqueID]: requirementID,
      });
      const courseCode = `${data.subject} ${data.catalogNbr}`;

      this.$emit(
        'edit-semester',
        this.year,
        this.type,
        (semester: FirestoreSemester): FirestoreSemester => ({
          ...semester,
          courses: [...this.courses, newCourse],
        })
      );

      const confirmationMsg = `Added ${courseCode} to ${this.type} ${this.year}`;

      this.openConfirmationModal(confirmationMsg);
      this.$gtag.event('add-course', {
        event_category: 'course',
        event_label: 'add',
        value: 1,
      });
    },
    deleteCourse(courseCode: string, uniqueID: number) {
      this.openConfirmationModal(`Removed ${courseCode} from ${this.type} ${this.year}`);
      this.$gtag.event('delete-course', {
        event_category: 'course',
        event_label: 'delete',
        value: 1,
      });
      // Update requirements menu
      this.$emit(
        'edit-semester',
        this.year,
        this.type,
        (semester: FirestoreSemester): FirestoreSemester => ({
          ...semester,
          courses: this.courses.filter(course => course.uniqueID !== uniqueID),
        })
      );
    },
    colorCourse(color: string, uniqueID: number) {
      this.$emit(
        'edit-semester',
        this.year,
        this.type,
        (semester: FirestoreSemester): FirestoreSemester => ({
          ...semester,
          courses: this.courses.map(course =>
            course.uniqueID === uniqueID ? { ...course, color } : course
          ),
        })
      );
    },
    courseOnClick(course: FirestoreSemesterCourse) {
      this.$emit('course-onclick', course);
    },
    editCourseCredit(credit: number, uniqueID: number) {
      this.$emit(
        'edit-semester',
        this.year,
        this.type,
        (semester: FirestoreSemester): FirestoreSemester => ({
          ...semester,
          courses: this.courses.map(course =>
            course.uniqueID === uniqueID ? { ...course, credits: credit } : course
          ),
        })
      );
    },
    dragListener(event: Event) {
      if (!this.$data.scrollable) event.preventDefault();
    },
    seasonMessage() {
      return `<b>This is a Semester Card of your current semester!
      <img src="${fall}"class = "newSemester-emoji-text">
      <img src="${spring}"class = "newSemester-emoji-text">
      <img src="${summer}"class = "newSemester-emoji-text">
      <img src="${winter}"class = "newSemester-emoji-text">
      </b><div
      class = "introjs-bodytext"> You can add all courses here in the following semester.</div>`;
    },
    openSemesterMenu() {
      this.stopCloseFlag = true;
      this.semesterMenuOpen = true;
    },
    closeSemesterMenuIfOpen() {
      if (this.stopCloseFlag) {
        this.stopCloseFlag = false;
      } else if (this.semesterMenuOpen) {
        this.semesterMenuOpen = false;
      }
    },
    openDeleteSemesterModal() {
      this.isDeleteSemesterOpen = true;
    },
    deleteSemester(type: string, year: string) {
      this.$emit('delete-semester', type, year);
      this.openConfirmationModal(`Deleted ${type} ${year} from plan`);
    },
    openEditSemesterModal() {
      this.isEditSemesterOpen = true;
    },
    editSemester(seasonInput: 'Fall' | 'Spring' | 'Winter' | 'Summer', yearInput: number) {
      this.$emit(
        'edit-semester',
        this.year,
        this.type,
        (oldSemester: FirestoreSemester): FirestoreSemester => ({
          ...oldSemester,
          type: seasonInput,
          year: yearInput,
        })
      );
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.semester {
  width: fit-content;
  position: relative;
  border-radius: 11px;

  &-addSemesterButton {
    background: $sangBlue;
    border-radius: 8px;
    min-height: 2.5rem;
    min-width: 9rem;
    color: #ffffff;
    border: none;
    position: absolute;
    top: -3.3rem;
  }

  &-content {
    padding: 0.875rem 0;
    border: 2px solid #d8d8d8;
    border-radius: 11px;
  }

  &--compact {
    padding: 0.875rem 1.125rem;
  }

  &-confirmation {
    top: 16px;
    display: none;
  }

  &-top {
    display: flex;
    justify-content: space-between;
    color: $medGray;
    margin-left: 1.125rem;
    margin-right: 1.125rem;
  }

  &-left {
    display: flex;
    flex-direction: column;

    &--compact {
      justify-content: space-between;
    }
  }

  &-right {
    &--compact {
      margin-top: 0.25rem;
    }
  }

  &-dotRow {
    padding: 8px 0;
    display: flex;
    position: relative;
    &:hover,
    &:active,
    &:focus {
      cursor: pointer;
    }
  }

  &-menu {
    position: absolute;
    right: -3rem;
    top: 2rem;
    z-index: 1;
  }

  &-name {
    font-size: 18px;
    line-height: 18px;
    margin-right: 0.5rem;
    font-weight: bold;
  }

  &-icon {
    width: 14px;
    height: 14px;
  }

  &-credits {
    font-size: 14px;
    line-height: 17px;
  }

  &-courseWrapper {
    margin: 0.5rem 0 0.5rem 0;
  }

  &-course {
    touch-action: none;
    cursor: grab;
  }

  &-course:active:hover {
    touch-action: none;
    cursor: grabbing;
  }

  &-addWrapper {
    margin-top: -5rem;
    width: 21.375rem;
    height: 4.625rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #d8d8d8;
    color: $medGray;
    margin-left: 1.125rem;
    margin-right: 1.125rem;

    &--compact {
      margin-top: -1.2rem;
      width: 10rem;
      height: 2rem;
    }
  }

  &-buttonText {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;

    &--compact {
      font-size: 14px;
      line-height: 17px;
    }
  }

  .season-emoji {
    height: 18px;
    margin-top: -4px;
  }

  /* The Modal (background) */
  .semester-modal {
    display: none;
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }

  .draggable-semester-courses {
    padding-top: 5px;
    padding-left: 1.125rem;
    padding-right: 1.125rem;
  }

  //Styling for drag and drop components and movement
  .gu-mirror {
    position: fixed !important;
    margin: 0 !important;
    z-index: 9999 !important;
    opacity: 0.8;
    -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';
    filter: alpha(opacity=80);
  }
  .gu-hide {
    display: none !important;
  }
  .gu-unselectable {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
  }
  .gu-transit {
    opacity: 0.2;
    -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)';
    filter: alpha(opacity=20);
  }

  .semester-modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

    &--block {
      display: block;
    }
  }

  .confirmation-modal {
    display: none;

    &--flex {
      display: flex;
    }
  }

  .modal {
    &--block {
      display: block;
    }
  }
}

@media only screen and (max-width: $medium-breakpoint) {
  .semester {
    &-menu {
      right: 0rem;
    }
    &-addWrapper {
      width: 17rem;
      &--compact {
        width: 10rem;
        height: 2rem;
      }
    }
  }
}
</style>

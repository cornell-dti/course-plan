<template>
  <div class="semester" :class="{ 'semester--compact': compact }" :id="id">
    <modal
      :id="'courseModal-' + id"
      class="semester-modal"
      type="course"
      :class="{ 'modal--block': isCourseModalOpen }"
      :semesterID="id"
      :isCourseModelSelectingSemester="isCourseModelSelectingSemester"
      @check-course-duplicate="checkCourseDuplicate"
      @close-course-modal="closeCourseModal"
      @add-course="addCourse"
      ref="modal"
      :seasonCourse="type"
      :yearCourse="year"
      :reqs="reqs"
    />
    <confirmation
      class="confirmation-modal"
      :class="{ 'confirmation-modal--flex': isConfirmationOpen }"
      :text="confirmationText"
    />
    <deletesemester
      class="semester-modal"
      :class="{ 'modal--block': isDeleteSemesterOpen }"
      @delete-semester="deleteSemester"
      @close-delete-modal="closeDeleteModal"
      :deleteSemID="deleteSemID"
      :deleteSemType="deleteSemType"
      :deleteSemYear="deleteSemYear"
      ref="deletesemester"
    />
    <editsemester
      class="semester-modal"
      :class="{ 'modal--block': isEditSemesterOpen }"
      @edit-semester="editSemester"
      @close-edit-modal="closeEditModal"
      :semesters="semesters"
      :deleteSemID="deleteSemID"
      :deleteSemType="deleteSemType"
      :deleteSemYear="deleteSemYear"
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
      id="tour"
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
        <div
          class="draggable-semester-courses"
          v-dragula="courses"
          bag="first-bag"
          :semId="id"
          :style="{ height: courseContainerHeight + 'rem' }"
        >
          <div v-for="course in courses" :key="course.uniqueID" class="semester-courseWrapper">
            <course
              v-bind="course"
              :courseObj="course"
              :duplicatedCourseCodeList="duplicatedCourseCodeList"
              :id="course.subject + course.number"
              :uniqueID="course.uniqueID"
              :compact="compact"
              :active="activatedCourse.uniqueID === course.uniqueID"
              class="semester-course"
              :semId="id"
              @delete-course="deleteCourse"
              @color-course="colorCourse"
              @updateBar="updateBar"
              @edit-course-credit="editCourseCredit"
            />
          </div>
        </div>
        <addcoursebutton
          :compact="compact"
          :shouldShowWalkthrough="true"
          @click="openCourseModal"
        />
      </div>
    </div>
    <semestermenu
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
import introJs from 'intro.js';
import Course from '@/components/Course.vue';
import Modal from '@/components/Modals/Modal.vue';
import Confirmation from '@/components/Confirmation.vue';
import SemesterMenu from '@/components/Modals/SemesterMenu.vue';
import DeleteSemester from '@/components/Modals/DeleteSemester.vue';
import EditSemester from '@/components/Modals/EditSemester.vue';
import AddCourseButton from '@/components/AddCourseButton.vue';

import { clickOutside } from '@/utilities';
import { AppCourse, AppSemester, CornellCourseRosterCourse } from '@/user-data';
import { SingleMenuRequirement } from '@/requirements/types';

Vue.component('course', Course);
Vue.component('modal', Modal);
Vue.component('confirmation', Confirmation);
Vue.component('semestermenu', SemesterMenu);
Vue.component('deletesemester', DeleteSemester);
Vue.component('editsemester', EditSemester);
Vue.component('addcoursebutton', AddCourseButton);

const fall = require('@/assets/images/fallEmoji.svg');
const spring = require('@/assets/images/springEmoji.svg');
const winter = require('@/assets/images/winterEmoji.svg');
const summer = require('@/assets/images/summerEmoji.svg');

const pageTour = introJs();
pageTour.setOption('exitOnEsc', 'false');
pageTour.setOption('doneLabel', 'Finish');
pageTour.setOption('skipLabel', 'Skip This Tutorial');
pageTour.setOption('nextLabel', 'Next');
pageTour.setOption('exitOnOverlayClick', 'false');

export default Vue.extend({
  data() {
    return {
      confirmationText: '',
      isConfirmationOpen: false,
      scrollable: true,
      semesterMenuOpen: false,
      stopCloseFlag: false,

      deleteSemID: 0,
      deleteSemType: '',
      deleteSemYear: 0,
      isDeleteSemesterOpen: false,
      isEditSemesterOpen: false,
      isShadow: false,
      isDraggedFrom: false,
      isCourseModalOpen: false,
      isCourseModelSelectingSemester: false,

      seasonImg: {
        Fall: fall,
        Spring: spring,
        Winter: winter,
        Summer: summer,
      },
    };
  },
  props: {
    id: Number,
    type: String as PropType<'Fall' | 'Spring' | 'Winter' | 'Summer'>,
    year: Number,
    courses: Array as PropType<readonly AppCourse[]>,
    compact: Boolean,
    activatedCourse: Object as PropType<AppCourse>,
    duplicatedCourseCodeList: Array as PropType<readonly string[]>,
    semesters: Array as PropType<readonly AppSemester[]>,
    isFirstSem: Boolean,
    reqs: Array as PropType<readonly SingleMenuRequirement[]>,
  },
  watch: {
    courses: {
      handler() {
        this.$emit(
          'edit-semester',
          this.id,
          (semester: AppSemester): AppSemester => ({
            ...semester,
            courses: this.courses,
          })
        );
      },
    },
  },
  mounted() {
    this.$el.addEventListener('touchmove', this.dragListener, { passive: false });
    // @ts-ignore
    const service = Vue.$dragula.$service;
    service.eventBus.$on('drag', (data: any) => {
      if (parseInt(data.container.getAttribute('semId'), 10) === this.id) {
        this.isDraggedFrom = true;
      }
      this.scrollable = true;
      this.isShadow = false;
    });
    service.eventBus.$on('drop', () => {
      this.scrollable = true;
    });
    service.eventBus.$on('shadow', (data: any) => {
      if (parseInt(data.container.getAttribute('semId'), 10) === this.id) {
        this.isShadow = true;
      } else {
        this.isShadow = false;
      }
    });
    service.eventBus.$on('dragend', () => {
      this.isShadow = false;
      this.isDraggedFrom = false;
    });
  },
  beforeDestroy() {
    this.$el.removeEventListener('touchmove', this.dragListener);
  },

  computed: {
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
    deleteDuplicateCourses(): readonly AppCourse[] {
      const uniqueCoursesNames: string[] = [];
      const uniqueCourses: AppCourse[] = [];
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
    openCourseModal(isSelectingSemester: boolean = false) {
      // Delete confirmation for the use case of adding multiple courses consecutively
      this.closeConfirmationModal();
      this.isCourseModalOpen = true;
      this.isCourseModelSelectingSemester = isSelectingSemester;
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
    addCourse(
      data: CornellCourseRosterCourse,
      season: string | null = null,
      year: number | null = null
    ) {
      // @ts-ignore
      const newCourse = this.$parent.$parent.createAppCourseFromCornellRosterCourse(data, false);
      const courseCode = `${data.subject} ${data.catalogNbr}`;
      let confirmationMsg;
      if (season !== '' || year !== 0) {
        this.$emit('add-course-to-semester', season, year, newCourse);
        confirmationMsg = `Added ${courseCode} to ${season} ${year}`;
      } else {
        this.$emit(
          'edit-semester',
          this.id,
          (semester: AppSemester): AppSemester => ({
            ...semester,
            courses: [...this.courses, newCourse],
          })
        );
        confirmationMsg = `Added ${courseCode} to ${this.type} ${this.year}`;
      }
      this.openConfirmationModal(confirmationMsg);
      this.$gtag.event('add-course', {
        event_category: 'course',
        event_label: 'add',
        value: 1,
      });
    },
    deleteCourse(subject: string, number: string, uniqueID: number) {
      const courseCode = `${subject} ${number}`;
      this.openConfirmationModal(`Removed ${courseCode} from ${this.type} ${this.year}`);
      this.$gtag.event('delete-course', {
        event_category: 'course',
        event_label: 'delete',
        value: 1,
      });
      // Update requirements menu
      this.$emit(
        'edit-semester',
        this.id,
        (semester: AppSemester): AppSemester => ({
          ...semester,
          courses: this.courses.filter(course => course.uniqueID !== uniqueID),
        })
      );
    },
    colorCourse(color: string, uniqueID: number) {
      this.$emit(
        'edit-semester',
        this.id,
        (semester: AppSemester): AppSemester => ({
          ...semester,
          courses: this.courses.map(course =>
            course.uniqueID === uniqueID ? { ...course, color } : course
          ),
        })
      );
    },
    updateBar(course: AppCourse, colorJustChanged: string, color: string) {
      this.$emit('updateBar', course, colorJustChanged, color);
    },
    editCourseCredit(credit: number, uniqueID: number) {
      this.$emit(
        'edit-semester',
        this.id,
        (semester: AppSemester): AppSemester => ({
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
    // TODO: unused
    buildIncorrectPlacementCautions() {
      if (this.courses) {
        this.courses.forEach(course => {
          if (!course.semesters.includes(this.type))
            // @ts-ignore
            course.alerts.caution = `Course unavailable in the ${this.type}`;
        });
      }
    },

    checkCourseDuplicate(key: string) {
      if (this.courses) {
        // @ts-ignore
        this.$refs.modal.courseIsAddable = true;
        this.courses.forEach(course => {
          if (`${course.subject} ${course.number}` === key) {
            // @ts-ignore
            this.$refs.modal.courseIsAddable = false;
            this.$emit('open-caution-modal');
          }
        });
      }
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
      this.deleteSemType = this.type;
      this.deleteSemYear = this.year;
      this.deleteSemID = this.id;

      this.isDeleteSemesterOpen = true;
    },
    deleteSemester(type: string, year: string) {
      this.$emit('delete-semester', type, year);
      this.openConfirmationModal(`Deleted ${type} ${year} from plan`);
    },
    openEditSemesterModal() {
      this.deleteSemType = this.type;
      this.deleteSemYear = this.year;
      this.deleteSemID = this.id;

      this.isEditSemesterOpen = true;
    },
    editSemester(seasonInput: 'Fall' | 'Spring' | 'Winter' | 'Summer', yearInput: number) {
      this.$emit(
        'edit-semester',
        this.deleteSemID,
        (oldSemester: AppSemester): AppSemester => ({
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
    top: -3.5rem;
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
    color: #d8d8d8;
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

@media only screen and (max-width: 878px) {
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

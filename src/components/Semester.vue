<template>
  <div
    class="semester"
    :class="{ 'semester--min': !isNotSemesterButton, 'semester--compact': compact }"
    :id="id"
  >
    <modal :id="'courseModal-' + id" class="semester-modal" type="course" :semesterID="id" @check-course-duplicate="checkCourseDuplicate" ref="modal" />
    <confirmation
      :id="'confirmation-' + id"
      class="semester-confirmation"
      :text="confirmationText"
    />
    <deletesemester
      :id="'deleteSemesterModal-' + id"
      class="semester-modal-delete"
      @delete-semester="deleteSemester"
      :deleteSemID="deleteSemID"
      :deleteSemType="deleteSemType"
      :deleteSemYear="deleteSemYear"
      ref="deletesemester"
    />
    <div v-if="isNotSemesterButton" class="semester-content">
      <div class="semester-top" :class="{ 'semester-top--compact': compact }">
        <div class="semester-left" :class="{ 'semester-left--compact': compact }">
          <span class="semester-name">{{ type }} {{ year }}</span>
          <span class="semester-credits">{{ creditString }}</span>
        </div>
        <div class="semester-right" :class="{ 'semester-right--compact': compact }">
          <div class="semester-dotRow" @click="openSemesterMenu">
            <span class="semester-dot semester-dot--menu"></span>
            <span class="semester-dot semester-dot--menu"></span>
            <span class="semester-dot semester-dot--menu"></span>
          </div>
        </div>
      </div>
      <div class="semester-courses">
        <div class="draggable-semester-courses" v-dragula="courses" bag="first-bag">
          <div v-for="course in courses" :key="course.id" class="semester-courseWrapper">
            <course
              v-bind="course"
              :courseObj="course"
              :id="course.subject + course.number"
              :compact="compact"
              :active="activatedCourse.subject === course.subject && activatedCourse.number === course.number"
              class="semester-course"
              @delete-course="deleteCourse"
              @color-course="colorCourse"
              @updateBar="updateBar"
            />
          </div>
        </div>
        <div
          class="semester-courseWrapper semester-addWrapper"
          :class="{ 'semester-addWrapper--compact': compact }"
          @click="openCourseModal"
        >
          <span class="semester-buttonText" :class="{ 'semester-buttonText--compact': compact }">{{
            buttonString
          }}</span>
        </div>
      </div>
    </div>
    <div v-if="!isNotSemesterButton" class="semester-empty" @click="openSemesterModal">
      <div
        class="semester-semesterWrapper"
        :class="{ 'semester-semesterWrapper--compact': compact }"
      >
        <span class="semester-buttonText" :class="{ 'semester-buttonText--compact': compact }">{{
          semesterString
        }}</span>
      </div>
    </div>
    <semestermenu
      v-if="semesterMenuOpen"
      class="semester-menu"
      @open-delete-semester-modal="openDeleteSemesterModal"
      v-click-outside="closeSemesterMenuIfOpen" />
  </div>
</template>

<script>
import Vue from 'vue';
import Course from '@/components/Course';
import Modal from '@/components/Modals/Modal';
import Confirmation from '@/components/Confirmation';
import SemesterMenu from '@/components/Modals/SemesterMenu';
import DeleteSemester from '@/components/Modals/DeleteSemester';

Vue.component('course', Course);
Vue.component('modal', Modal);
Vue.component('confirmation', Confirmation);
Vue.component('semestermenu', SemesterMenu);
Vue.component('deletesemester', DeleteSemester);

const clickOutside = {
  bind(el, binding, vnode) {
    el.event = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.event);
  },
  unbind(el) {
    document.body.removeEventListener('click', el.event);
  }
};


export default {
  data() {
    return {
      confirmationText: '',
      scrollable: true,

      semesterMenuOpen: false,
      stopCloseFlag: false,

      deleteSemID: 0,
      deleteSemType: '',
      deleteSemYear: 0
    };
  },
  props: {
    id: Number,
    type: String,
    year: Number,
    courses: Array,
    isNotSemesterButton: Boolean,
    compact: Boolean,
    activatedCourse: Object
  },

  mounted() {
    this.$el.addEventListener('touchmove', this.dragListener, { passive: false });

    const service = Vue.$dragula.$service;

    service.eventBus.$on('drag', () => {
      this.scrollable = false;
    });
    service.eventBus.$on('drop', () => {
      this.scrollable = true;
    });

    this.buildCautions();
  },

  beforeDestroy() {
    this.$el.removeEventListener('touchmove', this.dragListener);
  },

  computed: {
    // TODO: calculate credits from all classes
    creditString() {
      let credits = 0;
      this.courses.forEach(course => {
        credits += course.credits;
      });
      return `${credits.toString()} credits`;
    },
    buttonString() {
      return '+ COURSE';
    },
    semesterString() {
      return '+ SEMESTER';
    }
  },
  methods: {
    openCourseModal() {
      // Delete confirmation for the use case of adding multiple courses consecutively
      this.closeConfirmationModal();

      const modal = document.getElementById(`courseModal-${this.id}`);
      modal.style.display = 'block';

      // Activate focus
      const input = document.getElementById(`dropdown-${this.id}`);
      input.value = '';
      input.focus();
    },
    openSemesterModal() {
      // Delete confirmation for the use case of adding multiple semesters consecutively
      this.closeConfirmationModal();

      this.$parent.openSemesterModal();
    },
    openConfirmationModal(msg) {
      // Set text and display confirmation modal, then have it disappear after 5 seconds

      this.confirmationText = msg;
      const confirmationModal = document.getElementById(`confirmation-${this.id}`);
      confirmationModal.style.display = 'flex';

      setTimeout(() => {
        confirmationModal.style.display = 'none';
      }, 3000);
    },
    closeConfirmationModal() {
      const confirmationModal = document.getElementById(`confirmation-${this.id}`);
      confirmationModal.style.display = 'none';
    },
    addCourse(data) {
      const newCourse = this.$parent.$parent.createCourse(data);
      this.courses.push(newCourse);
      const courseCode = `${data.subject} ${data.catalogNbr}`;
      this.openConfirmationModal(`Added ${courseCode} to ${this.type} ${this.year}`);
      this.buildCautions();
    },
    deleteCourse(courseCode) {
      for (let i = 0; i < this.courses.length; i += 1) {
        if (`${this.courses[i].subject} ${this.courses[i].number}` === courseCode) {
          this.courses.splice(i, 1);
          break;
        }
      }
      this.openConfirmationModal(`Removed ${courseCode} from ${this.type} ${this.year}`);
      // Update requirements menu
      this.$parent.$parent.updateRequirementsMenu();
    },
    colorCourse(color, courseCode) {
      for (let i = 0; i < this.courses.length; i += 1) {
        if (`${this.courses[i].subject} ${this.courses[i].number}` === courseCode) {
          this.courses[i].color = color;
          break;
        }
      }
    },
    updateBar(course) {
      this.$emit('updateBar', course);
    },
    dragListener(event) {
      if (!this.$data.scrollable) event.preventDefault();
    },
    buildCautions() {
      this.buildDuplicateCautions();
    },
    buildDuplicateCautions() {
      this.$emit('build-duplicate-cautions');
    },
    buildIncorrectPlacementCautions() {
      if (this.courses) {
        this.courses.forEach(course => {
          if (!course.semesters.includes(this.type)) course.alerts.caution = `Course unavailable in the ${this.type}`;
        });
      }
    },
    checkCourseDuplicate(key) {
      if (this.courses) {
        this.$refs.modal.courseIsAddable = true;
        this.courses.forEach(course => {
          if (`${course.subject} ${course.number}` === key) {
            this.$refs.modal.courseIsAddable = false;
            this.$parent.openCautionModal();
          }
        });
      }
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

      const modal = document.getElementById(`deleteSemesterModal-${this.id}`);
      modal.style.display = 'block';
    },
    deleteSemester(type, year) {
      this.$emit('delete-semester', type, year);
      this.openConfirmationModal(`Deleted ${type} ${year} from plan`);
    }
  },
  directives: {
    'click-outside': clickOutside
  }
};
</script>

<style scoped lang="scss">
@mixin hover-button {
  border-color: #15a6cf;
  background: rgba(0, 0, 0, 0.03);
  color: #15a6cf;
}

.semester {
  padding: 0.875rem 1.125rem;
  border: 2px solid #d8d8d8;
  border-radius: 11px;
  width: fit-content;
  position: relative;

  &--min {
    border: 2px dashed #d8d8d8;
    padding: 0;
    width: 23.75rem;
    height: 9.38rem;
    color: #d8d8d8;

    &:hover,
    &:active,
    &:focus {
      @include hover-button();
    }

    // specific dimensions for min compact semester
    &.semester--compact {
      width: 13rem;
      height: 3.5rem;
    }
  }

  &--compact {
    padding: 0.875rem 1.125rem;
  }

  &-confirmation {
    display: none;
  }

  &-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  &-top {
    display: flex;
    justify-content: space-between;
    color: #858585;

    &--compact {
      flex-direction: column;
    }
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
    padding: 5px 0 8px 0;
    display: flex;
    position: relative;
    cursor: pointer;
  }

  &-dot {
    opacity: 0.8;
    height: 2px;
    width: 2px;
    background-color: white;
    border-radius: 50%;
    display: inline-block;
    margin-bottom: 2px;
    margin-top: 2px;

    &--menu {
      width: 5px;
      height: 5px;
      background-color: #c4c4c4;
      opacity: 1;
      margin: 0 2px;
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
    width: 21.375rem;
    height: 4.625rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #d8d8d8;
    color: #d8d8d8;

    &--compact {
      width: 10.5rem;
      height: 2rem;
    }

    &:hover,
    &:active,
    &:focus {
      @include hover-button();
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

  /* The Modal (background) */
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
  }

  .draggable-semester-courses {
    padding-top: 5px;
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

.semester-modal-delete {
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
}
}
</style>

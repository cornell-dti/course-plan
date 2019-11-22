<template>
  <div
    class="semester"
    v-bind:class="{ 'semester--min': !exists, 'semester--compact': compact}"
    v-bind:id="id"
  >
    <modal id="courseModal" class="semester-modal" type="course" />
    <modal id="semesterModal" class="semester-modal" type="semester" />
    <div v-if="exists" class="semester-content">
      <div class="semester-top" v-bind:class="{ 'semester-top--compact': compact }">
        <div class="semester-left" v-bind:class="{ 'semester-left--compact': compact }">
          <span class="semester-name">{{ name }}</span>
          <img class="semester-icon" src="../assets/images/pencil.svg" />
        </div>
        <div class="semester-right" v-bind:class="{ 'semester-right--compact': compact }">
          <span class="semester-credits">{{ creditString }}</span>
        </div>
      </div>
      <div class="semester-courses">
        <div class="draggable-semester-courses" v-dragula="courses" bag="first-bag">
          <div v-for="course in courses" v-bind:key="course.id" class="semester-courseWrapper">
            <course v-bind="course" v-bind:id="course.subject" class="semester-course" />
          </div>
        </div>
        <div
          class="semester-courseWrapper semester-addWrapper"
          v-bind:class="{ 'semester-addWrapper--compact': compact }"
          v-on:click="openCourseModal"
        >
          <span
            class="semester-buttonText"
            v-bind:class="{ 'semester-buttonText--compact': compact }"
          >{{ buttonString }}</span>
        </div>
      </div>
    </div>
    <div v-if="!exists" class="semester-empty" v-on:click="openSemesterModal">
      <div
        class="semester-semesterWrapper"
        v-bind:class="{ 'semester-semesterWrapper--compact': compact }"
      >
        <span
          class="semester-buttonText"
          v-bind:class="{ 'semester-buttonText--compact': compact }"
        >{{ semesterString }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Course from '@/components/Course';
import Modal from '@/components/Modals/Modal';

Vue.component('course', Course);
Vue.component('modal', Modal);

export default {
  // TODO: fonts! (Proxima Nova)
  props: {
    id: Number,
    name: String,
    courses: Array,
    exists: Boolean,
    compact: Boolean
  },
  mounted() {
    this.$el.addEventListener('click', this.closeAllModals);
    var _this = this;
    var _document = document;
    Vue.vueDragula.eventBus.$on('drop', function(args) {
      var target = args[2].parentNode.parentNode.parentNode.getAttribute('id');

      var vueTarget = _this.getVueInstancefromHTML(target, 'id');
      var source = args[3].parentNode.parentNode.parentNode.getAttribute('id');
      var vueSource = _this.getVueInstancefromHTML(source, 'id');

      var course = args[1].childNodes[0].getAttribute('class');
      var vueCourse = _this.getVueInstancefromHTML(course, 'class');
      const courseElem = {
        subject: vueCourse.subject,
        code: vueCourse.code,
        name: vueCourse.name,
        credits: vueCourse.credits,
        semesters: vueCourse.semesters,
        color: vueCourse.color,
        check: vueCourse.check,
        requirementsMap: vueCourse.requirementsMap
      };

      // console.log(courseElem);

      // console.log(vueSource.courses);
      // console.log(vueTarget.courses);

      // console.log(vueTarget.courses[0]);

      _this.updateCourseArrays(
        vueSource.courses,
        vueTarget.courses,
        courseElem
      );

      console.log('Source courses after update');
      console.log(vueSource.courses);

      console.log('Target courses after update');
      console.log(vueTarget.courses);
      // var vueTarget = _document.getElementsByClassName(args[2].parentElement.parentElement.parentElement)[0].__vue__;
      // console.log(vueTarget);
      // var element = args[1].childNodes[0];
      // var target = args[2];
      // var source = args[3];
    });
  },

  beforeDestroy: function() {
    this.$el.removeEventListener('click', this.closeAllModals);
  },

  computed: {
    // TODO: calculate credits from all classes
    creditString() {
      let credits = 0;
      this.courses.forEach(course => {
        credits += course.credits;
      });
      return `${credits.toString()} cr.`;
    },
    buttonString() {
      return '+ COURSE';
    },
    semesterString() {
      return '+ SEMESTER';
    }
  },
  methods: {
    printArrayLength() {
      console.log(this.courses.length);
    },
    openCourseModal() {
      const modal = document.getElementById('courseModal');
      modal.style.display = 'block';
    },
    openSemesterModal() {
      const modal = document.getElementById('semesterModal');
      modal.style.display = 'block';
    },
    closeAllModals(event) {
      const modals = document.getElementsByClassName('semester-modal');
      for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
          modals[i].style.display = 'none';
        }
      }
    },
    getVueInstancefromHTML: function(name, attribute) {
      if (attribute == 'class') {
        return document.getElementsByClassName(name)[0].__vue__;
      }
      //attribute == "id"
      return document.getElementById(name).__vue__;
    },
    removeCourse: function(sourceCourses, course) {
      for (let i = 0; i < sourceCourses.length; i++) {
        if (
          course.code == sourceCourses[i].code &&
          course.subject == sourceCourses[i].subject
        ) {
          sourceCourses.splice(i, 1);
          i--;
        }
      }
    },
    updateCourseArrays: function(sourceCourses, targetCourses, course) {
      //remove Course from source course array
      this.removeCourse(sourceCourses, course);
      //push course onto target course array
      targetCourses.push(course);
    }
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
      width: 12.5rem;
      height: 3.5rem;
    }
  }

  &--compact {
    padding: 0.875rem 1.125rem;
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

    &--compact {
      justify-content: space-between;
    }
  }

  &-right {
    &--compact {
      margin-top: 0.25rem;
    }
  }

  &-name {
    font-size: 18px;
    line-height: 22px;
    margin-right: 0.5rem;
    font-weight: bold;
  }

  &-icon {
    width: 14px;
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
    width: 21.25rem;
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
}
</style>

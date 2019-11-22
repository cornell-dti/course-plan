<template>
  <div class="semester" v-bind:class="{ 'semester--min': !exists, 'semester--compact': compact}" v-bind:id="id">
    <!-- TODO: Remove semesterModal from semester and move to semesterview -->
    <modal :id="'courseModal-'+id" class="semester-modal" type="course" :semesterID="id"/>
    <modal id="semesterModal" class="semester-modal" type="semester" />
    <div v-if="exists" class="semester-content">
      <div class="semester-top" v-bind:class="{ 'semester-top--compact': compact }">
        <div class="semester-left" v-bind:class="{ 'semester-left--compact': compact }">
          <span class="semester-name">{{ name }}</span>
          <img class="semester-icon" src="../assets/images/pencil.svg"/>
        </div>
        <div class="semester-right" v-bind:class="{ 'semester-right--compact': compact }">
          <span class="semester-credits">{{ creditString  }}</span>
        </div>
      </div>
      <div class="semester-courses">
        <div class="draggable-semester-courses" v-dragula="courses" bag="first-bag">
          <div v-for="course in courses" :key="course.id" class="semester-courseWrapper">
            <course v-bind="course" v-bind:id="course.subject" v-bind:compact="compact" class="semester-course"/>
          </div>
        </div>
          <div class="semester-courseWrapper semester-addWrapper" v-bind:class="{ 'semester-addWrapper--compact': compact }" v-on:click="openCourseModal">
            <span class="semester-buttonText" v-bind:class="{ 'semester-buttonText--compact': compact }">{{ buttonString }}</span>
          </div>
      </div>
    </div>
    <div v-if="!exists" class="semester-empty" v-on:click="openSemesterModal">
      <div class="semester-semesterWrapper" v-bind:class="{ 'semester-semesterWrapper--compact': compact }">
        <span class="semester-buttonText" v-bind:class="{ 'semester-buttonText--compact': compact }">{{ semesterString }}</span>
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
  data: function() {
    const courseMap = new Map();
    courseMap.set('KCM', ['CS 1110', 'CS 1112']);
    courseMap.set('CA', ['CS 2110']);
    let randomId = Math.floor(Math.random() * Math.floor(100));
    return {
      courses: [{
        id: randomId,
        subject: 'PHIL',
        code: 1100,
        name: 'Introduction to Philosophy',
        credits: 3,
        semesters: ['Fall', 'Spring'],
        color: '2BBCC6',
        check: true,
        requirementsMap: courseMap
      }]
    };
  },
  props: {
    id: Number,
    name: String,
    // courses: Array,
    exists: Boolean,
    compact: Boolean
  },
  mounted() {
    this.$el.addEventListener('click', this.closeAllModals);
    var _this = this;
    var _document = document;
  },

  beforeDestroy: function () {
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
      const modal = document.getElementById('courseModal-'+this.id);
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
    addCourse(data) {
      const courseMap = new Map();
      courseMap.set('KCM', ['CS 1110', 'CS 1112']);
      courseMap.set('CA', ['CS 2110']);

      let arr = data.code.split(" ");
      const subject = arr[0];
      const code = parseInt(arr[1]);
      
      // remove periods and split on ', '
      let semesters = data.catalogWhenOffered.replace(/\./g,'')
      semesters = semesters.split(", ")

      // TODO: update parsing for the below fields
      // Credits: Which enroll group, and min or max credits?
      // Color: How is this determined?
      // Need courseMap to be generated
      const newCourse = {
        subject: subject,
        code: code,
        name: data.titleLong,
        credits: data.enrollGroups[0].unitsMaximum,
        semesters: semesters,
        color: '2BBCC6',
        check: true,
        requirementsMap: null
      };

      this.courses.push(newCourse);
    }
  }
};
</script>


<style scoped lang="scss">
@mixin hover-button {
  border-color: #15A6CF;
  background: rgba(0, 0, 0, 0.03);
  color: #15A6CF;
}

.semester
{
  padding: .875rem 1.125rem;
  border: 2px solid #D8D8D8;
  border-radius: 11px;
  width: fit-content;

  &--min {
    border: 2px dashed #D8D8D8;
    padding: 0;
    width: 23.75rem;
    height: 9.38rem;
    color:#D8D8D8;

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
    padding: .875rem 1.125rem;

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
      margin-top: .25rem;
    }
  }

  &-name {
    font-size: 18px;
    line-height: 22px;
    margin-right: .5rem;
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
    margin: .5rem 0 .5rem 0;
  }

  &-course {
    touch-action: none;
    cursor:grab;
  }

  &-course:active:hover {
    touch-action: none;
    cursor:grabbing;
  }

  &-addWrapper {
    width: 21.25rem;
    height: 4.625rem;
    border-radius: .5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #D8D8D8;
    color: #D8D8D8;

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
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }

  .draggable-semester-courses{
    padding-top: 5px;
  }


  //Styling for drag and drop components and movement
    .gu-mirror {
    position: fixed !important;
    margin: 0 !important;
    z-index: 9999 !important;
    opacity: 0.8;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";
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
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
    filter: alpha(opacity=20);
  }
}

</style>

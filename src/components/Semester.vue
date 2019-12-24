<template>
  <div
    class="semester"
    :class="{ 'semester--min': !isNotSemesterButton, 'semester--compact': compact }"
    :id="id"
  >
    <modal :id="'courseModal-' + id" class="semester-modal" type="course" :semesterID="id" />
    <confirmation
      :id="'confirmation-' + id"
      class="semester-confirmation"
      :text="confirmationText"
    />
    <div v-if="isNotSemesterButton" class="semester-content">
      <div class="semester-top" :class="{ 'semester-top--compact': compact }">
        <div class="semester-left" :class="{ 'semester-left--compact': compact }">
          <span class="semester-name">{{ type }} {{ year }}</span>
          <img class="semester-icon" src="../assets/images/pencil.svg" />
        </div>
        <div class="semester-right" :class="{ 'semester-right--compact': compact }">
          <span class="semester-credits">{{ creditString }}</span>
        </div>
      </div>
      <div class="semester-courses">
        <div class="draggable-semester-courses" v-dragula="courses" bag="first-bag">
          <div v-for="course in courses" :key="course.id" class="semester-courseWrapper" @click="click(course)">
            <course
              v-bind="course"
              :id="course.subject + course.code"
              :compact="compact"
              class="semester-course"
              @delete-course="deleteCourse"
              @color-course="colorCourse"
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
  </div>
</template>

<script>
import Vue from 'vue';
import Course from '@/components/Course';
import Modal from '@/components/Modals/Modal';
import Confirmation from '@/components/Confirmation';

Vue.component('course', Course);
Vue.component('modal', Modal);
Vue.component('confirmation', Confirmation);

const firebaseConfig = require('@/firebaseConfig.js');

const { auth, userDataCollection } = firebaseConfig;

export default {
  // TODO: fonts! (Proxima Nova)
  data() {
    return {
      confirmationText: ''
    };
  },
  props: {
    id: Number,
    type: String,
    year: Number,
    courses: Array,
    isNotSemesterButton: Boolean,
    compact: Boolean
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
    createSemesterString(semesters) {
      let semesterString = '';
      semesters.forEach(semester => {
        semesterString += `${semester}, `;
      });
      if (semesterString.length > 0) {
        return semesterString.substring(0, semesterString.length - 2);
      }
      return semesterString;
    },
    openCourseModal() {
      const modal = document.getElementById(`courseModal-${this.id}`);
      modal.style.display = 'block';
    },
    openSemesterModal() {
      this.$parent.openSemesterModal();
    },
    addCourse(data) {
      const newCourse = this.$parent.$parent.createCourse(data);
      this.courses.push(newCourse);
      this.addCourseToFirebase(newCourse);

      // Set text and display confirmation modal, then have it disappear after 3 seconds

      this.confirmationText = `Added ${data.code} to "${this.type} ${this.year}"`;
      const confirmationModal = document.getElementById(`confirmation-${this.id}`);
      confirmationModal.style.display = 'flex';

      setTimeout(() => {
        confirmationModal.style.display = 'none';
      }, 5000);
    },
    addCourseToFirebase(course) {
      const firebaseCourse = {
        catalogWhenOffered: `${this.createSemesterString(course.semesters)}.`,
        code: `${course.subject} ${course.code}`,
        color: course.color,
        credits: course.credits,
        name: course.name
      };

      const user = auth.currentUser;
      const userEmail = user.email;
      const docRef = userDataCollection.doc(userEmail);

      // TODO: error handling if user not found or some firebase error
      // TODO: create a user if no document found
      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const { semesters } = doc.data();
            semesters.forEach(sem => {
              if (sem.type === this.type && sem.year === this.year) {
                sem.courses.push(firebaseCourse);
              }
            });
            docRef.update({
              semesters
            });
          } else {
            // doc.data() will be undefined in this case
            // console.log('No such document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    },
    deleteCourse(courseAbbr) {
      for (let i = 0; i < this.courses.length; i += 1) {
        if (this.courses[i].subject + this.courses[i].code === courseAbbr) {
          this.courses.splice(i, 1);
          break;
        }
      }
      this.deleteFirebaseCourse();
    },
    colorCourse(color, courseAbbr) {
      for (let i = 0; i < this.courses.length; i += 1) {
        if (this.courses[i].subject + this.courses[i].code === courseAbbr) {
          this.courses[i].color = color;
          break;
        }
      }
      this.updateFirebaseColor(color, courseAbbr);
    },
    deleteFirebaseCourse() {
      // TODO: make user / docRef global, and start reusing update code
      const user = auth.currentUser;
      const userEmail = user.email;
      const docRef = userDataCollection.doc(userEmail);

      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const { semesters } = doc.data();
            semesters.forEach(sem => {
              if (sem.type === this.type && sem.year === this.year) {
                sem.courses = this.courses;
              }
            });
            docRef.update({
              semesters
            });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    },
    updateFirebaseColor(color, courseAbbr) {
      // TODO: make user / docRef global, and start reusing update code
      const user = auth.currentUser;
      const userEmail = user.email;
      const docRef = userDataCollection.doc(userEmail);

      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const { semesters } = doc.data();
            semesters.forEach(sem => {
              if (sem.type === this.type && sem.year === this.year) {
                sem.courses.forEach(course => {
                  if (course.code.replace(/ /g, '') === courseAbbr) {
                    course.color = color;
                  }
                });
              }
            });
            docRef.update({
              semesters
            });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    },

    click(course) {
      // this.$emit('update', {subject: course.subject, number: course.code, roster: 'FA19', color: course.color});
      this.$parent.$parent.updateBar({
        subject: course.subject, number: course.code, roster: 'FA19', color: course.color
      });
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

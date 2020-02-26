<template>
  <div class="semesterView" :class="{ bottomBar: isBottomBar }" @click="closeBar" :key="key">
    <modal id="semesterModal" class="semester-modal" type="semester" ref="modalComponent" />
    <div class="semesterView-switch">
      <span class="semesterView-switchText">View:</span>
      <div class="semesterView-switchImage semesterView-twoColumn" @click="setNotCompact" :class="{ 'semesterView-twoColumn--active': !compact }"></div>
      <div class="semesterView-switchImage semesterView-fourColumn" @click="setCompact" :class="{ 'semesterView-fourColumn--active': compact }"></div>
    </div>
    <confirmation
      :id="'semesterConfirmation'"
      class="semesterView-confirmation"
      :text="confirmationText"
    />
    <caution
      :id="'semesterCaution'"
      class="semesterView-caution"
      :text="cautionText"
    />
    <div v-if="!compact" class="semesterView-content">
      <div v-for="sem in semesters" :key="sem.id" class="semesterView-wrapper">
        <semester
          v-bind="sem"
          :isNotSemesterButton="true"
          :activatedCourse="activatedCourse"
          @updateBar="updateBar"
          @delete-semester="deleteSemester"
          @build-duplicate-cautions="buildDuplicateCautions"
        />
      </div>
      <div class="semesterView-wrapper" :class="{ 'semesterView-wrapper--compact': compact }">
        <semester :isNotSemesterButton="false" @updateBar="updateBar" :activatedCourse="activatedCourse"/>
      </div>
      <div class="semesterView-empty" aria-hidden="true"></div>
    </div>
    <!-- TODO: investigate if there needs to be two different content divs with two sets of semesters -->
    <div v-if="compact" class="semesterView-content">
      <div
        v-for="sem in semesters"
        :key="sem.id"
        class="semesterView-wrapper semesterView-wrapper--compact">
        <semester v-bind="sem" :isNotSemesterButton="true" :compact="compact" @updateBar="updateBar" :activatedCourse="activatedCourse" @delete-semester="deleteSemester" />
      </div>
      <div class="semesterView-wrapper" :class="{ 'semesterView-wrapper--compact': compact }">
        <semester :isNotSemesterButton="false" :compact="compact" @updateBar="updateBar" :activatedCourse="activatedCourse" />
      </div>
      <div class="semesterView-empty semesterView-empty--compact" aria-hidden="true"></div>
      <div class="semesterView-empty semesterView-empty--compact" aria-hidden="true"></div>
      <div class="semesterView-empty semesterView-empty--compact" aria-hidden="true"></div>
      <div><div></div></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Course from '@/components/Course';
import Semester from '@/components/Semester';
import Confirmation from '@/components/Confirmation';
import Caution from '@/components/Caution';
import DeleteSemester from '@/components/Modals/DeleteSemester';

const clone = require('clone');

Vue.component('course', Course);
Vue.component('semester', Semester);
Vue.component('confirmation', Confirmation);
Vue.component('caution', Caution);
Vue.component('deletesemester', DeleteSemester);

const firebaseConfig = require('@/firebaseConfig.js');

const { auth, userDataCollection } = firebaseConfig;

// enum to define seasons as integers in season order
const SeasonsEnum = Object.freeze({
  winter: 0,
  spring: 1,
  summer: 2,
  fall: 3
});

export default {
  props: {
    semesters: Array,
    compact: Boolean,
    isBottomBar: Boolean
  },
  data() {
    return {
      confirmationText: '',
      cautionText: '',
      key: 0,
      activatedCourse: {},
      isCourseClicked: false
    };
  },
  watch: {
    semesters: {
      deep: true,
      handler() {
        this.updateFirebaseSemester();
      }
    }
  },
  mounted() {
    this.$el.addEventListener('click', this.closeAllModals);
  },

  beforeDestroy() {
    this.$el.removeEventListener('click', this.closeAllModals);
  },
  methods: {
    setCompact() {
      if (!this.compact) {
        this.$emit('compact-updated', !this.compact);
      }
    },
    setNotCompact() {
      if (this.compact) {
        this.$emit('compact-updated', !this.compact);
      }
    },
    buildDuplicateCautions() {
      if (this.semesters) {
        const coursesMap = {};
        this.semesters.forEach(semester => {
          semester.courses.forEach(course => {
            if (coursesMap[`${course.subject} ${course.number}`]) course.alerts.caution = 'Duplicate';
            coursesMap[`${course.subject} ${course.number}`] = true;
          });
        });
      }
    },
    openSemesterConfirmationModal(type, year, isAdd) {
      if (isAdd) {
        this.confirmationText = `Added ${type} ${year} to plan`;
      } else {
        this.confirmationText = `Deleted ${type} ${year} from plan`;
      }

      const confirmationModal = document.getElementById(`semesterConfirmation`);
      confirmationModal.style.display = 'flex';

      setTimeout(() => {
        confirmationModal.style.display = 'none';
      }, 3000);
    },
    openCautionModal() {
      this.cautionText = `Unable to add course. Already in plan.`;
      const cautionModal = document.getElementById(`semesterCaution`);
      cautionModal.style.display = 'flex';

      setTimeout(() => {
        cautionModal.style.display = 'none';
      }, 3000);
    },
    openSemesterModal() {
      const modal = document.getElementById('semesterModal');
      modal.style.display = 'block';
    },
    closeAllModals(event) {
      const modals = document.getElementsByClassName('semester-modal');
      for (let i = 0; i < modals.length; i += 1) {
        if (event.target === modals[i]) {
          modals[i].style.display = 'none';
          this.$refs.modalComponent.$refs.modalBodyComponent.resetDropdowns();
        }
      }
      const deleteSemesterModal = document.getElementById('deleteSemester');
      if (event.target === deleteSemesterModal) {
        deleteSemesterModal.style.display = 'none';
      }
    },
    addSemester(type, year) {
      const newSem = this.$parent.createSemester([], type, year);

      // find the index in which the semester should be added to maintain chronological order
      let i;
      for (i = 0; i < this.semesters.length; i += 1) {
        const oldSem = this.semesters[i];
        if (oldSem.year > year) {
          break;
        } else if (oldSem.year === year && SeasonsEnum[oldSem.type.toLowerCase()] > SeasonsEnum[type.toLowerCase()]) {
          break;
        }
      }
      this.semesters.splice(i, 0, newSem);

      this.openSemesterConfirmationModal(type, year, true);
    },
    deleteSemester(type, year) {
      for (let i = 0; i < this.semesters.length; i += 1) {
        if (this.semesters[i].type === type && this.semesters[i].year === year) {
          this.semesters.splice(i, 1);
          break;
        }
      }
      this.openSemesterConfirmationModal(type, year, false);

      // Update requirements menu from dashboard
      this.$emit('updateRequirementsMenu');
    },

    updateBar(course) {
      this.activatedCourse = course;
      this.key += 1;
      this.$emit('update-bar', course);
      this.isCourseClicked = true;
    },

    closeBar() {
      if (!this.isCourseClicked) {
        this.$emit('close-bar');
      }
      this.isCourseClicked = false;
    },
    /**
     * Reduces course object to only information needed to be stored on Firebase
     * Works in conjunction with addCourse()
     * CHANGE WILL ALTER DATA STRUCTURE
     */
    toFirebaseCourse(course) {
      return {
        code: `${course.subject} ${course.number}`,
        name: course.name,
        description: course.description,
        credits: course.credits,
        semesters: course.semesters,
        prereqs: course.prereqs,
        enrollment: course.enrollment,
        lectureTimes: course.lectureTimes,
        instructors: course.instructors,
        distributions: course.distributions,
        lastRoster: course.lastRoster,
        color: course.color
      };
    },
    /**
     * Updates semester user data
     */
    updateFirebaseSemester() {
      // TODO: make user / docRef global
      const user = auth.currentUser;
      const userEmail = user.email;
      const docRef = userDataCollection.doc(userEmail);

      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const firebaseSemesters = clone(this.semesters);
            firebaseSemesters.forEach(sem => {
              sem.courses = sem.courses.map(course => this.toFirebaseCourse(course));
            });
            docRef.update({ semesters: firebaseSemesters });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    }
  }
};
</script>

<style scoped lang="scss">
.semesterView {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 1.5rem 3rem 3rem;

  &-content {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -0.75rem;
  }

  &-switch {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 1rem;
    color: #858585;
  }

  &-switchText {
    margin-right: 0.5rem;
    font-size: 16px;
    line-height: 19px;
  }

  &-switchImage {
    width: 2.25rem;
    height: 2.25rem;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center;

    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }

  &-twoColumn {
    background-image: url('~@/assets/images/views/twoColumn.svg');

    &:hover,
    &:focus,
    &:active,
    &--active {
      background-image: url('~@/assets/images/views/twoColumnSelected.svg');
    }
  }

  &-fourColumn {
    background-image: url('~@/assets/images/views/fourColumn.svg');

    &:hover,
    &:focus,
    &:active,
    &--active {
      background-image: url('~@/assets/images/views/fourColumnSelected.svg');
    }
  }

  &-wrapper {
    display: flex;
    justify-content: center;
    flex: 1 1 50%;

    margin-bottom: 1.5rem;
    padding: 0 0.75rem;

    &--compact {
      flex: 1 1 25%;
    }
  }

  &-confirmation, &-caution {
    display: none;
    margin: auto;
  }

  &-empty {
    flex: 1 1 50%;
    padding: 0 0.75rem;

    &--compact {
      flex: 1 1 25%;
      min-width: 14.5rem;
    }
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

.bottomBar {
  margin-bottom: 300px;
}
</style>

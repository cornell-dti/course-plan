<template>
  <div class="semesterView">
    <modal id="semesterModal" class="semester-modal" type="semester" />
    <div><button v-on:click="changeCompact">Change View</button></div>
    <confirmation
      :id="'semesterConfirmation'"
      class="semesterView-confirmation"
      :text="confirmationText"
    />
    <div v-if="!compact" class="semesterView-content">
      <div v-for="sem in semesters" v-bind:key="sem.id" class="semesterView-wrapper">
        <semester v-bind="sem" :isNotSemesterButton="true" />
      </div>
      <div class="semesterView-wrapper" v-bind:class="{ 'semesterView-wrapper--compact': compact }">
        <semester :isNotSemesterButton="false" />
      </div>
    </div>
    <div v-if="compact" class="semesterView-content">
      <div
        v-for="sem in compactSemesters"
        v-bind:key="sem.id"
        class="semesterView-wrapper semesterView-wrapper--compact"
      >
        <semester v-bind="sem" :isNotSemesterButton="true" />
      </div>
      <div class="semesterView-wrapper" v-bind:class="{ 'semesterView-wrapper--compact': compact }">
        <semester :isNotSemesterButton="false" :compact="compact" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Course from '@/components/Course';
import Semester from '@/components/Semester';
import Confirmation from '@/components/Confirmation';

const clone = require('clone');

Vue.component('course', Course);
Vue.component('semester', Semester);
Vue.component('confirmation', Confirmation);

const firebaseConfig = require('@/firebaseConfig.js');
const { auth, userDataCollection } = firebaseConfig;

export default {
  props: {
    semesters: Array,
    compact: Boolean
  },
  data() {
    return {
      confirmationText: ''
    };
  },
  computed: {
    // Duplicate the semesters array, but set the compact boolean to true
    compactSemesters() {
      const compactSem = [];
      this.semesters.forEach(sem => {
        const newSem = clone(sem);
        const newCourses = [];
        sem.courses.forEach(course => {
          const newCourse = clone(course);
          newCourse.compact = true;
          newCourse.requirementsMap = new Map(course.requirementsMap);
          newCourses.push(newCourse);
        });
        newSem.courses = newCourses;
        newSem.compact = true;
        compactSem.push(newSem);
      });
      return compactSem;
    }
  },
    mounted() {
    this.$el.addEventListener('click', this.closeAllModals);
  },

  beforeDestroy() {
    this.$el.removeEventListener('click', this.closeAllModals);
  },
  methods: {
    changeCompact() {
      this.$emit('compact-updated', !this.compact);
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
        }
      }
    },
    addSemester(type, year) {
      let newSem = this.$parent.createSemester([], type, year);
      this.semesters.push(newSem);
      this.addSemesterToFirebase(newSem);

      this.confirmationText = `Added "${type} ${year}" to plan`;
      const confirmationModal = document.getElementById(`semesterConfirmation`);
      confirmationModal.style.display = 'flex';

      setTimeout(() => {
        confirmationModal.style.display = 'none';
      }, 3000);
    },
    addSemesterToFirebase(sem) {
      const user = auth.currentUser;
      const userEmail = user.email;
      const docRef = userDataCollection.doc(userEmail);

      // TODO: error handling if user not found or some firebase error
      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const { semesters } = doc.data();
            semesters.push(sem);
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
    }
  }
};
</script>

<style scoped lang="scss">
.semesterView {
  display: flex;
  flex-direction: column;

  &-content {
    display: flex;
    flex-wrap: wrap;
  }

  &-wrapper {
    display: flex;
    justify-content: center;
    flex-basis: 50%;
    margin-bottom: 1.5rem;

    &--compact {
      flex-basis: 25%;
    }
  }

  &-confirmation {
    display: none;
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

</style>

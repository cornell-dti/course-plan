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
    <div v-if="!compact" class="semesterView-content">
      <div v-for="sem in semesters" v-bind:key="sem.id" class="semesterView-wrapper">
        <semester v-bind="sem" :isNotSemesterButton="true" @updateBar="updateBar" :activatedCourse="activatedCourse"/>
      </div>
      <div class="semesterView-wrapper" v-bind:class="{ 'semesterView-wrapper--compact': compact }">
        <semester :isNotSemesterButton="false" @updateBar="updateBar" :activatedCourse="activatedCourse"/>
      </div>
    </div>
    <div v-if="compact" class="semesterView-content">
      <div
        v-for="sem in compactSemesters"
        v-bind:key="sem.id"
        class="semesterView-wrapper semesterView-wrapper--compact">
        <semester v-bind="sem" :isNotSemesterButton="true" @updateBar="updateBar" :activatedCourse="activatedCourse"/>
      </div>
      <div class="semesterView-wrapper" v-bind:class="{ 'semesterView-wrapper--compact': compact }">
        <semester :isNotSemesterButton="false" :compact="compact" @updateBar="updateBar" :activatedCourse="activatedCourse"/>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
// import firebase from 'firebase';
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
    compact: Boolean,
    isBottomBar: Boolean
  },
  data() {
    return {
      confirmationText: '',
      key: 0,
      activatedCourse: {}
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
    },
    addSemester(type, year) {
      const newSem = this.$parent.createSemester([], type, year);
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
    },

    updateBar(course) {
      this.activatedCourse = course;
      this.key += 1;
      this.$emit('updateBar', course);
    },

    closeBar() {
      this.$emit('close-bar');
    }
  }
};
</script>

<style scoped lang="scss">
.semesterView {
  display: flex;
  flex-direction: column;
  margin: 1.5rem 3rem 3rem;
  max-width: 49rem;

  &-content {
    display: flex;
    flex-wrap: wrap;
  }

  &-switch {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 1rem;
    color: #858585;
  }

  &-switchText {
    margin-right: .5rem;
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
      margin-right: .5rem;
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
    margin-bottom: 1.5rem;

    &:nth-child(odd) {
      margin-right: 1.5rem;
    }

    &--compact {
      &:not(:nth-child(4n+1)) {
        margin-right: 1.5rem;
      }
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

.bottomBar {
  margin-bottom: 300px;
}

</style>

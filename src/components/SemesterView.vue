<template>
  <div
    class="semesterView"
    :class="{
      bottomBar: isBottomBar && isBottomBarExpanded,
      expandedBottomBarSemesterView: isBottomBarExpanded,
      collapsedBottomBarSemesterView: isBottomBar && !isBottomBarExpanded,
    }"
    @click="closeBar"
    :key="key"
  >
    <modal
      id="semesterModal"
      class="semester-modal"
      :class="{ 'modal--block': isSemesterModalOpen }"
      type="semester"
      ref="modalComponent"
      :currentSemesters="semesters"
      @add-semester="addSemester"
      @close-semester-modal="closeSemesterModal"
    />
    <div class="semesterView-settings" :class="{ 'semesterView-settings--two': noSemesters }">
      <button v-if="noSemesters" class="semesterView-addSemesterButton" @click="openSemesterModal">
        + New Semester
      </button>
      <div class="semesterView-switch">
        <span v-if="!isMobile" class="semesterView-switchText">View:</span>
        <div
          class="semesterView-switchImage semesterView-twoColumn"
          v-if="!isMobile"
          @click="setNotCompact"
          :class="{ 'semesterView-twoColumn--active': !compact }"
        ></div>
        <div
          class="semesterView-switchImage semesterView-fourColumn"
          v-if="!isMobile"
          @click="setCompact"
          :class="{ 'semesterView-fourColumn--active': compact }"
        ></div>
      </div>
    </div>
    <confirmation
      :id="'semesterConfirmation'"
      class="semesterView-confirmation"
      :class="{ 'modal--flex': isSemesterConfirmationOpen }"
      :text="confirmationText"
    />
    <caution
      :id="'semesterCaution'"
      class="semesterView-caution"
      :class="{ 'modal--flex': isCautionModalOpen }"
      :text="cautionText"
    />
    <div class="semesterView-content">
      <div
        v-for="sem in semesters"
        :key="sem.id"
        class="semesterView-wrapper"
        :class="{ 'semesterView-wrapper--compact': compact }"
      >
        <semester
          v-bind="sem"
          ref="semester"
          :compact="compact"
          :activatedCourse="activatedCourse"
          :semesters="semesters"
          :isFirstSem="checkIfFirstSem(sem.id)"
          @updateBar="updateBar"
          @new-semester="openSemesterModal"
          @delete-semester="deleteSemester"
          @edit-semester="editSemester"
          @build-duplicate-cautions="buildDuplicateCautions"
          @update-requirements-menu="updateRequirementsMenu"
          @open-caution-modal="openCautionModal"
          @add-course-to-semester="addCourseToSemester"
        />
      </div>
      <div v-if="!compact" class="semesterView-empty" aria-hidden="true"></div>
      <div
        v-if="compact"
        class="semesterView-empty semesterView-empty--compact"
        aria-hidden="true"
      ></div>
      <div
        v-if="compact"
        class="semesterView-empty semesterView-empty--compact"
        aria-hidden="true"
      ></div>
      <div
        v-if="compact"
        class="semesterView-empty semesterView-empty--compact"
        aria-hidden="true"
      ></div>
      <div v-if="compact"><div v-if="compact"></div></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
// @ts-ignore
import clone from 'clone';
import Course from '@/components/Course.vue';
import Semester from '@/components/Semester.vue';
import Confirmation from '@/components/Confirmation.vue';
import Caution from '@/components/Caution.vue';
import DeleteSemester from '@/components/Modals/DeleteSemester.vue';
import EditSemester from '@/components/Modals/EditSemester.vue';

import { auth, userDataCollection } from '@/firebaseConfig';
import {
  AppCourse,
  AppSemester,
  FirestoreSemester,
  FirestoreSemesterCourse,
  FirestoreSemesterType,
} from '@/user-data';

Vue.component('course', Course);
Vue.component('semester', Semester);
Vue.component('confirmation', Confirmation);
Vue.component('caution', Caution);
Vue.component('deletesemester', DeleteSemester);
Vue.component('editsemester', EditSemester);

// enum to define seasons as integers in season order
const SeasonsEnum = Object.freeze({
  winter: 0,
  spring: 1,
  summer: 2,
  fall: 3,
});

export default Vue.extend({
  props: {
    semesters: Array as PropType<AppSemester[]>,
    currSemID: Number,
    compact: Boolean,
    isBottomBar: Boolean,
    isBottomBarExpanded: Boolean,
    isMobile: Boolean,
    startTour: Boolean,
  },
  data() {
    return {
      confirmationText: '',
      cautionText: '',
      key: 0,
      activatedCourse: {},
      isCourseClicked: false,
      isSemesterConfirmationOpen: false,
      isSemesterModalOpen: false,
      isCautionModalOpen: false,
    };
  },
  watch: {
    semesters: {
      deep: true,
      handler() {
        this.updateFirebaseSemester();
      },
    },
  },
  computed: {
    noSemesters(): boolean {
      return this.semesters.length === 0;
    },
  },
  methods: {
    checkIfFirstSem(id: number) {
      return this.semesters[0].id === id;
    },
    setCompact() {
      if (!this.compact) {
        this.$emit('compact-updated', !this.compact);
        this.$gtag.event('to-compact', {
          event_category: 'views',
          event_label: 'compact',
          value: 1,
        });
      }
    },
    setNotCompact() {
      if (this.compact) {
        this.$emit('compact-updated', !this.compact);
        this.$gtag.event('to-not-compact', {
          event_category: 'views',
          event_label: 'not-compact',
          value: 1,
        });
      }
    },
    buildDuplicateCautions() {
      if (this.semesters) {
        const coursesMap: Record<string, boolean> = {};
        this.semesters.forEach(semester => {
          semester.courses.forEach(course => {
            if (coursesMap[`${course.subject} ${course.number}`])
              course.alerts.caution = 'Duplicate';
            coursesMap[`${course.subject} ${course.number}`] = true;
          });
        });
      }
    },
    openSemesterConfirmationModal(type: FirestoreSemesterType, year: number, isAdd: boolean) {
      if (isAdd) {
        this.confirmationText = `Added ${type} ${year} to plan`;
      } else {
        this.confirmationText = `Deleted ${type} ${year} from plan`;
      }

      this.isSemesterConfirmationOpen = true;

      setTimeout(() => {
        this.isSemesterConfirmationOpen = false;
      }, 3000);
    },
    openCautionModal() {
      this.cautionText = `Unable to add course. Already in plan.`;
      this.isCautionModalOpen = true;

      setTimeout(() => {
        this.isCautionModalOpen = false;
      }, 3000);
    },
    openSemesterModal() {
      this.isSemesterModalOpen = true;
    },
    closeSemesterModal() {
      this.isSemesterModalOpen = false;
    },
    createSemester(courses: readonly AppCourse[], type: FirestoreSemesterType, year: number) {
      const semester = {
        courses,
        id: this.currSemID,
        type,
        year,
      };
      this.$emit('increment-semID');
      return semester;
    },
    addSemester(type: FirestoreSemesterType, year: number) {
      const newSem = this.createSemester([], type, year);

      // find the index in which the semester should be added to maintain chronological order
      let semesterIndex;
      for (semesterIndex = 0; semesterIndex < this.semesters.length; semesterIndex += 1) {
        const oldSem = this.semesters[semesterIndex];
        if (oldSem.year < year) {
          break;
        } else if (
          oldSem.year === year &&
          // @ts-ignore
          SeasonsEnum[oldSem.type.toLowerCase()] < SeasonsEnum[type.toLowerCase()]
        ) {
          break;
        }
      }
      this.semesters.splice(semesterIndex, 0, newSem);

      this.$gtag.event('add-semester', {
        event_category: 'semester',
        event_label: 'add',
        value: 1,
      });

      this.openSemesterConfirmationModal(type, year, true);

      return semesterIndex;
    },
    deleteSemester(type: FirestoreSemesterType, year: number) {
      for (let i = 0; i < this.semesters.length; i += 1) {
        if (this.semesters[i].type === type && this.semesters[i].year === year) {
          this.semesters.splice(i, 1);
          break;
        }
      }
      this.$gtag.event('delete-semester', {
        event_category: 'semester',
        event_label: 'delete',
        value: 1,
      });

      // Confirm success with alert
      this.openSemesterConfirmationModal(type, year, false);

      // Update requirements menu from dashboard
      this.$emit('updateRequirementsMenu');
    },
    addCourseToSemester(season: FirestoreSemesterType, year: number, newCourse: any) {
      let semesterFound = false;
      this.semesters.forEach(sem => {
        if (sem.type === season && sem.year === year) {
          semesterFound = true;
          sem.courses = [...sem.courses, newCourse];
        }
      });

      if (!semesterFound) {
        const semesterIndex = this.addSemester(season, year);
        console.log(semesterIndex);
        this.semesters[semesterIndex].courses = [
          ...this.semesters[semesterIndex].courses,
          newCourse,
        ];
      }
    },
    updateRequirementsMenu() {
      this.$emit('updateRequirementsMenu');
    },
    compare(a: AppSemester, b: AppSemester): number {
      if (a.type === b.type && a.year === b.year) {
        return 0;
      }
      if (a.year > b.year) {
        return -1;
      }
      if (a.year < b.year) {
        return 1;
      }
      // @ts-ignore
      if (SeasonsEnum[a.type.toLowerCase()] < SeasonsEnum[b.type.toLowerCase()]) {
        return 1;
      }
      return -1;
    },
    editSemester(id: number, type: FirestoreSemesterType, year: number) {
      let count = 1;
      for (let i = 0; i < this.semesters.length; i += 1) {
        if (this.semesters[i].id === id) {
          const currSemester = this.semesters[i];
          currSemester.type = type;
          currSemester.year = year;
        }
      }
      this.semesters.sort(this.compare);
      this.semesters.forEach(sem => {
        sem.id = count;
        count += 1;
      });
    },
    updateBar(course: AppCourse, colorJustChanged: string, color: string) {
      this.activatedCourse = course;
      this.key += 1;
      this.$emit('updateBar', course, colorJustChanged, color);
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
    toFirebaseCourse(course: AppCourse) {
      return {
        crseId: course.crseId,
        code: `${course.subject} ${course.number}`,
        name: course.name,
        description: course.description,
        credits: course.credits,
        creditRange: course.creditRange,
        semesters: course.semesters,
        prereqs: course.prereqs,
        enrollment: course.enrollment,
        lectureTimes: course.lectureTimes,
        instructors: course.instructors,
        distributions: course.distributions,
        lastRoster: course.lastRoster,
        color: course.color,
        uniqueID: course.uniqueID,
      } as FirestoreSemesterCourse;
    },
    /**
     * Updates semester user data
     */
    updateFirebaseSemester() {
      // TODO: make user / docRef global
      const user = auth.currentUser!;
      const userEmail = user.email!;
      const docRef = userDataCollection.doc(userEmail);

      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const firebaseSemesters: FirestoreSemester[] = (clone(
              this.semesters
            ) as AppSemester[]).map(sem => ({
              ...sem,
              courses: sem.courses.map(course => this.toFirebaseCourse(course)),
            }));
            docRef.update({ semesters: firebaseSemesters });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.semesterView {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 1.5rem 3rem 3rem;
  position: relative;

  &-content {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -0.75rem;
  }

  &-addSemesterButton {
    background: $sangBlue;
    border-radius: 8px;
    min-height: 2.5rem;
    min-width: 9rem;
    color: $white;
    border: none;
  }

  &-settings {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    min-height: 2.25rem;

    &--two {
      justify-content: space-between;
    }
  }

  &-switch {
    display: flex;
    color: $medGray;
    align-items: center;
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
      cursor: pointer;
      background-image: url('~@/assets/images/views/twoColumnSelected.svg');
    }
  }

  &-fourColumn {
    background-image: url('~@/assets/images/views/fourColumn.svg');

    &:hover,
    &:focus,
    &:active,
    &--active {
      cursor: pointer;
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

  &-confirmation,
  &-caution {
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
  margin-bottom: 350px;
}

.modal {
  &--block {
    display: block;
  }
  &--flex {
    display: flex;
  }
}

@media only screen and (max-width: 878px) {
  .semesterView {
    margin-top: 5.5rem;
    margin-left: 2.5rem;
    margin-right: 1rem;
    &-switch {
      padding-right: 0.75rem;
    }
    &-content {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>

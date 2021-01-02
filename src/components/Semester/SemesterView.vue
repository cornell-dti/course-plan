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
    <semester-caution
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
          :duplicatedCourseCodeList="duplicatedCourseCodeList"
          :semesters="semesters"
          :isFirstSem="checkIfFirstSem(sem.id)"
          :reqs="reqs"
          @updateBar="updateBar"
          @new-semester="openSemesterModal"
          @delete-semester="deleteSemester"
          @edit-semester="editSemester"
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
import Semester from '@/components/Semester/Semester.vue';
import Confirmation from '@/components/Confirmation.vue';
import SemesterCaution from '@/components/Semester/SemesterCaution.vue';
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
import { SingleMenuRequirement } from '@/requirements/types';

Vue.component('course', Course);
Vue.component('semester', Semester);
Vue.component('confirmation', Confirmation);
Vue.component('semester-caution', SemesterCaution);
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
    semesters: Array as PropType<readonly AppSemester[]>,
    currSemID: Number,
    compact: Boolean,
    isBottomBar: Boolean,
    isBottomBarExpanded: Boolean,
    isMobile: Boolean,
    startTour: Boolean,
    reqs: Array as PropType<readonly SingleMenuRequirement[]>,
  },
  data() {
    return {
      confirmationText: '',
      cautionText: '',
      key: 0,
      activatedCourse: {},
      duplicatedCourseCodeList: [] as readonly string[],
      isCourseClicked: false,
      isSemesterConfirmationOpen: false,
      isSemesterModalOpen: false,
      isCautionModalOpen: false,
    };
  },
  watch: {
    semesters: {
      handler() {
        this.buildDuplicateCautions();
        this.updateFirebaseSemester();
      },
    },
  },
  computed: {
    noSemesters(): boolean {
      return this.semesters.length === 0;
    },
  },
  mounted() {
    this.buildDuplicateCautions();
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
      const allCourseSet = new Set<string>();
      const duplicatedCourseCodeList: string[] = [];
      if (this.semesters) {
        const coursesMap: Record<string, boolean> = {};
        this.semesters.forEach(semester => {
          semester.courses.forEach(course => {
            const code = `${course.subject} ${course.number}`;
            if (allCourseSet.has(code)) {
              duplicatedCourseCodeList.push(code);
            } else {
              allCourseSet.add(code);
            }
          });
        });
      }
      this.duplicatedCourseCodeList = duplicatedCourseCodeList;
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
      const newSemesters = [...this.semesters, newSem].sort(this.compare);

      this.$gtag.event('add-semester', {
        event_category: 'semester',
        event_label: 'add',
        value: 1,
      });

      this.openSemesterConfirmationModal(type, year, true);
      this.$emit('edit-semesters', newSemesters);
    },
    deleteSemester(type: FirestoreSemesterType, year: number) {
      const newSemesters = this.semesters.filter(
        semester => semester.type !== type || semester.year !== year
      );
      this.$gtag.event('delete-semester', {
        event_category: 'semester',
        event_label: 'delete',
        value: 1,
      });

      // Confirm success with alert
      this.openSemesterConfirmationModal(type, year, false);

      // Update requirements menu from dashboard
      this.$emit('edit-semesters', newSemesters);
    },
    addCourseToSemester(season: FirestoreSemesterType, year: number, newCourse: any) {
      let semesterFound = false;
      const newSemestersWithCourse = this.semesters.map(sem => {
        if (sem.type === season && sem.year === year) {
          semesterFound = true;
          return { ...sem, courses: [...sem.courses, newCourse] };
        }
        return sem;
      });

      if (semesterFound) {
        this.$emit('edit-semesters', newSemestersWithCourse);
      } else {
        const newSem = this.createSemester([], season, year);
        newSem.courses = [newCourse];
        const newSemesters = [...this.semesters, newSem].sort(this.compare);
        this.$emit('edit-semesters', newSemesters);
      }
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
    editSemester(id: number, updater: (oldSemester: AppSemester) => AppSemester) {
      let count = 1;
      const newSemesters = this.semesters
        .map((currentSemester, index, array) =>
          currentSemester.id === id ? updater(currentSemester) : currentSemester
        )
        .sort(this.compare);
      newSemesters.forEach(sem => {
        sem.id = count;
        count += 1;
      });
      this.$emit('edit-semesters', newSemesters);
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
    toFirebaseCourse(course: AppCourse): FirestoreSemesterCourse {
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
      };
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

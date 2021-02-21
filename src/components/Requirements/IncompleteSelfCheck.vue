<template>
  <div class="incompleteselfcheck">
    <new-course-modal
      class="incompleteselfcheck-modal"
      :class="{ 'incompleteselfcheck-modal--block': isCourseModalOpen }"
      :isCourseModelSelectingSemester="true"
      :isSelfCheck="true"
      @check-course-duplicate="checkCourseDuplicate"
      @close-course-modal="closeCourseModal"
      @add-course="addNewCourse"
      ref="modal"
    />
    <div class="dropdown-select-wrapper">
      <div class="dropdown-select dropdown-input" v-click-outside="closeMenuIfOpen">
        <div class="dropdown-placeholder dropdown-wrapper" @click="showDropdown = !showDropdown">
          <span>Select Course</span>
        </div>
        <div class="dropdown-placeholder dropdown-arrow"></div>
      </div>
      <div class="dropdown-content" v-if="showDropdown">
        <div
          v-for="optionName in Object.keys(selfCheckCourses)"
          :key="optionName"
          class="dropdown-content-item"
          @click="addExistingCourse(optionName)"
        >
          <span>{{ optionName }}</span>
        </div>
        <div class="dropdown-content-item" @click="openCourseModal()">
          <span>{{ '+ Add new course to schedule' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { clickOutside } from '@/utilities';
import store from '@/store';
import { editSemesters } from '@/global-firestore-data';
import { cornellCourseRosterCourseToFirebaseSemesterCourse } from '@/user-data-converter';

import NewCourseModal from '@/components/Modals/NewCourse/NewCourseModal.vue';

// enum to define seasons as integers in season order
const SeasonsEnum = Object.freeze({
  Winter: 0,
  Spring: 1,
  Summer: 2,
  Fall: 3,
});

type Data = {
  showDropdown: boolean;
  isCourseModalOpen: boolean;
};

export default Vue.extend({
  components: {
    NewCourseModal,
  },
  props: {},
  data(): Data {
    return {
      showDropdown: false,
      isCourseModalOpen: false,
    };
  },
  computed: {
    selfCheckCourses(): Record<string, FirestoreSemesterCourse> {
      // TODO - limit to courses that don't have requirements they are fulfilling
      const courses: Record<string, FirestoreSemesterCourse> = {};
      store.state.semesters.forEach(semester => {
        semester.courses.forEach(course => {
          courses[course.code] = course;
        });
      });
      return courses;
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  methods: {
    closeMenuIfOpen() {
      this.showDropdown = false;
    },
    addExistingCourse(option: string) {
      this.showDropdown = false;
      this.$emit('addCourse', this.selfCheckCourses[option]);
    },
    addNewCourse(course: CornellCourseRosterCourse, season: FirestoreSemesterType, year: number) {
      this.showDropdown = false;
      const newCourse = cornellCourseRosterCourseToFirebaseSemesterCourse(course);
      this.addCourseToSemester(season, year, newCourse);
      this.$emit('addCourse', newCourse);
    },
    openCourseModal() {
      this.isCourseModalOpen = true;
    },
    closeCourseModal() {
      this.isCourseModalOpen = false;
    },
    checkCourseDuplicate(key: string) {
      // if (this.courses) {
      //   // @ts-ignore
      //   this.$refs.modal.courseIsAddable = true;
      //   this.courses.forEach(course => {
      //     if (course.code === key) {
      //       // @ts-ignore
      //       this.$refs.modal.courseIsAddable = false;
      //       this.$emit('open-caution-modal');
      //     }
      //   });
      // }
    },

    addCourseToSemester(
      season: FirestoreSemesterType,
      year: number,
      newCourse: FirestoreSemesterCourse
    ) {
      editSemesters(oldSemesters => {
        let semesterFound = false;
        const newSemestersWithCourse = oldSemesters.map(sem => {
          if (sem.type === season && sem.year === year) {
            semesterFound = true;
            return { ...sem, courses: [...sem.courses, newCourse] };
          }
          return sem;
        });
        if (semesterFound) return newSemestersWithCourse;
        return [...oldSemesters, this.createSemester([newCourse], season, year)].sort(this.compare);
      });
    },
    createSemester(
      courses: readonly FirestoreSemesterCourse[],
      type: FirestoreSemesterType,
      year: number
    ) {
      return { courses, type, year };
    },
    compare(a: FirestoreSemester, b: FirestoreSemester): number {
      if (a.type === b.type && a.year === b.year) {
        return 0;
      }
      if (a.year > b.year) {
        return -1;
      }
      if (a.year < b.year) {
        return 1;
      }
      if (SeasonsEnum[a.type] < SeasonsEnum[b.type]) {
        return 1;
      }
      return -1;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.dropdown {
  &-select {
    display: flex;
    flex-direction: row;
    background: $white;
    border: 0.5px solid $inactiveGray;
    box-sizing: border-box;
    border-radius: 2px;
    width: 100%;
    font-size: 14px;
    line-height: 17px;
    color: $darkPlaceholderGray;
    position: relative;

    &:not(:first-child) {
      margin-top: 0.5rem;
    }
  }
  &-placeholder {
    height: 100%;
    font-size: 14px;
    line-height: 17px;
    margin-left: 0.25rem;
    display: flex;
    align-items: center;
    color: $darkPlaceholderGray;
    background: transparent;
    cursor: pointer;
  }
  &-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }
  &-arrow {
    border-left: 6.24px solid transparent;
    border-right: 6.24px solid transparent;
    border-top: 6.24px solid $inactiveGray;
    background: transparent;
    margin-right: 8.7px;
    margin-left: 5px;
    margin-top: 5px;
    margin-bottom: auto;
  }
  &-content {
    z-index: 2;
    background: $white;
    box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
    border-radius: 7px;
    margin-top: 3px;
    &-item {
      height: 2.25rem;
      font-size: 14px;
      line-height: 17px;
      display: flex;
      align-items: center;
      color: $lightPlaceholderGray;
      padding-left: 10px;
      cursor: pointer;

      &:first-child {
        border-radius: 7px 7px 0px 0px;
      }

      &:last-child {
        border-radius: 0px 0px 7px 7px;
      }
    }
  }
  &-content div:hover {
    background: rgba(50, 160, 242, 0.15);
    width: 100%;
  }
}

/* The Modal (background) */
.incompleteselfcheck-modal {
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
</style>

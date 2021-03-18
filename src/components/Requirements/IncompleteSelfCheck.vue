<template>
  <div class="incompleteselfcheck">
    <new-self-check-course-modal
      class="incompleteselfcheck-modal"
      :class="{ 'incompleteselfcheck-modal--block': isCourseModalOpen }"
      :subReqName="subReqName"
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
import { addCourseToSemester, addCourseToSelectableRequirements } from '@/global-firestore-data';
import { cornellCourseRosterCourseToFirebaseSemesterCourse } from '@/user-data-converter';

import NewSelfCheckCourseModal from '@/components/Modals/NewCourse/NewSelfCheckCourseModal.vue';

type Data = {
  showDropdown: boolean;
  isCourseModalOpen: boolean;
};

export default Vue.extend({
  components: {
    NewSelfCheckCourseModal,
  },
  props: {
    subReqId: { type: String, required: true },
    subReqName: { type: String, required: true },
  },
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
          const selectableRequirementCourses =
            store.state.derivedSelectableRequirementData.requirementToCoursesMap[this.subReqId];
          if (!(selectableRequirementCourses && selectableRequirementCourses.includes(course)))
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
      addCourseToSelectableRequirements(this.selfCheckCourses[option].uniqueID, this.subReqId);
    },
    addNewCourse(course: CornellCourseRosterCourse, season: FirestoreSemesterType, year: number) {
      this.showDropdown = false;
      const newCourse = cornellCourseRosterCourseToFirebaseSemesterCourse(course);
      addCourseToSemester(season, year, newCourse, this.subReqId, this.$gtag);
    },
    openCourseModal() {
      this.isCourseModalOpen = true;
    },
    closeCourseModal() {
      this.isCourseModalOpen = false;
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

    &-wrapper {
      position: relative;
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
    position: absolute;
    width: 100%;
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

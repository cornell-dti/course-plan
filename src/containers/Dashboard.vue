<template>
  <div class="dashboard">
    <onboarding
      class="dashboard-onboarding"
      v-if="isOnboarding"
      :isEditingProfile="isEditingProfile"
      :userName="userName"
      :onboardingData="onboardingData"
      @onboard="endOnboarding"
      @cancelOnboarding="cancelOnboarding"
    />
    <div class="dashboard-mainView">
      <div class="dashboard-menus">
        <nav-bar
          class="dashboard-nav"
          @editProfile="editProfile"
          @toggleRequirementsBar="toggleRequirementsBar"
          :isBottomPreview="bottomBar.isPreview"
        />
        <requirements
          class="dashboard-reqs"
          v-if="loaded && (!isTablet || (isOpeningRequirements && isTablet))"
          :startTour="startTour"
          @showTourEndWindow="showTourEnd"
          @deleteCourseFromSemesters="deleteCourseFromSemesters"
        />
      </div>
      <semester-view
        v-if="loaded && ((!isOpeningRequirements && isTablet) || !isTablet)"
        ref="semesterview"
        :compact="compactVal"
        :startTour="startTour"
        :isBottomBarExpanded="bottomBar.isExpanded"
        :isBottomBar="bottomCourses.length > 0"
        :isMobile="isMobile"
        @compact-updated="compactVal = $event"
        @updateBar="updateBar"
        @close-bar="closeBar"
      />
    </div>
    <tour-window
      :title="welcome"
      :text="welcomeBodytext"
      :exit="welcomeExit"
      :buttonText="welcomeButtonText"
      @hide="hideWelcomeTour()"
      @skip="welcomeHidden = false"
      v-if="welcomeHidden"
    >
    </tour-window>
    <tour-window
      :title="congrats"
      :text="congratsBodytext"
      :exit="congratsExit"
      :buttonText="congratsButtonText"
      @hide="showTourEndWindow = false"
      v-if="showTourEndWindow"
    >
    </tour-window>
    <div>
      <bottom-bar
        v-if="bottomCourses.length > 0 && ((!isOpeningRequirements && isTablet) || !isTablet)"
        :bottomCourses="bottomCourses"
        :seeMoreCourses="seeMoreCourses"
        :bottomCourseFocus="bottomBar.bottomCourseFocus"
        :isExpanded="bottomBar.isExpanded"
        :maxBottomBarTabs="maxBottomBarTabs"
        @close-bar="closeBar"
        @open-bar="openBar"
        @change-focus="changeBottomCourseFocus"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import introJs from 'intro.js';
import SemesterView from '@/components/Semester/SemesterView.vue';
import Requirements from '@/components/Requirements/Requirements.vue';
import BottomBar from '@/components/BottomBar/BottomBar.vue';
import NavBar from '@/components/NavBar.vue';
import Onboarding from '@/components/Modals/Onboarding/Onboarding.vue';
import TourWindow from '@/components/Modals/TourWindow.vue';

import surfing from '@/assets/images/surfing.svg';

import store, { initializeFirestoreListeners } from '@/store';
import { editSemesters } from '@/global-firestore-data';

const tour = introJs();
tour.setOption('exitOnEsc', 'false');
tour.setOption('doneLabel', 'Finish');
tour.setOption('skipLabel', 'Skip This Tutorial');
tour.setOption('nextLabel', 'Next');
tour.setOption('exitOnOverlayClick', 'false');

// eslint-disable-next-line @typescript-eslint/no-empty-function
let listenerUnsubscriber = (): void => {};

export default Vue.extend({
  components: { BottomBar, NavBar, Onboarding, Requirements, SemesterView, TourWindow },
  data() {
    return {
      loaded: true,
      compactVal: false,
      bottomCourses: [] as AppBottomBarCourse[],
      seeMoreCourses: [] as AppBottomBarCourse[],
      // Default bottombar info without info
      bottomBar: { isPreview: false, isExpanded: false, bottomCourseFocus: 0 },
      isOnboarding: false,
      isEditingProfile: false,
      isOpeningRequirements: false,
      isTablet: window.innerWidth <= 878,
      isMobile: window.innerWidth <= 440,
      maxBottomBarTabs: window.innerWidth <= 1347 ? 2 : 4,
      welcome: 'Welcome Cornellian!',
      welcomeBodytext: 'View your college requirements, plan your semesters and courses, and more.',
      welcomeExit: 'No, I want to skip this',
      welcomeButtonText: 'Start Tutorial',
      welcomeHidden: false,
      startTour: false,
      showTourEndWindow: false,
      congrats: 'Congratulations! That’s a wrap',
      congratsBodytext: `Other than this, there is more you can explore,
        so feel free to surf through CoursePlan <img src = "${surfing}"
        class = "emoji-text" alt = "surf">`,
      congratsExit: '',
      congratsButtonText: 'Start Planning',
    };
  },
  computed: {
    userName(): FirestoreUserName {
      return store.state.userName;
    },
    onboardingData(): AppOnboardingData {
      return store.state.onboardingData;
    },
    semesters(): readonly FirestoreSemester[] {
      return store.state.semesters;
    },
  },
  created() {
    window.addEventListener('resize', this.resizeEventHandler);
  },
  mounted() {
    listenerUnsubscriber = initializeFirestoreListeners(() => {
      if (this.onboardingData.college !== '') {
        this.loaded = true;
      } else {
        this.startOnboarding();
      }
    });
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEventHandler);
    listenerUnsubscriber();
  },
  methods: {
    resizeEventHandler() {
      this.isMobile = window.innerWidth <= 440;
      this.isTablet = window.innerWidth <= 878;
      this.maxBottomBarTabs = window.innerWidth <= 1347 ? 2 : 4;
      if (this.bottomBar.bottomCourseFocus >= this.maxBottomBarTabs) {
        this.changeBottomCourseFocus(this.maxBottomBarTabs - 1);
      }
      this.updateBarTabs();
      this.updateSemesterView();
    },
    toggleRequirementsBar() {
      this.isOpeningRequirements = !this.isOpeningRequirements;
    },
    updateSemesterView() {
      if (this.isMobile) {
        // Make sure semesterView is not compact by default on mobile
        this.compactVal = false;
      }
    },

    showTourEnd() {
      if (!this.isMobile) {
        this.showTourEndWindow = true;
      }
    },
    changeBottomCourseFocus(newBottomCourseFocus: number) {
      this.bottomBar.bottomCourseFocus = newBottomCourseFocus;
    },

    updateBar(course: FirestoreSemesterCourse, colorJustChanged: string, color: string) {
      const [subject, number] = course.code.split(' ');
      // Update Bar Information
      const courseToAdd: AppBottomBarCourse = {
        subject,
        number,
        name: course.name,
        credits: course.credits,
        semesters: this.joinOrNAString(course.semesters),
        color: course.color,
        latestSem: course.lastRoster,
        // Array data
        instructors: this.joinOrNAString(course.instructors),
        distributionCategories: this.cleanCourseDistributionsArray(course.distributions),
        enrollmentInfo: this.joinOrNAString(course.enrollment),
        latestLecInfo: this.naIfEmptyStringArray(course.lectureTimes),
        overallRating: 0,
        difficulty: 0,
        workload: 0,
        prerequisites: this.noneIfEmpty(course.prereqs),
        description: course.description,
        uniqueID: course.uniqueID,
      };

      // expand bottombar if first course added
      if (this.bottomCourses.length === 0) {
        this.bottomBar.bottomCourseFocus = 0;
        this.openBar();
      }

      let bottomCourseIndex = -1;
      // if course already exists in bottomCourses, first remove course
      for (let i = 0; i < this.bottomCourses.length; i += 1) {
        // if colorJustChanged and course already exists, just update course color
        if (this.bottomCourses[i].uniqueID === course.uniqueID) {
          if (colorJustChanged) {
            this.bottomCourses[i].color = color;
          } else {
            bottomCourseIndex = i;
          }
        }
      }

      if (bottomCourseIndex < 0) {
        // Prepending bottomCourse to front of bottom courses array if bottomCourses < this.maxBottomBarTabs
        // Do not add course to bottomCourses if color was only changed
        if (this.bottomCourses.length < this.maxBottomBarTabs && !colorJustChanged) {
          this.bottomCourses.unshift(courseToAdd);
        } else {
          // else check no dupe in seeMoreCourses and add to seeMoreCourses
          for (let i = 0; i < this.seeMoreCourses.length; i += 1) {
            // if colorJustChanged and course already exists in seeMoreCourses, just update course color
            if (this.seeMoreCourses[i].uniqueID === course.uniqueID && colorJustChanged) {
              this.seeMoreCourses[i].color = color;
            } else if (this.seeMoreCourses[i].uniqueID === course.uniqueID && !colorJustChanged) {
              this.seeMoreCourses.splice(i, 1);
            }
          }
          // Do not move courses around from bottomCourses to seeMoreCourses if only color changed
          if (!colorJustChanged) {
            this.bottomCourses.unshift(courseToAdd);
            this.seeMoreCourses.unshift(this.bottomCourses[this.bottomCourses.length - 1]);
            this.bottomCourses.splice(this.bottomCourses.length - 1, 1);
          }
        }
        bottomCourseIndex = 0;
      }
      if (!colorJustChanged) {
        this.bottomBar.bottomCourseFocus = bottomCourseIndex;
      }

      this.getReviews(subject, number, review => {
        this.bottomCourses[bottomCourseIndex].overallRating = review.classRating;
        this.bottomCourses[bottomCourseIndex].difficulty = review.classDifficulty;
        this.bottomCourses[bottomCourseIndex].workload = review.classWorkload;
      });
    },

    getReviews(
      subject: string,
      number: string,
      callback: (review: {
        classRating: number;
        classDifficulty: number;
        classWorkload: number;
      }) => void
    ) {
      fetch(`https://www.cureviews.org/classInfo/${subject}/${number}/CY0LG2ukc2EOBRcoRbQy`).then(
        res => {
          res.json().then(reviews => {
            callback(reviews[0]);
          });
        }
      );
    },

    updateBarTabs() {
      // Move courses from see more to bottom tab to fulfill increased bottom tab capacity
      if (
        this.maxBottomBarTabs === 4 &&
        this.bottomCourses.length < 4 &&
        this.seeMoreCourses.length > 0
      ) {
        while (this.bottomCourses.length < 4) {
          // if any See More courses exist, move first See More Course to end of tab
          if (this.seeMoreCourses.length > 0) {
            const seeMoreCourseToMove = this.seeMoreCourses[0];
            // remove course from See More Courses
            this.seeMoreCourses.splice(0, 1);

            // add course to end of bottomCourses
            this.bottomCourses.push(seeMoreCourseToMove);
          }
        }
      } else if (this.maxBottomBarTabs === 2 && this.bottomCourses.length > 2) {
        // Move courses from bottom tab to see more for decreased max of 2
        while (this.bottomCourses.length > 2) {
          const bottomCourseToMove = this.bottomCourses.pop()!;
          this.seeMoreCourses.unshift(bottomCourseToMove);
        }
      }
    },

    openBar() {
      this.bottomBar.isExpanded = true;
    },

    closeBar() {
      this.bottomBar.isExpanded = false;
    },

    startOnboarding() {
      this.isOnboarding = true;
    },

    endOnboarding() {
      if (!this.isMobile) {
        this.welcomeHidden = true;
      }
      this.loaded = true;
      this.cancelOnboarding();
    },

    cancelOnboarding() {
      this.isOnboarding = false;
    },

    hideWelcomeTour() {
      this.welcomeHidden = false;
      if (!this.startTour) this.startTour = true;
    },

    editProfile() {
      this.isOnboarding = true;
      this.isEditingProfile = true;
    },

    cleanCourseDistributionsArray(distributions: readonly string[]) {
      // Iterates over distributions array and cleans every entry
      // Removes stray parentheses, spaces, and commas
      let matches: string[] = [];
      if (distributions[0] === '') {
        matches = ['N/A'];
      } else {
        for (let i = 0; i < distributions.length; i += 1) {
          distributions[i].replace(/[A-Za-z0-9-]+/g, d => {
            matches.push(d);
            return d;
          });
        }
      }

      return matches;
    },

    joinOrNAString(arr: readonly unknown[]) {
      return arr.length !== 0 && arr[0] !== '' ? arr.join(', ') : 'N/A';
    },

    noneIfEmpty(str: string) {
      return str && str.length !== 0 ? str : 'None';
    },

    naIfEmptyStringArray(arr: readonly string[]) {
      return arr && arr.length !== 0 && arr[0] !== '' ? arr : ['N/A'];
    },

    deleteCourseFromSemesters(uniqueID: number) {
      editSemesters(oldSemesters =>
        oldSemesters.map(semester => {
          const coursesWithoutDeleted = semester.courses.filter(
            course => course.uniqueID !== uniqueID
          );
          return { ...semester, courses: coursesWithoutDeleted };
        })
      );
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.dashboard {
  display: flex;
  flex-direction: column;

  &-mainView {
    display: flex;
    background-color: $backgroundBlue;
  }

  &-menus {
    display: flex;
  }

  &-reqs {
    margin-left: 4.5rem;
  }

  /* The Modal (background) */
  &-onboarding {
    position: fixed; /* Stay in place */
    z-index: 2; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }
  .emoji-text {
    height: 14px;
  }
}

.semester {
  margin: 1rem;
  padding: 1rem;
  height: 12.12rem;
}

@media only screen and (max-width: 878px) {
  .dashboard {
    &-nav {
      width: 100%;
      flex-direction: row;
      height: 4.5rem;
      padding-top: 0rem;
      padding-bottom: 0rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      position: fixed;
      z-index: 1;
    }
  }
}
</style>

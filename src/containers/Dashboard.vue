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
          :isOpeningRequirements="isOpeningRequirements"
          @editProfile="editProfile"
          @toggleRequirementsBar="toggleRequirementsBar"
        />
        <requirements
          class="dashboard-reqs"
          v-if="loaded && (!isTablet || (isOpeningRequirements && isTablet))"
          :startTour="startTour"
          @showTourEndWindow="showTourEnd"
        />
      </div>
      <semester-view
        v-if="loaded && ((!isOpeningRequirements && isTablet) || !isTablet)"
        ref="semesterview"
        :compact="compactVal"
        :startTour="startTour"
        :isBottomBarExpanded="bottomBarIsExpanded"
        :isBottomBar="hasBottomCourses"
        :isMobile="isMobile"
        @compact-updated="compactVal = $event"
      />
    </div>
    <tour-window
      title="Welcome Cornellian!"
      text="View your college requirements, plan your semesters and courses, and more."
      exit="No, I want to skip this"
      button-text="Start Tutorial"
      @hide="hideWelcomeTour()"
      @skip="welcomeHidden = false"
      v-if="welcomeHidden"
    />
    <tour-window
      title="Congratulations! That’s a wrap"
      text="Other than this, there is more you can explore, so feel free to surf through CoursePlan"
      exit=""
      button-text="Start Planning"
      :image="congratsBodyImage"
      alt="surf"
      @hide="showTourEndWindow = false"
      v-if="showTourEndWindow"
    />
    <bottom-bar
      v-if="(!isOpeningRequirements && isTablet) || !isTablet"
      :isExpanded="bottomBarIsExpanded"
      :maxBottomBarTabs="maxBottomBarTabs"
    />
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
import { immutableBottomBarState } from '@/components/BottomBar/BottomBarState';
import {
  smallBreakpoint,
  mediumBreakpoint,
  veryLargeBreakpoint,
} from '@/assets/scss/_variables.scss';

const smallBreakpointPixels = parseInt(
  smallBreakpoint.substring(0, smallBreakpoint.length - 2),
  10
);
const mediumBreakpointPixels = parseInt(
  mediumBreakpoint.substring(0, mediumBreakpoint.length - 2),
  10
);
const veryLargeBreakpointPixels = parseInt(
  veryLargeBreakpoint.substring(0, veryLargeBreakpoint.length - 2),
  10
);

const getMaxButtonBarTabs = () => {
  if (window.innerWidth <= veryLargeBreakpointPixels) {
    return window.innerWidth <= smallBreakpointPixels ? 1 : 2;
  }
  return 4;
};

const tour = introJs();
tour.setOption('exitOnEsc', 'false');
tour.setOption('doneLabel', 'Finish');
tour.setOption('skipLabel', 'Skip This Tutorial');
tour.setOption('nextLabel', 'Next');
tour.setOption('exitOnOverlayClick', 'false');

// eslint-disable-next-line @typescript-eslint/no-empty-function
let listenerUnsubscriber = (): void => {};

export default Vue.extend({
  components: {
    BottomBar,
    NavBar,
    Onboarding,
    Requirements,
    SemesterView,
    TourWindow,
  },
  data() {
    return {
      loaded: true,
      compactVal: false,
      isOnboarding: false,
      isEditingProfile: false,
      isOpeningRequirements: false,
      isTablet: window.innerWidth <= mediumBreakpointPixels,
      isMobile: window.innerWidth <= smallBreakpointPixels,
      maxBottomBarTabs: getMaxButtonBarTabs(),
      welcomeHidden: false,
      startTour: false,
      showTourEndWindow: false,
    };
  },
  computed: {
    congratsBodyImage(): string {
      return surfing;
    },
    userName(): FirestoreUserName {
      return store.state.userName;
    },
    onboardingData(): AppOnboardingData {
      return store.state.onboardingData;
    },
    semesters(): readonly FirestoreSemester[] {
      return store.state.semesters;
    },
    hasBottomCourses(): boolean {
      return immutableBottomBarState.bottomCourses.length > 0;
    },
    bottomBarIsExpanded(): boolean {
      return immutableBottomBarState.isExpanded;
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
      this.isMobile = window.innerWidth <= smallBreakpointPixels;
      this.isTablet = window.innerWidth <= mediumBreakpointPixels;
      this.maxBottomBarTabs = getMaxButtonBarTabs();
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
    overflow-x: hidden;
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
    z-index: 3; /* Sit on top */
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

@media only screen and (max-width: $medium-breakpoint) {
  .dashboard {
    &-reqs {
      margin-left: 0;
    }
  }
}
</style>

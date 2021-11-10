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
        <requirement-side-bar
          class="dashboard-reqs"
          v-if="loaded"
          :isDesktop="!isTablet"
          :isOpeningRequirements="isOpeningRequirements"
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
        @compact-updated="compactUpdated"
      />
    </div>
    <tour-window
      title="Welcome to CoursePlan!"
      text="View your college requirements, plan your semesters and courses, and more."
      exit="No, I want to skip this"
      button-text="Start Tutorial"
      @startTour="startWelcomeTour"
      @closeTourWindow="closeWelcome"
      v-if="welcomeHidden"
    />
    <tour-window
      title="Let's get CoursePlanning!"
      text="There's more to explore as you start planning! CoursePlan is continously improving, so please use it as a guide and
      also consult your advisors for more up to date information!"
      :isFinalStep="true"
      exit=""
      button-text="Get Started"
      @closeTourWindow="closeTour"
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
import { defineComponent } from 'vue';

import introJs from 'intro.js';
import SemesterView from '@/components/Semester/SemesterView.vue';
import RequirementSideBar from '@/components/Requirements/RequirementSideBar.vue';
import BottomBar from '@/components/BottomBar/BottomBar.vue';
import NavBar from '@/components/NavBar.vue';
import Onboarding from '@/components/Modals/Onboarding/Onboarding.vue';
import TourWindow from '@/components/Modals/TourWindow.vue';

import store, { initializeFirestoreListeners } from '@/store';
import { immutableBottomBarState } from '@/components/BottomBar/BottomBarState';
import {
  smallBreakpoint,
  mediumBreakpoint,
  veryLargeBreakpoint,
} from '@/assets/constants/scss-variables';

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
tour.setOption('doneLabel', 'Next');
tour.setOption('nextLabel', 'Next');
tour.setOption('exitOnOverlayClick', 'false');

// eslint-disable-next-line @typescript-eslint/no-empty-function
let listenerUnsubscriber = (): void => {};

export default defineComponent({
  components: {
    BottomBar,
    NavBar,
    Onboarding,
    RequirementSideBar,
    SemesterView,
    TourWindow,
  },
  data() {
    const isTablet = window.innerWidth <= mediumBreakpointPixels;
    const isMobile = window.innerWidth <= smallBreakpointPixels;
    return {
      loaded: true,
      compactVal: false,
      showSideBar: true,
      isOnboarding: false,
      isEditingProfile: false,
      isTablet,
      isMobile,
      isOpeningRequirements: false,
      maxBottomBarTabs: getMaxButtonBarTabs(),
      welcomeHidden: false,
      startTour: false,
      showTourEndWindow: false,
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
      if (this.onboardingData.college !== '' || this.onboardingData.grad !== '') {
        this.loaded = true;
      } else {
        this.startOnboarding();
      }
    });
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeEventHandler);
    listenerUnsubscriber();
  },
  methods: {
    resizeEventHandler() {
      this.isMobile = window.innerWidth <= smallBreakpointPixels;
      this.isTablet = window.innerWidth <= mediumBreakpointPixels;
      this.maxBottomBarTabs = getMaxButtonBarTabs();
    },
    toggleRequirementsBar() {
      this.isOpeningRequirements = !this.isOpeningRequirements;
    },
    compactUpdated(compact: boolean) {
      this.compactVal = compact;
    },

    showTourEnd() {
      if (!this.isMobile) {
        this.showTourEndWindow = true;
      }
    },

    startOnboarding() {
      this.isOnboarding = true;
      store.commit('setIsTeleportModalOpen', true);
    },

    endOnboarding() {
      if (!this.isMobile && !this.isEditingProfile) {
        this.welcomeHidden = true;
      }
      this.loaded = true;
      this.cancelOnboarding();
    },

    cancelOnboarding() {
      this.isOnboarding = false;
      store.commit('setIsTeleportModalOpen', false);
    },

    startWelcomeTour() {
      if (!this.startTour) {
        this.startTour = true;
        this.welcomeHidden = false;
      }
    },

    editProfile() {
      this.isEditingProfile = true;
      this.startOnboarding();
    },

    closeWelcome() {
      this.welcomeHidden = false;
    },

    closeTour() {
      this.showTourEndWindow = false;
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
    min-height: 100vh;
  }

  &-menus {
    display: flex;
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

<template>
  <div class="dashboard">
    <onboarding
      class="dashboard-modal"
      v-if="isOnboarding"
      :isEditingProfile="isEditingProfile"
      :userName="userName"
      :onboardingData="onboardingData"
      @onboard="endOnboarding"
      @cancelOnboarding="cancelOnboarding"
    />
    <schedule-generate-modal
      v-if="isScheduleGenerateModalOpen"
      class="dashboard-modal"
      :year="year"
      :season="season"
      :courses="coursesForGeneration"
      :reqs="reqsForGeneration"
      :credit-limit="creditLimitForGeneration"
      @closeScheduleGenerateModal="closeScheduleGenerateModal"
    />
    <div class="dashboard-mainView">
      <div class="dashboard-menus">
        <nav-bar
          class="dashboard-nav"
          data-cyId="navbar"
          :isDisplayingRequirementsMobile="requirementsIsDisplayedMobile"
          :startScheduleGeneratorTour="startScheduleGeneratorTour"
          @openPlan="openPlan"
          @openTools="openTools"
          @openProfile="openProfile"
          @openScheduleGenerate="openScheduleGenerate"
          @toggleRequirementsMobile="toggleRequirementsMobile"
          @openCollection="openCollection"
        />
        <requirement-side-bar
          class="dashboard-reqs"
          data-cyId="reqsSidebar"
          v-if="loaded && !showToolsPage && !isProfileOpen && !isScheduleGenerateOpen"
          :isMobile="isTablet"
          :isDisplayingMobile="requirementsIsDisplayedMobile"
          :isMinimized="requirementsIsMinimized"
          @toggleMinimized="toggleMinimizeRequirements"
          :startTour="startTour"
          @showTourEndWindow="showTourEnd"
          :isDisplayingCollection="isShowCollectionOpen"
          :startMultiplePlansTour="startMultiplePlansTour"
        />
        <schedule-generate-side-bar
          v-if="loaded && !showToolsPage && !isProfileOpen && isScheduleGenerateOpen"
          :year="year"
          :season="season"
          @openScheduleGenerateModal="openScheduleGenerateModal"
        />
        <bottom-bar
          v-if="!(isTablet && requirementsIsDisplayedMobile) && !showToolsPage && !isProfileOpen"
          :isNavbarWide="requirementsIsMinimized"
          :isExpanded="bottomBarIsExpanded"
          :maxBottomBarTabs="maxBottomBarTabs"
        />
      </div>
      <semester-view
        v-if="
          loaded && !(isTablet && requirementsIsDisplayedMobile) && !showToolsPage && !isProfileOpen
        "
        ref="semesterview"
        :compact="compactVal"
        :startTour="startTour"
        :isBottomBarExpanded="bottomBarIsExpanded"
        :isBottomBar="hasBottomCourses"
        :isMobile="isMobile"
        @compact-updated="compactUpdated"
        @openFall2025Giveaway="userClickedFall2025GiveawayProgress = true"
      />
      <tools-container class="toolsPage" v-if="showToolsPage" />
      <profile-editor
        class="profilePage"
        :onboardingData="onboardingData"
        :userName="userName"
        v-if="isProfileOpen"
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
    <giveaway-modal
      title="Courseplan Giveaway!"
      right-button-text="Submit"
      rightButtonAlt="giveaway submit icon"
      @modal-closed="closeGiveawayModal"
      v-if="showGiveawayModal && isBeforeCutoff"
    >
    </giveaway-modal>
    <fall-giveaway-modal
      title="Fall 2025 Pre-Enroll Giveaway"
      right-button-text="Submit"
      rightButtonAlt="giveaway submit icon"
      @modal-closed="closeFall2025GiveawayModal"
      v-if="
        (showFall2025GiveawayModal || userClickedFall2025GiveawayProgress) &&
        isBeforeFall2025GiveawayCutoff
      "
    >
    </fall-giveaway-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import introJs from 'intro.js';
import rosters from '@/assets/courses/rosters.json';
import SemesterView from '@/components/Semester/SemesterView.vue';
import RequirementSideBar from '@/components/Requirements/RequirementSideBar.vue';
import BottomBar from '@/components/BottomBar/BottomBar.vue';
import NavBar from '@/components/NavBar.vue';
import ScheduleGenerateSideBar from '@/components/ScheduleGenerate/ScheduleGenerateSideBar.vue';
import ScheduleGenerateModal from '@/components/ScheduleGenerate/ScheduleGenerateModal.vue';
import Onboarding from '@/components/Modals/Onboarding/Onboarding.vue';
import TourWindow from '@/components/Modals/TourWindow.vue';
import ToolsContainer from '@/containers/Tools.vue';
import ProfileEditor from '@/containers/Profile.vue';
import featureFlagCheckers from '@/feature-flags';
import GiveawayModal from '@/components/Modals/GiveawayModal.vue';
import FallGiveawayModal from '@/components/Modals/FallGiveawayModal.vue';

import store, { initializeFirestoreListeners, updateFA25GiveawayField } from '@/store';
import { immutableBottomBarState } from '@/components/BottomBar/BottomBarState';
import {
  smallBreakpoint,
  mediumBreakpoint,
  veryLargeBreakpoint,
} from '@/assets/constants/scss-variables';
import { CourseForFrontend } from '@/schedule-generator/course-unit';
import Requirement from '@/schedule-generator/requirement';

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
    ScheduleGenerateSideBar,
    Onboarding,
    ScheduleGenerateModal,
    RequirementSideBar,
    SemesterView,
    TourWindow,
    ToolsContainer,
    ProfileEditor,
    GiveawayModal,
    FallGiveawayModal,
  },
  data() {
    return {
      loaded: true,
      compactVal: false,
      showSideBar: true,
      isOnboarding: false,
      isEditingProfile: false,
      isTablet: window.innerWidth <= mediumBreakpointPixels,
      isMobile: window.innerWidth <= smallBreakpointPixels,
      requirementsIsDisplayedMobile: false,
      requirementsIsMinimized: false,
      maxBottomBarTabs: getMaxButtonBarTabs(),
      welcomeHidden: false,
      startTour: false,
      startMultiplePlansTour: false,
      startScheduleGeneratorTour: false,
      showTourEndWindow: false,
      showToolsPage: false,
      isProfileOpen: false,
      isShowCollectionOpen: false,
      showGiveawayModal: false,
      showFall2025GiveawayModal: false,
      userClickedFall2025GiveawayProgress: false,
      isScheduleGenerateOpen: false,
      isScheduleGenerateModalOpen: false,
      coursesForGeneration: [] as CourseForFrontend[],
      reqsForGeneration: [] as Requirement[],
      creditLimitForGeneration: 12,
    };
  },
  computed: {
    season(): FirestoreSemesterSeason {
      // Get the last element in the rosters array
      const lastElement = rosters[rosters.length - 1];

      // Determine the season
      let determinedSeason = 'Unknown';
      if (lastElement.startsWith('FA')) {
        determinedSeason = 'Fall';
      } else if (lastElement.startsWith('SP')) {
        determinedSeason = 'Spring';
      } else if (lastElement.startsWith('SU')) {
        determinedSeason = 'Summer';
      } else if (lastElement.startsWith('WI')) {
        determinedSeason = 'Winter';
      }

      // Log the determined season
      // console.log(`Determined season: ${determinedSeason}`);

      return determinedSeason as FirestoreSemesterSeason;
    },
    year(): number {
      // Get the last element in the rosters array
      const lastElement = rosters[rosters.length - 1];

      // Extract the last two digits of the year (e.g., '24' for '2024')
      const yearSuffix = lastElement.slice(2);

      // Log the determined year for testing
      // console.log(`Determined year: ${yearSuffix}`);

      // Return the year suffix as a number
      return parseInt(yearSuffix, 10) + 2000;
    },
    userName(): FirestoreUserName {
      return store.state.userName;
    },
    onboardingData(): AppOnboardingData {
      return store.state.onboardingData;
    },
    semesters(): readonly FirestoreSemester[] {
      return store.getters.getCurrentPlanSemesters;
    },
    hasBottomCourses(): boolean {
      return immutableBottomBarState.bottomCourses.length > 0;
    },
    bottomBarIsExpanded(): boolean {
      return immutableBottomBarState.isExpanded;
    },
    isBeforeCutoff(): boolean {
      const currentDate = new Date();
      const cutoffDate = new Date('2024-10-30T23:59:00'); // October 30th, 2024, at 11:59 PM
      console.log(currentDate < cutoffDate);
      return currentDate < cutoffDate;
    },
    isBeforeFall2025GiveawayCutoff(): boolean {
      const currentDate = new Date();
      const cutoffDate = new Date('2025-04-20T23:59:00'); // April 20th, 2025, at 11:59 PM
      console.log('Current date is before cuttoff date', currentDate < cutoffDate);
      return currentDate < cutoffDate;
    },
  },
  created() {
    window.addEventListener('resize', this.resizeEventHandler);
  },
  mounted() {
    listenerUnsubscriber = initializeFirestoreListeners(() => {
      if (this.onboardingData.college !== '' || this.onboardingData.grad !== '') {
        this.loaded = true;
        if (!this.onboardingData.sawNewFeature) {
          this.startMultiplePlansTour = true;
        } else if (!this.onboardingData.sawScheduleGenerator) {
          this.startScheduleGeneratorTour = true;
        }
        if (!this.onboardingData.sawGiveaway) {
          // if user did not see the giveaway
          this.showGiveawayModal = true; // show the giveaway
        }
        if (!this.onboardingData.fa25giveaway.entered) {
          this.showFall2025GiveawayModal = true;
        }
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
    toggleRequirementsMobile() {
      this.requirementsIsDisplayedMobile = !this.requirementsIsDisplayedMobile;
    },
    toggleMinimizeRequirements() {
      this.requirementsIsMinimized = !this.requirementsIsMinimized;
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

    // for the sidebar, not the modal
    openCollection() {
      this.showToolsPage = false;
      this.isProfileOpen = false;
      this.isScheduleGenerateOpen = false;
      this.isShowCollectionOpen = true;
    },

    openPlan() {
      this.showToolsPage = false;
      this.isProfileOpen = false;
      this.isShowCollectionOpen = false;
      this.isScheduleGenerateOpen = false;
    },

    openTools() {
      this.showToolsPage = true;
      this.isProfileOpen = false;
    },

    openScheduleGenerate() {
      this.showToolsPage = false;
      this.isProfileOpen = false;
      this.isScheduleGenerateOpen = true;
      this.isShowCollectionOpen = false;
    },

    editProfile() {
      this.isEditingProfile = true;
      this.startOnboarding();
    },

    openProfile() {
      if (featureFlagCheckers.isProfileEnabled()) {
        this.isProfileOpen = true;
        this.showToolsPage = false;
      } else {
        this.editProfile();
      }
    },

    openScheduleGenerateModal(
      coursesWithReqIds: {
        req: Requirement;
        courses: CourseForFrontend[];
      }[],
      creditLimit: number
    ) {
      this.coursesForGeneration = coursesWithReqIds.flatMap(req => req.courses);
      this.reqsForGeneration = coursesWithReqIds.map(obj => obj.req); // Store requirement IDs
      this.creditLimitForGeneration = creditLimit;
      this.isScheduleGenerateModalOpen = true;
    },

    closeScheduleGenerateModal() {
      this.isScheduleGenerateModalOpen = false;
    },

    closeWelcome() {
      this.welcomeHidden = false;
    },

    closeTour() {
      this.showTourEndWindow = false;
    },

    closeGiveawayModal() {
      this.showGiveawayModal = false;
    },

    closeFall2025GiveawayModal() {
      this.showFall2025GiveawayModal = false;
      this.userClickedFall2025GiveawayProgress = false;
      updateFA25GiveawayField({ saw: true });
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
  &-modal {
    position: fixed; /* Stay in place */
    z-index: 4; /* Sit on top */
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

.toolsPage {
  width: 100%;
}

.profilePage {
  width: 100%;
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

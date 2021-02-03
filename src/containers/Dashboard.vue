<template>
  <div class="dashboard">
    <onboarding
      class="dashboard-onboarding"
      v-if="isOnboarding"
      :isEditingProfile="isEditingProfile"
      :userData="user"
      @onboard="endOnboarding"
      @cancelOnboarding="cancelOnboarding"
    />
    <div class="dashboard-mainView">
      <div class="dashboard-menus">
        <navbar
          class="dashboard-nav"
          @editProfile="editProfile"
          @toggleRequirementsBar="toggleRequirementsBar"
          :isBottomPreview="bottomBar.isPreview"
        />
        <requirements
          class="dashboard-reqs"
          v-if="loaded && (!isTablet || (isOpeningRequirements && isTablet))"
          :semesters="semesters"
          :toggleableRequirementChoices="toggleableRequirementChoices"
          :user="user"
          :key="requirementsKey"
          :startTour="startTour"
          :reqs="reqs"
          @showTourEndWindow="showTourEnd"
          @on-toggleable-requirement-choices-change="chooseToggleableRequirementOption"
          @deleteCourseFromSemesters="deleteCourseFromSemesters"
        />
      </div>
      <semesterview
        v-if="loaded && ((!isOpeningRequirements && isTablet) || !isTablet)"
        ref="semesterview"
        :semesters="semesters"
        :compact="compactVal"
        :startTour="startTour"
        :isBottomBarExpanded="bottomBar.isExpanded"
        :isBottomBar="bottomCourses.length > 0"
        :isMobile="isMobile"
        :reqs="reqs"
        @compact-updated="compactVal = $event"
        @edit-semesters="editSemesters"
        @updateBar="updateBar"
        @close-bar="closeBar"
      />
    </div>
    <tourwindow
      :title="welcome"
      :text="welcomeBodytext"
      :exit="welcomeExit"
      :buttonText="welcomeButtonText"
      @hide="
        welcomeHidden = false;
        if (startTour == false) startTour = true;
      "
      @skip="welcomeHidden = false"
      v-if="welcomeHidden"
    >
    </tourwindow>
    <tourwindow
      :title="congrats"
      :text="congratsBodytext"
      :exit="congratsExit"
      :buttonText="congratsButtonText"
      @hide="showTourEndWindow = false"
      v-if="showTourEndWindow"
    >
    </tourwindow>
    <div>
      <bottombar
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
import Course from '@/components/Course.vue';
import SemesterView from '@/components/Semester/SemesterView.vue';
import Requirements from '@/components/Requirements/Requirements.vue';
import BottomBar from '@/components/BottomBar/BottomBar.vue';
import NavBar from '@/components/NavBar.vue';
import Onboarding from '@/components/Modals/Onboarding/Onboarding.vue';
import TourWindow from '@/components/Modals/TourWindow.vue';

import surfing from '@/assets/images/surfing.svg';

import '@/vueDragulaConfig';
import {
  auth,
  db,
  usernameCollection,
  semestersCollection,
  toggleableRequirementChoicesCollection,
  subjectColorsCollection,
  uniqueIncrementerCollection,
  onboardingDataCollection,
} from '@/firebaseConfig';
import {
  FirestoreUserName,
  FirestoreOnboardingUserData,
  CornellCourseRosterCourse,
  AppUser,
  AppCourse,
  AppSemester,
  AppBottomBarCourse,
  cornellCourseRosterCourseToAppCourse,
  firestoreSemestersToAppSemesters,
  createAppUser,
  AppToggleableRequirementChoices,
} from '@/user-data';
import { computeRequirements } from '@/requirements/reqs-functions';
import { CourseTaken, SingleMenuRequirement } from '@/requirements/types';
import getCourseEquivalentsFromUserExams from '@/requirements/data/exams/ExamCredit';
import getCurrentSeason, { checkNotNull, getCurrentYear, getSubjectColor } from '@/utilities';

Vue.component('course', Course);
Vue.component('semesterview', SemesterView);
Vue.component('requirements', Requirements);
Vue.component('bottombar', BottomBar);
Vue.component('navbar', NavBar);
Vue.component('onboarding', Onboarding);
Vue.component('tourwindow', TourWindow);

const tour = introJs();
tour.setOption('exitOnEsc', 'false');
tour.setOption('doneLabel', 'Finish');
tour.setOption('skipLabel', 'Skip This Tutorial');
tour.setOption('nextLabel', 'Next');
tour.setOption('exitOnOverlayClick', 'false');

export default Vue.extend({
  data() {
    const names = checkNotNull(checkNotNull(auth.currentUser).displayName).split(' ');
    return {
      loaded: false,
      compactVal: false,
      semesters: [] as readonly AppSemester[],
      toggleableRequirementChoices: {} as AppToggleableRequirementChoices,
      user: {
        major: [],
        majorFN: [],
        college: '',
        collegeFN: '',
        firstName: names[0],
        lastName: names[1],
        middleName: '',
        minor: [],
        minorFN: [],
        exam: [],
        transferCourse: [],
        tookSwim: 'no',
      } as AppUser,
      bottomCourses: [] as AppBottomBarCourse[],
      seeMoreCourses: [] as AppBottomBarCourse[],
      subjectColors: {} as { [subject: string]: string },
      uniqueIncrementer: 0,
      // Default bottombar info without info
      bottomBar: { isPreview: false, isExpanded: false, bottomCourseFocus: 0 },
      requirementsKey: 0,
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
      reqs: [] as readonly SingleMenuRequirement[],
    };
  },
  created() {
    window.addEventListener('resize', this.resizeEventHandler);
  },
  mounted() {
    this.getInformationFromUser();
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEventHandler);
  },
  methods: {
    getUserEmail(): string {
      return checkNotNull(checkNotNull(auth.currentUser).email);
    },

    getInformationFromUser() {
      Promise.all([
        usernameCollection.doc(this.getUserEmail()).get(),
        semestersCollection.doc(this.getUserEmail()).get(),
        toggleableRequirementChoicesCollection.doc(this.getUserEmail()).get(),
        subjectColorsCollection.doc(this.getUserEmail()).get(),
        uniqueIncrementerCollection.doc(this.getUserEmail()).get(),
        onboardingDataCollection.doc(this.getUserEmail()).get(),
      ]).then(
        ([
          usernameDoc,
          semesterDoc,
          toggleableRequirementChoicesDoc,
          subjectColorsDoc,
          uniqueIncrementerDoc,
          onboardingDataDoc,
        ]) => {
          const usernameData = usernameDoc.data();
          const semestersData = semesterDoc.data();
          const uniqueIncrementerData = uniqueIncrementerDoc.data();
          const onboardingData = onboardingDataDoc.data();
          if (usernameData != null && onboardingData != null) {
            this.user = createAppUser(onboardingData, usernameData);
          }
          if (semestersData != null) {
            this.semesters = firestoreSemestersToAppSemesters(semestersData.semesters);
          } else {
            const newSemesterData = [
              { type: getCurrentSeason(), year: getCurrentYear(), courses: [] },
            ];
            this.semesters = newSemesterData;
            semestersCollection.doc(this.getUserEmail()).set({ semesters: newSemesterData });
          }
          this.toggleableRequirementChoices = toggleableRequirementChoicesDoc.data() || {};
          this.subjectColors = subjectColorsDoc.data() || {};
          this.uniqueIncrementer =
            uniqueIncrementerData != null ? uniqueIncrementerData.uniqueIncrementer : 0;

          if (usernameData != null && semestersData != null && onboardingData != null) {
            this.loaded = true;
            this.recomputeRequirements();
          } else {
            this.startOnboarding();
          }
        }
      );
    },

    editSemesters(newSemesters: readonly AppSemester[]) {
      this.semesters = newSemesters;
      this.recomputeRequirements();
    },
    chooseToggleableRequirementOption(
      toggleableRequirementChoices: AppToggleableRequirementChoices
    ) {
      this.toggleableRequirementChoices = toggleableRequirementChoices;
      toggleableRequirementChoicesCollection
        .doc(this.getUserEmail())
        .set(toggleableRequirementChoices);
      this.recomputeRequirements();
    },
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

    /**
     * Creates a course on frontend with either user or API data
     */
    createAppCourseFromCornellRosterCourse(
      course: CornellCourseRosterCourse,
      isRequirementsCourse: boolean
    ): AppCourse {
      if (!isRequirementsCourse) {
        this.recomputeRequirements();
      }
      return cornellCourseRosterCourseToAppCourse(
        course,
        isRequirementsCourse,
        () => this.incrementID(),
        subject => this.addColor(subject)
      );
    },
    updateSemesterView() {
      if (this.isMobile) {
        // Make sure semesterView is not compact by default on mobile
        this.compactVal = false;
      }
    },

    incrementID() {
      // If uniqueIncrementer attribute does not exist, initialize it to 0 and populate existing courses
      if (this.uniqueIncrementer === undefined) {
        this.uniqueIncrementer = 0;
        this.semesters.forEach(semester => {
          semester.courses.forEach(course => {
            course.uniqueID = this.uniqueIncrementer;
            this.uniqueIncrementer += 1;
          });
        });
      } else {
        this.uniqueIncrementer += 1;
      }
      uniqueIncrementerCollection
        .doc(this.getUserEmail())
        .set({ uniqueIncrementer: this.uniqueIncrementer });
      return this.uniqueIncrementer;
    },

    addColor(subject: string) {
      const color = getSubjectColor(this.subjectColors, subject);
      // Update subjectColors on Firebase with new subject color group
      subjectColorsCollection.doc(this.getUserEmail()).set(this.subjectColors);
      return color;
    },
    showTourEnd() {
      if (!this.isMobile) {
        this.showTourEndWindow = true;
      }
    },
    changeBottomCourseFocus(newBottomCourseFocus: number) {
      this.bottomBar.bottomCourseFocus = newBottomCourseFocus;
    },

    updateBar(course: AppCourse, colorJustChanged: string, color: string) {
      // Update Bar Information
      const courseToAdd: AppBottomBarCourse = {
        subject: course.subject,
        number: course.number,
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

      this.getReviews(course.subject, course.number, review => {
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

    endOnboarding(onboardingData: {
      userData: FirestoreOnboardingUserData;
      name: FirestoreUserName;
    }) {
      const user = createAppUser(onboardingData.userData, onboardingData.name);

      this.user = user;
      this.loaded = true;
      if (!this.isMobile) {
        this.welcomeHidden = true;
      }

      db.batch()
        .set(usernameCollection.doc(this.getUserEmail()), onboardingData.name)
        .set(onboardingDataCollection.doc(this.getUserEmail()), onboardingData.userData)
        .commit()
        .catch(error => {
          console.log('Failed to write onboarding data:', error);
        });

      this.cancelOnboarding();
      this.recomputeRequirements();
    },

    cancelOnboarding() {
      this.isOnboarding = false;
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
          // @ts-ignore
          distributions[i].replace(/[A-Za-z0-9-]+/g, d => {
            matches.push(d);
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

    getCourseCodesArray(): readonly CourseTaken[] {
      const courses: CourseTaken[] = [];
      this.semesters.forEach(semester => {
        semester.courses.forEach(course => {
          courses.push({
            code: `${course.lastRoster}: ${course.subject} ${course.number}`,
            subject: course.subject,
            courseId: course.crseId,
            number: course.number,
            credits: course.credits,
            roster: course.lastRoster,
          });
        });
      });
      courses.push(...getCourseEquivalentsFromUserExams(this.user));
      return courses;
    },

    getRequirementTypeDisplayName(type: string): string {
      return type.charAt(0).toUpperCase() + type.substring(1);
    },

    recomputeRequirements(): void {
      const groups = computeRequirements(
        this.getCourseCodesArray(),
        this.toggleableRequirementChoices,
        this.user.college,
        this.user.major,
        this.user.minor
      );
      // Turn result into data readable by requirements menu
      const singleMenuRequirements = groups.map(group => {
        const singleMenuRequirement: SingleMenuRequirement = {
          ongoing: [],
          completed: [],
          name: `${
            group.groupName.charAt(0) + group.groupName.substring(1).toLowerCase()
          } Requirements`,
          group: group.groupName.toUpperCase() as 'COLLEGE' | 'MAJOR' | 'MINOR',
          specific: group.specific,
        };
        group.reqs.forEach(req => {
          // Create progress bar with requirement with progressBar = true
          if (req.requirement.progressBar) {
            singleMenuRequirement.type = this.getRequirementTypeDisplayName(
              req.requirement.fulfilledBy
            );
            singleMenuRequirement.fulfilled = req.totalCountFulfilled || req.minCountFulfilled;
            singleMenuRequirement.required =
              (req.requirement.fulfilledBy !== 'self-check' && req.totalCountRequired) ||
              req.minCountRequired;
          }
          // Default display value of false for all requirement lists
          const displayableRequirementFulfillment = { ...req, displayDescription: false };
          if (!req.minCountFulfilled || req.minCountFulfilled < req.minCountRequired) {
            singleMenuRequirement.ongoing.push(displayableRequirementFulfillment);
          } else {
            singleMenuRequirement.completed.push(displayableRequirementFulfillment);
          }
        });
        // Make number of requirements items progress bar in absense of identified progress metric
        if (!singleMenuRequirement.type) {
          singleMenuRequirement.type = 'Requirements';
          singleMenuRequirement.fulfilled = singleMenuRequirement.completed.length;
          singleMenuRequirement.required =
            singleMenuRequirement.ongoing.length + singleMenuRequirement.completed.length;
        }
        return singleMenuRequirement;
      });
      this.reqs = singleMenuRequirements;
    },
    deleteCourseFromSemesters(uniqueID: number) {
      const updatedSemesters = this.semesters.map(semester => {
        const coursesWithoutDeleted = semester.courses.filter(
          course => course.uniqueID !== uniqueID
        );
        return { ...semester, courses: coursesWithoutDeleted };
      });
      this.editSemesters(updatedSemesters);
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

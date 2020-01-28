<template>
  <div class="dashboard">
    <onboarding class="dashboard-onboarding" v-if="isOnboarding " @onboard="endOnboarding" :isEditingProfile="isEditingProfile" :user="user"/>
    <div class="dashboard-mainView">
      <div class="dashboard-menus">
        <navbar class="dashboard-nav"
        @editProfile="editProfile"
        :isBottomPreview="bottomBar.isPreview"
        />
        <requirements class="dashboard-reqs" v-if="loaded"
          :semesters="semesters"
          :user="user"
          :key="requirementsKey"
          :isBottomPreview="bottomBar.isPreview"
          :isBottomBar="bottomBar.isExpanded"
          @requirementsMap="loadRequirementsMap"
         />
      </div>
      <semesterview v-if="loaded"
        :semesters="semesters"
        :compact="compactVal"
        :isBottomBar="bottomBar.isExpanded"
        @compact-updated="compactVal = $event"
        @updateBar="updateBar"
        @close-bar="closeBar"
      />
    </div>
    <div id="dashboard-bottomView">
      <bottombar
      :data="bottomBar"
      @close-bar="closeBar"
      @open-bar="openBar"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import Course from '@/components/Course';
import SemesterView from '@/components/SemesterView';
import Requirements from '@/components/Requirements';
import BottomBar from '@/components/BottomBar';
import NavBar from '@/components/NavBar';
import Onboarding from '@/components/Modals/Onboarding';


import '@/vueDragulaConfig';

Vue.component('course', Course);
Vue.component('semesterview', SemesterView);
Vue.component('requirements', Requirements);
Vue.component('bottombar', BottomBar);
Vue.component('navbar', NavBar);
Vue.component('onboarding', Onboarding);

const firebaseConfig = require('@/firebaseConfig.js');

const { auth, userDataCollection } = firebaseConfig;

export default {
  props: {
    bottomCourses: Array
  },
  data() {
    const user = auth.currentUser;
    const names = user.displayName.split(' ');
    return {
      loaded: false,
      compactVal: false,
      currSemID: 1,
      semesters: [],
      firebaseSems: [],
      currentClasses: [],
      user: {
        major: '',
        majorFN: '',
        college: '',
        collegeFN: '',
        firstName: names[0],
        lastName: names[1],
        middleName: ''
      },
      // Default bottombar info without info
      bottomBar: { isPreview: false, isExpanded: false },
      requirementsKey: 0,
      isOnboarding: false,
      isEditingProfile: false
    };
  },
  mounted() {
    this.getInformationFromUser();
  },
  methods: {
    getInformationFromUser() {
      const user = auth.currentUser;
      const userEmail = user.email;
      const docRef = userDataCollection.doc(userEmail);

      // TODO: error handling for firebase errors
      docRef.get()
        .then(doc => {
          if (doc.exists) {
            this.semesters = this.convertSemesters(doc.data().semesters);
            this.firebaseSems = doc.data().semesters;
            this.user = this.parseUserData(doc.data().userData, doc.data().name);
            this.loaded = true;
          } else {
            this.startOnboarding();
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    },
    convertSemesters(firebaseSems) {
      const semesters = [];

      firebaseSems.forEach(firebaseSem => {
        const firebaseCourses = firebaseSem.courses;
        const courses = [];
        firebaseCourses.forEach(firebaseCourse => {
          courses.push(this.createCourse(firebaseCourse));
        });
        semesters.push(this.createSemester(courses, firebaseSem.type, firebaseSem.year));
      });
      return semesters;
    },

    /**
     * Creates a course on frontend with either user or API data
     */
    createCourse(course) {
      // TODO: id?
      const randomId = Math.floor(Math.random() * Math.floor(1000));

      const subject = (course.code && course.code.split(' ')[0]) || course.subject;
      const number = (course.code && course.code.split(' ')[1]) || course.catalogNbr;

      // TODO: same field?
      const name = course.titleLong || course.name;

      // Description of course. Please leave the redundancy in place as a sanity check.
      const description = course.description || course.description;

      // TODO Credits: Which enroll group, and min or max credits? And how is it stored for users
      const credits = course.credits || course.enrollGroups[0].unitsMaximum;

      // Semesters: remove periods and split on ', '
      const semesters = course.semesters || course.catalogWhenOffered.replace(/\./g, '').split(', ');

      // Get prereqs of course as string (). '' if neither available because '' is interpreted as false
      const prereqs = course.prereqs || course.catalogPrereqCoreq || '';

      // To be redefined if does not exist
      let { enrollment, lectureTimes, instructors } = course;

      if (!(enrollment || lectureTimes || instructors)) {
        // If new course, iterate through enrollment groups to retrieve enrollment info, lecture times, and instructors

        // Hash maps used to remove redundancies
        const enrollmentMap = {};
        const lectureTimesMap = {};
        const instructorsMap = {};
        course.enrollGroups.forEach(group => {
          group.classSections.forEach(section => {
            // Add section
            const enroll = section.ssrComponent;
            enrollmentMap[enroll] = true;

            section.meetings.forEach(meeting => {
              const { pattern, timeStart, timeEnd } = meeting;
              // Only add the time if it is a lecture
              if (enroll === 'LEC') lectureTimesMap[`${pattern} ${timeStart} - ${timeEnd}`] = true;

              meeting.instructors.forEach(instructor => {
                const { netid, firstName, lastName } = instructor;
                instructorsMap[netid] = `${firstName} ${lastName}`;
              });
            });
          });
        });

        enrollment = Object.keys(enrollmentMap);
        lectureTimes = Object.keys(lectureTimesMap);
        instructors = Object.keys(instructorsMap).map(netid => `${instructorsMap[netid]} (${netid})`);
      }

      // Distribution of course (e.g. MQR-AS)
      const distributions = course.distributions || course.catalogDistr.split(',');

      // Get last semester of available course. TODO: Remove when no longer firebase data dependant
      const lastRoster = course.lastRoster || course.roster;

      // TODO: pick color if a new course instead of this default
      const color = course.color || '2BBCC6';

      const alerts = { requirement: null, caution: null };

      // TODO: Need courseMap to be generated, check to change
      const newCourse = {
        id: randomId,
        subject,
        number,
        name,
        description,
        credits,
        semesters,
        prereqs,
        enrollment,
        lectureTimes,
        instructors,
        distributions,
        lastRoster,
        color,
        alerts,
        check: true
      };

      // Update requirements menu
      this.updateRequirementsMenu();

      return newCourse;
    },
    createSemester(courses, type, year) {
      const semester = {
        courses,
        id: this.currSemID,
        type,
        year
      };
      this.currSemID += 1;
      return semester;
    },

    updateRequirementsMenu() {
      this.requirementsKey += 1;
    },

    loadRequirementsMap(requirementsMap) {
      // Get map of requirements
      this.buildRequirementsAlert(requirementsMap);
    },

    buildRequirementsAlert(requirementsMap) {
      // Update semesters with alerts
      this.semesters.forEach(semester => {
        semester.courses.forEach(course => {
          const courseCode = `${course.subject} ${course.number}`;
          if (courseCode in requirementsMap) {
            // Add and to parse array to natural language
            const courseReqs = requirementsMap[courseCode];
            if (courseReqs.length > 1) {
              const listLength = courseReqs.length;
              courseReqs[listLength - 2] = `${courseReqs[listLength - 2]}, and ${courseReqs.pop()}`;
            }
            const parsedCourseReqs = `Satisfies ${courseReqs.join(', ')} Requirements`;
            course.alerts.requirement = parsedCourseReqs;
          }
        });
      });
    },

    updateBar(course) {
      // Update Bar Information
      this.bottomBar = {
        subject: course.subject,
        number: course.number,
        name: course.name,
        credits: course.credits,
        semesters: this.joinOrNAString(course.semesters),
        color: course.color,
        latestSem: course.lastRoster,
        id: 1,
        // Array data
        instructors: this.joinOrNAString(course.instructors),
        distributionCategories: this.joinOrNAString(course.distributions),
        enrollmentInfo: this.joinOrNAString(course.enrollment),
        latestLecInfo: this.joinOrNAString(course.lectureTimes),
        // TODO: CUReviews data
        overallRating: 0,
        difficulty: 0,
        workload: 0,
        prerequisites: this.noneIfEmpty(course.prereqs),
        description: course.description,
        isPreview: true,
        isExpanded: true
      };

      this.getReviews(course.subject, course.number, review => {
        this.bottomBar.overallRating = review.classRating;
        this.bottomBar.difficulty = review.classDifficulty;
        this.bottomBar.workload = review.classWorkload;
      });
    },

    getReviews(subject, number, callback) {
      fetch(`https://www.cureviews.org/classInfo/${subject}/${number}/CY0LG2ukc2EOBRcoRbQy`).then(res => {
        res.json().then(reviews => {
          callback(reviews.classes[0]);
        });
      });
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

    endOnboarding(onboardingData) {
      const user = this.parseUserData(onboardingData.userData, onboardingData.name);

      this.user = user;
      this.loaded = true;

      const userEmail = auth.currentUser.email;
      const docRef = userDataCollection.doc(userEmail);

      const data = {
        name: onboardingData.name,
        userData: onboardingData.userData,
        semesters: this.firebaseSems
      };

      // set the new name and userData, along with either an empty list of semesters or preserve the old list
      docRef.set(data);

      this.cancelOnboarding();
      this.updateRequirementsMenu();
    },

    cancelOnboarding() {
      this.isOnboarding = false;
    },

    parseUserData(data, name) {
      const user = {
        // TODO: take into account multiple majors and colleges
        major: data.majors[0].acronym,
        majorFN: data.majors[0].fullName,
        college: data.colleges[0].acronym,
        collegeFN: data.colleges[0].fullName,
        firstName: name.firstName,
        middleName: name.middleName,
        lastName: name.lastName
      };

      return user;
    },

    editProfile() {
      this.isOnboarding = true;
      this.isEditingProfile = true;
    },

    joinOrNAString(arr) {
      return (arr.length !== 0 && arr[0] !== '') ? arr.join(', ') : 'N/A';
    },

    noneIfEmpty(str) {
      return (str && str.length !== 0) ? str : 'None';
    }
  }
};
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;

  &-mainView {
    display: flex;
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
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }
}

.semester {
  margin: 1rem;
  padding: 1rem;
  height: 12.12rem;
}
</style>

<template>
  <div class="dashboard" v-if="loaded">
    <div class="dashboard-mainView">
      <div class="dashboard-menus">
        <navbar class="dashboard-nav" />
        <requirements class="dashboard-reqs"
          :semesters="semesters"
          :user="user"
          :key="requirementsKey"
         />
      </div>
      <semesterview
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

import '@/vueDragulaConfig';

Vue.component('course', Course);
Vue.component('semesterview', SemesterView);
Vue.component('requirements', Requirements);
Vue.component('bottombar', BottomBar);
Vue.component('navbar', NavBar);

const firebaseConfig = require('@/firebaseConfig.js');

const { auth, userDataCollection } = firebaseConfig;

export default {
  props: {
    bottomCourses: Array
  },
  data() {
    return {
      loaded: false,
      compactVal: false,
      currSemID: 1,
      semesters: [],
      currentClasses: [],
      user: {
        major: 'CS',
        majorFN: 'COMPUTER SCIENCE',
        college: 'AS',
        collegeFN: 'Arts and Science'
      },
      // Default bottombar info without info
      bottomBar: { isPreview: false, isExpanded: false },
      requirementsKey: 0
    };
  },
  mounted() {
    this.getSemestersFromUser();
  },
  methods: {
    getSemestersFromUser() {
      const user = auth.currentUser;
      const userEmail = user.email;
      const docRef = userDataCollection.doc(userEmail);

      // TODO: error handling for firebase errors
      docRef.get()
        .then(doc => {
          if (doc.exists) {
            this.semesters = this.convertSemesters(doc.data().semesters);
            this.loaded = true;
          } else {
            docRef.set({
              semesters: []
            });
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

      const subject = course.code.split(' ')[0] || course.subject;
      const number = course.code.split(' ')[1] || course.catalogNbr;

      // TODO: same field?
      const name = course.titleLong || course.name;

      // Description of course. Please leave the redundancy in place as a sanity check.
      const description = course.description || course.description;

      // TODO Credits: Which enroll group, and min or max credits? And how is it stored for users
      const credits = course.credits || course.enrollGroups[0].unitsMaximum;

      // Semesters: remove periods and split on ', '
      const semesters = course.semesters || course.catalogWhenOffered.replace(/\./g, '').split(', ');

      // Get prereqs of course as string ()
      const prereqs = course.prereqs || course.catalogPrereqCoreq;

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
      const lastRoster = course.lastRoster || course.semester;

      // TODO: pick color if a new course instead of this default
      const color = course.color || '2BBCC6';

      const courseMap = new Map();
      courseMap.set('KCM', ['CS 1110', 'CS 1112']);
      courseMap.set('CA', ['CS 2110']);

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
        check: true,
        requirementsMap: courseMap
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
        // requirementsMap: Map,
        id: 1,
        // Array data
        instructors: this.joinOrNAString(course.instructors),
        distributionCategories: this.joinOrNAString(course.distributions),
        enrollmentInfo: this.joinOrNAString(course.enrollment),
        latestLecInfo: this.joinOrNAString(course.lectureTimes),
        // TODO: CUReviews data
        overallRating: null,
        difficulty: null,
        workload: null,
        prerequisites: course.prereqs,
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

    joinOrNAString(arr) {
      return (arr.length !== 0 && arr[0] !== '') ? arr.join(', ') : 'N/A';
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
}

.semester {
  margin: 1rem;
  padding: 1rem;
  height: 12.12rem;
}
</style>

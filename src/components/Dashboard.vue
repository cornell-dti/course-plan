<template>
  <div class="dashboard">
    <div class="dashboard-mainView">
      <div class="dashboard-menus">
        <navbar class="dashboard-nav" />
        <requirements class="dashboard-reqs"/>
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
      <bottombar :data="bottomBar" @close-bar="closeBar" @open-bar="openBar"/>
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
      compactVal: false,
      currSemID: 1,
      semesters: [],

      // Default bottombar info without info
      bottomBar: { isPreview: false, isExpanded: false }
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
      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            this.semesters = this.convertSemesters(doc.data().semesters);
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
    createCourse(course) {
      const courseMap = new Map();
      courseMap.set('KCM', ['CS 1110', 'CS 1112']);
      courseMap.set('CA', ['CS 2110']);

      const arr = course.code.split(' ');
      const subject = arr[0];
      const code = parseInt(arr[1], 10);

      // remove periods and split on ', '
      let semesters = course.catalogWhenOffered.replace(/\./g, '');
      semesters = semesters.split(', ');

      // TODO: pick color if a new course instead of this default
      const color = course.color || '2BBCC6';

      // TODO Credits: Which enroll group, and min or max credits? And how is it stored for users
      const credits = course.credits || course.enrollGroups[0].unitsMaximum;

      // TODO: id?
      const randomId = Math.floor(Math.random() * Math.floor(100));

      // TODO: same field?
      const name = course.titleLong || course.name;

      // TODO: Need courseMap to be generated, check to change
      const newCourse = {
        id: randomId,
        subject,
        code,
        name,
        credits,
        semesters,
        color,
        check: true,
        requirementsMap: courseMap
      };

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

    async updateBar(course) {
      const res = await fetch(`https://classes.cornell.edu/api/2.0/search/classes.json?roster=${course.roster}&subject=${course.subject}&q=${course.subject}%20${course.number}`);
      const courseJSON = await res.json();

      if (courseJSON.data) {
        const courseData = courseJSON.data.classes[0];

        // Update Bar Information
        // console.log(courseData);

        // Calculate credits (3 or 3 - 4)
        const { unitsMinimum, unitsMaximum } = courseData.enrollGroups[0];
        const creditsCalc = (unitsMinimum === unitsMaximum) ? `${unitsMinimum}` : `${unitsMinimum} - ${unitsMaximum}`;
        // Calculate semesters into array (["String", "Fall"])
        const semestersRemovePeriod = courseData.catalogWhenOffered.replace(/\./g, '');
        const semestersCalc = semestersRemovePeriod.split(',');

        // Iterate through enrollment groups and meetings to identify all instructors lecture times and enrollment data
        const enrollment = {};
        const lectureTimes = {};
        const instructors = {};
        courseData.enrollGroups.forEach(group => {
          group.classSections.forEach(section => {
            // Add section
            const enroll = section.ssrComponent;
            enrollment[enroll] = true;

            section.meetings.forEach(meeting => {
              const { pattern, timeStart, timeEnd } = meeting;
              // Only add the time if it is a lecture
              if (enroll === 'LEC') lectureTimes[`${pattern} ${timeStart} - ${timeEnd}`] = true;

              meeting.instructors.forEach(instructor => {
                const { netid, firstName, lastName } = instructor;
                instructors[netid] = `${firstName} ${lastName}`;
              });
            });
          });
        });

        // Parse instructors to instructors array (["David Gries (grs23)", "Bob Iger (bi23)"])
        const instructorsCalc = [];
        Object.keys(instructors).forEach(netid => {
          instructorsCalc.push(`${instructors[netid]} (${netid})`);
        });

        let distributionCalc = courseData.catalogDistr.split(',');
        if (distributionCalc.length === 0 || distributionCalc[0] === '') distributionCalc = ['None'];

        // Parse enrollment to enrollment array (["LEC", "LAB"])
        const enrollmentCalc = Object.keys(enrollment);

        // Parse lecture times info
        let lecturesCalc = Object.keys(lectureTimes);
        if (lecturesCalc.length === 0 || lecturesCalc[0] === '') lecturesCalc = ['None'];

        const barData = {
          subject: courseData.subject,
          code: parseInt(courseData.catalogNbr, 10),
          name: courseData.titleLong,
          credits: creditsCalc,
          semesters: semestersCalc,
          color: course.color,
          // requirementsMap: Map,
          id: 1,
          instructors: instructorsCalc,
          distributionCategories: distributionCalc,
          enrollmentInfo: enrollmentCalc,
          latestSem: 'SP17', // TODO make to semester course is stored
          latestLecInfo: lecturesCalc,
          overallRating: 1,
          difficulty: 3.4,
          workload: 4.0,
          prerequisites: ['TODO'],
          description: courseData.description,
          isPreview: true,
          isExpanded: true
        };

        this.bottomBar = barData;
      }
    },

    openBar() {
      this.bottomBar.isExpanded = true;
    },

    closeBar() {
      this.bottomBar.isExpanded = false;
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

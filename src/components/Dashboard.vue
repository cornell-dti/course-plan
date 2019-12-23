<template>
  <div id="dashboard">
    <div id="dashboard-mainView">
      <semesterview
        :semesters="semesters"
        :compact="compactVal"
        @compact-updated="compactVal = $event"
        @update="update"
      />
      <requirements />
    </div>
    <div id="dashboard-bottomView">
      <bottombar :data="bottomBar"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import Course from '@/components/Course';
import SemesterView from '@/components/SemesterView';
import Requirements from '@/components/Requirements';
import BottomBar from '@/components/BottomBar';

import '@/vueDragulaConfig';

Vue.component('course', Course);
Vue.component('semesterview', SemesterView);
Vue.component('requirements', Requirements);
Vue.component('bottombar', BottomBar);

const firebaseConfig = require('@/firebaseConfig.js');

const { auth, userDataCollection } = firebaseConfig;

export default {
  props: {
    bottom_courses: Array
  },
  data() {
    return {
      compactVal: false,
      currSemID: 1,
      semesters: [],

      bottomBar: {
        subject: "ENGRD",
        code: 2700,
        name: "Basic Engineering Probability and Statistics",
        credits: '3',
        semesters: ["Fall", "Spring", "Summer", "Winter"],
        color: '2BBCC6',
        // requirementsMap: Map,
        id: 1,
        instructors: ["J.Pender"], // array of strings
        distribution_categories: ["MQR-AS"], // array of strings
        enrollment_info: ["Lecture", "Lab"],
        latest_sem: "SP17",
        latest_lec_info: ["TR 1:25PM - 2:40PM", "MW 1:25PM - 2:40PM"],
        overall_rating: 1,
        difficulty: 3.4,
        workload: 4.0,
        prerequisites: ["MATH 1910", "MATH 1920"],
        description: "Gives students a working knowledge of basic probability and statistics and their application to engineering. Includes computer analysis of data and simulation. Topics include random variables, probability distributions, expectation, estimation, testing, experimental design, quality control, and regression.",
        isExpanded: true,
        isPreview: false
      }
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

    update(course) {

      // Make API Requests
      const url = `https://classes.cornell.edu/api/2.0/search/classes.json?roster=${course.roster}&subject=${course.subject}&q=${course.subject}%20${course.number}`;

      const xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = () => { 
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let response = JSON.parse(xmlHttp.responseText);
            if (response.data) {
              const courseData = response.data.classes[0];

              console.log(courseData);

              const barData = {
                subject: courseData.subject,
                code: courseData.catalogNbr,
                name: courseData.titleLong,
                credits: (courseData.enrollGroups[0].unitsMinimum === courseData.enrollGroups[0].unitsMaximum) ? `${courseData.enrollGroups[0].unitsMinimum}` : `${courseData.enrollGroups[0].unitsMinimum} - ${courseData.enrollGroups[0].unitsMaximum}`,

                // TODO: REMAINING OF DATA
                semesters: ["ARRAY OF SEMESTERS"],
                color: '2BBCC6',
                // requirementsMap: Map,
                id: 1,
                instructors: ["ARR OF INSTRUCTORS"], // array of strings
                distribution_categories: ["MQR-AS"], // array of strings
                enrollment_info: ["Lecture", "Lab"],
                latest_sem: "SP17",
                latest_lec_info: ["TR 1:25PM - 2:40PM", "MW 1:25PM - 2:40PM"],
                overall_rating: 1,
                difficulty: 3.4,
                workload: 4.0,
                prerequisites: ["MATH 1910", "MATH 1920"],
                description: courseData.description,
                isExpanded: true,
                isPreview: true
              }

              this.bottomBar = barData;
            }
          }
      }
      xmlHttp.open("GET", url, true); // true for asynchronous 
      xmlHttp.send(null);
    }
  }
};
</script>

<style scoped lang="scss">
#dashboard {
  display: flex;
  flex-direction: column;
}
#dashboard-mainView {
  display: flex;
  justify-content: space-between;
}

.semester {
  margin: 1rem;
  padding: 1rem;
  height: 12.12rem;
}
</style>

<template>
  <div id="dashboard">
    <div id="dashboard-mainView">
      <semesterview
        :semesters="semesters"
        :compact="compactVal"
        @compact-updated="compactVal = $event"
      />
      <requirements :semesters="semesters" />
    </div>
    <div id="dashboard-bottomView">
      <bottombar />
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
      semesters: []
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

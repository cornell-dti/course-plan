<template>
  <div id="dashboard">
    <semesterview
      :semesters="semesters"
      :compact="compactVal"
      @compact-updated="compactVal = $event"
    />
    <requirements />
  </div>
</template>

<script>
import Vue from 'vue';
import firebase from 'firebase';

import Course from '@/components/Course';
import SemesterView from '@/components/SemesterView';
import Requirements from '@/components/Requirements';

import '@/vueDragulaConfig';

Vue.component('course', Course);
Vue.component('semesterview', SemesterView);
Vue.component('requirements', Requirements);

const firebaseConfig = require('@/firebaseConfig.js');

const { auth, userDataCollection } = firebaseConfig;

export default {
  data() {
    return {
      compactVal: false,
      currSemID: 1,
      semesters: []
    };
  },
  mounted() {
    this.getSemestersFromUser()
  },
  methods: {
    getSemestersFromUser() {
      let user = auth.currentUser;
      let userEmail = user.email;
      const docRef = userDataCollection.doc(userEmail);

      // TODO: error handling if user not found or some firebase error
      // TODO: create a user if no document found
      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            this.semesters = this.convertSemesters(doc.data().semesters)
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    },
    convertSemesters(firebaseSems) {
      let semesters = [];
      firebaseSems.forEach((firebaseSem) => {
        let firebaseCourses = firebaseSem.courses;
        let courses = [];
        firebaseCourses.forEach((firebaseCourse) => {
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
      let color = course.color || '2BBCC6';

      // TODO Credits: Which enroll group, and min or max credits? And how is it stored for users
      let credits = course.credits || course.enrollGroups[0].unitsMaximum

      // TODO: id?
      const randomId = Math.floor(Math.random() * Math.floor(100));

      // TODO: same field?
      let name = course.titleLong || course.name;

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
      let semester = {
        courses,
        id: this.currSemID,
        type,
        year
      }
      this.currSemID++;
      return semester;
    }
  }
};
</script>

<style scoped lang="scss">
#dashboard {
  display: flex;
  justify-content: space-between;
}

.semester {
  margin: 1rem;
  padding: 1rem;
  height: 12.12rem;
}
</style>

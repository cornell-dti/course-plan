<template>
  <div id="dashboard">
    <semesterview :semesters="semesters" :compact="false" />
  </div>
</template>

<script>
import Vue from 'vue';
import Course from '@/components/Course';
import SemesterView from '@/components/SemesterView';

const dragula = require('@/vueDragulaConfig.js');

Vue.component('course', Course);

Vue.component('course', Course);
Vue.component('semesterview', SemesterView);

export default {
  computed: {
    semesters() {
      let courseMap = new Map();
      courseMap.set('KCM', ['CS 1110', 'CS 1112']);
      courseMap.set('CA', ['CS 2110']);
      const course = {
        subject: 'PHIL',
        code: 1100,
        name: 'Introduction to Philosophy',
        credits: 3,
        semesters: ['Fall', 'Spring'],
        color: '2BBCC6',
        check: true,
        requirementsMap: courseMap
      };
      const semester1 = {
        name: 'Freshman Fall',
        courses: [course, course]
      };
      const semester2 = {
        name: 'Freshman Spring',
        courses: [course, course, course]
      };
      const semester3 = {
        name: 'Sophomore Fall',
        courses: [course]
      };
      const semesters = [semester1, semester2, semester3];

      return semesters;
    }
  }
};
</script>

<style scoped lang="scss">
#dashboard
{
  margin: 1rem;
}

.semester
{
  margin: 1rem;
  padding: 1rem;
  height: 12.12rem;
}

</style>

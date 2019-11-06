<template>
  <div id="dashboard">
    <semesterview :semesters="semesters" :compact="false" />
  </div>
</template>

<script>
import Vue from 'vue';
import Course from '@/components/Course';
import SemesterView from '@/components/SemesterView';

var dragula = require('@/vueDragulaConfig.js');
Vue.component('course', Course);

Vue.component('course', Course);
Vue.component('semesterview', SemesterView);

export default {
  computed: {
    semesters() {
      let course = {
        subject: 'PHIL',
        code: 1100,
        name: 'Introduction to Philosophy',
        credits: 3,
        semesters: ['Fall', 'Spring'],
        color: "2BBCC6",
        check: true,
        requirements: ["KCM", "CA"]
      };
      let semester1 = {
        name: "Freshman Fall",
        courses: [course, course]
      }
      let semester2 = {
        name: "Freshman Spring",
        courses: [course, course, course]
      }
      let semester3 = {
        name: "Sophomore Fall",
        courses: [course]
      }
      let semesters = [semester1, semester2, semester3];

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
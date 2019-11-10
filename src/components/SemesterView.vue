<template>
  <div class="semesterView">
    <div><button v-on:click="changeCompact">Change View</button></div>
    <div v-if="!compact" class="semesterView-content">
      <div v-for="sem in semesters" v-bind:key="sem.id" class="semesterView-wrapper">
        <semester v-bind="sem" :exists="true"/>
      </div>
      <div class="semesterView-wrapper" v-bind:class="{ 'semesterView-wrapper--compact': compact }">
        <semester :exists="false"/>
      </div>
    </div>
    <div v-if="compact" class="semesterView-content">
      <div v-for="sem in compactSemesters" v-bind:key="sem.id" class="semesterView-wrapper semesterView-wrapper--compact">
        <semester v-bind="sem" :exists="true"/>
      </div>
      <div class="semesterView-wrapper" v-bind:class="{ 'semesterView-wrapper--compact': compact }">
        <semester :exists="false" :compact="compact"/>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Course from '@/components/Course';
import Semester from '@/components/Semester';

Vue.component('course', Course);
Vue.component('semester', Semester);

export default {
  props: {
    semesters: Array,
    compact: Boolean
  },
  computed: {
    // Duplicate the semesters array, but set the compact boolean to true
    compactSemesters() {
      const compactSem = [];
      this.semesters.forEach(sem => {
        const newSem = JSON.parse(JSON.stringify(sem));
        const newCourses = [];
        sem.courses.forEach(course => {
          const newCourse = JSON.parse(JSON.stringify(course));
          newCourse.compact = true;
          newCourses.push(newCourse);
        });
        newSem.courses = newCourses;
        newSem.compact = true;
        compactSem.push(newSem);
      });
      return compactSem;
    }
  },
  methods: {
    changeCompact() {
      this.compact = !this.compact;
    }
  }
};
</script>

<style scoped lang="scss">
.semesterView
{
  display: flex;
  flex-direction: column;

  &-content {
    display: flex;
    flex-wrap: wrap;
  }

  &-wrapper {
    display: flex;
    justify-content: center;
    flex-basis: 50%;
    margin-bottom: 1.5rem;

    &--compact {
      flex-basis: 25%;
    }
  }
}

</style>

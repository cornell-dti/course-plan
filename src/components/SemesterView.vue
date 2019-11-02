<template>
  <div class="semesterView">
    <div v-for="sem in semesters" v-bind:key="sem.id" class="semesterView-wrapper"> 
      <semester v-bind="sem" :exists="true"/>
    </div>
    <div class="semesterView-wrapper">
      <semester :exists="false"/>
    </div>
  </div>
</template>

<script>
import { Component, Vue} from "vue-property-decorator";
import Course from '@/components/Course';
import Semester from '@/components/Semester';

Vue.component('course', Course);
Vue.component('semester', Semester);

export default {
  props: {
    semesters: Array,
  }
};
</script>

<style scoped lang="scss">
.semesterView
{
  display: flex;
  flex-wrap: wrap;

  &-wrapper {
    display: flex;
    justify-content: center;
    flex-basis: 50%;
    margin-bottom: 1.5rem;
  }
}

</style>
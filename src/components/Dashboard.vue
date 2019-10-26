<template>
  <div id="dashboard">
    <div class="semester">
      <div class="semester-title">Fall 2019</div>
      <div class="semester-list">
        <course class="semester-class" subject="PHIL" :code="1100" name="Introduction to Philosophy" :credits="3" :semesters="['Fall', 'Spring']" :check=true color="2BBCC6" requirement="KCM"></course>
      </div>
    </div>
    <div class="semester">
      <div class="semester-title">Spring 2020</div>
      <!-- <div class="semester-list">
        <course class="semester-class" subject="CS" code=2110 name="Object-Oriented Programming and Data Structures"></course>
        <course class="semester-class" subject="CS" code=1110 name="Introduction to Computing Using Python"></course>
      </div> -->
    </div>
    <div class="semester"></div>
    <div class="semester"></div>
    <div class="semester"></div>
    <div class="semester"></div>
    <div class="semester"></div>
    <div class="semester"></div>
  </div>
</template>

<script>
import { Component, Vue} from "vue-property-decorator";
import Course from '@/components/Course';

Vue.component('course', Course);

export default {};
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

  &:nth-child(even) {
    background: lightblue;
  }

  &:nth-child(odd) {
    background: lightpink;
  }

  &-title {
    font-weight: bold;
  }

  &-list
  {
    margin-top: .5rem;
    display: flex;
    flex-direction: row;
  }

  &-class
  {
    margin-right: .5rem;
  }
}

</style>
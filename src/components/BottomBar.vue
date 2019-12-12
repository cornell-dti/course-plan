<template>
    <div class="bottombar">
        <bottombarcourse
        :subject="subject"
        :code="code"
        :name="name"
        :credits="credits"
        :semesters="semesters"
        :color="color"
        :id="id"
        :instructors="instructors"
        :distribution_categories="distribution_categories"
        :enrollment_info="enrollment_info"
        :sp17_lec_info="sp17_lec_info"
        :overall_rating="overall_rating"
        :difficulty="difficulty"
        :workload="workload"
        :prerequisites="prerequisites"
        :description="description"
        :isExpanded="isExpanded"
        :isPreview="isPreview" 
        />
    </div>
</template>


<script>
import Vue from 'vue';
import BottomBarCourse from '@/components/BottomBarCourse';

Vue.component('bottombarcourse', BottomBarCourse);
export default {
  data() {
    return {
      subject: "ENGRD",
      code: 2700,
      name: "Basic Engineering Probability and Statistics",
      credits: 3,
      semesters: ["Fall", "Spring", "Summer", "Winter"],
      color: '2BBCC6',
      // requirementsMap: Map,
      id: 1,
      instructors: ["J.Pender"], // array of strings
      distribution_categories: ["MQR-AS"], // array of strings
      enrollment_info: ["Lecture", "Lab"],
      sp17_lec_info: ["TR 1:25PM - 2:40PM", "MW 1:25PM - 2:40PM"],
      overall_rating: 1,
      difficulty: 3.4,
      workload: 4.0,
      prerequisites: ["MATH 1910", "MATH 1920"],
      description: "Gives students a working knowledge of basic probability and statistics and their application to engineering. Includes computer analysis of data and simulation. Topics include random variables, probability distributions, expectation, estimation, testing, experimental design, quality control, and regression.",
      isExpanded: true,
      isPreview: true
    };
  },
  props: {
    bottom_courses: Array
  }

};
</script>


<style scoped lang="scss">
</style>

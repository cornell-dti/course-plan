<template>
    <div class="bottombar">
        <bottombarcourse
        :subject="data.subject"
        :code="data.code"
        :name="data.name"
        :credits="data.credits"
        :semesters="data.semesters"
        :color="data.color"
        :id="data.id"
        :instructors="data.instructors"
        :distributionCategories="data.distributionCategories"
        :enrollmentInfo="data.enrollmentInfo"
        :latestSem="data.latestSem"
        :latestLecInfo="data.latestLecInfo"
        :overallRating="data.overallRating"
        :difficulty="data.difficulty"
        :workload="data.workload"
        :prerequisites="data.prerequisites"
        :description="data.description"
        :isPreview="data.isPreview"
        :isExpanded="data.isExpanded"
        @toggle="toggle"
        />
    </div>
</template>


<script>
import Vue from 'vue';
import BottomBarCourse from '@/components/BottomBarCourse';

Vue.component('bottombarcourse', BottomBarCourse);
export default {
  props: {
    bottomCourses: Array,
    data: Object
  },
  methods: {
    toggle(isExpanded) {
      if (isExpanded) this.$emit('close-bar');
      else this.$emit('open-bar');
    }
  }
};
</script>


<style scoped lang="scss">
</style>

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
        :distribution_categories="data.distribution_categories"
        :enrollment_info="data.enrollment_info"
        :latest_sem="data.latest_sem"
        :latest_lec_info="data.latest_lec_info"
        :overall_rating="data.overall_rating"
        :difficulty="data.difficulty"
        :workload="data.workload"
        :prerequisites="data.prerequisites"
        :description="data.description"
        :isExpanded="data.isExpanded"
        :isPreview="data.isPreview" 
        />
    </div>
</template>


<script>
import Vue from 'vue';
import BottomBarCourse from '@/components/BottomBarCourse';

Vue.component('bottombarcourse', BottomBarCourse);
export default {
  props: {
    bottom_courses: Array,
    data: Object
  }
};
</script>


<style scoped lang="scss">
</style>

<template>
    <div class="bottombar">
        <bottombarcourse />
    </div>
</template>


<script>
import Vue from 'vue';
import BottomBarCourse from '@/components/BottomBarCourse';

Vue.component('bottombarcourse', BottomBarCourse);
export default {
  props: {
    bottom_courses: Array
  }

};
</script>


<style scoped lang="scss">
</style>

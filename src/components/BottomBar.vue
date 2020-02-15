<template>
    <div class="bottombar">
      <div class="bottombar-tabview">
          <bottombartabview
          :bottomCourses="bottomCourses"
          @bottomBarTabToggle="bottomBarTabToggle"
          />
      </div>
      <div class="bottombar-title" @click="toggle">
        <!-- <span class="bottombar-square-title">Name of Course</span> -->
        <bottombartitle
        :color="bottomCourses[0].color"
        :name="bottomCourses[0].name"
        />
      </div>
      <div :class="{ hide: !bottomCourses[0].isExpanded }" class="bottombar-course">
        <bottombarcourse
        :subject="bottomCourses[0].subject"
        :number="bottomCourses[0].number"
        :name="bottomCourses[0].name"
        :credits="bottomCourses[0].credits"
        :semesters="bottomCourses[0].semesters"
        :color="bottomCourses[0].color"
        :id="bottomCourses[0].id"
        :instructors="bottomCourses[0].instructors"
        :distributionCategories="bottomCourses[0].distributionCategories"
        :enrollmentInfo="bottomCourses[0].enrollmentInfo"
        :latestSem="bottomCourses[0].latestSem"
        :latestLecInfo="bottomCourses[0].latestLecInfo"
        :overallRating="bottomCourses[0].overallRating"
        :difficulty="bottomCourses[0].difficulty"
        :workload="bottomCourses[0].workload"
        :prerequisites="bottomCourses[0].prerequisites"
        :description="bottomCourses[0].description"
        :isPreview="bottomCourses[0].isPreview"
        :isExpanded="bottomCourses[0].isExpanded"
        @toggle="toggle"
        />
      </div>
    </div>
</template>


<script>
import Vue from 'vue';
import BottomBarCourse from '@/components/BottomBarCourse';
import BottomBarTabView from '@/components/BottomBarTabView';
import BottomBarTitle from '@/components/BottomBarTitle';

Vue.component('bottombarcourse', BottomBarCourse);
Vue.component('bottombartabview', BottomBarTabView);
Vue.component('bottombartitle', BottomBarTitle);

export default {
  props: {
    bottomCourses: Array
    // data: Object
  },

  methods: {
    toggle(isExpanded) {
      if (isExpanded) this.$emit('close-bar');
      else this.$emit('open-bar');
    },
    bottomBarTabToggle(courseObj) {
      // Move courseObj to front of array
      if (this.bottomCourses.indexOf(courseObj) > 0) { // not already in front
        this.bottomCourses.splice(this.bottomCourses.indexOf(courseObj), 1);
        this.bottomCourses.unshift(courseObj);
      }
    }
  }
};

</script>


<style scoped lang="scss">
.bottombar {
  display: flex;
  flex-direction: column;
  width: 100%;

  &-tabview {
    width: 100%;
    position: fixed;
    bottom: 300px;
  }

}
.hide {
    height: 0;
}

</style>

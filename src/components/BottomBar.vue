<template>
    <div class="bottombar">
      <div class="bottombar-tabview">
          <bottombartabview
          :bottomCourses="bottomCourses"
          :seeMoreCourses="seeMoreCourses"
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
        :courseObj="bottomCourses[0]"
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
    bottomCourses: Array,
    seeMoreCourses: Array
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

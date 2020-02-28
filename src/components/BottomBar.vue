<template>
    <div class="bottombar">
      <div class="bottombar-tabviewTitleWrapper">
        <div class="bottombar-tabview" v-bind:class="{ expandedTabView: isExpanded }">
            <bottombartabview
            :bottomCourses="bottomCourses"
            :seeMoreCourses="seeMoreCourses"
            :isExpanded="isExpanded"
            @bottomBarTabToggle="bottomBarTabToggle"
            @toggleFromTab="toggleFromTab"
            />
        </div>
        <div class="bottombar-title" @click="toggle()">
          <bottombartitle
          :color="bottomCourses[0].color"
          :name="bottomCourses[0].name"
          :isExpanded="isExpanded"
          />
        </div>
      </div>
      <div v-if="this.isExpanded" class="bottombar-course">
        <bottombarcourse
        :courseObj="bottomCourses[0]"
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
    seeMoreCourses: Array,
    isExpanded: Boolean
  },

  methods: {
    toggle() {
      if (this.isExpanded) this.$emit('close-bar');
      else this.$emit('open-bar');
    },
    bottomBarTabToggle(courseObj) {
      // Move courseObj to front of array
      if (this.bottomCourses.indexOf(courseObj) > 0) { // not already in front
        this.bottomCourses.splice(this.bottomCourses.indexOf(courseObj), 1);
        this.bottomCourses.unshift(courseObj);
      }
    },
    toggleFromTab() {
      this.toggle();
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
    position:fixed;
    bottom: 40px;
    left: 29.5rem;
    width: calc(100vw - 29.5rem);
  }

}
.expandedTabView{
    position: fixed;
    // bottom: 300px;
    bottom: 355px;
}

</style>

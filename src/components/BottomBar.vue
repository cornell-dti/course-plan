<template>
    <div class="bottombar">
      <div class="bottombar-tabviewTitleWrapper">
        <div class="bottombar-tabview" v-bind:class="{ expandedTabView: isExpanded }">
            <bottombartabview
            :bottomCourses="bottomCourses"
            :seeMoreCourses="seeMoreCourses"
            :bottomCourseFocus="bottomCourseFocus"
            :isExpanded="isExpanded"
            :maxBottomBarTabs="maxBottomBarTabs"
            @bottomBarTabToggle="bottomBarTabToggle"
            @toggleFromTab="toggleFromTab"
            />
        </div>
        <div class="bottombar-title" @click="toggle()">
          <bottombartitle
          :color="bottomCourses[this.bottomCourseFocus].color"
          :name="bottomCourses[this.bottomCourseFocus].name"
          :isExpanded="isExpanded"
          />
        </div>
      </div>
      <div v-if="this.isExpanded" class="bottombar-course">
        <bottombarcourse
        :courseObj="bottomCourses[this.bottomCourseFocus]"
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
    isExpanded: Boolean,
    maxBottomBarTabs: Number
  },

  data() {
    return {
      bottomCourseFocus: 0
    };
  },

  methods: {
    toggle() {
      if (this.isExpanded) this.$emit('close-bar');
      else this.$emit('open-bar');
    },
    bottomBarTabToggle(courseObj) {
      this.bottomCourseFocus = this.bottomCourses.indexOf(courseObj);
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
    bottom: 2.5rem;
    left: 29.5rem;
    width: calc(100vw - 29.5rem);
  }

}
.expandedTabView{
    position: fixed;
    bottom: 18.75rem;
}

@media only screen and (max-width: 976px) {
  .bottombar {
    &-tabview {
      left: 25.5rem;
      width: calc(100vw - 25.5rem);
    }
  }
}
@media only screen and (max-width: 878px) {
  .bottombar {
    &-tabview {
      left: 0rem;
      width: 100%;
    }
  }
}

@media only screen and (max-width: 440px) {
  .expandedTabView {
    bottom: 11.75rem;
  }
}

</style>

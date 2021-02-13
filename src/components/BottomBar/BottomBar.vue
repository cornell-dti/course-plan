<template>
  <div class="bottombar">
    <div class="bottombar-tabviewTitleWrapper">
      <div class="bottombar-tabview" v-bind:class="{ expandedTabView: isExpanded }">
        <bottom-bar-tab-view
          :bottomCourses="bottomCourses"
          :seeMoreCourses="seeMoreCourses"
          :bottomCourseFocus="bottomCourseFocus"
          :isExpanded="isExpanded"
          :maxBottomBarTabs="maxBottomBarTabs"
          @bottomBarTabToggle="bottomBarTabToggle"
          @toggleFromTab="toggle"
        />
      </div>
      <div class="bottombar-title" @click="toggle()">
        <bottom-bar-title
          :color="bottomCourses[bottomCourseFocus].color"
          :name="bottomCourses[bottomCourseFocus].name"
          :isExpanded="isExpanded"
        />
      </div>
    </div>
    <div v-if="isExpanded" class="bottombar-course">
      <bottom-bar-course :courseObj="bottomCourses[bottomCourseFocus]" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BottomBarCourse from '@/components/BottomBar/BottomBarCourse.vue';
import BottomBarTabView from '@/components/BottomBar/BottomBarTabView.vue';
import BottomBarTitle from '@/components/BottomBar/BottomBarTitle.vue';

export default Vue.extend({
  components: { BottomBarCourse, BottomBarTabView, BottomBarTitle },
  props: {
    bottomCourses: { type: Array as PropType<AppBottomBarCourse[]>, required: true },
    seeMoreCourses: { type: Array as PropType<AppBottomBarCourse[]>, required: true },
    bottomCourseFocus: { type: Number, required: true },
    isExpanded: { type: Boolean, required: true },
    maxBottomBarTabs: { type: Number, required: true },
  },

  methods: {
    toggle() {
      if (this.isExpanded) this.$emit('close-bar');
      else this.$emit('open-bar');
    },
    bottomBarTabToggle(courseObj: AppBottomBarCourse) {
      const newBottomCourseFocus = this.bottomCourses.indexOf(courseObj);
      this.$emit('change-focus', newBottomCourseFocus);
    },
  },
});
</script>

<style scoped lang="scss">
.bottombar {
  display: flex;
  flex-direction: column;
  width: 100%;

  &-tabview {
    position: fixed;
    bottom: 2.5rem;
    left: 29.5rem;
    width: calc(100vw - 29.5rem);
  }
}
.expandedTabView {
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

<template>
  <div class="bottombar" v-if="hasBottomBarCourses">
    <div class="bottombar-tabviewTitleWrapper">
      <div class="bottombar-tabview" :class="{ expandedTabView: isExpanded }">
        <bottom-bar-tab-view :maxBottomBarTabs="maxBottomBarTabs" />
      </div>
      <div class="bottombar-title" @click="toggleBottomBar()">
        <bottom-bar-title
          :color="focusedBottomBarCourse.color"
          :name="focusedBottomBarCourse.name"
          :isExpanded="isExpanded"
        />
      </div>
    </div>
    <div v-if="isExpanded" class="bottombar-course">
      <bottom-bar-course :courseObj="focusedBottomBarCourse" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BottomBarCourse from '@/components/BottomBar/BottomBarCourse.vue';
import BottomBarTabView from '@/components/BottomBar/BottomBarTabView.vue';
import BottomBarTitle from '@/components/BottomBar/BottomBarTitle.vue';
import { immutableBottomBarState, toggleBottomBar } from '@/components/BottomBar/BottomBarState';

export default Vue.extend({
  components: { BottomBarCourse, BottomBarTabView, BottomBarTitle },
  props: {
    maxBottomBarTabs: { type: Number, required: true },
  },

  computed: {
    hasBottomBarCourses(): boolean {
      return immutableBottomBarState.bottomCourses.length > 0;
    },
    isExpanded(): boolean {
      return immutableBottomBarState.isExpanded;
    },
    focusedBottomBarCourse(): AppBottomBarCourse {
      const focus = immutableBottomBarState.bottomCourseFocus;
      const normalizedFocus = focus < this.maxBottomBarTabs ? focus : this.maxBottomBarTabs - 1;
      return immutableBottomBarState.bottomCourses[normalizedFocus];
    },
  },

  methods: {
    toggleBottomBar,
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

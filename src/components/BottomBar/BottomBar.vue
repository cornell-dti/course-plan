<template>
  <div class="bottombar" v-if="hasBottomBarCourses">
    <div class="bottombar-tabview" :class="{ expandedTabView: isExpanded }">
      <bottom-bar-tab-view :maxBottomBarTabs="maxBottomBarTabs" />
    </div>
    <button
      class="bottombar-title full-opacity-on-hover"
      :class="{ expandedBottomBarTitle: isExpanded }"
      @click="toggleBottomBar($gtag)"
    >
      <bottom-bar-title
        :color="focusedBottomBarCourse.color"
        :name="focusedBottomBarCourse.name"
        :isExpanded="isExpanded"
      />
    </button>
    <div v-if="isExpanded" class="bottombar-course">
      <bottom-bar-course :courseObj="focusedBottomBarCourse" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BottomBarCourse from '@/components/BottomBar/BottomBarCourse.vue';
import BottomBarTabView from '@/components/BottomBar/BottomBarTabView.vue';
import BottomBarTitle from '@/components/BottomBar/BottomBarTitle.vue';
import { immutableBottomBarState, toggleBottomBar } from '@/components/BottomBar/BottomBarState';

export default defineComponent({
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
@import '@/assets/scss/_variables.scss';

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

  &-title {
    position: fixed;
    bottom: 0;
    left: 29.5rem;
    height: 2.5rem;
    width: calc(100vw - 29.5rem);
    text-align: left;
    padding-left: 0;
  }

  &-course {
    position: fixed;
    bottom: 0;
    left: 29.5rem;
    width: 100%;
    background-color: $white;
    width: calc(100vw - 29.5rem);
    height: 16.5rem;
  }
}

.expandedTabView {
  position: fixed;
  bottom: 19rem;
}
.expandedBottomBarTitle {
  position: fixed;
  bottom: 16.5rem;
}

@media only screen and (max-width: $large-breakpoint) {
  .bottombar {
    &-tabview,
    &-title,
    &-course {
      left: 25.5rem;
      width: calc(100vw - 25.5rem);
    }
  }
}

@media only screen and (max-width: $medium-breakpoint) {
  .bottombar {
    &-tabview,
    &-title,
    &-course {
      left: 0;
      width: 100vw;
    }

    &-course {
      height: calc(100vh - 14rem);
    }
  }

  .expandedTabView {
    position: fixed;
    bottom: calc(100vh - 11.5rem);
  }

  .expandedBottomBarTitle {
    position: fixed;
    bottom: calc(100vh - 14rem);
  }
}
</style>

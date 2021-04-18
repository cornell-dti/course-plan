<template>
  <div class="bottombartabview">
    <div class="bottombartabview-bottomCourseWrapper">
      <div
        v-for="(bottomCourse, index) in firstFewCourses"
        :key="index"
        class="bottombartabview-courseWrapper"
      >
        <bottom-bar-tab
          :color="bottomCourse.color"
          :courseObj="bottomCourse"
          :tabIndex="index"
          :bottomCourseFocus="bottomCourseFocus"
          :isExpanded="isExpanded"
          @on-change-focus="() => changeBottomBarCourseFocus(index)"
          @on-delete="() => deleteBottomBarCourse(index, $gtag)"
        />
      </div>
    </div>
    <div v-if="seeMoreCourses.length > 0" class="bottombartabview-seeMoreWrapper">
      <div class="bottombarSeeMoreTab" @click="bottomBarSeeMoreToggle">
        <div class="bottombarSeeMoreTab-name">See More</div>
        <img
          v-if="!seeMoreOpen"
          class="bottombarSeeMoreTab-arrow"
          src="@/assets/images/uparrow-white.svg"
          alt="expand see more bottom bar tabs"
        />
        <img
          v-if="seeMoreOpen"
          class="bottombarSeeMoreTab-arrow"
          src="@/assets/images/downarrow-white.svg"
          alt="collapse see more bottom bar tabs"
        />
      </div>
      <div v-if="seeMoreOpen" class="bottombarSeeMoreOptions">
        <div class="seeMoreCourse-content">
          <div
            v-for="(seeMoreCourse, index) in seeMoreCourses"
            :key="index"
            class="seeMoreCourse-option"
          >
            <span
              class="seeMoreCourse-option-text"
              @click="moveBottomBarCourseToFirst(index + maxBottomBarTabs)"
              >{{ seeMoreCourse.code }}</span
            >
            <img
              class="seeMoreCourse-option-delete"
              src="@/assets/images/x-blue.svg"
              @click="deleteBottomBarCourse(index + maxBottomBarTabs, $gtag)"
              alt="x to delete bottom bar tab"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BottomBarTab from '@/components/BottomBar/BottomBarTab.vue';
import {
  immutableBottomBarState,
  changeBottomBarCourseFocus,
  deleteBottomBarCourse,
  moveBottomBarCourseToFirst,
} from '@/components/BottomBar/BottomBarState';
import { GTagEvent } from '@/gtag';

export default defineComponent({
  components: { BottomBarTab },
  data() {
    return {
      seeMoreOpen: false,
    };
  },
  props: {
    maxBottomBarTabs: { type: Number, required: true },
  },

  computed: {
    bottomCourseFocus(): number {
      const focus = immutableBottomBarState.bottomCourseFocus;
      return focus < this.maxBottomBarTabs ? focus : this.maxBottomBarTabs - 1;
    },
    isExpanded(): boolean {
      return immutableBottomBarState.isExpanded;
    },
    /** The first few courses that can fit in the bottom bar tabs without see more. */
    firstFewCourses(): readonly AppBottomBarCourse[] {
      return immutableBottomBarState.bottomCourses.slice(0, this.maxBottomBarTabs);
    },
    seeMoreCourses(): readonly AppBottomBarCourse[] {
      return immutableBottomBarState.bottomCourses.slice(this.maxBottomBarTabs);
    },
  },

  methods: {
    changeBottomBarCourseFocus,
    deleteBottomBarCourse,
    moveBottomBarCourseToFirst,
    bottomBarSeeMoreToggle() {
      this.seeMoreOpen = !this.seeMoreOpen;
      GTagEvent(this.$gtag, 'bottom-bar-see-more');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.bottombartabview {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: -0.2%;
  align-items: flex-end;

  &-bottomCourseWrapper {
    display: flex;
    flex-direction: row;
  }

  &-courseWrapper {
    margin-right: 0.25rem;
  }

  &-seeMoreWrapper {
    display: flex;
    flex-direction: column;
    margin-right: 1%;
    .bottombarSeeMoreTab {
      color: $white;
      width: 9rem;
      height: 1.75rem;
      background-color: $sangBlue;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      display: flex;
      align-items: center;

      justify-content: space-between;
      padding-left: 8px;
      padding-right: 8px;
      cursor: pointer;
      &-arrow {
        width: 14px;
        height: 50%;
        margin-right: 7%;
      }
    }
  }

  .bottombarSeeMoreOptions {
    width: 9rem;
    background-color: $white;
    border: 1px solid rgba(218, 218, 218, 0.2);
    max-height: 6.81rem;
    overflow-y: scroll;
    .seeMoreCourse {
      &-option {
        border: 1px solid rgba(218, 218, 218, 0.2);
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 17px;
        width: 100%;
        height: 25px;

        color: $lightPlaceholderGray;
        display: flex;
        align-items: center;

        justify-content: space-between;
        padding-left: 8px;
        padding-right: 8px;
        cursor: pointer;

        &-delete {
          display: none;
          width: 0.625rem;
          height: 0.55rem;
          margin-right: 7%;
        }
      }

      &-option:hover {
        text-decoration-line: underline;
        background: rgba(50, 160, 242, 0.15);
      }
    }

    .seeMoreCourse-option:hover img {
      display: block;
    }
  }
}
@media only screen and (max-width: $small-medium-breakpoint) {
  .bottombartabview {
    &-seeMoreWrapper {
      .bottombarSeeMoreTab {
        width: 7rem;
        height: fit-content;
      }
    }
    .bottombarSeeMoreOptions {
      width: 100%;
      .seeMoreCourse {
        &-option {
          width: 100%;
          height: fit-content;
        }
      }
    }
  }
}
</style>

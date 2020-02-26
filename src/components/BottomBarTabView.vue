<template>
  <div class="bottombartabview">
    <div v-for="bottomCourse in bottomCourses" :key="bottomCourse.id" class="bottombartabview-courseWrapper">
      <bottombartab
        v-bind="bottomCourse"
        :id="bottomCourse.id"
        :subject="bottomCourse.subject"
        :number="bottomCourse.number"
        :color="bottomCourse.color"
        :courseObj ="bottomCourse"
        @bottomBarTabToggle="bottomBarTabToggle"
        @deleteBottomTab="deleteBottomTab"
      />
    </div>
    <div class="bottombartabview-seeMoreWrapper">
      <div class="bottombarSeeMoreTab" @click="bottomBarSeeMoreToggle">
          <div class="bottombarSeeMoreTab-name">{{seeMoreString}}</div>
          <img class="bottombarSeeMoreTab-arrow" src="@/assets/images/uparrow-white.svg" />
      </div>

      <div v-if="seeMoreOpen" class="seeMoreCourse-content">
          <div
            v-for="seeMoreCourse in seeMoreCourses"
            :key="seeMoreCourse.id"
            class="seeMoreCourse-section"
          >
              <span class="seeMoreCourse-text">{{ seeMoreCourse.subject }} {{ seeMoreCourse.number}}</span>
          </div>
      </div>

    </div>

  </div>
</template>

<script>
import Vue from 'vue';
import BottomBarTab from '@/components/BottomBarTab';

Vue.component('bottombartab', BottomBarTab);

export default {
  data() {
    return {
      seeMoreOpen: false
    };
  },
  props: {
    bottomCourses: Array,
    seeMoreCourses: Array
  },

  computed: {
    seeMoreString() {
      return 'See More';
    }
  },

  methods: {
    bottomBarTabToggle(courseObj) {
      this.$emit('bottomBarTabToggle', courseObj);
    },

    deleteBottomTab(subject, number) {
      for (let i = 0; i < this.bottomCourses.length; i += 1) {
        if (this.bottomCourses[i].subject === subject && this.bottomCourses[i].number === number) {
          this.bottomCourses.splice(i, 1);
          break;
        }
      }
    },

    bottomBarSeeMoreToggle() {
      this.seeMoreOpen = !this.seeMoreOpen;
      console.log(this.seeMoreOpen);
    }

  }
};

</script>

<style scoped lang="scss">
.bottombartabview {
  width: 92%;
  display: flex;
  flex-direction: row;

  &-courseWrapper {
    margin-right: 0.25rem;
  }

  &-seeMoreWrapper {
    // display:flex;
    // flex-direction: column;
    margin-left: auto;
    .bottombarSeeMoreTab {
      color: white;
      position: absolute;
      width: 7.38rem;
      height: 1.75rem;
      background-color: #508197;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      display: flex;
      align-items: center;

      justify-content: space-between;
      padding-left: 8px;
      padding-right: 8px;
      cursor:pointer;
      &-arrow {
        width: 14px;
        height: 50%;
      }
    }
  }

}
</style>

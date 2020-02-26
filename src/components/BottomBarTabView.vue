<template>
  <div class="bottombartabview">
    <div class="bottombartabview-bottomCourseWrapper">
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
    </div>
    <div class="bottombartabview-seeMoreWrapper">
      <div class="bottombarSeeMoreTab" @click="bottomBarSeeMoreToggle">
          <div class="bottombarSeeMoreTab-name">{{seeMoreString}}</div>
          <img v-if="!seeMoreOpen" class="bottombarSeeMoreTab-arrow" src="@/assets/images/uparrow-white.svg" />
          <img v-if="seeMoreOpen" class="bottombarSeeMoreTab-arrow" src="@/assets/images/downarrow-white.svg" />
      </div>

      <div class="bottombarSeeMoreOptions">
        <div v-if="seeMoreOpen" class="seeMoreCourse-content">
            <div
              v-for="seeMoreCourse in seeMoreCourses"
              :key="seeMoreCourse.id"
              class="seeMoreCourse-option"
            >
                <span class="seeMoreCourse-option-text" @click="moveToBottomBar(seeMoreCourse)">{{ seeMoreCourse.subject }} {{ seeMoreCourse.number}}</span>
                <img class="seeMoreCourse-option-delete" src="@/assets/images/x-blue.svg" @click="deleteSeeMoreCourse(seeMoreCourse)"/>
            </div>
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
    },

    moveToBottomBar(course) {
      if (this.bottomCourses.length >= 4) {
        const bottomCourseToMove = this.bottomCourses[this.bottomCourses.length - 1];
        // remove bottomCourseToMove from bottomCourses
        this.bottomCourses.splice(this.bottomCourses.length - 1, 1);

        // add bottomCourseToMove to seeMoreCourses
        this.seeMoreCourses.unshift(bottomCourseToMove);
      }
      // remove course from seeMoreCourses
      for (let i = 0; i < this.seeMoreCourses.length; i += 1) {
        if (this.seeMoreCourses[i].subject === course.subject && this.seeMoreCourses[i].number === course.number) {
          this.seeMoreCourses.splice(i, 1);
        }
      }
      // add course to bottomCourses
      this.bottomCourses.unshift(course);
    },

    deleteSeeMoreCourse(course) {
      // remove course from seeMoreCourses
      for (let i = 0; i < this.seeMoreCourses.length; i += 1) {
        if (this.seeMoreCourses[i].subject === course.subject && this.seeMoreCourses[i].number === course.number) {
          this.seeMoreCourses.splice(i, 1);
        }
      }
    }

  }
};

</script>

<style scoped lang="scss">
.bottombartabview {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: -0.2%;


  &-bottomCourseWrapper {
    display: flex;
    flex-direction: row;
  }

  &-courseWrapper {
    margin-right: 0.25rem;
  }

  &-seeMoreWrapper {
    display:flex;
    flex-direction: column;
    margin-left: auto;
    .bottombarSeeMoreTab {
      color: white;
      // position: absolute;
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

  .bottombarSeeMoreOptions {
    width: 7.375rem;
    background-color: #FFFFFF;;
    border: 1px solid rgba(218, 218, 218, 0.2);
    // height: 6.81rem;
    overflow: scroll;

    .seeMoreCourse {
      &-option {
        border: 1px solid rgba(218, 218, 218, 0.2);
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 17px;
        width: 100%;
        height: 25px;

        color: #757575;
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
        }
      }

      &-option:hover {
          text-decoration-line: underline;
          background: rgba(50, 160, 242, 0.15);
      }
    }

    .seeMoreCourse-option:hover img {
      display:block;
    }
  }

}
</style>

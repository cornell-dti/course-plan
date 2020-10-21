<template>
  <div class="bottombartabview">
    <div class="bottombartabview-bottomCourseWrapper">
      <div v-for="(bottomCourse, index) in bottomCourses" :key="bottomCourse.id" class="bottombartabview-courseWrapper">
        <bottombartab
          v-bind="bottomCourse"
          :id="bottomCourse.id"
          :subject="bottomCourse.subject"
          :number="bottomCourse.number"
          :color="bottomCourse.color"
          :courseObj="bottomCourse"
          :tabIndex="index"
          :bottomCourseFocus="bottomCourseFocus"
          :isExpanded ="isExpanded"
          @bottomBarTabToggle="bottomBarTabToggle"
          @deleteBottomTab="deleteBottomTab"
          @toggleFromTab="toggleFromTab"
          @updateBarTabs="updateBarTabs"
        />
      </div>
    </div>
    <div v-if="seeMoreCourses.length > 0" class="bottombartabview-seeMoreWrapper">
      <div class="bottombarSeeMoreTab" @click="bottomBarSeeMoreToggle">
          <div class="bottombarSeeMoreTab-name">{{seeMoreString}}</div>
          <img v-if="!seeMoreOpen" class="bottombarSeeMoreTab-arrow" src="@/assets/images/uparrow-white.svg" />
          <img v-if="seeMoreOpen" class="bottombarSeeMoreTab-arrow" src="@/assets/images/downarrow-white.svg" />
      </div>
      <div v-if="seeMoreOpen" class="bottombarSeeMoreOptions">
        <div class="seeMoreCourse-content">
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
    seeMoreCourses: Array,
    bottomCourseFocus: Number,
    isExpanded: Boolean,
    maxBottomBarTabs: Number
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
      let i = 0;
      for (; i < this.bottomCourses.length; i += 1) {
        if (this.bottomCourses[i].subject === subject && this.bottomCourses[i].number === number) {
          this.bottomCourses.splice(i, 1);
          break;
        }
      }

      // if any See More courses exist, move first See More Course to end of tab
      if (this.seeMoreCourses.length > 0) {
        const seeMoreCourseToMove = this.seeMoreCourses[0];
        // remove course from See More Courses
        this.seeMoreCourses.splice(0, 1);

        // add course to end of bottomCourses
        this.bottomCourses.push(seeMoreCourseToMove);
      }

      // update focused course
      if (i >= this.bottomCourses.length) {
        this.bottomBarTabToggle(this.bottomCourses[i - 1]);
      }
    },

    bottomBarSeeMoreToggle() {
      this.seeMoreOpen = !this.seeMoreOpen;
    },

    moveToBottomBar(course) {
      if (this.bottomCourses.length >= this.maxBottomBarTabs) {
        const bottomCourseToMove = this.bottomCourses[this.bottomCourses.length - 1];
        // remove bottomCourseToMove from bottomCourses
        this.bottomCourses.splice(this.bottomCourses.length - 1, 1);

        // add bottomCourseToMove to seeMoreCourses
        this.seeMoreCourses.unshift(bottomCourseToMove);
      }
      // add course to bottomCourses
      this.bottomCourses.unshift(course);
      this.bottomBarTabToggle(this.bottomCourses[0]);
      // remove course from seeMoreCourses
      this.deleteSeeMoreCourse(course);
    },

    deleteSeeMoreCourse(course) {
      // remove course from seeMoreCourses
      for (let i = 0; i < this.seeMoreCourses.length; i += 1) {
        if (this.seeMoreCourses[i].uniqueID === course.uniqueID) {
          this.seeMoreCourses.splice(i, 1);
        }
      }
      this.updateBarTabs();
    },

    toggleFromTab() {
      this.$emit('toggleFromTab');
    },

    updateBarTabs() {
      this.$emit('updateBarTabs');
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
  align-items: flex-end;

  justify-content: space-between;


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
    margin-right: 1%;
    .bottombarSeeMoreTab {
      color: white;
      width: 9rem;
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
        margin-right: 7%;
      }
    }
  }

  .bottombarSeeMoreOptions {
    width: 9rem;
    background-color: #FFFFFF;;
    border: 1px solid rgba(218, 218, 218, 0.2);
    max-height:6.81rem;
    overflow-y:scroll;
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
          margin-right: 7%;
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
@media only screen and (max-width: 600px) {
  .bottombartabview {
    &-seeMoreWrapper {
      .bottombarSeeMoreTab {
        width: 100%;
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

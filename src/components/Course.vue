<template>
  <div :class="{ 'course--min': compact, 'active': active }" class="course" @click="updateBar()">
    <div class="course-color" :style="cssVars" :class="{ 'course-color--active': active, 'course-color--min': compact }">
      <div class="course-dotColumn">
        <span class="course-dot"></span>
        <span class="course-dot"></span>
        <span class="course-dot"></span>
      </div>
      <div class="course-dotColumn">
        <span class="course-dot"></span>
        <span class="course-dot"></span>
        <span class="course-dot"></span>
      </div>
    </div>
    <div :class="{ 'course-content--min': compact }" class="course-content">
      <div :class="{ 'course-main--min': compact }" class="course-main">
        <div :class="{ 'course-top--min': compact }" class="course-top">
          <div :class="{ 'course-code--min': compact }" class="course-code">
            {{ subject }} {{ number }}
          </div>
          <div class="course-dotRow" @click="openMenu">
            <span class="course-dot course-dot--menu"></span>
            <span class="course-dot course-dot--menu"></span>
            <span class="course-dot course-dot--menu"></span>
          </div>
        </div>
        <div v-if="!compact" class="course-name">{{ name }}</div>
        <div class="course-info">
          <span v-if="!compact" class="course-credits">{{ creditString }}</span>
          <span v-if="!compact && semesterString" class="course-semesters">{{
            semesterString
          }}</span>
          <!-- <div v-if="!compact && alerts.requirement" class="course-outerWrapper course-tooltip">
            <div class="course-iconWrapper course-iconWrapper--info">
              <img class="course-icon course-icon--info" src="../assets/images/info.svg" />
            </div>
            <div
              class="course-tooltiptext course-tooltiptext--info"
              v-html="requirementString"
            ></div>
          </div> -->
          <div v-if="alerts.caution" class="course-outerWrapper course-tooltip">
            <div v-if="!compact" class="course-iconWrapper course-iconWrapper--caution">
              <img class="course-icon course-icon--caution" src="../assets/images/caution.svg" />
            </div>
            <div
              class="course-tooltiptext course-tooltiptext--caution"
              v-html="cautionString"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <coursemenu
      v-if="menuOpen"
      class="course-menu"
      @delete-course="deleteCourse"
      @color-course="colorCourse"
      v-click-outside="closeMenuIfOpen"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import CourseMenu from '@/components/Modals/CourseMenu';

Vue.component('coursemenu', CourseMenu);

const clickOutside = {
  bind(el, binding, vnode) {
    el.event = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.event);
  },
  unbind(el) {
    document.body.removeEventListener('click', el.event);
  }
};

export default {
  props: {
    courseObj: Object,
    subject: String,
    number: String,
    name: String,
    credits: Number,
    prereqs: String,
    semesters: Array,
    color: String,
    alerts: Object,
    compact: Boolean,
    id: String,
    active: Boolean
  },
  data() {
    return {
      menuOpen: false,
      stopCloseFlag: false
    };
  },
  computed: {
    rqString() {
      return 'RQ';
    },

    // TODO: bold requirements
    requirementString() {
      return this.alerts.requirement;
    },

    // TODO: too much DOM manipulation that vue should fix - talk to Sam
    cautionString() {
      return this.alerts.caution;
    },

    semesterString() {
      let semesterString = '';
      this.semesters.forEach(semester => {
        semesterString += `${semester}, `;
      });
      if (semesterString.length > 0) {
        return semesterString.substring(0, semesterString.length - 2);
      }
      return semesterString;
    },

    creditString() {
      return `${this.credits} credits`;
    },
    review() {
      return `https://www.cureviews.org/course/${this.subject}/${this.number}`;
    },

    // TODO: change semester from FA18
    roster() {
      return `https://classes.cornell.edu/browse/roster/FA18/class/${this.subject}/${this.number}`;
    },

    cssVars() {
      return {
        '--bg-color': `#${this.color}`
      };
    }
  },
  methods: {
    openMenu() {
      this.stopCloseFlag = true;
      this.menuOpen = true;
    },
    closeMenuIfOpen() {
      if (this.stopCloseFlag) {
        this.stopCloseFlag = false;
      } else if (this.menuOpen) {
        this.menuOpen = false;
      }
    },
    deleteCourse() {
      this.$emit('delete-course', `${this.subject} ${this.number}`);
      this.closeMenuIfOpen();
    },
    colorCourse(color) {
      this.$emit('color-course', color, `${this.subject} ${this.number}`);
      this.closeMenuIfOpen();
    },
    updateBar() {
      if (!this.menuOpen) {
        this.$emit('updateBar', this.courseObj);
      }
    }

  },
  directives: {
    'click-outside': clickOutside
  }
};
</script>

<style scoped lang="scss">
// TODO: font families
// TODO: common variables (colors)
.course {
  width: 21.375rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  background-color: white;
  box-shadow: -4px -4px 10px #efefef, 4px 4px 10px #efefef;
  position: relative;
  height: 5.625rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &--min {
    width: 10.5rem;
    height: 2.125rem;
  }

  &-main {
    &--min {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
    }
  }

  &-color {
    width: 1.25rem;
    height: 5.625rem;
    border-radius: 0.42rem 0 0 0.42rem;
    background-color: var(--bg-color);
    display: flex;
    align-items: center;
    justify-content: center;

    &--active {
      width: 19px;
      height: 5.5rem;
    }

    &--min {
      height: 2.125rem;

      &.course-color--active {
        height: 2rem;
      }
    }
  }

  &-dotColumn {
    display: flex;
    flex-direction: column;

    &:first-child {
      margin-right: 5px;
    }
  }

  &-dotRow {
    padding: 8px 0 8px 0;
    display: flex;
    position: relative;
  }

  &-dot {
    opacity: 0.8;
    height: 2px;
    width: 2px;
    background-color: white;
    border-radius: 50%;
    display: inline-block;
    margin-bottom: 2px;
    margin-top: 2px;

    &--menu {
      width: 5px;
      height: 5px;
      background-color: #c4c4c4;
      opacity: 1;
      margin: 0 2px;
    }
  }

  &-content {
    width: 18rem;
    margin: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;


    &--min {
      width: 9.25rem;
      margin-bottom: 0;
      margin-top: 0;
      margin-right: .5rem;
    }
  }

  &-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &--min {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  }

  &-code {
    font-size: 14px;
    line-height: 17px;
    color: #858585;

    &--min {
      color: #3d3d3d;
    }
  }

  &-name {
    font-size: 16px;
    line-height: 19px;
    color: #3d3d3d;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    width: 18rem;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-info {
    font-size: 14px;
    line-height: 17px;
    color: #757575;
    display: flex;
    align-items: center;
  }

  &-semesters {
    margin-left: 0.2rem;

    &:before {
      margin-right: 0.2rem;
      font-style: normal;
      content: '|';
    }
  }

  &-iconWrapper {
    font-style: normal;
    display: flex;
    margin-left: 0.2rem;
    align-items: center;

    // TODO: styling for info icon on course card
    // &--info {
    //   &:before {
    //     margin-right: 0.2rem;
    //     font-style: normal;
    //     content: '|';
    //   }
    // }

    &--caution {
      &:before {
        margin-right: 0.2rem;
        font-style: normal;
        content: '|';
      }
    }
  }

  &-icon {
    width: 13px;

    &--info {
      margin-right: 4px;
    }
  }

  &-buttons {
    display: flex;
    justify-content: space-around;
    margin: 0.5rem;
  }

  &-menu {
    position: absolute;
    right: -3rem;
    top: 2rem;
    z-index: 1;
  }
}

.active {
  border: 1px solid #2b6693;
  height: 5.625rem;
  width: 21.375rem;

  &.course--min {
    height: 2.125rem;
    width: 10.5rem;
  }
}

// TODO: convert px to rem for spacing
/* Tooltip container */
.course-tooltip {
  position: relative;
  display: inline-block;
  // border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.course-tooltip .course-tooltiptext {
  visibility: hidden;
  width: 120px;
  color: #858585;
  background-color: #fff;
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
  left: -5.2rem;
  border: 0.75px solid #a7a7a7;
  top: 1.25rem;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;

  &--caution {
    width: 180px;
    text-align: left;
  }
}

/* Show the tooltip text when you mouse over the tooltip container */
.course-tooltip:hover .course-tooltiptext {
  visibility: visible;
}

.course-tooltip .course-tooltiptext::after {
  content: ' ';
  position: absolute;
  bottom: 100%; /* At the top of the tooltip */
  right: 82px;
  margin-left: -10px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent white transparent;
  z-index: 3;
}

.course-tooltip .course-tooltiptext::before {
  content: ' ';
  position: absolute;
  bottom: 100%; /* At the top of the tooltip */
  right: 80px;
  margin-left: -2px;
  border-width: 7px;
  border-style: solid;
  border-color: transparent transparent #a7a7a7 transparent;

  z-index: 2;
}

.course-tooltip .course-tooltiptext--info::after {
  right: 10px;
}

.course-tooltip .course-tooltiptext--info::before {
  right: 8px;
}
</style>

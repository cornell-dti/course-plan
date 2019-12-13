<template>
  <div v-bind:class="{ 'course--min': !notCompact }" class="course">
    <div class="course-color" :style="cssVars">
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
    <div v-bind:class="{ 'course-content--min': !notCompact }" class="course-content">
      <div v-bind:class="{ 'course-main--min': !notCompact }" class="course-main">
        <div class = "course-top">
          <div v-bind:class="{ 'course-code--min': !notCompact }" class="course-code">
            {{ subject }} {{ code }}
          </div>
          <div class="course-dotRow" v-on:click="openMenu">
            <span class="course-dot course-dot--menu"></span>
            <span class="course-dot course-dot--menu"></span>
            <span class="course-dot course-dot--menu"></span>
          </div>
        </div>
        <div v-if="notCompact" class="course-name">{{ name }}</div>
        <div class="course-info">
          <span v-if="notCompact" class="course-credits">{{ creditString }}</span>
          <span v-if="notCompact && semesterString" class="course-semesters">{{
            semesterString
          }}</span>
          <div v-if="notCompact" class="course-outerWrapper course-tooltip">
            <div class="course-iconWrapper course-iconWrapper--info">
              <img class="course-icon course-icon--info" src="../assets/images/info.svg" />
            </div>
            <div
              class="course-tooltiptext course-tooltiptext--info"
              v-html="requirementString"
            ></div>
          </div>
          <div class="course-outerWrapper course-tooltip">
            <div class="course-iconWrapper">
              <img class="course-icon" src="../assets/images/caution.svg" />
            </div>
            <div
              class="course-tooltiptext course-tooltiptext--caution"
              v-html="cautionString"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <coursemenu v-if="menuOpen" class="course-menu" v-on:delete-course="deleteCourse" v-on:color-course="colorCourse" v-click-outside="closeMenuIfOpen" />
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
    subject: String,
    code: Number,
    name: String,
    credits: Number,
    semesters: Array,
    color: String,
    requirementsMap: Map,
    compact: Boolean,
    id: String
  },
  data() {
    return {
      menuOpen: false,
      stopCloseFlag: false
    };
  },
  computed: {
    notCompact() {
      return !this.compact;
    },

    rqString() {
      return 'RQ';
    },

    // TODO: bold requirements
    requirementString() {
      if (
        this.requirementsMap === null
        || this.requirementsMap.keys() === null
        || this.requirementsMap.keys().length === 0
      ) {
        return '';
      }

      const keys = Array.from(this.requirementsMap.keys());
      let str = 'Satisfies ';
      const endStr = '</b> requirement';
      const { length } = keys;
      if (length === 1) {
        return `${str}<b>${keys[0]}${endStr}`;
      }

      // loop through all but the last requirement and comma separate
      for (let i = 0; i < length - 1; i += 1) {
        str += `<b>${keys[i]}</b>, `;
      }

      // remove the comma if only 2 requirements
      if (length === 2) {
        str = `${str.substring(0, str.length - 2)} `;
      }

      return `${str}and <b>${keys[length - 1]}${endStr}`;
    },

    // TODO: too much DOM manipulation that vue should fix - talk to Sam
    cautionString() {
      if (
        this.requirementsMap === null
        || this.requirementsMap.keys() === null
        || this.requirementsMap.keys().length === 0
      ) {
        return null;
      }

      let str = '';
      this.requirementsMap.forEach((courses, req) => {
        str += '<li>';
        if (courses.length === 1) {
          str += `${courses[0]} also fulfills <b>${req}</b> requirement`;
        } else {
          // loop through all but the last course and comma separate
          for (let i = 0; i < courses.length - 1; i += 1) {
            str += `${courses[i]}, `;
          }

          // remove the comma if only 2 requirements
          if (courses.length === 2) {
            str = `${str.substring(0, str.length - 2)} `;
          }

          str = `${str}and ${courses[courses.length - 1]} also fulfill <b>${req}</b> requirement`;
        }
        str += '</li>';
      });

      return str;
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
      return `https://www.cureviews.org/course/${this.subject}/${this.code}`;
    },

    // TODO: change semester from FA18
    roster() {
      return `https://classes.cornell.edu/browse/roster/FA18/class/${this.subject}/${this.code}`;
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
      this.$emit('delete-course', this.id);
    },
    colorCourse(color) {
      this.$emit('color-course', color, this.id);
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
  width: 21.25rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  background-color: white;
  box-shadow: -4px -4px 10px #efefef, 4px 4px 10px #efefef;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:active,
  &:focus {
    border: 1px solid #2b6693;
  }

  &--min {
    width: 10.5rem;
    height: 2rem;
  }

  &-main {
    width: 100%;
    margin-right: 1rem;

    &--min {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
      margin-right: 0.5rem;
    }
  }

  &-color {
    width: 1.35rem;
    border-radius: 0.5rem 0 0 0.5rem;
    background-color: var(--bg-color);
    margin-right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-dotColumn {
    display: flex;
    flex-direction: column;

    &:first-child {
      margin-right: 5px;
    }
  }

  &-dotRow{
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
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    display: flex;
    justify-content: space-between;
    width: 100%;

    &--min {
      margin-bottom: 0;
      margin-top: 0;
    }
  }

  &-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

    &--info {
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

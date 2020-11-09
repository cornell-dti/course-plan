<template>
  <div :class="{ 'course--min': compact, 'active': active }" class="course" @click="updateBar()">
    <div class="course-color" :style="cssVars" :class="{ 'course-color--active': active, 'course-color--min': compact }">
      <img src="@/assets/images/dots/sixDots.svg" alt="dots" />
    </div>
    <div :class="{ 'course-content--min': compact }" class="course-content">
      <div :class="{ 'course-main--min': compact }" class="course-main">
        <div :class="{ 'course-top--min': compact }" class="course-top">
          <div :class="{ 'course-code--min': compact }" class="course-code">
            {{ subject }} {{ number }}
          </div>
          <div class="course-dotRow" @click="openMenu">
            <img src="@/assets/images/dots/threeDots.svg" alt="dots" />
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
      :semId="semId"
      :isCompact="compact"
      class="course-menu"
      @delete-course="deleteCourse"
      @color-course="colorCourse"
      @edit-course-credit="editCourseCredit"
      :getCreditRange="getCreditRange"
      v-click-outside="closeMenuIfOpen"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import CourseMenu from '@/components/Modals/CourseMenu';
import { clickOutside } from '@/utilities';

Vue.component('coursemenu', CourseMenu);

export default {
  props: {
    courseObj: Object,
    subject: String,
    number: String,
    name: String,
    credits: Number,
    creditRange: Array,
    prereqs: String,
    semesters: Array,
    color: String,
    alerts: Object,
    compact: Boolean,
    id: String,
    uniqueID: Number,
    active: Boolean,
    semId: Number
  },
  data() {
    return {
      menuOpen: false,
      stopCloseFlag: false,
      getCreditRange: this.creditRange,
      colorJustChanged: false
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
      if (this.credits === 1) {
        return `${this.credits} credit`;
      }
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
      this.$emit('delete-course', this.subject, this.number, this.uniqueID);
      this.closeMenuIfOpen();
    },
    colorCourse(color) {
      this.$emit('color-course', color, this.uniqueID);
      this.closeMenuIfOpen();
      this.colorJustChanged = true;
    },
    updateBar() {
      if (!this.menuOpen) {
        this.$emit('updateBar', this.courseObj, this.colorJustChanged, this.color);
      }
      this.colorJustChanged = false;
    },
    editCourseCredit(credit) {
      this.$emit('edit-course-credit', credit, this.uniqueID);
      this.closeMenuIfOpen();
    }
  },
  directives: {
    'click-outside': clickOutside
  }
};
</script>

<style scoped lang="scss">
// TODO: font families
@import "@/assets/scss/_variables.scss";

.course {
  width: 21.375rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  background-color: $white;
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

  &-dotRow {
    padding: 8px 0;
    display: flex;
    position: relative;
    &:hover,
    &:active,
    &:focus {
      cursor: pointer;
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
    color: $medGray;

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

  &-credits {
    white-space: nowrap;
  }

  &-semesters {
    margin-left: 0.2rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 14rem;

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
  color: $medGray;
  background-color: $white;
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
    width: 7.5rem;
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
  right: 14px;
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
  right: 12px;
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

@media only screen and (max-width: 878px) {
  .course {
    width: 17rem;
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

    &-content {
      width: 17rem;
      &--min {
        width: 9.25rem;
        margin-bottom: 0;
        margin-top: 0;
        margin-right: .5rem;
      }
    }

    &-top {
      width: 14rem;
      &--min {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }

    &-name {
      width: 14rem;
    }

    &-menu {
      right: -1rem;
    }
  }
  .active {
    border: 1px solid #2b6693;
    height: 5.625rem;
    width: 17rem;

    &.course--min {
      height: 2.125rem;
      width: 10.5rem;
    }
  }
}
</style>

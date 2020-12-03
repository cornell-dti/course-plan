<template>
  <div
    :class="{ 'reqcourse--min': compact, completedReqCourse: isCompletedReqCourse }"
    class="reqcourse"
    :style="borderColorCSSvar"
  >
    <div
      v-if="!isCompletedReqCourse"
      class="reqcourse-color"
      :style="cssVars"
      :class="{ 'reqcourse-color--min': compact }"
    >
      <img src="@/assets/images/dots/sixDots.svg" alt="dots" />
    </div>
    <div :class="{ 'reqcourse-content--min': compact }" class="reqcourse-content">
      <div :class="{ 'reqcourse-main--min': compact }" class="reqcourse-main">
        <div :class="{ 'reqcourse-top--min': compact }" class="reqcourse-top">
          <div :class="{ 'reqcourse-code--min': compact }" class="reqcourse-code">
            {{ courseCodeLabel }}
          </div>
        </div>
        <!-- TODO: Revisit if we want this component for Incomplete Req Courses-->
        <!-- <div v-if="!compact" class="reqcourse-name">{{ name }}</div>
        <div class="reqcourse-info">
          <span v-if="!compact" class="reqcourse-credits">{{ creditString }}</span>
          <span v-if="!compact && semesterString" class="reqcourse-semesters">{{
            semesterString
          }}</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import firebase from 'firebase/app';

export default Vue.extend({
  props: {
    color: String,
    subject: String,
    number: String,
    isCompletedReqCourse: Boolean,
    compact: Boolean
  },
  computed: {
    borderColorCSSvar() {
      return {
        '--border-color': `#${this.color}`,
      };
    },
    cssVars() {
      return {
        '--bg-color': `#${this.color}`,
      };
    },
    courseCodeLabel() {
      return `${this.subject} ${this.number}`;
    }
  }
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.reqcourse {
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
    width: 10rem;
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
      margin-right: 0.5rem;
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
    width: 10rem;
  }
}

.completedReqCourse {
  border: 1px solid;
  border-color: var(--border-color);
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
      width: 10rem;
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
        margin-right: 0.5rem;
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
      width: 10rem;
    }
  }
}
</style>
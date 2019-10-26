<template>
  <div class="course">
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
    <div class="course-content">
      <div class="course-main">
        <div class="course-code">{{ subject }} {{ code }}</div>
        <div class="course-name">{{ name }}</div>
        <div class="course-info">
          <span class="course-credits">{{ creditString }}</span>
          <span :v-if="semesterString" class="course-semesters">{{ semesterString }}</span>
          <div class="course-checkmarkWrapper tooltip">
            <img :v-if="check" class="course-checkmark" src="../assets/images/checkmark.svg" />
            <div class="tooltiptext">{{ requirementString }}</div>
          </div>
        </div>
        <!-- <div class="course-buttons">
          <a class="course-button" :href="review">
            <img class="course-image" src="@/assets/cornell-logo.webp">
          </a>
          <a class="course-button" :href="roster">
            <img class="course-image" src="@/assets/dti-logo.png">
          </a>
        </div> -->
      </div>
      <div class="course-tripleDots">
        <div class="course-dotRow">
          <span class="course-dot course-dot--menu"></span>
          <span class="course-dot course-dot--menu"></span>
          <span class="course-dot course-dot--menu"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue} from "vue-property-decorator";

export default {
  props: {
    subject: String,
    code: Number, 
    name: String,
    credits: Number,
    semesters: Array,
    color: String,
    check: Boolean,
    requirement: String,
  },
  computed: {
    requirementString() {
      return "Satisfies " + this.requirement + " requirement";
    },

    semesterString() {
      let semesterString = "";
      this.semesters.forEach(semester => {
        semesterString += semester + ", "
      });
      if(semesterString.length > 0) {
        return semesterString.substring(0, semesterString.length - 2);
      }
      return semesterString;
    },

    creditString() {
      return this.credits + " credits";
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
        '--bg-color': '#' + this.color
      }
    }
  }
};
</script>


<style scoped lang="scss">
// TODO: font families
// TODO: common variables (colors)
.course
{
  width: 21.25rem;
  border-radius: .5rem;
  display: flex;
  flex-direction: row;
  background-color: white;

  &-color {
    width: 1.35rem;
    border-radius: .5rem 0 0 .5rem;
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

  &-dot {
    opacity: .5;
    height: 3px;
    width: 3px;
    background-color: white;
    border-radius: 50%;
    display: inline-block;
    margin-bottom: .312rem;

    &--menu {
      background-color: #C4C4C4;
      opacity: 1;
    }
  }

  &-content {
    margin-top: .75rem;
    margin-bottom: .75rem;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &-code {
    font-size: 14px;
    line-height: 17px;
    color: #858585;
  }

  &-name {
    font-size: 16px;
    line-height: 19px;
    color: #3D3D3D;
    margin-top: .25rem;
    margin-bottom: .25rem;
  }

  &-info {
    font-size: 14px;
    line-height: 17px;
    color: #757575;
    display: flex;
    align-items: center;
  }

  &-semesters {
    border-left: 1px #757575 solid;
    margin-left: .3rem;
    padding-left: .3rem;
  }

  &-checkmarkWrapper {
    border-left: 1px #757575 solid;
    margin-left: .3rem;
    padding-left: .3rem;
    display: flex;
  }

  // TODO: center
  &-checkmark {
    width: 16px;
  }

  &-buttons {
    display: flex;
    justify-content: space-around;
    margin: .5rem;
  }
}

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  // border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  color: #858585;
  background-color: #fff;
  text-align: center;
  padding: .5rem;
  border-radius: 6px;
  left: -5.75rem;
  border: .75px solid #A7A7A7;
 
  /* Position the tooltip text */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

.tooltip .tooltiptext::after {
  content: " ";
  position: absolute;
  bottom: 100%;  /* At the top of the tooltip */
  right: 9px;
  margin-left: -10px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent white transparent;
  z-index: 3;
}

.tooltip .tooltiptext::before {
  content: " ";
  position: absolute;
  bottom: 100%;  /* At the top of the tooltip */
  right: 7px;
  margin-left: -2px;
  border-width: 7px;
  border-style: solid;
  border-color: transparent transparent #A7A7A7 transparent;

  z-index: 2;
}

</style>

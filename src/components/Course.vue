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
        <div v-bind:class="{ 'course-code--min': !notCompact }" class="course-code">{{ subject }} {{ code }}</div>
        <div v-if="notCompact" class="course-name">{{ name }}</div>
        <div class="course-info">
          <span v-if="notCompact" class="course-credits">{{ creditString }}</span>
          <span v-if="notCompact && semesterString" class="course-semesters">{{ semesterString }}</span>
          <div v-if="notCompact" class="course-outerWrapper tooltip">
            <div class="course-iconWrapper course-iconWrapper--info">
              <img :v-if="requirements" class="course-icon course-icon--info" src="../assets/images/info.svg" />
            </div>
            <div class="tooltiptext tooltiptext--info" v-html="requirementString"></div>
          </div>
          <div class="course-outerWrapper tooltip">
            <div class="course-iconWrapper">
              <img class="course-icon" src="../assets/images/caution.svg" />
            </div>
            <div class="tooltiptext">{{ cautionString }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

export default {
  props: {
    subject: String,
    code: Number,
    name: String,
    credits: Number,
    semesters: Array,
    color: String,
    requirements: Array,
    compact: Boolean
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
      if (this.requirements == null || this.requirements.length == 0) {
        return;
      }

      let str = 'Satisfies ';
      const endStr = '</b> requirement';
      const { length } = this.requirements;
      if (length == 1) {
        return `${str}<b>${this.requirements[0]}${endStr}`;
      }

      // loop through all but the last requirement and comma separate
      for (let i = 0; i < length - 1; i++) {
        str += `<b>${this.requirements[i]}</b>, `;
      }

      // remove the comma if only 2 requirements
      if (length == 2) {
        str = `${str.substring(0, str.length - 2)} `;
      }

      return `${str}and <b>${this.requirements[length - 1]}${endStr}`;
    },

    // TODO: waiting on Emily comments
    cautionString() {

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
  box-shadow: -4px -4px 10px #EFEFEF, 4px 4px 10px #EFEFEF;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:active,
  &:focus {
    border: 1px solid #2B6693;
  }

  &--min {
    width: 10.5rem;
    height: 2rem;
  }

  &-main {
    &--min {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
      margin-right:.5rem;
    }
  }

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
    opacity: .8;
    height: 2px;
    width: 2px;
    background-color: white;
    border-radius: 50%;
    display: inline-block;
    margin-bottom: 2px;
    margin-top: 2px;

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

    &--min {
      margin-bottom: 0;
      margin-top: 0;
    }
  }

  &-code {
    font-size: 14px;
    line-height: 17px;
    color: #858585;

    &--min {
      color: #3D3D3D;
    }
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
    margin-left: .2rem;

    &:before {
      margin-right: .2rem;
      font-style: normal;
      content: '|'
    }
  }

  &-iconWrapper {
    font-style: normal;
    display: flex;
    margin-left: .2rem;
    align-items: center;

    &--info {
      &:before {
        margin-right: .2rem;
        font-style: normal;
        content: '|'
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
  left: -5.2rem;
  border: .75px solid #A7A7A7;
  top: 1.25rem;

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
  right: 22px;
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
  right: 20px;
  margin-left: -2px;
  border-width: 7px;
  border-style: solid;
  border-color: transparent transparent #A7A7A7 transparent;

  z-index: 2;
}

.tooltip .tooltiptext--info::after {
  right: 10px;
}

.tooltip .tooltiptext--info::before {
  right: 8px;
}

</style>

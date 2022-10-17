<template>
  <div class="progress">
    <div class="progress-position">
      <div class="progress-bar-container">
        <div class="progress-bar-overflow">
          <div
            class="progress-bar"
            :style="{ transform: `rotate(${45 + 180 * sumRequirements()}deg)` }"
          ></div>
        </div>
        <img class="progress-bar-caption" :src="getImage" />
      </div>
      <div class="progress-status">
        <span class="progress-status-text">{{ getProgressString }}</span>
      </div>
    </div>
    <div class="progress-text">
      <span class="progress-text-style"> You've completed: </span>
      <span class="progress-text-style" v-if="hasCollege">
        {{ collegeRequirementCount.finished }} / {{ collegeRequirementCount.needed }} College
        Requirements
      </span>
      <span class="progress-text-style" v-if="hasMajor">
        {{ majorRequirementCount.finished }} / {{ majorRequirementCount.needed }} Major
        Requirements</span
      >
      <span class="progress-text-style" v-if="hasMinor">
        {{ minorRequirementCount.finished }} / {{ minorRequirementCount.needed }} Minor
        Requirements</span
      >
      <span class="progress-text-style" v-if="hasGrad">
        {{ gradRequirementCount.finished }} / {{ gradRequirementCount.needed }} Grad
        Requirements</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import { getCollegeFullName, getMajorFullName } from '@/utilities';
import { AdvisorPackage } from '@/requirements/tools-types';
import getAdvisor from '@/requirements/tools-utilities';
import confetti from '@/assets/images/progress_tracker/confetti.svg';
import fire from '@/assets/images/progress_tracker/fire.svg';
import flex from '@/assets/images/progress_tracker/flex.svg';
import hands from '@/assets/images/progress_tracker/hands_raised.svg';
import star from '@/assets/images/progress_tracker/star.svg';
import introJs from 'intro.js';

export default defineComponent({
  data() {
    return {
      progressImg: {
        Confetti: confetti,
        Fire: fire,
        Flex: flex,
        Hands: hands,
        Star: star,
      },
      hasCollege: false,
      hasMajor: false,
      hasMinor: false,
      hasGrad: false,
      collegeRequirementCount: {
        finished: 0,
        needed: 0,
      },
      majorRequirementCount: {
        finished: 0,
        needed: 0,
      },
      minorRequirementCount: {
        finished: 0,
        needed: 0,
      },
      gradRequirementCount: {
        finished: 0,
        needed: 0,
      },
    };
  },
  methods: {
    queryRequirements(): any {
      this.requirements.forEach(req => {
        let totalRequired = 0,
          totalCompleted = 0;
        req.reqs.forEach(req => {
          if (!(req.fulfillment.fulfilledBy === 'self-check')) {
            totalRequired += 1 + Object.values(req.fulfillment.additionalRequirements ?? {}).length;
          }
          [req.fulfillment, ...Object.values(req.fulfillment.additionalRequirements ?? {})].forEach(
            reqOrNestedReq => {
              if (reqOrNestedReq.safeMinCountFulfilled >= reqOrNestedReq.minCountRequired) {
                totalCompleted += 1;
              } else {
                totalCompleted +=
                  reqOrNestedReq.safeMinCountFulfilled / reqOrNestedReq.minCountRequired;
              }
            }
          );
        });
        switch (req.groupName) {
          case 'College':
            this.hasCollege = true;
            this.collegeRequirementCount.finished = totalCompleted;
            this.collegeRequirementCount.needed = totalRequired;
            break;
          case 'Major':
            this.hasMajor = true;
            this.majorRequirementCount.finished = totalCompleted;
            this.majorRequirementCount.needed = totalRequired;
            break;
          case 'Minor':
            this.hasMinor = true;
            this.minorRequirementCount.finished = totalCompleted;
            this.minorRequirementCount.needed = totalRequired;
            break;
          case 'Grad':
            this.hasGrad = true;
            this.gradRequirementCount.finished = totalCompleted;
            this.gradRequirementCount.needed = totalRequired;
            break;
        }
      });
    },
    sumRequirements(): number {
      let totalRequired =
        this.collegeRequirementCount.needed +
        this.majorRequirementCount.needed +
        this.minorRequirementCount.needed +
        this.gradRequirementCount.needed;
      let totalCompleted =
        this.collegeRequirementCount.finished +
        this.majorRequirementCount.finished +
        this.minorRequirementCount.finished +
        this.gradRequirementCount.finished;
      return totalCompleted / totalRequired;
    },
  },
  computed: {
    progressValue(): String {
      return 'transform: rotate(63deg)';
      // return 45 + 1.8 * this['progress-info'];
    },
    requirements(): readonly GroupedRequirementFulfillmentReport[] {
      return store.state.groupedRequirementFulfillmentReport;
    },

    getTransform(): string {
      return 'transform: rotate(63deg)';
    },
    getImage(): string {
      this.queryRequirements();
      let progress = this.sumRequirements();
      if (progress < 0.2) {
        return this.progressImg['Hands'];
      } else if (progress < 0.4) {
        return this.progressImg['Flex'];
      } else if (progress < 0.6) {
        return this.progressImg['Star'];
      } else if (progress < 0.8) {
        return this.progressImg['Fire'];
      }
      return this.progressImg['Confetti'];
    },
    getProgressString(): string {
      let progress = this.sumRequirements;
      return 'You are almost there!';
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.progress {
  height: 100%;
  width: 100%;
  background-color: #ffffff;

  &-position {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 2;
    margin: 0 0 0 0;
    position: relative;
    margin-bottom: 4px;
  }

  &-bar-container {
    position: relative;
    margin: 4px;
    float: left;
    text-align: center;
    flex-grow: 2;
    margin-bottom: -100px;
  }

  &-bar-overflow {
    /* Wraps the rotating .bar */
    position: relative;
    overflow: hidden; /* Comment this line to understand the trick */
    width: 100%;
    height: 75px; /* Half circle (overflow) */
    margin-bottom: -45px; /* bring the numbers up */
    z-index: 0;
  }
  &-bar {
    position: absolute;
    top: 0;
    left: 17%;
    width: 150px;
    height: 150px; /* full circle! */
    border-radius: 50%;
    box-sizing: border-box;
    color: #ffffff;
    background-color: #ffffff;
    border: 5px solid #eee; /* half gray, */
    border-bottom-color: #0bf; /* half azure */
    border-right-color: #0bf;
  }

  &-bar-caption {
    height: 50px;
    width: 50px;
    position: relative;
    z-index: 2;
  }

  &-status {
    flex-grow: 1;
  }

  &-status-text {
    position: absolute;
    left: 25%;
    font-family: 'Proxima Nova';
    font-style: normal;
    font-size: 14px;
    line-height: 15px;
    /* identical to box height */
    text-align: center;
    color: #92c3e6;
  }

  &-text-style {
    font-family: 'Proxima Nova';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    /* identical to box height */
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: #000000;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  &-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
  }
}
</style>

<template>
  <div class="progress">
    <div class="progress-position">
      <div class="progress-bar-container">
        <div class="progress-bar-overflow">
          <div class="progress-bar" :style="progressBarStyle"></div>
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
import confetti from '@/assets/images/progress_tracker/confetti.svg';
import fire from '@/assets/images/progress_tracker/fire.svg';
import flex from '@/assets/images/progress_tracker/flex.svg';
import hands from '@/assets/images/progress_tracker/hands_raised.svg';
import star from '@/assets/images/progress_tracker/star.svg';

export default defineComponent({
  data() {
    return {
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
    queryRequirements(): void {
      for (const { reqs, groupName } of this.requirements) {
        let totalRequired = 0;
        let totalCompleted = 0;
        for (const { fulfillment } of reqs) {
          const additionalRequirements = Object.values(fulfillment.additionalRequirements ?? {});
          if (fulfillment.fulfilledBy !== 'self-check') {
            totalRequired += 1 + additionalRequirements.length;
          }
          const mixedRequirements = [fulfillment, ...additionalRequirements];
          for (const mixedReq of mixedRequirements) {
            if (mixedReq.safeMinCountFulfilled >= mixedReq.minCountRequired) {
              totalCompleted += 1;
            }
          }
        }
        switch (groupName) {
          case 'College':
            this.hasCollege = true;
            this.collegeRequirementCount.finished = Math.round(totalCompleted * 10) / 10;
            this.collegeRequirementCount.needed = Math.round(totalRequired * 10) / 10;
            break;
          case 'Major':
            this.hasMajor = true;
            this.majorRequirementCount.finished = Math.round(totalCompleted * 10) / 10;
            this.majorRequirementCount.needed = Math.round(totalRequired * 10) / 10;
            break;
          case 'Minor':
            this.hasMinor = true;
            this.minorRequirementCount.finished = Math.round(totalCompleted * 10) / 10;
            this.minorRequirementCount.needed = Math.round(totalRequired * 10) / 10;
            break;
          case 'Grad':
            this.hasGrad = true;
            this.gradRequirementCount.finished = Math.round(totalCompleted * 10) / 10;
            this.gradRequirementCount.needed = Math.round(totalRequired * 10) / 10;
            break;
          default:
            break;
        }
      }
    },
  },
  computed: {
    requirements(): readonly GroupedRequirementFulfillmentReport[] {
      return store.state.groupedRequirementFulfillmentReport;
    },
    progress(): number {
      const totalRequired =
        this.collegeRequirementCount.needed +
        this.majorRequirementCount.needed +
        this.minorRequirementCount.needed +
        this.gradRequirementCount.needed;
      const totalCompleted =
        this.collegeRequirementCount.finished +
        this.majorRequirementCount.finished +
        this.minorRequirementCount.finished +
        this.gradRequirementCount.finished;
      return totalCompleted / totalRequired;
    },
    getImage(): string {
      this.queryRequirements();
      if (this.progress < 0.2) {
        return hands;
      }
      if (this.progress < 0.4) {
        return flex;
      }
      if (this.progress < 0.6) {
        return star;
      }
      if (this.progress < 0.8) {
        return fire;
      }
      return confetti;
    },
    progressBarStyle(): Record<string, string> {
      return {
        transform: `rotate(${45 + 180 * this.progress}deg)`,
      };
    },
    getProgressString(): string {
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
    position: relative;
    margin-bottom: 0.25rem;
  }

  &-bar-container {
    position: relative;
    margin: 0.25rem;
    float: left;
    text-align: center;
    flex-grow: 2;
    margin-bottom: -6.25rem;
  }

  &-bar-overflow {
    /* Wraps the rotating .bar */
    position: relative;
    overflow: hidden; /* Comment this line to understand the trick */
    width: 100%;
    height: 4.688rem; /* Half circle (overflow) */
    margin-bottom: -2.813rem; /* bring the numbers up */
    z-index: 0;
  }
  &-bar {
    position: absolute;
    top: 0;
    left: 20%;
    width: 9.375rem;
    height: 9.375rem; /* full circle! */
    border-radius: 50%;
    box-sizing: border-box;
    color: #ffffff;
    background-color: #ffffff;
    border: 0.313rem solid #eee; /* half gray, */
    border-bottom-color: #0bf; /* half azure */
    border-right-color: #0bf;
  }

  &-bar-caption {
    height: 3.125rem;
    width: 3.125rem;
    position: relative;
    z-index: 2;
  }

  &-status {
    flex-grow: 1;
  }

  &-status-text {
    position: absolute;
    left: 30%;
    font: '14px normal Proxima Nova';
    /* identical to box height */
    text-align: center;
    color: #92c3e6;
  }

  &-text-style {
    font: '14px normal Proxima Nova';
    line-height: 1rem;
    /* identical to box height */
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: #000000;
    margin-top: 0.625rem;
    margin-bottom: 0.625rem;
  }
  &-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
  }
}
</style>

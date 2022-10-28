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
      <div v-for="(req, index) in requirementProgressBundles" :key="index" class="progress-row">
        <span class="progress-reqname progress-text-style"
          >{{ Math.floor(req.safeProgress) }} / {{ req.totalRequired }}</span
        >
        <span class="progress-numfulfilled progress-text-style">
          {{ req.groupName }} Requirements
        </span>
      </div>
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
import {
  groupedRequirementDangerouslyFulfilled,
  groupedRequirementTotalDangerousRequirementProgress,
  groupedRequirementTotalRequired,
  groupedRequirementTotalSafeRequirementProgress,
} from '@/requirements/requirement-frontend-computation';

export default defineComponent({
  computed: {
    requirementProgressBundles(): GroupedRequirementFulfillmentReportWithProgress[] {
      return store.state.groupedRequirementFulfillmentReport.map(req => ({
        ...req,
        dangerouslyFulfilled: groupedRequirementDangerouslyFulfilled(req),
        totalRequired: groupedRequirementTotalRequired(req),
        safeProgress: groupedRequirementTotalSafeRequirementProgress(req),
        dangerousProgress: groupedRequirementTotalDangerousRequirementProgress(req),
      }));
    },
    safeProgress() {
      let totalRequired = 0;
      let totalCompleted = 0;
      this.requirementProgressBundles.forEach(req => {
        totalRequired += req.safeProgress;
        totalCompleted += req.totalRequired;
      });
      return totalCompleted / (100 * totalRequired);
    },
    dangerousProgress() {
      let totalRequired = 0;
      let totalCompleted = 0;
      this.requirementProgressBundles.forEach(req => {
        totalRequired += req.dangerousProgress;
        totalCompleted += req.totalRequired;
      });
      return totalCompleted / totalRequired;
    },
    getImage(): string {
      if (this.safeProgress < 0.2) {
        return hands;
      }
      if (this.safeProgress < 0.4) {
        return flex;
      }
      if (this.safeProgress < 0.6) {
        return star;
      }
      if (this.safeProgress < 0.8) {
        return fire;
      }
      return confetti;
    },
    progressBarStyle(): Record<string, string> {
      return {
        transform: `rotate(${45 + 180 * this.safeProgress}deg)`,
      };
    },
    getProgressString(): string {
      if (this.safeProgress < 0.2) {
        return 'Strong start!';
      }
      if (this.safeProgress < 0.4) {
        return 'Solid progress!';
      }
      if (this.safeProgress < 0.6) {
        return 'Good work!';
      }
      if (this.safeProgress < 0.8) {
        return 'Almost there!';
      }
      return 'Congrats!';
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

  &-row {
    display: grid;
    grid-template-columns: 20% 80%;
    justify-content: space-evenly;
  }

  &-reqname {
    grid-column-start: 1;
    grid-column-end: 1;
  }

  &-numfulfilled {
    grid-column-start: 2;
    grid-column-end: 2;
  }

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
    position: absolute;
    overflow: hidden; /* Comment this line to understand the trick */
    width: 100%;
    height: 4.688rem; /* Half circle (overflow) */
    margin-top: 2rem;
    z-index: 0;
    display: flex;
    justify-content: center;
  }

  &-bar {
    //position: absolute;
    //top: 0;
    //left: 20%;
    width: 9.375rem;
    height: 9.375rem; /* full circle! */
    border-radius: 50%;
    box-sizing: border-box;
    color: #ffffff;
    background-color: #ffffff;
    border: 0.5rem solid #eee; /* half gray, */
    border-bottom-color: #0bf; /* half azure */
    border-right-color: #0bf;
  }

  &-bar-caption {
    height: 3.125rem;
    width: 3.125rem;
    position: absolute;
    z-index: 2;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 3.7rem;
  }

  &-status {
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }

  &-status-text {
    margin-top: 1rem;
    //position: absolute;
    //left: 30%;
    font: '14px normal Proxima Nova';
    /* identical to box height */
    text-align: center;
    color: #92c3e6;
    z-index: 1;
    margin-top: 8.7rem;
  }

  &-text-style {
    font: '14px normal Proxima Nova';
    line-height: 1rem;
    /* identical to box height */
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: #000000;
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

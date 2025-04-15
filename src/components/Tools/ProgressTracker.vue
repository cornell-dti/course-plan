<template>
  <div class="progress">
    <div class="progress-position">
      <div class="progress-bar-container">
        <div class="progress-bar-overflow">
          <div class="progress-bar" :style="progressBarStyle"></div>
        </div>
        <img class="progress-bar-caption" :src="emoji" />
      </div>
      <div class="progress-status">
        <span class="progress-status-text">{{ progressMessage }}</span>
      </div>
    </div>
    <div class="progress-text">
      <span class="progress-text-style"> You've completed: </span>
      <div v-for="(req, index) in requirementProgressBundles" :key="index" class="progress-row">
        <span class="progress-numfulfilled progress-text-style">
          {{ req.dangerouslyFulfilled }} / {{ req.totalRequired }}
        </span>
        <span class="progress-reqname progress-text-style">
          {{ requirementProgressString(req.specific, req.groupName) }}
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
import { getCollegeAbbrev, getMajorAbbrev, getMinorAbbrev, getGradAbbrev } from '../../data';
import { sumBy } from '@/utilities';

/** Discrete progress towards completing requirements */
enum ProgressState {
  Zero,
  First,
  Second,
  Third,
  Fourth,
  Fifth,
}

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
    safeProgress(): number {
      return sumBy(this.requirementProgressBundles, req => req.safeProgress);
    },
    dangerousProgress(): number {
      return sumBy(this.requirementProgressBundles, req => req.dangerouslyFulfilled);
    },
    totalRequired(): number {
      return sumBy(this.requirementProgressBundles, req => req.totalRequired);
    },
    progressState(): ProgressState {
      if (this.dangerousProgress === 0) {
        return ProgressState.Zero;
      }
      if (this.dangerousProgress / this.totalRequired < 0.25) {
        return ProgressState.First;
      }
      if (this.dangerousProgress / this.totalRequired < 0.5) {
        return ProgressState.Second;
      }
      if (this.dangerousProgress / this.totalRequired < 0.75) {
        return ProgressState.Third;
      }
      if (this.dangerousProgress / this.totalRequired < 1.0) {
        return ProgressState.Fourth;
      }
      return ProgressState.Fifth;
    },
    emoji(): string {
      switch (this.progressState) {
        case ProgressState.Zero:
          return hands;
        case ProgressState.First:
          return hands;
        case ProgressState.Second:
          return flex;
        case ProgressState.Third:
          return star;
        case ProgressState.Fourth:
          return fire;
        case ProgressState.Fifth:
          return confetti;
        default:
          throw new Error();
      }
    },
    progressBarStyle(): Record<string, string> {
      return {
        transform: `rotate(${45 + (180 * this.dangerousProgress) / this.totalRequired}deg)`,
      };
    },
    progressMessage(): string {
      switch (this.progressState) {
        case ProgressState.Zero:
          return "Let's get started!";
        case ProgressState.First:
          return 'Strong start!';
        case ProgressState.Second:
          return 'Solid progress!';
        case ProgressState.Third:
          return 'Good work!';
        case ProgressState.Fourth:
          return 'Almost there!';
        case ProgressState.Fifth:
          return 'Congrats!';
        default:
          throw new Error();
      }
    },
  },
  methods: {
    requirementProgressString(req: string, reqGroup: string): string {
      switch (reqGroup) {
        case 'College':
          return `${getCollegeAbbrev(req)} ${reqGroup} Requirements`;
        case 'Major':
          return `${getMajorAbbrev(req)} ${reqGroup} Requirements`;
        case 'Minor':
          return `${getMinorAbbrev(req)} ${reqGroup} Requirements`;
        case 'Grad':
          return `${getGradAbbrev(req)} ${reqGroup} Requirements`;
        default:
          return '';
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.progress {
  height: min-content;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-wrap: wrap;

  &-row {
    display: grid;
    grid-template-columns: 15% 85%;
    justify-content: space-evenly;
  }

  &-numfulfilled {
    grid-column-start: 1;
    grid-column-end: 1;
    font-weight: bolder;
  }

  &-reqname {
    grid-column-start: 2;
    grid-column-end: 2;
  }

  &-position {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
    margin-bottom: 0.25rem;
    min-width: 220px;
  }

  &-bar {
    width: 9.375rem;
    height: 9.375rem;
    border-radius: 50%;
    box-sizing: border-box;
    color: white;
    background-color: white;
    border: 0.5rem solid #eee;
    border-bottom-color: sangBlue;
    border-right-color: sangBlue;

    &-caption {
      height: 3.125rem;
      width: 3.125rem;
      position: absolute;
      z-index: 1;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 1.7rem;
    }

    &-container {
      position: relative;
      float: left;
      text-align: center;
      height: 75px;
    }

    &-overflow {
      position: absolute;
      overflow: hidden;
      width: 100%;
      height: 75px;
      z-index: 0;
      display: flex;
      justify-content: center;
    }
  }

  &-status {
    display: flex;
    justify-content: center;
    height: 1rem;
    margin-top: 1rem;

    &-text {
      text-align: center;
      color: $sangBlue;
      z-index: 1;
      font-weight: bolder;
    }
  }

  &-text {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: flex-start;
    padding-top: 1rem;

    &-style {
      font-size: 14px;
      line-height: 1rem;
      display: flex;
      align-items: center;
      letter-spacing: 0.01em;
      color: #000000;
      margin-bottom: 0.625rem;
    }
  }
}
</style>

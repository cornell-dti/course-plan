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
          {{ req.specific }} {{ req.groupName }} Requirements
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
import { sumBy } from '@/utilities';

/** Discrete progress towards completing requirements */
enum ProgressState {
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
    grid-template-columns: 20% 80%;
    justify-content: space-evenly;
  }

  &-numfulfilled {
    grid-column-start: 1;
    grid-column-end: 1;
    font-weight: 900;
  }

  &-reqname {
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
    min-height: 150px;
    min-width: 200px;
  }

  &-bar {
    width: 9.375rem;
    height: 9.375rem; /* full circle! */
    border-radius: 50%;
    box-sizing: border-box;
    color: #ffffff;
    background-color: #ffffff;
    border: 0.5rem solid #eee; /* half gray, */
    border-bottom-color: #0bf; /* half azure */
    border-right-color: #0bf;

    &-caption {
      height: 3.125rem;
      width: 3.125rem;
      position: absolute;
      z-index: 2;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 3.7rem;
    }

    &-container {
      position: relative;
      float: left;
      text-align: center;
      flex-grow: 2;
      margin: 0.25rem 0.25rem -6.25rem;
    }

    &-overflow {
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
  }

  &-status {
    flex-grow: 1;
    display: flex;
    justify-content: center;

    &-text {
      margin-top: 1rem;
      /* identical to box height */
      text-align: center;
      color: #0bf;
      z-index: 1;
      margin-top: 8.7rem;
    }
  }

  &-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;

    &-style {
      font-size: 14px;
      line-height: 1rem;
      /* identical to box height */
      display: flex;
      align-items: center;
      letter-spacing: 0.01em;
      color: #000000;
      margin-bottom: 0.625rem;
    }
  }
}
</style>

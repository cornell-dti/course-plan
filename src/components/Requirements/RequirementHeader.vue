<template>
  <div class="requirementheader">
    <!-- TODO change for multiple colleges -->
    <h1
      v-if="
        reqIndex <= numOfColleges ||
        reqIndex == numOfColleges + onboardingData.major.length ||
        req.groupName === 'Grad'
      "
      class="col top p-0"
    >
      {{ req.groupName }} Requirements
    </h1>
    <!-- TODO change for multiple colleges -->
    <div v-if="req.groupName === 'College'" class="college">
      <button
        :style="{
          'border-bottom': `2px solid #${getReqColor(req.groupName, onboardingData)}`,
        }"
        class="college-title-button college-title full-opacity-on-hover"
        :disabled="true"
      >
        <p
          :style="{
            'font-weight': 500,
            color: `#${getReqColor(req.groupName, onboardingData)}`,
          }"
          class="college-title-top"
        >
          {{ getCollegeFullName(onboardingData.college) }}
        </p>
      </button>
    </div>
    <!-- TODO change for multiple colleges -->
    <div v-if="reqIndex === numOfColleges && req.groupName === 'Major'" class="major">
      <button
        :style="{
          'border-bottom':
            id === displayedMajorIndex
              ? `2px solid #${getReqColor(req.groupName, onboardingData)}`
              : '',
        }"
        @click="activateMajor(id)"
        :class="[
          { 'full-opacity-on-hover': onboardingData.major.length === 1 },
          'major-title-button major-title',
        ]"
        v-for="(major, id) in onboardingData.major"
        :key="id"
        :disabled="id === displayedMajorIndex"
      >
        <p
          :style="{
            'font-weight': id === displayedMajorIndex ? 500 : undefined,
            color:
              id === displayedMajorIndex ? `#${getReqColor(req.groupName, onboardingData)}` : '',
          }"
          class="major-title-top"
          data-cyId="majorTitle"
        >
          {{ getMajorFullName(major) }}
        </p>
        <p
          :style="{
            color:
              id === displayedMajorIndex ? `#${getReqColor(req.groupName, onboardingData)}` : '',
          }"
          class="major-title-bottom"
          data-cyId="collegeTitle"
        >
          ({{ getCollegeFullName(onboardingData.college) }})
        </p>
      </button>
    </div>
    <div
      v-if="reqIndex == numOfColleges + onboardingData.major.length && req.groupName === 'Minor'"
      class="minor"
    >
      <button
        :style="{
          'border-bottom':
            id === displayedMinorIndex
              ? `2px solid #${getReqColor(req.groupName, onboardingData)}`
              : '',
        }"
        @click="activateMinor(id)"
        :class="[
          { 'full-opacity-on-hover': onboardingData.minor.length === 1 },
          'major-title major-title-button',
        ]"
        v-for="(minor, id) in onboardingData.minor"
        :key="id"
        :disabled="id === displayedMinorIndex"
      >
        <p
          :style="{
            'font-weight': id === displayedMinorIndex ? 500 : undefined,
            color:
              id === displayedMinorIndex ? `#${getReqColor(req.groupName, onboardingData)}` : '',
          }"
          class="minor-title-top"
        >
          {{ getMinorFullName(minor) }}
        </p>
        <!-- <p :style="{'color': minor.display ? `#${reqGroupColorMap[req.group][0]}` : ''}" class="minor-title-bottom">({{user.collegeFN}})</p> Change for multiple colleges -->
      </button>
    </div>
    <div v-if="req.groupName === 'Grad'" class="grad">
      <button
        :style="{
          'border-bottom': `2px solid #${getReqColor(req.groupName, onboardingData)}`,
        }"
        class="grad-title-button grad-title full-opacity-on-hover"
        :disabled="true"
      >
        <p
          :style="{
            'font-weight': 500,
            color: `#${getReqColor(req.groupName, onboardingData)}`,
          }"
          class="grad-title-top"
        >
          {{ getGradFullName(onboardingData.grad) }}
        </p>
      </button>
    </div>

    <!-- progress bar settings -->
    <div v-if="showMajorOrMinorRequirements">
      <div class="progress">
        <div
          class="progress-bar"
          :style="{
            'background-color': `#${getReqColor(req.groupName, onboardingData)}`,
            width: safeProgressWidth,
          }"
          role="progressbar"
          aria-label="Requirements Safe Progress"
          :aria-valuenow="safeProgressWidthValue"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
        <div
          v-if="conflictsEnabled"
          class="progress-bar progress-bar--warning"
          :style="{ width: dangerousProgressWidth }"
          role="progressbar"
          aria-label="Requirements Conflict Progress"
          :aria-valuenow="dangerousProgressWidthValue"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      <div class="progress-text">
        <progress-bar-caution
          class="caution"
          :numConflicts="numberConflictsRounded"
        ></progress-bar-caution>
        <span class="progress-text-credits"
          >{{ requirementDangerouslyFulfilled }}/{{ requirementTotalRequired }}</span
        >
        <span class="progress-text-text"> Total Requirements Inputted on Schedule</span>
      </div>

      <!--View more college requirements -->
      <button
        class="view-more-dropdown"
        @click="toggleDetails()"
        :aria-expanded="displayDetails"
        data-cyId="requirements-viewMore"
      >
        <svg
          class="view-more-chevron"
          :class="{ 'view-more-chevron--closed': !displayDetails }"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.33"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
        <div class="req-name">
          {{ displayDetails ? 'Hide' : 'View' }} all {{ req.groupName.toLowerCase() }} requirements
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import ProgressBarCaution from '@/components/Requirements/ProgressBarCaution.vue';
import {
  getCollegeFullName,
  getMajorFullName,
  getMinorFullName,
  getGradFullName,
  getReqColor,
} from '@/utilities';
import featureFlagCheckers from '@/feature-flags';
import {
  groupedRequirementDangerouslyFulfilled,
  groupedRequirementTotalDangerousRequirementProgress,
  groupedRequirementTotalRequired,
  groupedRequirementTotalSafeRequirementProgress,
} from '@/requirements/requirement-frontend-computation';

export default defineComponent({
  components: { ProgressBarCaution },
  props: {
    reqIndex: { type: Number, required: true },
    displayDetails: { type: Boolean, required: true },
    displayedMajorIndex: { type: Number, required: true },
    displayedMinorIndex: { type: Number, required: true },
    req: { type: Object as PropType<GroupedRequirementFulfillmentReport>, required: true },
    onboardingData: { type: Object as PropType<AppOnboardingData>, required: true },
    showMajorOrMinorRequirements: { type: Boolean, required: true },
    numOfColleges: { type: Number, required: true },
  },
  emits: {
    activateMajor(id: number) {
      return typeof id === 'number';
    },
    activateMinor(id: number) {
      return typeof id === 'number';
    },
    toggleDetails() {
      return true;
    },
  },
  computed: {
    conflictsEnabled(): boolean {
      return featureFlagCheckers.isRequirementConflictsEnabled();
    },
    requirementDangerouslyFulfilled(): number {
      return groupedRequirementDangerouslyFulfilled(this.req);
    },
    requirementTotalRequired(): number {
      return groupedRequirementTotalRequired(this.req);
    },
    totalSafeRequirementProgress(): number {
      return groupedRequirementTotalSafeRequirementProgress(this.req);
    },
    totalDangerousRequirementProgress(): number {
      return groupedRequirementTotalDangerousRequirementProgress(this.req);
    },
    // the sum of the progress of each requirement, divided by number of requirements
    safeProgressWidth(): string {
      return `${(this.totalSafeRequirementProgress / this.requirementTotalRequired) * 100}%`;
    },
    dangerousProgressWidth(): string {
      const diff = this.numberConflicts;
      return `${(diff / this.requirementTotalRequired) * 100}%`;
    },
    safeProgressWidthValue(): string {
      return ((this.totalSafeRequirementProgress / this.requirementTotalRequired) * 100).toFixed(1);
    },
    dangerousProgressWidthValue(): string {
      const diff = this.numberConflicts;
      return ((diff / this.requirementTotalRequired) * 100).toFixed(1);
    },
    numberConflicts(): number {
      return this.conflictsEnabled
        ? this.totalDangerousRequirementProgress - this.totalSafeRequirementProgress
        : 0;
    },
    numberConflictsRounded(): number {
      return Math.ceil(this.numberConflicts);
    },
  },
  methods: {
    getCollegeFullName,
    getMajorFullName,
    getMinorFullName,
    getGradFullName,
    getReqColor,
    toggleDetails() {
      this.$emit('toggleDetails');
    },
    activateMajor(id: number) {
      this.$emit('activateMajor', id);
    },
    activateMinor(id: number) {
      this.$emit('activateMinor', id);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_tokens.scss';

.requirementheader {
  @include cp-font;
}

// section title, e.g. "Major Requirements"
h1.top {
  @include cp-text(14px, 20px, 600);
  color: $cp-ink;
  margin: 20px 0 12px;
}

// program tabs (college / majors / minors / grad); the active one keeps the group color
.college,
.major,
.minor,
.grad {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid $cp-line;

  &-title {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $cp-muted;
    padding: 6px 8px;
    margin-bottom: -1px;

    &-button {
      @include cp-reset-button;
      border-radius: $cp-r-sm $cp-r-sm 0 0;
      text-align: center;
      transition: background-color 100ms;

      &:not(:disabled):hover {
        background: $cp-hover;
        color: $cp-ink;
      }

      &:disabled {
        cursor: default;
      }

      p {
        flex-direction: column;
      }
    }

    &-top {
      @include cp-text(13px, 18px, 500);
      margin: 0;
    }

    &-bottom {
      @include cp-text(11px, 14px);
      margin: 0;
    }
  }
}

.progress {
  display: flex;
  height: 6px;
  border-radius: 999px;
  background: $cp-wash;
  overflow: hidden;

  &-bar {
    border-radius: 999px;
    transition: width 300ms ease-out;

    &--warning {
      background-color: $cp-warn-line;
    }
  }
}

.progress-text {
  @include cp-text(12px, 16px);
  margin: 6px 0 0;
  color: $cp-muted;
  display: flex;
  align-items: center;

  &-credits {
    font-weight: 600;
    color: $cp-ink;
    margin-right: 4px;
  }
}

// "View all … requirements": the V2 expand row
.view-more-dropdown {
  @include cp-reset-button;
  width: calc(100% + 16px);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px -8px 4px;
  padding: 8px;
  border-radius: $cp-r-sm;
  color: $cp-ink;
  text-align: left;
  transition: background-color 100ms;

  &:hover {
    background: $cp-hover;
  }

  &:active {
    background: $cp-press;
  }
}

.view-more-chevron {
  flex-shrink: 0;
  color: $cp-muted;
  transition: transform 200ms;

  &--closed {
    transform: rotate(-90deg);
  }
}

.req-name {
  @include cp-text(13px, 18px, 600);
  flex: 1;
}

.caution {
  margin-right: 4px;
}
</style>

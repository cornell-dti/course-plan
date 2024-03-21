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
        class="btn row top view-more-dropdown"
        @click="toggleDetails()"
        aria-haspopup="true"
        data-toggle="dropdown"
        data-cyId="requirements-viewMore"
      >
        <div
          class="col-1 p-0 btn"
          :style="{ color: `#${getReqColor(req.groupName, onboardingData)}` }"
        >
          <drop-down-arrow
            :isFlipped="displayDetails"
            :fillColor="`#${getReqColor(req.groupName, onboardingData)}`"
            :isHeader="true"
          />
        </div>
        <div
          class="req-name col p-0"
          :style="{ color: `#${getReqColor(req.groupName, onboardingData)}` }"
        >
          {{ displayDetails ? 'Hide' : 'View' }} All {{ req.groupName }} Requirements
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import DropDownArrow from '@/components/DropDownArrow.vue';
import ProgressBarCaution from '@/components/Requirements/ProgressBarCaution.vue';
import { getReqColor } from '@/utilities';
import {
  getCollegeFullName,
  getMajorFullName,
  getMinorFullName,
  getGradFullName,
} from '@/store-utilities';
import featureFlagCheckers from '@/feature-flags';
import {
  groupedRequirementDangerouslyFulfilled,
  groupedRequirementTotalDangerousRequirementProgress,
  groupedRequirementTotalRequired,
  groupedRequirementTotalSafeRequirementProgress,
} from '@/requirements/requirement-frontend-computation';

export default defineComponent({
  components: { DropDownArrow, ProgressBarCaution },
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

.college,
.major,
.minor,
.grad {
  display: flex;
  padding-bottom: 25px;

  &-title {
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    color: $lightPlaceholderGray;
    padding-bottom: 6px;

    &-button {
      border: none;
      background: none;
      text-align: center;
      display: flex;
      align-items: center;

      p {
        flex-direction: column;
      }
    }

    &-top {
      text-align: center;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      margin: 0;
    }

    &-bottom {
      text-align: center;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 15px;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.btn {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &-2 {
    padding-top: 0px;
    margin: 0px;
  }
}

.row {
  margin: 0;
}

.row > div {
  padding: 0;
}

.progress {
  border-radius: 1rem;
  height: 10px;

  &-bar {
    &--warning {
      background-color: $conflictWarning;
    }
  }
}

.top {
  margin: 1.5rem 0 1rem 0;

  &-small {
    margin: 0px;
  }
}

.major {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: $darkGray;

  &-college {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;
    color: $darkGray;
  }
}

button.active {
  color: $sangBlue;
  border-bottom: solid 10px $sangBlue;
  padding-bottom: 2px;
  margin: 5px;
}

.progress-text {
  margin: 0.3125rem 0 0 0;
  font-size: 12px;
  color: $darkGray;
  display: flex;

  &-credits {
    font-weight: bold;
    margin-right: 0.2rem;
  }

  &-text {
    font-weight: normal;
  }
}

button.view {
  margin: 0.7rem 0 2rem 0;
  min-height: 40px;
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  color: white;
  text-transform: uppercase;
}

.dropdown {
  height: 5px;
  width: 5px;
}

.button-dropdown {
  background-color: transparent;
  color: transparent;
  outline-style: transparent;
}

.req {
  &-name {
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    width: 100%;
    text-align: left;
  }
}

.view-more-dropdown {
  width: 100%;

  div:first-child {
    justify-content: flex-start;
  }
}

.caution {
  padding-top: 1px;
  margin-right: 0.2rem;
}
</style>

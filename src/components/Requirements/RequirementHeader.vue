<template>
  <div class="requirementheader">
    <!-- TODO change for multiple colleges -->
    <h1
      v-if="reqIndex <= numOfColleges || reqIndex == numOfColleges + onboardingData.major.length"
      class="col top p-0"
    >
      {{ req.groupName }} Requirements
    </h1>
    <!-- TODO change for multiple colleges -->
    <div v-if="reqIndex === 0" class="college">
      <button
        :style="{
          'border-bottom': `2px solid #${reqGroupColorMap[req.groupName][0]}`,
        }"
        class="college-title-button college-title full-opacity-on-hover"
        :disabled="true"
      >
        <p
          :style="{
            'font-weight': '500',
            color: `#${reqGroupColorMap[req.groupName][0]}`,
          }"
          class="college-title-top"
        >
          {{ getCollegeFullName(onboardingData.college) }}
        </p>
      </button>
    </div>
    <!-- TODO change for multiple colleges -->
    <div v-if="reqIndex === numOfColleges" class="major">
      <button
        :style="{
          'border-bottom':
            id === displayedMajorIndex ? `2px solid #${reqGroupColorMap[req.groupName][0]}` : '',
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
            'font-weight': id === displayedMajorIndex ? '500' : '',
            color: id === displayedMajorIndex ? `#${reqGroupColorMap[req.groupName][0]}` : '',
          }"
          class="major-title-top"
        >
          {{ getMajorFullName(major) }}
        </p>
        <p
          :style="{
            color: id === displayedMajorIndex ? `#${reqGroupColorMap[req.groupName][0]}` : '',
          }"
          class="major-title-bottom"
        >
          ({{ getCollegeFullName(onboardingData.college) }})
        </p>
      </button>
    </div>
    <div v-if="reqIndex == numOfColleges + onboardingData.major.length" class="minor">
      <button
        :style="{
          'border-bottom':
            id === displayedMinorIndex ? `2px solid #${reqGroupColorMap[req.groupName][0]}` : '',
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
            'font-weight': id === displayedMinorIndex ? '500' : '',
            color: id === displayedMinorIndex ? `#${reqGroupColorMap[req.groupName][0]}` : '',
          }"
          class="minor-title-top"
        >
          {{ getMinorFullName(minor) }}
        </p>
        <!-- <p :style="{'color': minor.display ? `#${reqGroupColorMap[req.group][0]}` : ''}" class="minor-title-bottom">({{user.collegeFN}})</p> Change for multiple colleges -->
      </button>
    </div>

    <!-- progress bar settings -->
    <div v-if="showMajorOrMinorRequirements">
      <div class="progress">
        <div
          class="progress-bar"
          :style="{
            'background-color': `#${reqGroupColorMap[req.groupName][0]}`,
            width: progressWidth,
          }"
          role="progressbar"
          aria-label="Requirements Progress"
          :aria-valuenow="progressWidthValue"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      <p class="progress-text">
        <span class="progress-text-credits"
          >{{ requirementFulfilled }}/{{ requirementTotalRequired }}</span
        >
        <span class="progress-text-text"> Total Requirements Inputted on Schedule</span>
      </p>

      <!--View more college requirements -->
      <button
        class="btn row top view-more-dropdown"
        @click="toggleDetails()"
        aria-haspopup="true"
        data-toggle="dropdown"
      >
        <div class="col-1 p-0 btn" :style="{ color: `#${reqGroupColorMap[req.groupName][0]}` }">
          <drop-down-arrow
            :isFlipped="displayDetails"
            :fillColor="`#${reqGroupColorMap[req.groupName][0]}`"
            :isHeader="true"
          />
        </div>
        <div class="req-name col p-0" :style="{ color: `#${reqGroupColorMap[req.groupName][0]}` }">
          {{ displayDetails ? 'Hide' : 'View' }} All {{ req.groupName }} Requirements
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import DropDownArrow from '@/components/DropDownArrow.vue';
import { getCollegeFullName, getMajorFullName, getMinorFullName } from '@/utilities';

export default defineComponent({
  components: { DropDownArrow },
  props: {
    reqIndex: { type: Number, required: true },
    displayDetails: { type: Boolean, required: true },
    displayedMajorIndex: { type: Number, required: true },
    displayedMinorIndex: { type: Number, required: true },
    req: { type: Object as PropType<GroupedRequirementFulfillmentReport>, required: true },
    reqGroupColorMap: {
      type: Object as PropType<Readonly<Record<string, string[]>>>,
      required: true,
    },
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
    // number of fully fulfilled requirements, note pure self-checks are never fulfilled
    requirementFulfilled(): number {
      let fulfilled = 0;
      this.req.reqs.forEach(req => {
        if (req.minCountFulfilled >= req.minCountRequired) fulfilled += 1;
      });
      return fulfilled;
    },
    // number of requirements that can be fulfilled (so no pure self-checks)
    requirementTotalRequired(): number {
      return this.req.reqs.filter(req => req.fulfilledBy !== 'self-check').length;
    },
    // the sum of the progress of each requirement (outside of pure self-check), maxed out at 1
    totalRequirementProgress(): number {
      let fulfilled = 0;
      this.req.reqs.forEach(req => {
        if (req.minCountFulfilled >= req.minCountRequired) fulfilled += 1;
        else fulfilled += req.minCountFulfilled / req.minCountRequired;
      });
      return fulfilled;
    },
    // the sum of the progress of each requirement, divided by number of requirements
    progressWidth(): string {
      return `${(this.totalRequirementProgress / this.requirementTotalRequired) * 100}%`;
    },
    progressWidthValue(): string {
      return ((this.totalRequirementProgress / this.requirementTotalRequired) * 100).toFixed(1);
    },
  },
  methods: {
    getCollegeFullName,
    getMajorFullName,
    getMinorFullName,
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
.minor {
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
  line-height: 12px;
  color: $darkGray;

  &-credits {
    font-weight: bold;
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
</style>

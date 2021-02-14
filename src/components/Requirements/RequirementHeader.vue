<template>
  <div class="requirementheader">
    <!-- TODO change for multiple colleges -->
    <div
      v-if="reqIndex <= numOfColleges || reqIndex == numOfColleges + onboardingData.major.length"
      class="row top"
    >
      <p class="name col p-0">{{ req.groupName }} Requirements</p>
    </div>
    <!-- TODO change for multiple colleges -->
    <div v-if="reqIndex == numOfColleges" class="major">
      <div
        :style="{
          'border-bottom':
            id === displayedMajorIndex ? `2px solid #${reqGroupColorMap[req.groupName][0]}` : '',
        }"
        @click="activateMajor(id)"
        class="major-title"
        v-for="(major, id) in onboardingData.major"
        :key="id"
        :class="{ pointer: multipleMajors }"
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
      </div>
    </div>
    <div v-if="reqIndex == numOfColleges + onboardingData.major.length" class="minor">
      <div
        :style="{
          'border-bottom':
            id === displayedMinorIndex ? `2px solid #${reqGroupColorMap[req.groupName][0]}` : '',
        }"
        @click="activateMinor(id)"
        class="major-title"
        v-for="(minor, id) in onboardingData.minor"
        :key="id"
        :class="{ pointer: multipleMinors }"
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
      </div>
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
      <div class="row top">
        <div class="col-1 p-0">
          <button
            :style="{ color: `#${reqGroupColorMap[req.groupName][0]}` }"
            class="btn"
            @click="toggleDetails()"
          >
            <drop-down-arrow
              :isFlipped="displayDetails"
              :fillColor="`#${reqGroupColorMap[req.groupName][0]}`"
            />
          </button>
        </div>
        <div class="col p-0">
          <button
            class="btn req-name"
            :style="{ color: `#${reqGroupColorMap[req.groupName][0]}` }"
            @click="toggleDetails()"
          >
            {{ displayDetails ? 'Hide' : 'View' }} All {{ req.groupName }} Requirements
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DropDownArrow from '@/components/DropDownArrow.vue';
import { GroupedRequirementFulfillmentReport } from '@/requirements/types';
import { getCollegeFullName, getMajorFullName, getMinorFullName } from '@/utilities';

export default Vue.extend({
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
  computed: {
    multipleMajors() {
      return this.onboardingData.major.length > 1;
    },
    multipleMinors() {
      return this.onboardingData.minor.length > 1;
    },
    requirementFulfilled(): number {
      let fulfilled = 0;
      this.req.reqs.forEach(req => {
        if (req.minCountFulfilled >= req.minCountRequired) fulfilled += 1;
      });
      return fulfilled;
    },
    requirementTotalRequired(): number {
      return this.req.reqs.length;
    },
    progressWidth(): string {
      return `${(this.requirementFulfilled / this.requirementTotalRequired) * 100}%`;
    },
    progressWidthValue(): string {
      return ((this.requirementFulfilled / this.requirementTotalRequired) * 100).toFixed(1);
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
.btn:focus,
.btn:active {
  outline: none !important;
  box-shadow: none;
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
.name {
  margin-top: auto;
  margin-bottom: auto;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  color: $darkGray;
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
    align-self: center;
  }
  .pointer {
    cursor: pointer;
  }
}
</style>

<template>
  <div class="advisors">
    <div class="advisors-content">
      <div class="advisors-heading-row">
        <span class="advisors-info, advisors-heading-content">Type</span>
        <span class="advisors-info, advisors-heading-content">Name</span>
        <span class="advisors-info, advisors-heading-content">Email</span>
      </div>
      <div v-for="(advisor, index) in advisors" :key="index" class="advisors-row">
        <span class="advisors-info,advisors-type"> {{ advisor.type }} </span>

        <span class="advisors-info, advisors-name">
          {{ advisor.name }}
        </span>
        <a class="advisors-info, advisors-email" :href="'mailto:' + advisor.email">
          {{ advisor.email }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import { getCollegeFullName, getMajorFullName } from '@/utilities';
import { AdvisorPackage } from '@/requirements/tools-types';
import getAdvisor from '@/requirements/tools-utilities';

export default defineComponent({
  props: {
    maxItems: { type: Number, required: false, default: 5 },
  },
  computed: {
    onboardingData(): AppOnboardingData {
      return store.state.onboardingData;
    },
    userInfo(): FirestoreUserName {
      return store.state.userName;
    },
    advisors(): AdvisorPackage[] {
      return [
        ...(this.onboardingData.college
          ? getAdvisor(this.onboardingData.college, 'college', this.userInfo)
          : []),
        ...this.onboardingData.major
          .map(acronym => getAdvisor(acronym, 'major', this.userInfo))
          .flat(),
        ...this.onboardingData.minor
          .map(acronym => getAdvisor(acronym, 'minor', this.userInfo))
          .flat(),
      ].slice(0, this.maxItems);
    },
    advisorNames(): string[] {
      return this.advisors.map(x => x.name);
    },
  },
  methods: {
    getCollegeFullName,
    getMajorFullName,
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.advisors {
  height: 100%;
  width: 100%;

  &-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 0 24px 0 24px;
  }

  &-info {
    font-size: 14px;
    color: #3d3d3d;
    align-self: center;
    justify-self: start;
    margin-left: 5px;
    margin-right: 5px;
  }
  &-row {
    display: grid;
    grid-template-columns: 20% 40% 40%;
    justify-content: space-evenly;
    margin: 7px 0 7px 0;
  }
  &-heading {
    &-content {
      font-weight: bold;
      color: black;
    }
    &-row {
      @extend .advisors-row;
      margin-top: 0;
    }
  }
  &-name {
    grid-column-start: 2;
    grid-column-end: 2;
  }

  &-email {
    grid-column-start: 3;
    grid-column-end: 3;
    color: #3d3d3d;
    &:hover,
    &:focus,
    &:active {
      color: #7e7e7e;
    }
  }

  &-type {
    grid-column-start: 1;
    grid-column-end: 1;
  }
}
</style>

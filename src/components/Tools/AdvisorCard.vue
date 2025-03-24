<template>
  <div class="advisors">
    <div class="advisors-content" v-if="advisors.length === 0">
      <span class="advisors-empty"> Sorry, you don't have an advisor yet. </span>
    </div>
    <div v-else class="advisors-content">
      <div class="advisors-heading-row">
        <span class="advisors-info advisors-heading-content">Type</span>
        <span class="advisors-info advisors-heading-content">Name</span>
        <span class="advisors-info advisors-heading-content">Email</span>
      </div>
      <div v-for="(advisor, index) in advisors" :key="index" class="advisors-row">
        <span class="advisors-info advisors-type"> {{ capitalizeFirstLetter(advisor.type) }} </span>
        <span class="advisors-info advisors-name">
          {{ advisor.name }}
        </span>
        <a class="advisors-info advisors-email" :href="`mailto:${advisor.email}`">
          <span class="advisors-email-text"> {{ advisor.email }} </span>
          <img
            class="advisors-email-icon"
            src="@/assets/images/link-gray.svg"
            alt="external link"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import { getCollegeFullName, getMajorFullName } from '@/utilities';
import { AdvisorPackage } from '@/tools/advisors/types';
import getAdvisor from '@/tools/advisors/utilities';

export default defineComponent({
  props: {
    maxItems: { type: Number, required: false, default: undefined },
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
        ...this.onboardingData.major.flatMap(acronym =>
          getAdvisor(acronym, 'major', this.userInfo)
        ),
        ...this.onboardingData.minor.flatMap(acronym =>
          getAdvisor(acronym, 'minor', this.userInfo)
        ),
      ].slice(0, this.maxItems);
    },
    advisorNames(): string[] {
      return this.advisors.map(x => x.name);
    },
  },
  methods: {
    getCollegeFullName,
    getMajorFullName,
    capitalizeFirstLetter(string: string): string {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
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
    margin: 0 1.5rem 0 1.5rem;
  }

  &-empty {
    display: flex;
    justify-content: space-around;
  }

  &-info {
    font-size: 14px;
    color: #3d3d3d;
    align-self: center;
    justify-self: start;
    max-width: 100%;
  }

  &-row {
    display: grid;
    grid-template-columns: 20% 40% 40%;
    justify-content: space-evenly;
    margin: 0.375rem 0 0.375rem 0;
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
    // color: #3d3d3d;
    color: $lightPlaceholderGray;
    text-decoration: underline;

    &:hover,
    &:focus,
    &:active {
      color: $yuxuanBlue;
    }

    display: flex;
    align-items: center;

    &-icon {
      margin-left: 0.25rem;
    }

    &-text {
      max-width: 100%;
    }
  }

  &-type {
    grid-column-start: 1;
    grid-column-end: 1;
  }
}
</style>

<template>
  <div class="profileContainer">
    <div class="profileContainer-header">
      <div class="profileContainer-title">
        <span> Edit Profile</span>
      </div>
      <div class="profileContainer-subtitle">
        <span> get your information up-to-date! </span>
      </div>
    </div>
    <div class="profileContainer-editPage">
      <onboarding-basic
        :userName="name"
        :onboardingData="onboarding"
        :isEditingProfile="true"
        @updateBasic="updateBasic"
      />
    </div>
    <div>
      <button
        class="profileContainer-button"
        @click="submitOnboarding"
        data-cyId="onboarding-finishButton"
      >
        Finish
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import OnboardingBasic from '@/components/Modals/Onboarding/OnboardingBasic.vue';
import { setAppOnboardingData } from '@/global-firestore-data';

export default defineComponent({
  components: { OnboardingBasic },
  props: {
    userName: { type: Object as PropType<FirestoreUserName>, required: true },
    onboardingData: {
      type: Object as PropType<AppOnboardingData>,
      required: true,
    },
  },
  data() {
    return {
      name: { ...this.userName },
      onboarding: { ...this.onboardingData },
    };
  },
  methods: {
    submitOnboarding() {
      setAppOnboardingData(this.name, this.onboarding);
      this.$emit('onboard');
    },
    updateBasic(
      gradYear: string,
      gradSem: FirestoreSemesterSeason,
      entranceYear: string,
      entranceSem: FirestoreSemesterSeason,
      college: string,
      major: readonly string[],
      minor: readonly string[],
      grad: string,
      name: FirestoreUserName
    ) {
      this.name = name;
      this.onboarding = {
        ...this.onboarding,
        gradYear,
        gradSem,
        entranceYear,
        entranceSem,
        college,
        major,
        minor,
        grad,
      };
    },
  },
});
</script>
<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.profileContainer {
  background-color: #f6fafc;
  padding: 3rem 7rem;

  &-title {
    width: 523px;
    height: 40px;
    right: 753px;
    top: 40px;

    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 40px;

    /* identical to box height */
    display: flex;
    align-items: center;

    color: #3c3c3c;
  }

  &-subtitle {
    width: 523px;
    height: 24px;
    right: 753px;
    top: 99px;

    font-family: 'Proxima Nova';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 24px;

    /* identical to box height */
    display: flex;
    align-items: center;

    color: #757575;
  }

  &-editPage {
    width: 80%;
  }

  &-button {
    background: $emGreen;
    border: 0;
    box-sizing: border-box;
    border-radius: 1px;
    font-size: 14px;
    line-height: 14px;
    color: $white;
    margin: 5px;
    width: 80px;
    min-height: 1.75rem;

    &-previous {
      background: $white;
      color: $emGreen;
      border-radius: 0px;
      border-width: 0px;
    }
  }
}
</style>

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
    <div class="profileContainer-buttonGroup">
      <button
        :class="{
          'profileContainer-button': currentPage != 1,
          'profileContainer-selectedButton': currentPage === 1,
        }"
        @click="openBasicInfo"
      >
        Basic Information
      </button>
      <button
        :class="{
          'profileContainer-button': currentPage != 2,
          'profileContainer-selectedButton': currentPage === 2,
        }"
        @click="openTransferCredit"
      >
        Transfer Credit
      </button>
    </div>
    <div class="profileContainer-editPage">
      <onboarding-basic
        v-if="currentPage === 1"
        :userName="name"
        :onboardingData="onboarding"
        :isEditingProfile="true"
        @updateBasic="updateBasic"
      />
      <onboarding-transfer
        v-if="currentPage == 2"
        :onboardingData="onboarding"
        @updateTransfer="updateTransfer"
      />
    </div>
    <div class="profileContainer-error" data-cyId="onboarding-error" v-if="isError">
      {{ errorText }}
    </div>
    <div>
      <button
        class="profileContainer-finishButton"
        @click="openConfirmation"
        data-cyId="onboarding-finishButton"
        :disabled="isError"
      >
        Save
      </button>
    </div>
    <profile-confirmation
      @close-modal="closeConfirmation"
      v-if="isConfirmOpen"
      @submit-onboarding="submitOnboarding"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import OnboardingBasic from '@/components/Modals/Onboarding/OnboardingBasic.vue';
import OnboardingTransfer from '@/components/Modals/Onboarding/OnboardingTransfer.vue';
import { setAppOnboardingData } from '@/global-firestore-data';
import ProfileConfirmation from '@/components/Modals/ProfileConfirmation.vue';
import {
  getMajorFullName,
  getMinorFullName,
  getGradFullName,
  computeGradYears,
  SeasonOrdinal,
} from '@/utilities';
import store from '@/store';

const placeholderText = 'Select one';
export default defineComponent({
  components: { OnboardingBasic, OnboardingTransfer, ProfileConfirmation },
  props: {
    userName: { type: Object as PropType<FirestoreUserName>, required: true },
    onboardingData: {
      type: Object as PropType<AppOnboardingData>,
      required: true,
    },
  },
  emits: ['onboard', 'cancelOnboarding'],
  data() {
    return {
      currentPage: 1,
      name: { ...this.userName },
      onboarding: {
        ...this.onboardingData,
        gradYear:
          this.onboardingData.gradYear in computeGradYears(this.onboardingData.entranceYear)
            ? this.onboardingData.gradYear
            : '',
      },
      changed: false,
      isConfirmOpen: false,
    };
  },
  computed: {
    // Display error if a required field is empty
    isInvalidGraduationSemester(): boolean {
      const { gradYear } = this.onboarding;
      const { entranceYear } = this.onboarding;
      if (gradYear !== '' && entranceYear !== '') {
        if (this.onboarding.entranceSem && this.onboarding.gradSem && gradYear === entranceYear) {
          return (
            SeasonOrdinal[this.onboarding.gradSem] < SeasonOrdinal[this.onboarding.entranceSem]
          );
        }
        return gradYear < entranceYear;
      }
      return false;
    },
    isInvalidMajorMinorGradError(): boolean {
      return (
        this.onboarding.major
          .map(getMajorFullName)
          .some((majorFullName: string) => majorFullName === '') ||
        this.onboarding.minor
          .map(getMinorFullName)
          .some((minorFullName: string) => minorFullName === '') ||
        (this.onboarding.grad ? getGradFullName(this.onboarding.grad) === '' : false)
      );
    },
    isError(): boolean {
      if (!this.changed || this.isInvalidGraduationSemester || this.isInvalidMajorMinorGradError) {
        return true;
      }
      return (
        this.name.firstName === '' ||
        this.name.lastName === '' ||
        this.onboarding.gradYear === '' ||
        !this.onboarding.gradSem ||
        this.onboarding.entranceYear === '' ||
        !this.onboarding.entranceSem ||
        (this.onboarding.college === '' && this.onboarding.grad === '')
      );
    },
    /**
     * Set error text depending on which fields are missing
     *
     * @returns a string containing the names of all types of required data missing from onboarding.
     */
    errorText(): string {
      if (!this.changed) {
        return '';
      }
      if (this.isInvalidGraduationSemester) {
        return `${
          'Your graduation semester cannot come before your entrance semester. Please select a ' +
          'graduation semester after '
        }${this.onboarding.entranceSem} ${this.onboarding.entranceYear}.`;
      }
      if (this.isInvalidMajorMinorGradError) {
        return (
          'Invalid major, minor, or graduate program. Delete the placeholder major, minor, or program' +
          'and try again.'
        );
      }
      const messages = [];
      if (this.onboarding.college === '' && this.onboarding.grad === '') {
        messages.push('at least one undergraduate or graduate degree');
      }
      if (this.name.firstName === '') {
        messages.push('a first name');
      }
      if (this.name.lastName === '') {
        messages.push('a last name');
      }
      if (this.onboarding.entranceYear === '' || !this.onboarding.entranceSem) {
        messages.push('an entrance semester');
      }
      if (this.onboarding.gradYear === '' || !this.onboarding.gradSem) {
        messages.push('a graduation semester');
      }

      // generate the string depending on how many error messages are selected
      let errorString = 'Please select ';
      for (let i = 0; i < messages.length; i += 1) {
        errorString += messages[i];
        if (i < messages.length - 2) {
          errorString += ', ';
        } else if (i === messages.length - 2 && messages.length === 2) {
          errorString += ' and ';
        } else if (i === messages.length - 2) {
          errorString += ', and ';
        }
      }

      return `${errorString}.`;
    },
  },
  methods: {
    submitOnboarding() {
      this.clearTransferCreditIfGraduate();
      setAppOnboardingData(this.name, this.onboarding);
      this.changed = false;
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
      this.changed = true;
    },
    // clear transfer credits if the student is only in a graduate program, but previously set transfer credits
    clearTransferCreditIfGraduate() {
      if (this.onboarding.grad !== '' && this.onboarding.college === '') {
        this.updateTransfer([], 'no');
      }
    },
    updateTransfer(exams: readonly FirestoreAPIBExam[], tookSwim: 'yes' | 'no') {
      const userExams = exams.filter(
        ({ subject, score }) => score !== 0 && subject !== placeholderText
      );
      this.onboarding = {
        ...this.onboarding,
        exam: userExams,
        tookSwim,
      };
      this.changed = true;
    },
    openBasicInfo() {
      this.currentPage = 1;
    },
    openTransferCredit() {
      this.currentPage = 2;
    },
    openConfirmation() {
      this.isConfirmOpen = true;
    },
    closeConfirmation() {
      this.isConfirmOpen = false;
      store.commit('setIsTeleportModalOpen', false);
    },
  },
});
</script>
<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.profileContainer {
  background-color: #ffffff;
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
    margin: 19px 0 50px 0;

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

  &-buttonGroup {
    margin: 35px 0 0;
    float: left;
    width: 30%;
  }

  &-error {
    font-size: 16px;
    line-height: 17px;
    text-align: center;
    margin-bottom: 1rem;
    color: #d8000c;
  }

  &-selectedButton {
    margin: 0 0 50px 0;
    font-family: 'ProximaNova';
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 30px;
    display: flex;
    align-items: center;
    color: #000000;
    border-bottom: 3px solid $emGreen;
  }

  &-button {
    margin: 0 0 50px 0;
    font-family: 'ProximaNova';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: #000000;
  }

  &-editPage {
    float: left;
    width: 70%;
  }

  &-finishButton {
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
    float: right;

    &-previous {
      background: $white;
      color: $emGreen;
      border-radius: 0px;
      border-width: 0px;
    }
  }

  &-finishButton:disabled {
    background: $emGreen;
    border: 0;
    opacity: 0.5;
    box-sizing: border-box;
    border-radius: 1px;
    font-size: 14px;
    line-height: 14px;
    color: $white;
    margin: 5px;
    width: 80px;
    min-height: 1.75rem;
    float: right;
  }
}

@media only screen and (max-width: $medium-breakpoint) {
  .profileContainer {
    padding: 5rem 4rem;
  }
}
</style>

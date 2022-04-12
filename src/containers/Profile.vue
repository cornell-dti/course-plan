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
      <button class="profileContainer-button" @click="openBasicInfo">Basic Information</button>
      <button class="profileContainer-button" @click="openTransferCredit">Transfer Credit</button>
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
    <div>
      <button
        class="profileContainer-finishButton"
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
import OnboardingTransfer from '@/components/Modals/Onboarding/OnboardingTransfer.vue';
import { setAppOnboardingData } from '@/global-firestore-data';
import { getMajorFullName, getMinorFullName, getGradFullName } from '@/utilities';
import timeline1Text from '@/assets/images/timeline1text.svg';
import timeline2Text from '@/assets/images/timeline2text.svg';
import timeline3Text from '@/assets/images/timeline3text.svg';

const timelineTexts = [timeline1Text, timeline2Text, timeline3Text];

const placeholderText = 'Select one';
const FINAL_PAGE = 3;

export default defineComponent({
  components: { OnboardingBasic, OnboardingTransfer },
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
      onboarding: { ...this.onboardingData },
    };
  },
  computed: {
    // Display error if a required field is empty
    isError(): boolean {
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
    timelineTextImage(): string {
      return timelineTexts[this.currentPage - 1];
    },
    /**
     * Display error if onboarding data includes a major, minor, or graduate program
     * that doesn't exist in requirementsJSON.
     *
     * @returns true if onboarding contains a major, minor, or program that is not in
     * requirementsJSON on this branch, false otherwise.
     */
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
    /**
     * Set error text depending on which fields are missing
     *
     * @returns a string containing the names of all types of required data missing from onboarding.
     */
    errorText(): string {
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
      this.$emit('onboard');
    },
    goBack() {
      // special case: if the user has a graduate program (and not an undergrad program), skip the transfer page
      if (this.onboarding.grad !== '' && !this.onboarding.college && this.currentPage > 1) {
        this.currentPage = 1;
      } else {
        this.currentPage = this.currentPage - 1 === 0 ? 0 : this.currentPage - 1;
      }
    },
    setPage(page: number) {
      this.currentPage = page;
    },
    canProgress() {
      return !(this.isError || this.isInvalidMajorMinorGradError);
    },
    goNext() {
      // Only move onto next page if error message is not displayed
      if (!(this.isError || this.isInvalidMajorMinorGradError)) {
        // special case: if the user has a graduate program (and not an undergrad program), skip the transfer page
        if (this.onboarding.grad !== '' && !this.onboarding.college && this.currentPage === 1) {
          this.currentPage += 2;
        } else {
          this.currentPage = this.currentPage === FINAL_PAGE ? FINAL_PAGE : this.currentPage + 1;
        }
      }
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
    },
    cancel() {
      if (this.onboardingData.college !== '' || this.onboardingData.grad !== '') {
        this.$emit('cancelOnboarding');
      }
    },
    checkClickOutside(e: MouseEvent) {
      if (
        e.target === this.$refs.modalBackground &&
        (this.onboardingData.college !== '' || this.onboardingData.grad !== '')
      ) {
        this.cancel();
      }
    },
    openBasicInfo() {
      this.currentPage = 1;
    },
    openTransferCredit() {
      this.currentPage = 2;
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

    font-family: 'Proxima Nova';
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

  &-buttonGroup {
    float: left;
    width: 20%;
  }

  &-button {
    margin: 50px;
    font-family: 'Proxima Nova';
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
    width: 80%;
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

    &--disabled {
      opacity: 0.3;
      border: 1px solid $sangBlue;
      background-color: $disabledGray;

      &:hover {
        opacity: 0.3;
      }
    }
  }
}
</style>

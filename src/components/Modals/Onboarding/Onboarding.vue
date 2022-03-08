<template>
  <div class="onboarding" @click="checkClickOutside" ref="modalBackground" data-cyId="onboarding">
    <div class="onboarding-main">
      <div v-if="isEditingProfile" class="onboarding-cancel">
        <button data-cyId="onboarding-cancel" @click="cancel">
          <img
            class="onboarding-cancel-icon"
            src="@/assets/images/x.svg"
            alt="x to close onboarding modal"
          />
        </button>
      </div>
      <div class="onboarding-content" :class="{ editing: isEditingProfile }">
        <div class="onboarding-top">
          <div v-if="!isEditingProfile" class="onboarding-header">
            <span
              ><img
                class="onboarding-header-emoji"
                src="@/assets/images/waveEmoji.svg"
                alt="wave"
              />
              Welcome to CoursePlan</span
            >
          </div>
          <div v-if="isEditingProfile" class="onboarding-header">
            <span
              ><img
                class="onboarding-header-emoji"
                src="@/assets/images/clapEmoji.svg"
                alt="clap"
              />
              Hi {{ name.firstName }}</span
            >
          </div>
          <div v-if="!isEditingProfile" class="onboarding-description">
            Let's get to know you first!
          </div>
          <div v-if="isEditingProfile" class="onboarding-description">Let's edit your profile!</div>
          <onboarding-basic
            v-if="currentPage == 1"
            :userName="name"
            :onboardingData="onboarding"
            :isEditingProfile="isEditingProfile"
            @updateBasic="updateBasic"
          />
          <onboarding-transfer
            v-if="currentPage == 2"
            :onboardingData="onboarding"
            @updateTransfer="updateTransfer"
          />
          <onboarding-review
            v-if="currentPage == 3"
            :userName="name"
            :onboardingData="onboarding"
            @setPage="setPage"
          />
        </div>
        <div class="onboarding-error" data-cyId="onboarding-error" v-if="isError">
          {{ errorText }}
        </div>
        <div class="onboarding-error" v-if="isInvalidGraduationYear">
          Your graduation semester cannot come before your entrance semester. Please select a
          graduation semester after {{ onboarding.entranceSem }} {{ onboarding.entranceYear }}.
        </div>
        <div class="onboarding-error" v-if="isInvalidMajorMinorGradError">
          Invalid major, minor, or graduate program. Delete the placeholder major, minor, or program
          and try again.
        </div>
      </div>
      <div class="onboarding-bottom">
        <div class="onboarding-bottom--section onboarding-bottom--section---center">
          <img class="timeline" :src="timelineTextImage" alt="onboarding progress timeline" />
        </div>
        <div v-if="currentPage === 3" class="onboarding-bottom--section">
          <!-- keeping skip button code in case we want to add back -->
          <!-- <div class="onboarding-bottom--contents" @click="cancel">
            <label class="onboarding-bottom--text">Skip for now</label>
          </div> -->
          <div class="onboarding-bottom--contents">
            <button class="onboarding-button-previous" @click="goBack">&lt; Previous</button>
            <button
              class="onboarding-button"
              @click="submitOnboarding"
              data-cyId="onboarding-finishButton"
            >
              Finish
            </button>
          </div>
        </div>
        <div v-else class="onboarding-bottom--section">
          <div class="onboarding-bottom--contents">
            <button v-if="currentPage != 1" class="onboarding-button-previous" @click="goBack">
              &lt; Previous
            </button>
            <button
              class="onboarding-button"
              @click="goNext"
              :disabled="!canProgress()"
              :class="{ 'onboarding-button--disabled': !canProgress() }"
              data-cyId="onboarding-nextButton"
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import OnboardingBasic from '@/components/Modals/Onboarding/OnboardingBasic.vue';
import OnboardingTransfer from '@/components/Modals/Onboarding/OnboardingTransfer.vue';
import OnboardingReview from '@/components/Modals/Onboarding/OnboardingReview.vue';
import { setAppOnboardingData, populateSemesters } from '@/global-firestore-data';
import { getMajorFullName, getMinorFullName, getGradFullName } from '@/utilities';
import timeline1Text from '@/assets/images/timeline1text.svg';
import timeline2Text from '@/assets/images/timeline2text.svg';
import timeline3Text from '@/assets/images/timeline3text.svg';

const timelineTexts = [timeline1Text, timeline2Text, timeline3Text];

const placeholderText = 'Select one';
const FINAL_PAGE = 3;

export default defineComponent({
  components: { OnboardingBasic, OnboardingReview, OnboardingTransfer },
  props: {
    isEditingProfile: { type: Boolean, required: true },
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
     * Display error if graduation semester comes before entrance semester, comparing both year and season
     *
     * @returns true if graduation semesters comes before entrance semester, false otherwise
     */
    isInvalidGraduationYear(): boolean {
      const { gradYear } = this.onboarding;
      const { entranceYear } = this.onboarding;
      if (gradYear !== '' && entranceYear !== '')
        if (gradYear === entranceYear) {
          // TODO - refactor to use SeasonOrdinal
          const order = ['Winter', 'Spring', 'Summer', 'Fall'];
          return (
            order.indexOf(this.onboarding.gradSem) < order.indexOf(this.onboarding.entranceSem)
          );
        }
      return gradYear < entranceYear;
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
        messages.push('an entrance date');
      }
      if (this.onboarding.gradYear === '' || !this.onboarding.gradSem) {
        messages.push('a graduation date');
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
      // indicates first time user onboarding
      if (!this.isEditingProfile) populateSemesters(this.onboarding);
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
      return !(this.isError || this.isInvalidMajorMinorGradError || this.isInvalidGraduationYear);
    },
    goNext() {
      // Only move onto next page if error message is not displayed
      if (!(this.isError || this.isInvalidMajorMinorGradError || this.isInvalidGraduationYear)) {
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
  },
});
</script>
<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';

@media only screen and (max-width: $large-breakpoint) {
  .onboarding {
    &-main {
      width: 100%;
    }
  }
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .onboarding {
    &-header {
      text-align: center;
    }

    &-inputWrapper {
      text-align: center;
    }
  }
}
</style>

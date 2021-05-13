<template>
  <div class="onboarding" @click="checkClickOutside" ref="modalBackground">
    <div class="onboarding-main">
      <div v-if="isEditingProfile" class="onboarding-cancel">
        <button @click="cancel">
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
        <div class="onboarding-error" :class="{ 'onboarding--hidden': !isError }">
          Please fill out all required fields and try again.
        </div>
        <div
          class="onboarding-error"
          :class="{ 'onboarding--hidden': !isInvalidMajorOrMinorError }"
        >
          Invalid major or minor. Delete the placeholder major or minor and try again.
        </div>
      </div>
      <div class="onboarding-bottom">
        <div class="onboarding-bottom--section onboarding-bottom--section---center">
          <img
            class="timeline"
            :src="require(`@/assets/images/timeline${currentPage}text.svg`)"
            alt="onboarding progress timeline"
          />
        </div>
        <div v-if="currentPage === 3" class="onboarding-bottom--section">
          <!-- keeping skip button code in case we want to add back -->
          <!-- <div class="onboarding-bottom--contents" @click="cancel">
            <label class="onboarding-bottom--text">Skip for now</label>
          </div> -->
          <div class="onboarding-bottom--contents">
            <button class="onboarding-button-previous" @click="goBack">&lt; Previous</button>
            <button class="onboarding-button" @click="submitOnboarding">Finish</button>
          </div>
        </div>
        <div v-else class="onboarding-bottom--section">
          <div class="onboarding-bottom--contents">
            <button v-if="currentPage != 1" class="onboarding-button-previous" @click="goBack">
              &lt; Previous
            </button>
            <button class="onboarding-button" @click="goNext">Next &gt;</button>
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
import { addStarterSemesters, setOnboardingData } from '@/global-firestore-data';
import { getMajorFullName, getMinorFullName } from '@/utilities';

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
        this.onboarding.college === '' ||
        this.onboarding.gradYear === '' ||
        this.onboarding.entranceYear === ''
      );
    },
    // Display error if onboarding data includes a major or minor that doesn't exist in requirementsJSON
    isInvalidMajorOrMinorError(): boolean {
      return (
        this.onboarding.major
          .map(getMajorFullName)
          .some((majorFullName: string) => majorFullName === '') ||
        this.onboarding.minor
          .map(getMinorFullName)
          .some((minorFullName: string) => minorFullName === '')
      );
    },
  },
  methods: {
    submitOnboarding() {
      setOnboardingData(this.name, this.onboarding);
      addStarterSemesters();
      this.$emit('onboard');
    },
    goBack() {
      this.currentPage = this.currentPage - 1 === 0 ? 0 : this.currentPage - 1;
    },
    setPage(page: number) {
      this.currentPage = page;
    },
    goNext() {
      // Only move onto next page if error message is not displayed
      if (!(this.isError || this.isInvalidMajorOrMinorError)) {
        this.currentPage = this.currentPage === FINAL_PAGE ? FINAL_PAGE : this.currentPage + 1;
      }
    },
    updateBasic(
      gradYear: string,
      entranceYear: string,
      college: string,
      major: readonly string[],
      minor: readonly string[],
      name: FirestoreUserName
    ) {
      this.name = name;
      this.onboarding = {
        ...this.onboarding,
        gradYear,
        entranceYear,
        college,
        major,
        minor,
      };
    },
    updateTransfer(
      exams: readonly FirestoreAPIBExam[],
      classes: readonly FirestoreTransferClass[],
      tookSwim: 'yes' | 'no'
    ) {
      const userExams = exams.filter(
        ({ subject, score }) => score !== 0 && subject !== placeholderText
      );
      const userClasses = classes.filter(it => it.class !== placeholderText);
      this.onboarding = {
        ...this.onboarding,
        exam: userExams,
        transferCourse: userClasses,
        tookSwim,
      };
    },
    cancel() {
      if (this.onboardingData.college !== '') {
        this.$emit('cancelOnboarding');
      }
    },
    checkClickOutside(e: MouseEvent) {
      if (e.target === this.$refs.modalBackground && this.onboardingData.college !== '') {
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

<template>
  <div class="onboarding">
    <div class="onboarding-main">
      <div v-if="isEditingProfile" class="onboarding-cancel" @click="cancel">
        <img class="onboarding-cancel-icon" src="@/assets/images/x.svg" alt="X" />
      </div>
      <div class="onboarding-content" :class="{ editing: isEditingProfile }">
        <div class="onboarding-top">
          <div v-if="!isEditingProfile" class="onboarding-header">👏 Welcome to CoursePlan</div>
          <div v-if="isEditingProfile" class="onboarding-header">👋 Hi {{ user.firstName }}</div>
          <div v-if="!isEditingProfile" class="onboarding-description">
            Let's get to know you first!
          </div>
          <div v-if="isEditingProfile" class="onboarding-description">Let's edit your profile!</div>
          <onboardingBasic
            v-if="currentPage == 1"
            :user="user"
            ref="basic"
            @updateBasic="updateBasic"
          />
          <onboardingTransfer
            v-if="currentPage == 2"
            :user="user"
            ref="transfer"
            @updateTransfer="updateTransfer"
          />
          <onboardingReview v-if="currentPage == 3" :user="user" @setPage="setPage" />
        </div>
        <div class="onboarding-error" :class="{ 'onboarding--hidden': !isError }">
          Please fill out all required fields and try again.
        </div>
      </div>
      <div class="onboarding-bottom">
        <div class="onboarding-bottom--section onboarding-bottom--section---center">
          <img
            class="timeline"
            :src="require(`@/assets/images/timeline${currentPage}text.svg`)"
            alt="X"
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
import Vue, { PropType } from 'vue';
import OnboardingBasic from '@/components/Modals/Onboarding/OnboardingBasic.vue';
import OnboardingTransfer from '@/components/Modals/Onboarding/OnboardingTransfer.vue';
import OnboardingReview from '@/components/Modals/Onboarding/OnboardingReview.vue';
import { AppUser, FirestoreAPIBExam, FirestoreTransferClass, FirestoreUserName } from '@/user-data';

Vue.component('onboardingBasic', OnboardingBasic);
Vue.component('onboardingTransfer', OnboardingTransfer);
Vue.component('onboardingReview', OnboardingReview);

type DropdownSlot = { acronym: string; text: string };

const placeholderText = 'Select one';
const FINAL_PAGE = 3;

export default Vue.extend({
  props: {
    isEditingProfile: { type: Boolean, required: true },
    userData: { type: Object as PropType<AppUser>, required: true },
  },
  data() {
    return {
      currentPage: 1,
      isError: false,
      user: this.userData,
    };
  },
  methods: {
    submitOnboarding() {
      // Display error if a required field is empty, otherwise submit
      if (
        this.user.firstName === '' ||
        this.user.lastName === '' ||
        this.user.collegeFN === placeholderText
      ) {
        this.isError = true;
      } else {
        const onboardingData = {
          name: {
            firstName: this.user.firstName,
            middleName: this.user.middleName,
            lastName: this.user.lastName,
          },
          userData: {
            colleges: [{ acronym: this.user.college, fullName: this.user.collegeFN }],
            majors: this.notPlaceholderOptions(
              this.user.major.map((acronym, i) => ({ acronym, text: this.user.majorFN[i] }))
            ),
            minors: this.notPlaceholderOptions(
              this.user.minor.map((acronym, i) => ({ acronym, text: this.user.minorFN[i] }))
            ),
            exam: this.user.exam.filter(exam => exam.subject !== placeholderText),
            class: this.user.transferCourse.filter(
              oneClass => oneClass.class !== placeholderText && oneClass.class !== null
            ),
            tookSwim: this.user.tookSwim,
          },
        };
        this.$emit('onboard', onboardingData);
      }
    },
    notPlaceholderOptions(options: readonly DropdownSlot[]) {
      return options
        .filter(option => option.text !== placeholderText)
        .map(option => ({ acronym: option.acronym, fullName: option.text }));
    },
    goBack() {
      this.currentPage = this.currentPage - 1 === 0 ? 0 : this.currentPage - 1;
    },
    setPage(page: number) {
      this.currentPage = page;
    },
    goNext() {
      this.currentPage = this.currentPage === FINAL_PAGE ? FINAL_PAGE : this.currentPage + 1;
    },
    basicOptionsToUser(major: readonly DropdownSlot[], minor: readonly DropdownSlot[]) {
      const userMajorsAcronym: string[] = [];
      const userMajorsFN: string[] = [];
      for (let i = 0; i < major.length; i += 1) {
        if (major[i].text !== placeholderText) {
          userMajorsAcronym.push(major[i].acronym);
          userMajorsFN.push(major[i].text);
        }
      }
      const userMinorsAcronym: string[] = [];
      const userMinorsFN: string[] = [];
      for (let i = 0; i < minor.length; i += 1) {
        if (minor[i].text !== placeholderText) {
          userMinorsAcronym.push(minor[i].acronym);
          userMinorsFN.push(minor[i].text);
        }
      }
      return { userMajorsAcronym, userMajorsFN, userMinorsAcronym, userMinorsFN };
    },
    updateBasic(
      { acronym: college, text: collegeFN }: DropdownSlot,
      newMajor: readonly DropdownSlot[],
      newMinor: readonly DropdownSlot[],
      { firstName, middleName, lastName }: FirestoreUserName
    ) {
      const {
        userMajorsAcronym: major,
        userMajorsFN: majorFN,
        userMinorsAcronym: minor,
        userMinorsFN: minorFN,
      } = this.basicOptionsToUser(newMajor, newMinor);
      this.user = {
        ...this.user,
        firstName,
        middleName,
        lastName,
        college,
        collegeFN,
        major,
        majorFN,
        minor,
        minorFN,
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
      this.user = { ...this.user, exam: userExams, transferCourse: userClasses, tookSwim };
    },
    cancel() {
      this.$emit('cancelOnboarding');
    },
  },
});
</script>
<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

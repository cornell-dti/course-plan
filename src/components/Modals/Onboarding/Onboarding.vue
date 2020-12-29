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
            :key="keyCounter"
            @updateBasic="updateBasic"
          />
          <onboardingTransfer
            v-if="currentPage == 2"
            :user="user"
            :key="keyCounter"
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

<script>
import Vue from 'vue';
import reqsData from '@/requirements/typed-requirement-json';
import OnboardingBasic from '@/components/Modals/Onboarding/OnboardingBasic.vue';
import OnboardingTransfer from '@/components/Modals/Onboarding/OnboardingTransfer.vue';
import OnboardingReview from '@/components/Modals/Onboarding/OnboardingReview.vue';
import { clickOutside } from '@/utilities';
import { lightPlaceholderGray } from '@/assets/scss/_variables.scss';

Vue.component('onboardingBasic', OnboardingBasic);
Vue.component('onboardingTransfer', OnboardingTransfer);
Vue.component('onboardingReview', OnboardingReview);

const placeholderText = 'Select one';
const FINAL_PAGE = 3;

export default Vue.extend({
  props: {
    isEditingProfile: Boolean,
    userData: Object,
  },
  data() {
    // Set dropdown colleges and majors if already filled out
    let collegeText = placeholderText;
    let collegeAcronym = '';
    let collegePlaceholderColor = '';
    // const user = this.userData;
    if (this.userData.college !== '') {
      collegeText = this.userData.collegeFN;
      collegeAcronym = this.userData.college;
      collegePlaceholderColor = lightPlaceholderGray;
    }

    let majorText = placeholderText;
    let majorAcronym = '';
    let majorPlaceholderColor = '';
    if ('major' in this.userData && this.userData.major.length > 0) {
      majorText = this.userData.majorFN;
      majorAcronym = this.userData.major;
      majorPlaceholderColor = lightPlaceholderGray;
    }

    let minorText = placeholderText;
    let minorAcronym = '';
    let minorPlaceholderColor = '';
    if ('minor' in this.userData && this.userData.minor.length > 0) {
      minorText = this.userData.minorFN;
      minorAcronym = this.userData.minor;
      minorPlaceholderColor = lightPlaceholderGray;
    }

    return {
      // TODO: Get real college, major, and minor lists
      currentPage: 1,
      colleges: {},
      majors: {},
      minors: {},
      firstName: this.userData.firstName,
      middleName: this.userData.middleName,
      lastName: this.userData.lastName,
      tookSwim: '',
      placeholderText,
      displayOptions: {
        college: [],
        major: [],
        minor: [],
        exam: [],
        class: [],
      },
      isError: false,
      keyCounter: 1,
      user: JSON.parse(JSON.stringify(this.userData)),
    };
  },
  directives: {
    'click-outside': clickOutside,
  },
  methods: {
    submitOnboarding() {
      // Display error if a required field is empty, otherwise submit
      if (
        this.firstName === '' ||
        this.lastName === '' ||
        this.noOptionSelected(this.displayOptions.college)
      ) {
        this.isError = true;
      } else {
        const onboardingData = {
          name: {
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
          },
          userData: {
            colleges: this.notPlaceholderOptions(this.displayOptions.college),
            majors: this.notPlaceholderOptions(this.displayOptions.major),
            minors: this.notPlaceholderOptions(this.displayOptions.minor),
            exam: this.notPlaceholderOptionsExam(this.displayOptions.exam),
            class: this.notPlaceholderOptionsClass(this.displayOptions.class),
            tookSwim: this.tookSwim,
          },
        };
        this.$emit('onboard', onboardingData);
      }
    },
    // check to see if a set of options (college, major, minor) only has placeholder texts (so no options selected)
    // TODO check if all fields in a exam (subject, score, type) are filled
    noOptionSelected(options) {
      let bool = true;
      options.forEach(option => {
        if (option.placeholder !== placeholderText) {
          bool = false;
        }
      });

      return bool;
    },
    notPlaceholderOptionsClass(options) {
      const list = [];
      options.forEach(option => {
        if (option.class !== placeholderText && option.class !== null) {
          list.push(option);
        }
      });
      return list;
    },
    notPlaceholderOptionsExam(options) {
      const list = [];
      const sections = ['type', 'subject', 'score'];
      options.forEach(option => {
        const exam = {};
        let isValidExam = true;
        for (const sec of sections) {
          if (option[sec].placeholder !== placeholderText && option[sec].placeholder !== null) {
            exam[sec] = option[sec].placeholder;
          } else {
            isValidExam = false;
          }
        }
        if (typeof option.equivCourse !== 'undefined') {
          exam.equivCourse = option.equivCourse;
        }
        if (isValidExam) list.push(exam);
      });
      return list;
    },
    notPlaceholderOptions(options) {
      const list = [];
      options.forEach(option => {
        if (option.placeholder !== placeholderText) {
          const obj = {
            acronym: option.acronym,
            fullName: option.placeholder,
          };

          list.push(obj);
        }
      });
      return list;
    },
    goBack() {
      if (this.currentPage === 2) {
        this.$refs.transfer.updateTransfer();
      }
      this.currentPage = this.currentPage - 1 === 0 ? 0 : this.currentPage - 1;
    },
    setPage(page) {
      this.currentPage = page;
    },
    goNext() {
      if (this.currentPage === 1) {
        this.$refs.basic.updateBasic();
      } else if (this.currentPage === 2) {
        this.$refs.transfer.updateTransfer();
      }
      this.currentPage = this.currentPage === FINAL_PAGE ? FINAL_PAGE : this.currentPage + 1;
    },
    basicOptionsToUser(major, minor) {
      const userMajorsAcronym = [];
      const userMajorsFN = [];
      for (let i = 0; i < major.length; i += 1) {
        if (major[i].placeholder !== 'Select one') {
          userMajorsAcronym.push(major[i].acronym);
          userMajorsFN.push(major[i].placeholder);
        }
      }
      const userMinorsAcronym = [];
      const userMinorsFN = [];
      for (let i = 0; i < minor.length; i += 1) {
        if (minor[i].placeholder !== 'Select one') {
          userMinorsAcronym.push(minor[i].acronym);
          userMinorsFN.push(minor[i].placeholder);
        }
      }
      const basicData = {
        userMajorsAcronym,
        userMajorsFN,
        userMinorsAcronym,
        userMinorsFN,
      };
      return basicData;
    },
    updateBasic(newMajor, newCollege, newMinor, name) {
      const basicData = this.basicOptionsToUser(newMajor, newMinor);
      this.displayOptions.major = newMajor;
      this.user.major = basicData.userMajorsAcronym;
      this.user.majorFN = basicData.userMajorsFN;
      this.displayOptions.minor = newMinor;
      this.user.minor = basicData.userMinorsAcronym;
      this.user.minorFN = basicData.userMinorsFN;
      this.displayOptions.college = newCollege;
      // in this format since we may support multiple colleges in future
      this.user.college = newCollege[0].acronym;
      this.user.collegeFN = newCollege[0].placeholder;
      this.firstName = name.firstName;
      this.user.firstName = name.firstName;
      this.middleName = name.middleName;
      this.user.middleName = name.middleName;
      this.lastName = name.lastName;
      this.user.lastName = name.lastName;
      this.keyCounter += 1;
    },
    transferOptionsToUser(exam, classes) {
      const userExams = [];
      for (let i = 0; i < exam.length; i += 1) {
        if (
          exam[i].score !== undefined &&
          exam[i].score.placeholder !== '0' &&
          exam[i].subject.placeholder !== 'Select one'
        ) {
          const currExam = {
            equivCourse: exam[i].equivCourse,
            score: exam[i].score.placeholder,
            subject: exam[i].subject.placeholder,
            type: exam[i].type.placeholder,
          };
          userExams.push(currExam);
        }
      }
      const userClasses = [];
      for (let i = 0; i < classes.length; i += 1) {
        if (classes[i].class !== 'Select one') {
          userClasses.push(classes[i]);
        }
      }
      const transferData = {
        userExams,
        userClasses,
      };
      return transferData;
    },
    updateTransfer(exam, classes, tookSwim) {
      const convertedData = this.transferOptionsToUser(exam, classes);
      this.displayOptions.exam = exam;
      this.user.exam = convertedData.userExams;
      this.displayOptions.class = classes;
      this.user.transferCourse = convertedData.userClasses;
      this.tookSwim = tookSwim;
      this.user.tookSwim = tookSwim;
      this.keyCounter += 1;
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

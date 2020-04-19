<template>
  <div class="onboarding">
    <div class="onboarding-main">
      <div v-if="isEditingProfile" class="onboarding-cancel" @click="$emit('cancelOnboarding')">
        <img class="onboarding-cancel-icon" src="@/assets/images/x.svg" alt="X">
      </div>
      <div class="onboarding-content" :class="{ editing: isEditingProfile }">
        <div class="onboarding-top">
          <div v-if="!isEditingProfile" class="onboarding-header">👏 Welcome to CoursePlan</div>
          <div v-if="isEditingProfile" class="onboarding-header">👋 Hi {{ user.firstName }}</div>
          <div v-if="!isEditingProfile" class="onboarding-description">Let's get to know you first!</div>
          <div v-if="isEditingProfile" class="onboarding-description">Let's edit your profile!</div>
          <onboardingBasic v-if="currentPage == 1"
            :user="user"
            @update="updateBasic"/>
          <onboardingTransfer v-if="currentPage == 2"
            :user="user"
            @update="updateTransfer"
            />
        </div>
      </div>
      <div class="onboarding-bottom">
        <div class="onboarding-bottom--section onboarding-bottom--section---center">
          <img class="timeline" :src="require(`@/assets/images/timeline${currentPage}.svg`)" alt="X">
        </div>
        <div v-if="currentPage==3" class="onboarding-bottom--section onboarding-bottom--section---center">
          <button class="onboarding-button" @click="submitOnboarding">Finish</button>
        </div>
        <div v-else class="onboarding-bottom--section">
          <div class="onboarding-bottom--contents" @click="$emit('cancelOnboarding')">
            <label class="onboarding-bottom--text">Skip for now</label>
          </div>
          <div class="onboarding-bottom--contents">
            <button class="onboarding-button" @click="goBack"> Prev </button>
            <button class="onboarding-button" @click="goNext">Next</button>
          </div>
        </div>
        <div class="onboarding-error" :class="{ 'onboarding--hidden': !isError }">Please fill out all required fields and try again.</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import reqsData from '@/requirements/typed-requirement-json';
import OnboardingBasic from '@/components/Modals/OnboardingBasic';
import OnboardingTransfer from '@/components/Modals/OnboardingTransfer';

require('@/assets/images/timeline1.svg');

Vue.component('onboardingBasic', OnboardingBasic);
Vue.component('onboardingTransfer', OnboardingTransfer);

const placeholderText = 'Select one';

const clickOutside = {
  bind(el, binding, vnode) {
    el.event = event => {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event, binding.arg);
      }
    };
    document.body.addEventListener('click', el.event);
  },
  unbind(el) {
    document.body.removeEventListener('click', el.event);
  }
};

export default {
  props: {
    isEditingProfile: Boolean,
    user: Object
  },
  data() {
    // Set dropdown colleges and majors if already filled out
    let collegeText = placeholderText;
    let collegeAcronym = '';
    let collegePlaceholderColor = '';
    if (this.user.college !== '') {
      collegeText = this.user.collegeFN;
      collegeAcronym = this.user.college;
      collegePlaceholderColor = '#757575';
    }

    let majorText = placeholderText;
    let majorAcronym = '';
    let majorPlaceholderColor = '';
    if ('major' in this.user && this.user.major.length > 0) {
      majorText = this.user.majorFN;
      majorAcronym = this.user.major;
      majorPlaceholderColor = '#757575';
    }

    return {
      // TODO: Get real college, major, and minor lists
      currentPage: 1,
      colleges: {},
      majors: {},
      minors: {},
      firstName: this.user.firstName,
      middleName: this.user.middleName,
      lastName: this.user.lastName,
      displayOptions: {
        college: [
          {
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholderColor: collegePlaceholderColor,
            placeholder: collegeText,
            acronym: collegeAcronym
          }
        ],
        major: [
          {
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholderColor: majorPlaceholderColor,
            placeholder: majorText,
            acronym: majorAcronym
          }
        ],
        minor: [
          {
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholderColor: '',
            placeholder: placeholderText,
            acronym: ''
          }
        ]
      },
      isError: false
    };
  },
  directives: {
    'click-outside': clickOutside
  },
  methods: {
    submitOnboarding() {
      // Display error if a required field is empty, otherwise submit
      if (this.firstName === '' || this.lastName === '' || this.noOptionSelected(this.displayOptions.college)) {
        this.isError = true;
      } else {
        const onboardingData = {
          name: {
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName
          },
          userData: {
            colleges: this.notPlaceholderOptions(this.displayOptions.college),
            majors: this.notPlaceholderOptions(this.displayOptions.major),
            minors: this.notPlaceholderOptions(this.displayOptions.minor)
          }
        };

        this.$emit('onboard', onboardingData);
      }
    },
    // check to see if a set of options (college, major, minor) only has placeholder texts (so no options selected)
    noOptionSelected(options) {
      let bool = true;
      options.forEach(option => {
        if (option.placeholder !== placeholderText) {
          bool = false;
        }
      });

      return bool;
    },
    notPlaceholderOptions(options) {
      const list = [];
      options.forEach(option => {
        if (option.placeholder !== placeholderText) {
          const obj = {
            acronym: option.acronym,
            fullName: option.placeholder
          };

          list.push(obj);
        }
      });

      return list;
    },
    goBack() {
      this.currentPage = (this.currentPage - 1 === 0) ? 0 : this.currentPage - 1;
    },
    goNext() {
      this.currentPage = (this.currentPage + 1 === 4) ? 3 : this.currentPage + 1;
      console.log(this.currentPage);
    },
    updateBasic(newMajor) {
      console.log('hi');
      this.displayOptions.major = newMajor;
    }

  }
};

</script>

<style scoped lang="scss">
  @import '@/components/Modals/Onboarding.scss';
</style>

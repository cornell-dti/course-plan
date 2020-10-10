<template>
  <div class="onboarding">
    <div class="onboarding-main">
      <div v-if="isEditingProfile" class="onboarding-cancel" @click="cancel">
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
            @updateBasic="updateBasic"/>
          <onboardingTransfer v-if="currentPage == 2"
            :user="user"
            @updateTransfer="updateTransfer"
            />
        </div>
      </div>
      <div class="onboarding-bottom">
        <div class="onboarding-bottom--section onboarding-bottom--section---center">
          <img class="timeline" :src="require(`@/assets/images/timeline${currentPage}.svg`)" alt="X">
        </div>
        <div v-if="currentPage==3" class="onboarding-bottom--section onboarding-bottom--section---center">
          <div class="onboarding-bottom--contents" @click="cancel">
            <label class="onboarding-bottom--text">Skip for now</label>
          </div>
          <div class="onboarding-bottom--contents">
            <button class="onboarding-button" @click="goBack"> Prev </button>
            <button class="onboarding-button" @click="submitOnboarding">Finish</button>
         </div>
        </div>
<<<<<<< HEAD
        <div v-else class="onboarding-bottom--section">
          <div class="onboarding-bottom--contents" @click="cancel">
            <label class="onboarding-bottom--text">Skip for now</label>
=======
        <div class="onboarding-section">
          <!-- TODO: Multiple colleges -->
          <div class="onboarding-subHeader">Your College</div>
          <div class="onboarding-inputs">
            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <label class="onboarding-label">Your College (required)</label>
              <div class="onboarding-selectWrapper">
                <div
                  class="onboarding-select onboarding-input"
                  :class="{ 'onboarding-select--disabled': Object.keys(colleges).length <= 0 }"
                  id="college"
                  v-for="(options, index) in displayOptions.college"
                  :key = index
                  :style="{ borderColor: options.boxBorder }"
                  v-click-outside:[index]="closeCollegeDropdownIfOpen"
                >
                  <div class="onboarding-dropdown-placeholder college-wrapper" @click="showHideCollegeContent(index)">
                    <div
                      class="onboarding-dropdown-placeholder college-placeholder"
                      id="college-placeholder"
                      :style="{ color: options.placeholderColor }"
                    >
                      {{ options.placeholder }}
                    </div>
                    <div
                      class="onboarding-dropdown-placeholder college-arrow"
                      id="college-arrow"
                      :style="{ borderTopColor: options.arrowColor }"
                    ></div>
                  </div>
                  <div
                    class="onboarding-dropdown-content college-content"
                    id="college-content"
                    v-if="options.shown"
                  >
                    <div
                      v-for="(college, acronym) in colleges"
                      :key="acronym"
                      :id="college"
                      class="onboarding-dropdown-content-item"
                      @click="selectCollege(college, acronym, index)"
                    >
                      {{ college }}
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <label class="onboarding-label">Your Major (optional)</label>
              <div class="onboarding-selectWrapper">
                <div
                  class="onboarding-select onboarding-input"
                  :class="{ 'onboarding-select--disabled': Object.keys(majors).length <= 0 }"
                  id="major"
                  v-for="(options, index) in displayOptions.major"
                  :key = index
                  :style="{ borderColor: options.boxBorder }"
                  v-click-outside:[index]="closeMajorDropdownIfOpen"
                >
                  <div class="onboarding-dropdown-placeholder major-wrapper" @click="showHideMajorContent(index)">
                    <div
                      class="onboarding-dropdown-placeholder major-placeholder"
                      id="major-placeholder"
                      :style="{ color: options.placeholderColor }"
                    >
                      {{options.placeholder}}
                    </div>
                    <div
                      class="onboarding-dropdown-placeholder major-arrow"
                      id="major-arrow"
                      :style="{ borderTopColor: options.arrowColor }"
                    ></div>
                  </div>
                  <div
                    class="onboarding-dropdown-content major-content"
                    id="major-content"
                    v-if="options.shown"
                  >
                    <div
                      v-for="(major, acronym) in majors"
                      :key="acronym"
                      :id="major"
                      class="onboarding-dropdown-content-item"
                      @click="selectMajor(major, acronym, index)"
                    >
                      {{ major }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="onboarding-addRemoveWrapper" :class="{ 'onboarding--hidden': Object.keys(majors).length <= 0}">
                <div class="onboarding-add" @click="addMajor">
                  Add
                </div>
                <div class="onboarding-remove" @click="removeMajor" :class="{'onboarding--hidden': displayOptions.major.length === 1 && displayOptions.major[0].placeholder == placeholderText}">
                  Remove
                </div>
              </div>
            </div>

            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <label class="onboarding-label">Your Minor (optional)</label>
              <div class="onboarding-selectWrapper">
                <div
                  class="onboarding-select onboarding-input"
                  id="minor"
                  v-for="(options, index) in displayOptions.minor"
                  :key = index
                  :style="{ borderColor: options.boxBorder }"
                  v-click-outside:[index]="closeMinorDropdownIfOpen"
                >
                  <div class="onboarding-dropdown-placeholder minor-wrapper" @click="showHideMinorContent(index)">
                    <div
                      class="onboarding-dropdown-placeholder minor-placeholder"
                      id="minor-placeholder"
                      :style="{ color: options.placeholderColor }"
                    >
                      {{ options.placeholder }}
                    </div>
                    <div
                      class="onboarding-dropdown-placeholder minor-arrow"
                      id="minor-arrow"
                      :style="{ borderTopColor: options.arrowColor }"
                    ></div>
                  </div>
                  <div
                    class="onboarding-dropdown-content minor-content"
                    id="minor-content"
                    v-if="options.shown"
                  >
                    <div
                      v-for="(minor, acronym) in minors"
                      :key="acronym"
                      :id="minor"
                      class="onboarding-dropdown-content-item"
                      @click="selectMinor(minor, acronym, index)"
                    >
                      {{ minor }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="onboarding-addRemoveWrapper" :class="{ 'onboarding--hidden': Object.keys(minors).length <= 0}">
                <div class="onboarding-add" @click="addMinor">
                  Add
                </div>
                <div class="onboarding-remove" @click="removeMinor" :class="{'onboarding--hidden': displayOptions.minor.length === 1 && displayOptions.minor[0].placeholder == placeholderText}">
                  Remove
                </div>
              </div>
            </div>

>>>>>>> 2891bbf470e10b44ff9cdc37460dda0d32fb6aa5
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
const FINAL_PAGE = 3;
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

    let minorText = placeholderText;
    let minorAcronym = '';
    let minorPlaceholderColor = '';
    if ('minor' in this.user && this.user.minor.length > 0) {
      minorText = this.user.minorFN;
      minorAcronym = this.user.minor;
      minorPlaceholderColor = '#757575';
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
      tookSwim: '',
      placeholderText,
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
            placeholderColor: minorPlaceholderColor,
            placeholder: minorText,
            acronym: minorAcronym
          }
        ],
        exam: [],
        class: []
      },
      isError: false
    };
  },
  directives: {
    'click-outside': clickOutside
  },
  mounted() {
    this.setCollegesMap();
    this.setMajorsList();
    this.setMinorsList();
    this.flattenDisplayMajors();
    this.flattenDisplayMinors();
  },
  methods: {
    flattenDisplayMajors() {
      const majors = [];
      this.displayOptions.major.forEach(major => {
        if (Array.isArray(major.acronym)) {
          major.acronym.flat(Infinity);
          for (let i = 0; i < major.acronym.length; i += 1) {
            const newMajor = {
              shown: false,
              stopClose: false,
              boxBorder: '',
              arrowColor: '',
              placeholderColor: '#757575',
              placeholder: major.placeholder[i],
              acronym: major.acronym[i]
            };
            majors.push(newMajor);
          }
        } else {
          majors.push({
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholderColor: '',
            placeholder: major.placeholder,
            acronym: major.acronym
          });
        }
      });
      this.displayOptions.major = majors;
    },
    flattenDisplayMinors() {
      const minors = [];
      this.displayOptions.minor.forEach(minor => {
        if (Array.isArray(minor.acronym)) {
          minor.acronym.flat(Infinity);
          for (let i = 0; i < minor.acronym.length; i += 1) {
            const newminor = {
              shown: false,
              stopClose: false,
              boxBorder: '',
              arrowColor: '',
              placeholderColor: '#757575',
              placeholder: minor.placeholder[i],
              acronym: minor.acronym[i]
            };
            minors.push(newminor);
          }
        } else {
          minors.push({
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholderColor: '',
            placeholder: minor.placeholder,
            acronym: minor.acronym
          });
        }
      });
      this.displayOptions.minor = minors;
    },
    // Set the colleges map to with acronym keys and full name values
    setCollegesMap() {
      /** @type {Object.<string, string>} */
      const colleges = {};
      const collegeJSON = reqsData.college;
      Object.keys(collegeJSON).forEach(key => {
        colleges[key] = collegeJSON[key].name;
      });
      this.colleges = colleges;
    },
    // Set the majors map to with acronym keys and full name values
    setMajorsList() {
      /** @type {Object.<string, string>} */
      const majors = {};
      const majorJSON = reqsData.major;
      Object.keys(majorJSON).forEach(key => {
        // make sure name defined
        // only show majors for schools the user is in
        for (let i = 0; i < this.displayOptions.college.length; i += 1) {
          const college = this.displayOptions.college[i];
          if (majorJSON[key].schools.includes(college.acronym)) {
            majors[key] = majorJSON[key].name;
          }
        }
      });
      this.majors = majors;
    },
    // TODO: add minors when the list exists
    setMinorsList() {
      const minors = {};
      const minorJSON = reqsData.minor;
      for (const key in minorJSON) {
        // make sure name defined
        if ('name' in minorJSON[key]) {
          // only show majors for schools the user is in
          for (let i = 0; i < this.displayOptions.college.length; i += 1) {
            minors[key] = minorJSON[key].name;
          }
        }
      }
      this.minors = minors;
    },
    // Clear a major if a new college is selected and the major is not in it
    clearMajorIfNotInCollege() {
      const majorJSON = reqsData.major;
      for (let x = 0; x < this.displayOptions.major.length; x += 1) {
        const major = this.displayOptions.major[x];
        let foundCollege = false;
        // Do nothing if no major set
        if (major.acronym !== '') {
          for (let i = 0; i < this.displayOptions.college.length; i += 1) {
            const college = this.displayOptions.college[i];
            if (majorJSON[major.acronym].schools.includes(college.acronym)) {
              foundCollege = true;
              break;
            }
          }
        }
        if (!foundCollege) {
          major.placeholderColor = '';
          major.placeholder = placeholderText;
          major.acronym = '';
        }
      }
    },
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
            minors: this.notPlaceholderOptions(this.displayOptions.minor),
            exam: this.notPlaceholderOptionsExam(this.displayOptions.exam),
            class: this.notPlaceholderOptionsClass(this.displayOptions.class),
            tookSwim: this.tookSwim
          }
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
      this.currentPage = (this.currentPage === FINAL_PAGE) ? FINAL_PAGE : this.currentPage + 1;
    },
    updateBasic(newMajor, newCollege, newMinor) {
      this.displayOptions.major = newMajor;
      this.displayOptions.minor = newMinor;
      this.displayOptions.college = newCollege;
    },
    removeMajor() {
      this.displayOptions.major.pop();
      if (this.displayOptions.major.length === 0) {
        this.addMajor();
      }
    },
    updateTransfer(exam, classes, tookSwim) {
      this.displayOptions.exam = exam;
      this.displayOptions.class = classes;
      this.tookSwim = tookSwim;
    },
    cancel() {
      this.$emit('cancelOnboarding');
    },
    removeMinor() {
      this.displayOptions.minor.pop();
      if (this.displayOptions.minor.length === 0) {
        this.addMinor();
      }
    }
  }
};
</script>
<style scoped lang="scss">
  @import '@/components/Modals/Onboarding.scss';
</style>

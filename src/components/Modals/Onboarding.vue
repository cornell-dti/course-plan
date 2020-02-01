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
        </div>
        <div class="onboarding-section">
          <div class="onboarding-subHeader">Your Name</div>
          <div class="onboarding-inputs onboarding-inputs--name">
            <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
              <label class="onboarding-label">First Name*</label>
              <input class="onboarding-input" v-model="firstName" />
            </div>
            <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
              <label class="onboarding-label">Middle Name</label>
              <input class="onboarding-input" v-model="middleName" />
            </div>
            <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
              <label class="onboarding-label">Last Name*</label>
              <input class="onboarding-input" v-model="lastName" />
            </div>
          </div>
        </div>
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
              <label class="onboarding-label">Your Major</label>
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
                      {{ options.placeholder }}
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
                <div class="onboarding-remove" @click="removeMajor" :class="{ 'onboarding--hidden': displayOptions.major.length <= 1 }">
                  Remove
                </div>
              </div>
            </div>
            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <label class="onboarding-label">Your Minor (optional)</label>
              <div class="onboarding-selectWrapper">
                <div
                  class="onboarding-select onboarding-input"
                  :class="{ 'onboarding-select--disabled': Object.keys(minors).length <= 0 }"
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
                <div class="onboarding-remove" @click="removeMinor" :class="{ 'onboarding--hidden': displayOptions.minor.length <= 1 }">
                  Remove
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="onboarding-bottom">
        <button class="onboarding-button" @click="submitOnboarding">Continue</button>
        <div class="onboarding-error" :class="{ 'onboarding--hidden': !isError }">Please fill out all required fields and try again.</div>
      </div>
    </div>
  </div>
</template>

<script>
import reqsData from '@/requirements/reqs.json';

const placeholderText = 'Select one';

const clickOutside = {
  bind(el, binding, vnode) {
    el.event = function (event) {
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
      reqsData,
      // TODO: Get real college, major, and minor lists
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
  mounted() {
    this.setCollegesMap();
    this.setMajorsList();
    this.setMinorsList();
  },
  methods: {
    // Set the colleges map to with acronym keys and full name values
    setCollegesMap() {
      const colleges = {};
      const collegeJSON = reqsData.college;
      for (const key in collegeJSON) {
        if ('name' in collegeJSON[key]) {
          colleges[key] = collegeJSON[key].name;
        }
      }

      this.colleges = colleges;
    },
    // Set the majors map to with acronym keys and full name values
    setMajorsList() {
      const majors = {};
      const majorJSON = reqsData.major;
      for (const key in majorJSON) {
        // make sure name defined
        if ('name' in majorJSON[key]) {
          // only show majors for schools the user is in
          for (let i = 0; i < this.displayOptions.college.length; i += 1) {
            const college = this.displayOptions.college[i];
            if (majorJSON[key].schools.includes(college.acronym)) {
              majors[key] = majorJSON[key].name;
              continue;
            }
          }
        }
      }
      this.majors = majors;
    },
    // TODO: add minors when the list exists
    setMinorsList() {
      this.minors = {};
    },
    // Clear a major if a new college is selected and the major is not in it
    clearMajorIfNotInCollege() {
      // Do nothing if no major set
      if (this.displayOptions.major.length === 1 && this.displayOptions.major[0].acronym === '') {
        return;
      }
      const majorJSON = reqsData.major;
      for (let x = 0; x < this.displayOptions.major.length; x += 1) {
        const major = this.displayOptions.major[x];
        let foundCollege = false;
        for (let i = 0; i < this.displayOptions.college.length; i += 1) {
          const college = this.displayOptions.college[i];
          if (majorJSON[major.acronym].schools.includes(college.acronym)) {
            foundCollege = true;
            break;
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
    showHideContent(type, i) {
      let displayOptions = this.displayOptions[type];
      displayOptions = displayOptions[i];
      const contentShown = displayOptions.shown;
      displayOptions.shown = !contentShown;

      if (contentShown) {
        // clicked box when content shown. So then hide content
        displayOptions.boxBorder = '#C4C4C4';
        displayOptions.arrowColor = '#C4C4C4';
      } else {
        displayOptions.boxBorder = '#32A0F2';
        displayOptions.arrowColor = '#32A0F2';
      }
    },
    showHideCollegeContent(i) {
      this.showHideContent('college', i);
    },
    showHideMajorContent(i) {
      this.showHideContent('major', i);
    },
    showHideMinorContent(i) {
      this.showHideContent('minor', i);
    },
    closeDropdownIfOpen(type, i) {
      let displayOptions = this.displayOptions[type];
      displayOptions = displayOptions[i];
      if (displayOptions.stopClose) {
        displayOptions.stopClose = false;
      } else if (displayOptions.shown) {
        displayOptions.shown = false;
        displayOptions.boxBorder = '#C4C4C4';
        displayOptions.arrowColor = '#C4C4C4';
      }
    },
    closeCollegeDropdownIfOpen(event, i) {
      this.closeDropdownIfOpen('college', i);
    },
    closeMajorDropdownIfOpen(event, i) {
      this.closeDropdownIfOpen('major', i);
    },
    closeMinorDropdownIfOpen(event, i) {
      this.closeDropdownIfOpen('minor', i);
    },
    selectOption(type, text, acronym, i) {
      let displayOptions = this.displayOptions[type];
      displayOptions = displayOptions[i];
      displayOptions.placeholder = text;
      displayOptions.acronym = acronym;
      displayOptions.shown = false;
      displayOptions.arrowColor = '#C4C4C4';
      displayOptions.boxBorder = '#C4C4C4';
      displayOptions.placeholderColor = '#757575';
    },
    selectCollege(text, acronym, i) {
      this.selectOption('college', text, acronym, i);
      this.setMajorsList();
      this.clearMajorIfNotInCollege();
    },
    selectMajor(text, acronym, i) {
      this.selectOption('major', text, acronym, i);
    },
    selectMinor(text, acronym, i) {
      this.selectOption('minor', text, acronym, i);
    },
    addMajor() {
      const newMajor = {
        shown: false,
        stopClose: false,
        boxBorder: '',
        arrowColor: '',
        placeholderColor: '',
        placeholder: placeholderText,
        acronym: ''
      };
      this.displayOptions.major.push(newMajor);
    },
    removeMajor() {
      this.displayOptions.major.pop();
    },
    addMinor() {
      const minor = {
        shown: false,
        stopClose: false,
        boxBorder: '',
        arrowColor: '',
        placeholderColor: '',
        placeholder: placeholderText
      };
      this.displayOptions.minor.push(minor);
    },
    removeMinor() {
      this.displayOptions.minor.pop();
    }
  }
};

</script>

<style scoped lang="scss">
.onboarding {
  padding: 1rem;

  &-main {
    background: #ffffff;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    width: 36rem;
  }

  &-cancel {
    cursor: pointer;
    text-align: right;

    &-icon {
      margin: 25px 25px 0 0;
    }
  }

  &-content {
    padding: 2.5rem 2.5rem 0 2.5rem;
  }

  &-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
  }

  &-header {
    // TODO: font-size is 40px on designs, but does not fit
    font-weight: bold;
    font-size: 38px;
    color: #4F4F4F;
  }

  &-description {
    font-weight: 300;
    font-size: 20px;
    line-height: 24px;

    color: #757575;
  }

  &-section {
    margin-bottom: 1rem;
  }

  &-inputs {
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 9px;

    padding: 2rem;

    &--name {
      display: flex;
    }
  }

  &-subHeader {
    font-size: 24px;
    line-height: 29px;

    color: #757575;
    margin-bottom: .75rem;
  }

  &-label {
    font-size: 16px;
    line-height: 19px;
    color: #757575;

    margin-bottom: .5rem;
  }

  &-input {
    font-size: 14px;
    line-height: 17px;
    color: #757575;
    width: 100%;
    height: 1.75rem;

    background-color: white;
    border: 0.5px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 2px;
  }

  &-inputWrapper {
    &--name {
      width: calc(100% / 3);

      &:not(:last-child) {
        margin-right: 1.5rem;
      }
    }

    &--college {
      &:not(:last-child) {
        margin-bottom: 1rem;
      }
      &:first-child {
        margin-bottom: 2rem;
      }
    }
  }

  &-addRemoveWrapper {
    margin-top: .5rem;
    display: flex;
    justify-content: flex-end;

    font-size: 14px;
    line-height: 16px;
  }

  &-add {
    cursor: pointer;
    color: #1AA9A5;
  }

  &-remove {
    cursor: pointer;
    margin-left: .5rem;
    color: #FF7979
  }

  &-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;

    border-top: 1px solid #E5E5E5;
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 9px;
    padding-top: 1rem;
    height: 5.25rem;
  }

  &-button {
    background: #1AA9A5;
    border: 0;
    box-sizing: border-box;
    border-radius: 5px;
    font-size: 14px;
    line-height: 14px;
    color: #FFFFFF;

    width: 20rem;
    min-height: 1.75rem;

    &:hover,
    &:focus,
    &:active {
      background: #D7D7D7;
    }
  }

  &-error {
    margin-top: .5rem;
    font-size: 14px;
    line-height: 17px;
    color: #D8000C;
  }

  &-select {
    background: #ffffff;
    border: 1px solid #c4c4c4;

    box-sizing: border-box;
    border-radius: 1px;
    width: 100%;
    font-size: 14px;
    line-height: 17px;

    color: #b6b6b6;
    position: relative;

    &:not(:first-child) {
      margin-top: .5rem;
    }

    &--disabled {
      opacity: 0.3;
      pointer-events: none;
    }
  }

  &-dropdown {
    &-placeholder {
      height: 100%;
      font-size: 14px;
      line-height: 17px;
      margin-left: .25rem;
      display: flex;
      align-items: center;

      color: #b6b6b6;

      background: transparent;

      &.college-wrapper,
      &.major-wrapper,
      &.minor-wrapper {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
      }

      &.college-wrapper,
      &.major-wrapper,
      &.minor-wrapper {
        width: 100%;
        height: 100%;
      }

      &.college-placeholder,
      &.major-placeholder,
      &.minor-placeholder {
        margin-top: 5px;
        margin-bottom: 5px;
        width: 100%;
      }

      &.college-arrow,
      &.major-arrow,
      &.minor-arrow {
        border-left: 6.24px solid transparent;
        border-right: 6.24px solid transparent;

        border-top: 6.24px solid #c4c4c4;
        background: transparent;

        //when clicked border-top-color: #32A0F2;

        margin-top: 30px;
        margin-bottom: 10.17px;

        margin-right: 8.7px;
        margin-left: 5px;
      }
    }
  }

  &-dropdown-content {
    z-index: 2;
    position: absolute;
    width: inherit;
    background: #ffffff;
    box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
    border-radius: 7px;

    margin-top: 3px;

    &-item {
      height: 2.25rem;
      font-size: 14px;
      line-height: 17px;
      display: flex;
      align-items: center;

      color: #757575;

      padding-left: 10px;
    }
  }

  &-dropdown-content div:hover {
    background: rgba(50, 160, 242, 0.15);
    width: 100%;
  }

  &--hidden {
    display: none;
  }
}

.editing {
  padding-top: 0;
}

select option {
  color: black;
}
select option:first-child {
  color: grey;
}
select.empty {
  color: grey;
}
/* Hidden placeholder */
select option[disabled]:first-child {
  display: none;
}

</style>

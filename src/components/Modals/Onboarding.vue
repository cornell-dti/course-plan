<template>
  <div class="onboarding">
    <div class="onboarding-main">
      <div class="onboarding-content">
        <div class="onboarding-top">
          <div class="onboarding-header">👏Welcome to CoursePlan</div>
          <div class="onboarding-description">Let's get to know you first!</div>
        </div>
        <div class="onboarding-section">
          <div class="onboarding-subHeader">Your Name</div>
          <div class="onboarding-inputs onboarding-inputs--name">
            <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
              <!-- TODO: Autofill -->
              <label class="onboarding-label">First Name*</label>
              <input class="onboarding-input" :value="firstName" />
            </div>
            <!-- TODO: Optional vs Required -->
            <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
              <label class="onboarding-label">Middle Name</label>
              <input class="onboarding-input" v-model="middleName" />
            </div>
            <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
              <label class="onboarding-label">Last Name*</label>
              <input class="onboarding-input" :value="lastName" />
            </div>
          </div>
        </div>
        <div class="onboarding-section">
          <!-- TODO: Multiple colleges -->
          <div class="onboarding-subHeader">Your College</div>
          <div class="onboarding-inputs">
            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <label class="onboarding-label">Your College*</label>
              <div
                class="onboarding-select onboarding-input"
                id="college"
                :style="{ borderColor: displayOptions.college.boxBorder }"
              >
                <div class="onboarding-dropdown-placeholder college-wrapper" @click="showHideCollegeContent">
                  <div
                    class="onboarding-dropdown-placeholder college-placeholder"
                    id="college-placeholder"
                    :style="{ color: displayOptions.college.placeholderColor }"
                  >
                    {{ displayOptions.college.placeholder }}
                  </div>
                  <div
                    class="onboarding-dropdown-placeholder college-arrow"
                    id="college-arrow"
                    :style="{ borderTopColor: displayOptions.college.arrowColor }"
                  ></div>
                </div>
                <div
                  class="onboarding-dropdown-content college-content"
                  id="college-content"
                  v-if="displayOptions.college.shown"
                >
                  <div
                    v-for="college in colleges"
                    :key="college"
                    :id="college"
                    class="onboarding-dropdown-content-item"
                    @click="selectCollege(college)"
                  >
                    {{ college }}
                  </div>
                </div>
              </div>
            </div>
            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <!-- TODO: Add and remove functionality -->
              <label class="onboarding-label">Your Major*</label>
              <div
                class="onboarding-select onboarding-input"
                id="major"
                :style="{ borderColor: displayOptions.major.boxBorder }"
              >
                <div class="onboarding-dropdown-placeholder major-wrapper" @click="showHideMajorContent">
                  <div
                    class="onboarding-dropdown-placeholder major-placeholder"
                    id="major-placeholder"
                    :style="{ color: displayOptions.major.placeholderColor }"
                  >
                    {{ displayOptions.major.placeholder }}
                  </div>
                  <div
                    class="onboarding-dropdown-placeholder major-arrow"
                    id="major-arrow"
                    :style="{ borderTopColor: displayOptions.major.arrowColor }"
                  ></div>
                </div>
                <div
                  class="onboarding-dropdown-content major-content"
                  id="major-content"
                  v-if="displayOptions.major.shown"
                >
                  <div
                    v-for="major in majors"
                    :key="major"
                    :id="major"
                    class="onboarding-dropdown-content-item"
                    @click="selectMajor(major)"
                  >
                    {{ major }}
                  </div>
                </div>
              </div>
            </div>
            <!-- TODO: Autofill -->
            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <label class="onboarding-label">Your Minor</label>
              <div
                class="onboarding-select onboarding-input"
                id="minor"
                :style="{ borderColor: displayOptions.minor.boxBorder }"
              >
                <div class="onboarding-dropdown-placeholder minor-wrapper" @click="showHideMinorContent">
                  <div
                    class="onboarding-dropdown-placeholder minor-placeholder"
                    id="minor-placeholder"
                    :style="{ color: displayOptions.minor.placeholderColor }"
                  >
                    {{ displayOptions.minor.placeholder }}
                  </div>
                  <div
                    class="onboarding-dropdown-placeholder minor-arrow"
                    id="minor-arrow"
                    :style="{ borderTopColor: displayOptions.minor.arrowColor }"
                  ></div>
                </div>
                <div
                  class="onboarding-dropdown-content minor-content"
                  id="minor-content"
                  v-if="displayOptions.minor.shown"
                >
                  <div
                    v-for="minor in minors"
                    :key="minor"
                    :id="minor"
                    class="onboarding-dropdown-content-item"
                    @click="selectMinor(minor)"
                  >
                    {{ minor }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        <div class="onboarding-bottom">
        <button class="onboarding-button" @click="submitOnboarding">Continue</button>
      </div>
    </div>
  </div>
</template>

<script>
const placeholderText = 'Select one';
export default {
  props: {
    firstName: String,
    lastName: String
  },
  data() {
    return {
      // TODO: Get real college, major, and minor lists
      colleges: ['Engineering', 'Arts & Sciences', 'CALS'],
      majors: ['CS', 'INFO'],
      minors: ['CS', 'INFO'],
      middleName: "",
      displayOptions: {
        college: {
          shown: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: '',
          placeholder: placeholderText
        },
        major: {
          shown: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: '',
          placeholder: placeholderText
        },
        minor: {
          shown: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: '',
          placeholder: placeholderText
        }
      }
    }
  },
  methods: {
    submitOnboarding() {
      let onboardingData = {
        name: {
          firstName: this.firstName,
          middleName: this.middleName,
          lastName: this.lastName,
        },
        userData: {
          college: this.displayOptions.college.placeholder,
          major: this.displayOptions.major.placeholder,
          minor: this.displayOptions.minor.placeholder,
        }
      }

      // If set to the placeholderText, set to an empty string
      Object.keys(onboardingData.userData).forEach(function(key) {
        if(onboardingData.userData[key] === placeholderText) {
          onboardingData.userData[key] = "";
        }
      });

      this.$emit('onboard', onboardingData);
    },
    showHideContent(contentID) {
      const displayOptions = this.displayOptions[contentID];
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
    showHideCollegeContent() {
      this.showHideContent('college');
    },
    showHideMajorContent() {
      this.showHideContent('major');
    },
    showHideMinorContent() {
      this.showHideContent('minor');
    },
    selectOption(type, text) {
      const displayOptions = this.displayOptions[type];
      displayOptions.placeholder = text;
      displayOptions.shown = false;
      displayOptions.arrowColor = '#C4C4C4';
      displayOptions.placeholderColor = '#757575';
    },
    selectCollege(text) {
      this.selectOption('college', text);
    },
    selectMajor(text) {
      this.selectOption('major', text);
    },
    selectMinor(text) {
      this.selectOption('minor', text);
    },
    resetDropdown(type) {
      let displayOptions = this.displayOptions[type];
      displayOptions.shown = false;
      displayOptions.boxBorder = '#C4C4C4';
      displayOptions.arrowColor = '#C4C4C4';
      displayOptions.placeholderColor = '#B6B6B6';
      displayOptions.placeholder = 'Select one';
    },
    resetDropdowns() {
      this.resetDropdown('college');
      this.resetDropdown('major');
      this.resetDropdown('minor');
    }
  }
}

</script>

<style scoped lang="scss">
.onboarding {
  padding: 1rem;

  &-main {
    background: #ffffff;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 2.5rem;
    width: 36rem;
  }

  &-content {
    padding: 0 2.5rem 0 2.5rem;
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
    font-weight: 600;
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
        margin-bottom: 2rem;
      }
    }
  }

  &-bottom {
    display: flex;
    justify-content: center;

    border-top: 1px solid #E5E5E5;
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 9px;
    padding-top: 1rem;
    padding-bottom: 2.5rem;
  }

  &-button {
    background: #D7D7D7;
    border: 0.5px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 9px;

    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
    color: #FFFFFF;

    min-width: 20rem;
    min-height: 1.75rem;

    &:hover,
    &:focus,
    &:active {
      background: #1AA9A5;
    }
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
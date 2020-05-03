<template>
    <div class="onboarding">
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
              <label class="onboarding-label">Your Major!</label>
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
              <div class="onboarding-addRemoveWrapper" :class="{ 'onboarding--hidden': displayOptions.major.length <= 0}">
                <div class="onboarding-add" @click="addMajor">
                  Add
                </div>
                <div class="onboarding-remove" @click="removeMajor" :class="{ 'onboarding--hidden': displayOptions.major.length <= 1 }">
                  Remove
                </div>
              </div>
            </div>
            <!--
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
                <div class="onboarding-remove" @click="removeMinor" :class="{ 'onboarding--hidden': displayOptions.minor.length <= 1 }">
                  Remove
                </div>
              </div>
            </div>
            -->
    </div>
  </div>
</div>
</template>

<script>

import reqsData from '@/requirements/typed-requirement-json';

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
    this.flattenDisplayMajors();
    this.$emit('updateBasic', this.displayOptions.major, this.displayOptions.college, this.displayOptions.minor);
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
            const college = this.displayOptions.college[i];
            if (minorJSON[key].schools.includes(college.acronym)) {
              minors[key] = minorJSON[key].name;
            }
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
      this.$emit('updateBasic', this.displayOptions.major, this.displayOptions.college, this.displayOptions.minor);
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
    removeMajor() {
      this.displayOptions.major.pop();
    },
    removeMinor() {
      this.displayOptions.minor.pop();
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
      const majors = [];
      this.displayOptions.major.forEach(maj => {
        if (maj.length > 0) {
          maj.forEach(subMaj => {
            majors.push(subMaj);
          });
        } else {
          majors.push(maj);
        }
      });
      this.displayOptions.major = majors;
      this.displayOptions.major.push(newMajor);
    }
  }
};

</script>

<style scoped lang="scss">
  @import '@/components/Modals/Onboarding.scss';
</style>

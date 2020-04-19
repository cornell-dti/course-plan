<template>
    <div class="onboarding">
        <div class="onboarding-section">
          <div class="onboarding-subHeader">Cornell Swimming Test</div>
          <div class="onboarding-inputs onboarding-inputs--name">
            <div class="onboarding-inputWrapper">
              <label class="onboarding-label">Have you taken or planning on taking the Swim Test?</label>
              <div class="onboarding-inputs--radioWrapper">
                <input class="onboarding-inputs--radio" type="radio" v-model="tookSwimTest" value="yes">
                <label class="onboarding-inputs--radio--radioText" for="yes">Yes</label>
                <input class="onboarding-inputs--radio" type="radio" v-model="tookSwimTest" value="no">
                <label class="onboarding-inputs--radio--radioText" for="no">No</label>
              </div>
            </div>
          </div>
        </div>
        <div class="onboarding-section">
          <!-- TODO: Multiple colleges -->
          <div class="onboarding-subHeader">Transfer Credits (Optional)</div>
          <div class="onboarding-inputs">
            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <div class="onboarding-subHeader2">Test Credits</div>
              <div
                  class= "onboarding-section"
                  id="college"
                  v-for="(options, index) in displayOptions.exam"
                  :key = index
                  :style="{ borderColor: options.type.boxBorder }"
                  v-click-outside:[index]="closeCollegeDropdownIfOpen"
                >
               <label class="onboarding-label">Source/Type</label>
              <div class="onboarding-select onboarding-input">
                  <div class="onboarding-dropdown-placeholder college-wrapper" @click="showHideExamContent(index)">
                    <div
                      class="onboarding-dropdown-placeholder college-placeholder"
                      id="college-placeholder"
                      :style="{ color: options.type.placeholderColor }"
                    >
                      {{ options.type.placeholder }}
                    </div>
                    <div
                      class="onboarding-dropdown-placeholder college-arrow"
                      id="college-arrow"
                      :style="{ borderTopColor: options.type.arrowColor }"
                    ></div>
                  </div>
                  <div
                    class="onboarding-dropdown-content college-content"
                    id="college-content"
                    v-if="options.type.shown"
                  >
                    <div
                      v-for="(exam, acronym) in exams"
                      :key="acronym"
                      :id="exam"
                      class="onboarding-dropdown-content-item"
                      @click="selectExam(exam, acronym, index)"
                    >
                      {{ exam }}
                    </div>
                  </div>
              </div>
              <div class="onboarding-selectWrapperRow">
                <div class="onboarding-select--columnWide " >
                  <label class="onboarding-label">Subject</label>
                  <div class="onboarding-select onboarding-input">
                  <div class="onboarding-dropdown-placeholder college-wrapper" @click="showHideSubjectContent(index)">
                    <div
                      class="onboarding-dropdown-placeholder college-placeholder"
                      id="college-placeholder"
                      :style="{ color: options.subject.placeholderColor }"
                    >
                      {{ options.subject.placeholder }}
                    </div>
                    <div
                      class="onboarding-dropdown-placeholder college-arrow"
                      id="college-arrow"
                      :style="{ borderTopColor: options.subject.arrowColor }"
                    ></div>
                  </div>
                  <div
                    class="onboarding-dropdown-content college-content"
                    id="college-content"
                    v-if="options.subject.shown"
                  >
                    <div
                      v-for="(subject, acronym) in subjects"
                      :key="acronym"
                      :id="college"
                      class="onboarding-dropdown-content-item"
                      @click="selectSubject(subject, acronym, index)"
                    >
                      {{ subject }}
                    </div>
                  </div>
                  </div>
                </div>
                <div class="onboarding-select--column" >
                  <label class="onboarding-label">Score</label>
                  <div class="onboarding-select onboarding-input">
                  <div class="onboarding-dropdown-placeholder college-wrapper" @click="showHideScoreContent(index)">
                    <div
                      class="onboarding-dropdown-placeholder college-placeholder"
                      id="college-placeholder"
                      :style="{ color: options.score.placeholderColor }"
                    >
                      {{ options.score.placeholder }}
                    </div>
                    <div
                      class="onboarding-dropdown-placeholder college-arrow"
                      id="college-arrow"
                      :style="{ borderTopColor: options.score.arrowColor }"
                    ></div>
                  </div>
                  <div
                    class="onboarding-dropdown-content college-content"
                    id="college-content"
                    v-if="options.score.shown"
                  >
                    <div
                      v-for="(score, acronym) in scores"
                      :key="acronym"
                      :id="score"
                      class="onboarding-dropdown-content-item"
                      @click="selectScore(score, acronym, index)"
                    >
                      {{ score }}
                    </div>
                  </div>
                </div>
                </div>
                 </div>
              </div>
              <div class="onboarding-addRemoveWrapper">
                <div class="onboarding-add" @click="addExam">
                  Add
                </div>
                <div class="onboarding-remove" @click="removeMajor" >
                  Remove
                </div>
              </div>
            </div>
            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <div class="onboarding-subHeader2">Credits From Other Instituions</div>
              <label class="onboarding-label">Equivalent Cornell Class</label>
              <div class="onboarding-selectWrapper">
                <div
                  class="onboarding-select onboarding-input"
                  id="major"
                  v-for="(options, index) in displayOptions.class"
                  :key = index
                  :style="{ borderColor: options.boxBorder }"
                  v-click-outside:[index]="closeMajorDropdownIfOpen"
                >
                  <div class="onboarding-dropdown-placeholder major-wrapper" @click="showHideClassContent(index)">
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
                      v-for="(major, acronym) in classes"
                      :key="acronym"
                      :id="major"
                      class="onboarding-dropdown-content-item"
                      @click="selectClass(major, acronym, index)"
                    >
                      {{ major }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="onboarding-addRemoveWrapper">
                <div class="onboarding-add" @click="addMajor">
                  Add
                </div>
                <div class="onboarding-remove" @click="removeMajor">
                  Remove
                </div>
              </div>
            </div>
            <div class="onboarding-bottomWrapper">
              <div class=" onboarding-label--bottom">
              <label class=" onboarding-label" >Total Non-Cornell Credits</label>
              </div>
              <div class="onboarding-label--bottom">
                <label class=" onboarding-label onboarding-label--bottom---bold">4 </label>
                <label class="onboarding-label"> Credits</label>
              </div>
            </div>
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
      // :class="{ 'onboarding--hidden': displayOptions.major.length <= 1 }"
      tookSwimTest: '',
      colleges: {},
      majors: {},
      minors: {},
      scores: ['0', '1', '2', '3', '4'], // for based on exam
      classes: ['CS 1110: Introduction to Computing Using Python', 'CS 1110: Introduction to Computing Using Python'],
      exams: ['AP', 'IB'],
      subjects: ['Chemistry', 'Physics I', 'Physics II', 'Calculas AB', 'Calculas BC', 'Biology', 'French'], // fix
      firstName: this.user.firstName,
      middleName: this.user.middleName,
      lastName: this.user.lastName,
      displayOptions: {
        exam: [
          {
            type: {
              shown: false,
              stopClose: false,
              boxBorder: '',
              arrowColor: '',
              placeholderColor: majorPlaceholderColor,
              placeholder: 'AP',
              acronym: majorAcronym
            },
            subject: {
              shown: false,
              stopClose: false,
              boxBorder: '',
              arrowColor: '',
              placeholderColor: majorPlaceholderColor,
              placeholder: 'Chemistry',
              acronym: majorAcronym

            },
            score: {
              shown: false,
              stopClose: false,
              boxBorder: '',
              arrowColor: '',
              placeholderColor: majorPlaceholderColor,
              placeholder: '5',
              acronym: majorAcronym
            }
          }
        ],
        class: [
          {
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholderColor: majorPlaceholderColor,
            placeholder: majorText,
            acronym: majorAcronym
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
    // this.setCollegesMap();
    // this.setMajorsList();
    // this.setMinorsList();
  },
  methods: {
    showHideContent(type, section, i) {
      let displayOptions = this.displayOptions[type];
      displayOptions = displayOptions[i];
      let contentShown;
      if (type === 'exam') {
        contentShown = displayOptions[section].shown;
        displayOptions[section].shown = !contentShown;
      } else {
        contentShown = displayOptions.shown;
        displayOptions.shown = !contentShown;
      }


      if (contentShown) {
        // clicked box when content shown. So then hide content
        displayOptions.boxBorder = '#C4C4C4';
        displayOptions.arrowColor = '#C4C4C4';
      } else {
        displayOptions.boxBorder = '#32A0F2';
        displayOptions.arrowColor = '#32A0F2';
      }
    },
    showHideExamContent(i) {
      this.showHideContent('exam', 'type', i);
    },
    showHideSubjectContent(i) {
      this.showHideContent('exam', 'subject', i);
    },
    showHideScoreContent(i) {
      this.showHideContent('exam', 'score', i);
    },
    showHideClassContent(i) {
      this.showHideContent('class', '', i);
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
    selectOption(type, section, text, acronym, i) {
      let displayOptions = this.displayOptions[type];
      displayOptions = displayOptions[i];
      if (type === 'exam') {
        displayOptions = displayOptions[section];
      }
      displayOptions.placeholder = text;
      displayOptions.shown = false;
      displayOptions.arrowColor = '#C4C4C4';
      displayOptions.boxBorder = '#C4C4C4';
      displayOptions.placeholderColor = '#757575';
    },
    selectExam(text, acronym, i) {
      this.selectOption('exam', 'type', text, acronym, i);
    },
    selectScore(text, acronym, i) {
      this.selectOption('exam', 'score', text, acronym, i);
    },
    selectSubject(text, acronym, i) {
      this.selectOption('exam', 'subject', text, acronym, i);
    },
    selectClass(text, acronym, i) {
      this.selectOption('class', 'placholder', text, acronym, i);
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
    addExam() {
      console.log(placeholderText);
      const exam = {
        shown: false,
        stopClose: false,
        boxBorder: '',
        arrowColor: '',
        placeholderColor: '',
        placeholder: placeholderText
      };

      this.displayOptions.exam.push(exam);
      console.log(this.displayOptions.exam);
    },
    removeMinor() {
      this.displayOptions.minor.pop();
    }
  }
};

</script>

<style scoped lang="scss">
  @import '@/components/Modals/Onboarding.scss';
</style>

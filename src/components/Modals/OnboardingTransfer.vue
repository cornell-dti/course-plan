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
                  v-click-outside:[index]="closeTypeDropdownIfOpen"
                >
               <label class="onboarding-label">Source/Type</label>
              <div class="onboarding-select onboarding-input"
                    :style="{borderColor: options.type.boxBorder}" >
                  <div class="onboarding-dropdown-placeholder college-wrapper" @click="showHideExamContent(index)">
                    <div
                      class="onboarding-dropdown-placeholder college-placeholder"
                      id="college-placeholder"
                      :style="{ color: options.type.placeholderColor}"
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
                      :id="subject"
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
              <div class="onboarding-addRemoveWrapper" >
                <div class="onboarding-add" @click="addExam">
                  Add
                </div>
                <div class="onboarding-remove" @click="removeExam" :class="{ 'onboarding--hidden': displayOptions.exam.length <= 1}" >
                  Remove
                </div>
              </div>
            </div>
            <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
              <div class="onboarding-subHeader2">Credits From Other Instituions</div>
              <label class="onboarding-label">Equivalent Cornell Class</label>
              <div class="onboarding-selectWrapper">
                <newCourse
                :isOnboard="true"
                > </newCourse>
              </div>
              <div class="onboarding-addRemoveWrapper">
                <div class="onboarding-add" @click="addTransfer">
                  Add
                </div>
                <div class="onboarding-remove" @click="removeTransfer">
                  Remove
                </div>
              </div>
              <div class="onboarding-selectWrapper">
                <div
                  class="onboarding-select onboarding-input onboarding-selectWrapperRow"
                  id="major"
                  v-for="(options, index) in displayOptions.class"
                  :key = index
                  :style="{ borderColor: options.boxBorder }"
                  v-click-outside:[index]="closeClassDropdownIfOpen"
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
            </div>
            <div class="onboarding-bottomWrapper">
              <div class=" onboarding-label--bottom">
              <label class=" onboarding-label" >Total Non-Cornell Credits</label>
              </div>
              <div class="onboarding-label--bottom">
                <label class=" onboarding-label onboarding-label--bottom---bold">{{totalCredits}} </label>
                <label class="onboarding-label"> Credits</label>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>

import reqsData from '@/requirements/typed-requirement-json';
import coursesJSON from '../../assets/courses/courses.json';
import transferJSON from '../../assets/Transfer/AP-json';
import NewCourse from '@/components/Modals/NewCourse';

Vue.component('newCourse', NewCourse);

const placeholderText = 'Select one';
const laceholderColor = '#757575';

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
    let credits = 0;
    const exams = [];
    const sections = ['type', 'subject', 'score'];
    if ('exam' in this.user && this.user.exam.length > 0) {
      for (let x = 0; x < this.user.exam.length; x += 1) {
        const exam = {};
        for (const sec of sections) {
          exam[sec] = {
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholderColor: '#757575',
            placeholder: this.user.exam[x][sec],
            acronym: ''
          };
        }
        exams.push(exam);
        credits += this.user.exam[x].credits;
      }
    }
    const exam = {};
    for (const sect of sections) {
      exam[sect] = {
        shown: false,
        stopClose: false,
        boxBorder: '',
        arrowColor: '',
        placeholderColor: '',
        placeholder: placeholderText,
        acronym: ''
      };
    }
    exams.push(exam);


    const classes = [];
    if ('transferClass' in this.user && this.user.transferClass.length > 0) {
      for (let x = 0; x < this.user.transferClass.length; x += 1) {
        const Class = {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: '',
          placeholder: this.user.transferClass[x].name,
          acronym: ''
        };
        classes.push(Class);
        credits += this.user.transferClass[x].credits;
      }
    }
    const Class = {
      shown: false,
      stopClose: false,
      boxBorder: '',
      arrowColor: '',
      placeholderColor: '',
      placeholder: placeholderText,
      acronym: ''
    };
    classes.push(Class);

    console.log(exams);
    return {
      // TODO: Get real college, major, and minor lists
      // :class="{ 'onboarding--hidden': displayOptions.major.length <= 1 }"
      tookSwimTest: '',
      scores: [], // for based on exam
      classes: [],
      exams: [],
      subjects: ['Chemistry', 'Physics I', 'Physics II', 'Calculas AB', 'Calculas BC', 'Biology', 'French'], // fix
      firstName: this.user.firstName,
      middleName: this.user.middleName,
      lastName: this.user.lastName,
      displayOptions: {
        exam: exams,
        class: classes
      },
      isError: false,
      totalCredits: credits
    };
  },
  directives: {
    'click-outside': clickOutside
  },
  mounted() {
    this.getExams();
  },
  methods: {
    getExams() {
      // this.$emit('updateTransfer', this.displayOptions.exams, this.displayOptions.class);
    },
    showHideContent(type, section, i) {
      let displayOptions = this.displayOptions[type];
      displayOptions = displayOptions[i];
      if (type === 'exam') {
        displayOptions = displayOptions[section];
      }
      const contentShown = displayOptions.shown;
      displayOptions.shown = !contentShown;
      if (contentShown) {
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
    closeDropdownIfOpen(section, i) {
      let displayOptions = this.displayOptions[section];
      displayOptions = displayOptions[i];
      if (section === 'exam') {
        Object.keys(displayOptions).forEach(key => {
          if (displayOptions[key].stopClose) {
            displayOptions[key].stopClose = false;
          } else if (displayOptions[key].shown) {
            displayOptions[key].shown = false;
            displayOptions[key].boxBorder = '#C4C4C4';
            displayOptions[key].arrowColor = '#C4C4C4';
          }
        });
      } else if (displayOptions.stopClose) {
        displayOptions.stopClose = false;
      } else if (displayOptions.shown) {
        displayOptions.shown = false;
        displayOptions.boxBorder = '#C4C4C4';
        displayOptions.arrowColor = '#C4C4C4';
      }
    },
    closeTypeDropdownIfOpen(event, i) {
      this.closeDropdownIfOpen('exam', i);
    },
    closeClassDropdownIfOpen(event, i) {
      this.closeDropdownIfOpen('class', i);
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
    addExam() {
      const exam = {
        type: {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: '',
          placeholder: placeholderText,
          acronym: ''
        },
        subject: {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: placeholderText,
          placeholder: placeholderText,
          acronym: ''
        },
        score: {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: '',
          placeholder: placeholderText,
          acronym: ''
        }
      };
      this.displayOptions.exams = this.displayOptions.exam.push(exam);
    },
    removeExam() {
      this.displayOptions.exam.pop();
    },
    removeTransfer() {
      this.displayOptions.class.pop();
    },
    addTransfer() {
      const newTransfer = {
        shown: false,
        stopClose: false,
        boxBorder: '',
        arrowColor: '',
        placeholderColor: '',
        placeholder: placeholderText,
        acronym: ''
      };
      this.displayOptions.class.push(newTransfer);
    }
  }
};

</script>

<style scoped lang="scss">
  @import '@/components/Modals/Onboarding.scss';
</style>

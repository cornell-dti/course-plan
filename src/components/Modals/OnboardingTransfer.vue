<template>
    <div class="onboarding">
        <div class="onboarding-section">
          <div class="onboarding-subHeader"><span class="onboarding-subHeader--font">Cornell Swimming Test </span> </div>
          <div class="onboarding-inputs onboarding-inputs--name">
            <div class="onboarding-inputWrapper">
              <label class="onboarding-label">Have you taken or planning on taking the Swim Test?</label>
              <div class="onboarding-inputs--radioWrapper">
                <input class="onboarding-inputs--radio" type="radio" v-on:click="updateSwimYes" v-model="tookSwimTest" value="yes">
                <label class="onboarding-inputs--radio--radioText" for="yes">Yes</label>
                <input class="onboarding-inputs--radio" type="radio" v-on:click="updateSwimNo" v-model="tookSwimTest" value="no">
                <label class="onboarding-inputs--radio--radioText" for="no">No</label>
              </div>
            </div>
          </div>
        </div>
        <div class="onboarding-section">
          <div class="onboarding-subHeader"><span class="onboarding-subHeader--font"> Transfer Credits (Optional)</span></div>
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
                      v-for="(subject, acronym) in subjects[index]"
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
              <div
                v-for="(options, index) in displayOptions.class"
                :key= index
                class="onboarding-selectWrapper">
                <newCourse
                :semesterID= index
                :isOnboard="true"
                :placeholderText= options.class
                > </newCourse>
              <div class="onboarding-addRemoveWrapper">
                <div class="onboarding-remove" @click="removeTransfer">
                  Remove
                </div>
              </div>

            </div>
                <div class="onboarding-addRemoveWrapper">
                <div class="onboarding-add" @click="addTransfer">
                  Add
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

import reqsData from '@/requirements/data/exams/ExamCredit';
import coursesJSON from '../../assets/courses/courses.json';
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
    return {
      // TODO: Get real college, major, and minor lists
      // :class="{ 'onboarding--hidden': displayOptions.major.length <= 1 }"
      tookSwimTest: '',
      scores: [], // for based on exam
      classes: [],
      exams: [],
      subjects: [[]], // fix
      firstName: this.user.firstName,
      middleName: this.user.middleName,
      lastName: this.user.lastName,
      displayOptions: {
        exam: [],
        class: []
      },
      transferJSON: {},
      isError: false,
      totalCredits: 0
    };
  },
  directives: {
    'click-outside': clickOutside
  },
  mounted() {
    this.getClasses();
    this.getTransferMap();
    this.setExamsMap();
    this.setSubjectList();
    this.getCredits();
  },
  methods: {
    getClasses() {
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
          if (typeof this.user.exam[x].subject !== 'undefined') {
            exams.push(exam);
            credits += this.user.exam[x].credits;
            exam.equivCourse = this.user.exam[x].equivCourse;
          }
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
      this.displayOptions.exam = exams;
      const swim = (typeof this.user.tookSwim !== 'undefined') ? this.user.tookSwim : 'no';
      this.tookSwimTest = swim;
      const transferClass = [];
      this.user.transferCourse.forEach(course => {
        transferClass.push(course);
      });
      transferClass.push({ class: placeholderText, credits: 0 });
      this.displayOptions.class = transferClass;
    },
    getCredits() {
      let count = 0;
      this.displayOptions.exam.forEach(exam => {
        if (this.transferJSON !== null) {
          const name = exam.subject.placeholder;
          if (name in this.transferJSON) {
            count += this.transferJSON[name].credits[0].credits;
          }
        }
      });
      this.displayOptions.class.forEach(clas => {
        count += clas.credits;
      });
      this.totalCredits = count;
    },
    getTransferMap() {
      const TransferJSON = {};
      reqsData.AP.forEach(sub => {
        TransferJSON[sub.subject] = {
          credits: sub.credits,
          type: 'AP'
        };
      });
      reqsData.IB.forEach(sub => {
        TransferJSON[sub.subject] = {
          credits: sub.credits,
          type: 'IB'
        };
      });
      this.transferJSON = TransferJSON;
      if (typeof this.displayOptions !== 'undefined') {
        this.$emit('updateTransfer', this.displayOptions.exam, this.displayOptions.class, this.tookSwimTest);
      }
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
          if (key !== 'equivCourse' && displayOptions[key].stopClose) {
            displayOptions[key].stopClose = false;
          } else if (key !== 'equivCourse' && displayOptions[key].shown) {
            displayOptions[key].shown = false;
            displayOptions[key].boxBorder = '#C4C4C4';
            displayOptions[key].arrowColor = '#C4C4C4';
          }
        });
      } else if (displayOptions.stopClose) {
        displayOptions.stopClose = false;
      } else if ('equivCourse' && displayOptions.shown) {
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
    // Set the colleges map to with acronym keys and full name values
    setExamsMap() {
      /** @type {Object.<string, string>} */
      const exams = [];
      Object.keys(reqsData).forEach(key => {
        exams.push(key);
      });
      this.exams = exams;
    },
    // Set the majors map to with acronym keys and full name values
    setSubjectList() {
      /** @type {Object.<string, string>} */
      const totalSubjects = [];
      this.displayOptions.exam.forEach(exam => {
        if (exam.type.placeholder !== placeholderText) {
          const examType = exam.type.placeholder;
          const subjects = [];
          if (examType in reqsData && examType !== null) {
            reqsData[examType].forEach(sub => {
              subjects.push(sub.subject);
            });
            totalSubjects.push(subjects);
            if (examType === 'AP') {
              this.scores = [1, 2, 3, 4, 5];
            } else {
              this.scores = [1, 2, 3, 4, 5, 6, 7];
            }
          }
        }
      });
      this.subjects = totalSubjects;
    },
    // Didn't want to seperate into two functions but v-model wouldn't work unless clicked twice?
    updateSwimYes() {
      this.tookSwimTest = 'yes';
      this.$emit('updateTransfer', this.displayOptions.exam, this.displayOptions.class, this.tookSwimTest);
    },
    updateSwimNo() {
      this.tookSwimTest = 'no';
      this.$emit('updateTransfer', this.displayOptions.exam, this.displayOptions.class, this.tookSwimTest);
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
      this.$emit('updateTransfer', this.displayOptions.exam, this.displayOptions.class, this.tookSwimTest);
    },
    // Clear a major if a new college is selected and the major is not in it
    clearSubjectAndScoreIfNotInCollege() {
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
    selectExam(text, acronym, i) {
      this.selectOption('exam', 'type', text, acronym, i);
      this.setSubjectList();
      // this.clearMajorIfNotInCollege();
    },
    selectScore(text, acronym, i) {
      this.selectOption('exam', 'score', text, acronym, i);
    },
    selectSubject(text, acronym, i) {
      const type = this.displayOptions.exam[i].type.placeholder;
      const course = this.getCourseFromExam(type, text);
      this.displayOptions.exam[i].equivCourse = course;
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
    getCourseFromExam(type, subject) {
      let count = 0;
      let courses;
      for (const sub of reqsData[type]) {
        if (sub.subject === subject) {
          courses = reqsData[type][count].credits[0].courseEquivalents;
          // as a default takes the first equivalent course
          // TODO will need to add requirements menu if editiable.
        }
        count += 1;
      }
      return courses;
    },
    removeExam() {
      this.displayOptions.exam.pop();
    },
    removeTransfer() {
      this.displayOptions.class.pop();
    },
    addTransfer() {
      this.displayOptions.class.push(placeholderText);
    },
    addItem(id) {
      const dropdown = document.getElementById(`dropdown-${id}`);
      const title = dropdown.value;
      const courseCode = title.substring(0, title.indexOf(':'));
      const subject = courseCode.split(' ')[0];
      const number = courseCode.split(' ')[1];
      fetch(`https://classes.cornell.edu/api/2.0/search/classes.json?roster=FA14&subject=${subject}&q=${courseCode}`)
        .then(res => res.json())
        .then(resultJSON => {
          // check catalogNbr of resultJSON class matches number of course to add
          resultJSON.data.classes.forEach(resultJSONclass => {
            if (resultJSONclass.catalogNbr === number) {
              const course = resultJSONclass;
              const creditsC = course.credits || course.enrollGroups[0].unitsMaximum;
              this.displayOptions.class[id] = {
                class: courseCode,
                course,
                credits: creditsC
              };
              this.getCredits();
              this.$emit('updateTransfer', this.displayOptions.exam, this.displayOptions.class, this.tookSwimTest);
            }
          });
        });
    }
  }
};

</script>

<style scoped lang="scss">
  @import '@/components/Modals/Onboarding.scss';
</style>

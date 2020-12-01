<template>
    <div class="onboarding">
        <div class="onboarding-section">
          <div class="onboarding-subHeader"><span class="onboarding-subHeader--font"> Basic Information</span></div>
          <div class="onboarding-subsection onboarding-inputs--review">
            <div class="onboarding-subHeader2-fillRow"><span class="onboarding-subHeader2-review"> Your Name</span></div>
            <div class="onboarding-selectWrapperRow-review">
              <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
                <label class="onboarding-label"><span> First Name </span></label>
                <label class="onboarding-label--review"><span> {{ firstName }}</span></label>
              </div>
              <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
                <label class="onboarding-label"><span> Middle Name </span></label>
                <label class="onboarding-label--review"><span> {{ middleName }}</span></label>
              </div>
              <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
                <label class="onboarding-label"><span> Last Name </span></label>
                <label class="onboarding-label--review"><span> {{ lastName }}</span></label>
              </div>
            </div>
            <div class="onboarding-subHeader2-fillRow"><span class="onboarding-subHeader2-review"> Your Major</span></div>
            <div class="onboarding-selectWrapper">
              <div class="onboarding-selectWrapper-review">
                <label class="onboarding-label">College</label>
                <label class="onboarding-label--review">{{ displayOptions.college[0].placeholder }}</label>
              </div>
              <div class="onboarding-selectWrapper-review">
                <label class="onboarding-label">Major</label>
                <label class="onboarding-label--review">{{ displayOptions.major[0].placeholder }}</label>
              </div>
            </div>
            <div class="onboarding-subHeader2-fillRow"><span class="onboarding-subHeader2-review"> Your Minor</span></div>
            <div class="onboarding-selectWrapper">
              <label class="onboarding-label">Minor</label>
              <label class="onboarding-label--review">{{ displayOptions.minor[0].placeholder }}</label>
            </div>
          </div>
        </div>
        <div class="onboarding-section">
          <!-- TODO: Multiple colleges -->
          <div class="onboarding-subHeader"><span class="onboarding-subHeader--font"> Transfer Credits</span> </div>
          <div class="onboarding-inputs onboarding-inputs">
            <div class="onboarding-subHeader2-fillRow"><span class="onboarding-subHeader2-review"> Cornell Swimming Test</span></div>
            <div class="onboarding-selectWrapper">
              <div class="onboarding-selectWrapper-review">
                <label class="onboarding-label">
                  <img class="checkmark" src="@/assets/images/checkmark-green.svg">
                  {{ this.user.tookSwim === 'yes' ? "Yes" : "No" }}
                </label>
              </div>
            </div>
            <div class="onboarding-subHeader2-fillRow"><span class="onboarding-subHeader2-review"> Test Credits</span></div>
            <div class="onboarding-selectWrapper">
              <div class="onboarding-selectWrapper-reviewExam">
                <div>
                  <label class="onboarding-label">AP Credits</label>
                  <div v-for="(options, index) in displayOptions.exam" :key = "'AP'+index">
                    <label v-if="typeof options.type != undefined && options.type.placeholder == 'AP'" class="onboarding-label--review">{{ options.subject.placeholder }}</label>
                  </div>
                  <label class="onboarding-label addSpaceTop">IB Credits</label>
                  <div v-for="(options, index) in displayOptions.exam" :key = "'IB'+index">
                    <label v-if="typeof options.type != undefined && options.type.placeholder == 'IB'" class="onboarding-label--review">{{ options.subject.placeholder }}</label>
                  </div>
                </div>
                <div class = "alignCenter">
                  <label class="onboarding-label">Score</label>
                  <div v-for="(options, index) in displayOptions.exam" :key = "'APScore'+index">
                    <label v-if="typeof options.type != undefined && options.type.placeholder == 'AP'" class="onboarding-label--review">{{ options.score.placeholder }}</label>
                  </div>
                  <label class="onboarding-label addSpaceTop">Score</label>
                  <div v-for="(options, index) in displayOptions.exam" :key = "'IBScore'+index">
                    <label v-if="typeof options.type != undefined && options.type.placeholder == 'IB'" class="onboarding-label--review">{{ options.score.placeholder }}</label>
                  </div>
                </div>
                <div class = "alignCenter">
                  <label class="onboarding-label ">Credit</label>
                  <div v-for="(options, index) in displayOptions.exam" :key = "'APCredit'+index">
                    <!-- TODO replace credit with actual value -->
                    <label v-if="typeof options.type != undefined && options.type.placeholder == 'AP'" class="onboarding-label--review">{{ getExamCredit(options) }}</label>
                  </div>
                  <label class="onboarding-label addSpaceTop">Credit</label>
                  <div v-for="(options, index) in displayOptions.exam" :key = "'IBCredit'+index">
                    <label v-if="typeof options.type != undefined && options.type.placeholder == 'IB'" class="onboarding-label--review">{{ getExamCredit(options) }}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="onboarding-subHeader2-fillRow"><span class="onboarding-subHeader2-review"> Transferred Course Credits</span></div>
            <div class = "onboarding-selectWrapper">
              <div class="onboarding-selectWrapper-reviewExam">
                <div>
                  <div
                    v-for="(options, index) in displayOptions.class" :key= index>
                    <label v-if="options.class !== 'Select one'" class="onboarding-label--review"> {{ options.class }} </label>
                  </div>
                </div>
                <div class="alignEnd">
                  <div
                    v-for="(options, index) in displayOptions.class" :key= index>
                    <label v-if="options.class !== 'Select one'" class="onboarding-label--review"> {{ options.credits }} Credits </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="onboarding-bottomWrapper">
              <label class="onboarding-subHeader2-review">Total Transfer Credits:</label>
              <label class="onboarding-label--bottom">{{ totalCredits }} Credits</label>
            </div>
          </div>
          </div>
</div>
</template>

<script>
// TODO: a lot of the functions are repeated from basic and transfer pages, is there a way to avoid that?

import reqsData from '@/requirements/typed-requirement-json';
import examData from '@/requirements/data/exams/ExamCredit';
import coursesJSON from '../../assets/courses/courses.json';

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
      colleges: {},
      majors: {},
      minors: {},
      firstName: this.user.firstName,
      middleName: this.user.middleName,
      lastName: this.user.lastName,
      placeholderText,
      totalCredits: 0,
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
    this.getClasses();
    this.getTransferMap();
    this.setExamsMap();
    this.setSubjectList();
    this.getCredits();
    this.$emit('updateBasic', this.displayOptions.major, this.displayOptions.college, this.displayOptions.minor);
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
    getExamCredit(exam) {
      const name = exam.subject.placeholder;
      if (this.transferJSON !== null) {
        if (name in this.transferJSON) {
          return this.transferJSON[name].credits[0].credits;
        }
      }
      return 0;
    },
    getTransferMap() {
      // console.log(reqsData);
      const TransferJSON = {};
      examData.AP.forEach(sub => {
        TransferJSON[sub.subject] = {
          credits: sub.credits,
          type: 'AP'
        };
      });
      examData.IB.forEach(sub => {
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
      Object.keys(examData).forEach(key => {
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
          if (examType in examData && examType !== null) {
            examData[examType].forEach(sub => {
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
      fetch(`https://classes.cornell.edu/api/2.0/search/classes.json?roster=FA14&subject=${subject}&q=${courseCode}`) // should be removed later
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
    },
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
      if (this.displayOptions.major.length === 0) {
        this.addMajor();
      }
    },
    removeMinor() {
      this.displayOptions.minor.pop();
      if (this.displayOptions.minor.length === 0) {
        this.addMinor();
      }
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
    }
  }
};

</script>

<style scoped lang="scss">
  @import '@/components/Modals/Onboarding.scss';
</style>

<template>
  <div class="onboarding">
    <div class="onboarding-section">
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> Basic Information</span>
        <span>
          <button class="onboarding-button-previous" @click="setPage(1)">
            <img src="@/assets/images/edit-review.svg" alt="edit" />
          </button>
        </span>
      </div>
      <div class="onboarding-subsection onboarding-inputs--review">
        <div class="onboarding-subHeader2-fillRow">
          <span class="onboarding-subHeader2-review"> Your Name</span>
        </div>
        <div class="onboarding-selectWrapperRow-review">
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
            <label class="onboarding-label"><span> First Name </span></label>
            <label class="onboarding-label--review"
              ><span> {{ firstName }}</span></label
            >
          </div>
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
            <label class="onboarding-label"><span> Middle Name </span></label>
            <label class="onboarding-label--review"
              ><span> {{ middleName }}</span></label
            >
          </div>
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
            <label class="onboarding-label"><span> Last Name </span></label>
            <label class="onboarding-label--review"
              ><span> {{ lastName }}</span></label
            >
          </div>
        </div>
        <div class="onboarding-subHeader2-fillRow">
          <span class="onboarding-subHeader2-review"> Your Major</span>
        </div>
        <div class="onboarding-selectWrapper">
          <div class="onboarding-selectWrapper-review">
            <label class="onboarding-label">College*</label>
            <div>
              <label class="onboarding-label--review">{{
                displayOptions.college[0].placeholder
              }}</label>
            </div>
          </div>
          <div class="onboarding-selectWrapper-review">
            <label class="onboarding-label">Major</label>
            <div v-for="(major, index) in displayOptions.major" :key="'Major' + index">
              <label class="onboarding-label--review">{{ major.placeholder }}</label>
            </div>
          </div>
        </div>
        <div class="onboarding-subHeader2-fillRow">
          <span class="onboarding-subHeader2-review"> Your Minor</span>
        </div>
        <div class="onboarding-selectWrapper">
          <label class="onboarding-label">Minors:</label>
          <div v-for="(minor, index) in displayOptions.minor" :key="'Minor' + index">
            <label class="onboarding-label--review">{{ minor.placeholder }}</label>
          </div>
        </div>
      </div>
    </div>
    <div class="onboarding-section">
      <!-- TODO: Multiple colleges -->
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> Transfer Credits</span>
        <span>
          <button class="onboarding-button-previous" @click="setPage(2)">
            <img src="@/assets/images/edit-review.svg" />
          </button>
        </span>
      </div>
      <div class="onboarding-inputs onboarding-inputs">
        <div class="onboarding-subHeader2-fillRow">
          <span class="onboarding-subHeader2-review"> Cornell Swimming Test</span>
        </div>
        <div class="onboarding-selectWrapper">
          <div class="onboarding-selectWrapper-review">
            <label class="onboarding-label">
              <img class="checkmark" src="@/assets/images/checkmark-onboarding.svg" />
              {{ this.user.tookSwim === 'yes' ? 'Yes' : 'No' }}
            </label>
          </div>
        </div>
        <div class="onboarding-subHeader2-fillRow">
          <span class="onboarding-subHeader2-review"> Test Credits</span>
        </div>
        <div class="onboarding-selectWrapper">
          <div class="onboarding-selectWrapper-reviewExam">
            <div class="alignLeft">
              <label class="onboarding-label">AP Credits</label>
              <div v-for="(options, index) in displayOptions.exam" :key="'AP' + index">
                <label
                  v-if="typeof options.type != undefined && options.type.placeholder == 'AP'"
                  class="onboarding-label--review"
                  >{{ options.subject.placeholder }}</label
                >
              </div>
              <label class="onboarding-label addSpaceTop">IB Credits</label>
              <div v-for="(options, index) in displayOptions.exam" :key="'IB' + index">
                <label
                  v-if="typeof options.type != undefined && options.type.placeholder == 'IB'"
                  class="onboarding-label--review"
                  >{{ options.subject.placeholder }}</label
                >
              </div>
            </div>
            <div class="alignCenter">
              <label class="onboarding-label">Score</label>
              <div v-for="(options, index) in displayOptions.exam" :key="'APScore' + index">
                <label
                  v-if="typeof options.type != undefined && options.type.placeholder == 'AP'"
                  class="onboarding-label--review"
                  >{{ options.score.placeholder }}</label
                >
              </div>
              <label class="onboarding-label addSpaceTop">Score</label>
              <div v-for="(options, index) in displayOptions.exam" :key="'IBScore' + index">
                <label
                  v-if="typeof options.type != undefined && options.type.placeholder == 'IB'"
                  class="onboarding-label--review"
                  >{{ options.score.placeholder }}</label
                >
              </div>
            </div>
            <div class="alignCenter">
              <label class="onboarding-label">Credit</label>
              <div v-for="(options, index) in displayOptions.exam" :key="'APCredit' + index">
                <!-- TODO replace credit with true value rather than dummy json value, or remove credit from showing -->
                <label
                  v-if="typeof options.type != undefined && options.type.placeholder == 'AP'"
                  class="onboarding-label--review"
                  >{{ getExamCredit(options) }}</label
                >
              </div>
              <label class="onboarding-label addSpaceTop">Credit</label>
              <div v-for="(options, index) in displayOptions.exam" :key="'IBCredit' + index">
                <label
                  v-if="typeof options.type != undefined && options.type.placeholder == 'IB'"
                  class="onboarding-label--review"
                  >{{ getExamCredit(options) }}</label
                >
              </div>
            </div>
          </div>
        </div>
        <div class="onboarding-subHeader2-fillRow">
          <span class="onboarding-subHeader2-review"> Transferred Course Credits</span>
        </div>
        <div class="onboarding-selectWrapper">
          <div class="onboarding-selectWrapper-reviewExam">
            <div>
              <div v-for="(options, index) in displayOptions.class" :key="index">
                <label v-if="options.class !== 'Select one'" class="onboarding-label--review">
                  {{ options.class }}
                </label>
              </div>
            </div>
            <div class="alignEnd">
              <div v-for="(options, index) in displayOptions.class" :key="index">
                <label v-if="options.class !== 'Select one'" class="onboarding-label--review">
                  {{ options.credits }} Credits
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="onboarding-bottomWrapper">
          <label class="onboarding-subHeader2-review">Total Transfer Credits:</label>
          <div class="onboarding-label--bottom">
            <label class="onboarding-label--bottom---bold">{{ totalCredits }}</label>
            <label>Credits</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TODO: move repeated functions in all onboarding pages to a separate file

import reqsData from '@/requirements/typed-requirement-json';
import { examData } from '@/requirements/data/exams/ExamCredit';
import coursesJSON from '@/assets/courses/courses.json';

const placeholderText = 'Select one';

export default {
  props: {
    user: Object,
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
      // TODO: Store info of form locally to save form input when moving between pages
      colleges: {},
      majors: {},
      minors: {},
      firstName: this.user.firstName,
      middleName: this.user.middleName,
      lastName: this.user.lastName,
      placeholderText,
      totalCredits: 0,
      transferJSON: {},
      displayOptions: {
        college: [
          {
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholderColor: collegePlaceholderColor,
            placeholder: collegeText,
            acronym: collegeAcronym,
          },
        ],
        major: [
          {
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholderColor: majorPlaceholderColor,
            placeholder: majorText,
            acronym: majorAcronym,
          },
        ],
        minor: [
          {
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholderColor: minorPlaceholderColor,
            placeholder: minorText,
            acronym: minorAcronym,
          },
        ],
        exam: [
          {
            // unnecessary but required for type check, as this is not ts file yet, whats a better way to deal with this?
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholderColor: '',
            placeholder: placeholderText,
            acronym: '',
            type: {
              placeholder: '',
            },
            subject: {
              placeholder: '',
            },
            score: {
              placeholder: '',
            },
          },
        ],
        class: [
          {
            // unnecessary but required for type check, as this is not ts file yet
            class: placeholderText,
            credits: 0,
          },
        ],
      },
      isError: false,
    };
  },
  mounted() {
    this.setCollegesMap();
    this.getClasses();
    this.flattenDisplayMajors();
    this.flattenDisplayMinors();
    this.getTransferMap();
    this.setExamsMap();
    this.setSubjectList();
    this.getCredits();
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
              placeholder: major.placeholder[i],
              acronym: major.acronym[i],
            };
            majors.push(newMajor);
          }
        } else {
          majors.push({
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholder: major.placeholder,
            acronym: major.acronym,
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
              placeholder: minor.placeholder[i],
              acronym: minor.acronym[i],
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
            acronym: minor.acronym,
          });
        }
      });
      this.displayOptions.minor = minors;
    },
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
              acronym: '',
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
          acronym: '',
        };
      }
      exams.push(exam);
      this.displayOptions.exam = exams;
      const swim = typeof this.user.tookSwim !== 'undefined' ? this.user.tookSwim : 'no';
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
            count += this.transferJSON[name].credits;
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
          return this.transferJSON[name].credits;
        }
      }
      return 0;
    },
    getTransferMap() {
      const TransferJSON = {};
      examData.AP.forEach(sub => {
        TransferJSON[sub.name] = {
          credits: sub.fulfillment.credits,
          type: 'AP',
        };
      });
      examData.IB.forEach(sub => {
        TransferJSON[sub.name] = {
          credits: sub.fulfillment.credits,
          type: 'IB',
        };
      });
      this.transferJSON = TransferJSON;
      if (typeof this.displayOptions !== 'undefined') {
        this.$emit(
          'updateTransfer',
          this.displayOptions.exam,
          this.displayOptions.class,
          this.tookSwimTest
        );
      }
    },
    // Set the exam map to with acronym keys and full name values
    setExamsMap() {
      /** @type {Object.<string, string>} */
      const exams = [];
      Object.keys(examData).forEach(key => {
        exams.push(key);
      });
      this.exams = exams;
    },
    // Set the subject map to with acronym keys and full name values
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
          }
        }
      });
      this.subjects = totalSubjects;
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
    setPage(page) {
      this.$emit('setPage', page);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

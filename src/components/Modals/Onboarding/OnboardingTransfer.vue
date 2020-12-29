<template>
  <div class="onboarding">
    <div class="onboarding-section">
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font">Cornell Swimming Test </span>
      </div>
      <div class="onboarding-inputs onboarding-inputs--name">
        <div class="onboarding-inputWrapper">
          <label class="onboarding-label"
            >Have you taken the Swim Test? (Choose yes if you are a transfer)</label
          >
          <div class="onboarding-inputs--radioWrapper">
            <label class="onboarding-inputs--radio--radioText" for="yes">
              <input
                class="onboarding-inputs--radio"
                type="radio"
                v-on:click="updateSwimYes"
                v-model="tookSwimTest"
                id="yes"
                value="yes"
              />
              <img class="checkmark" :src="swimYesImage" alt="checkmark" />
              Yes
            </label>
            <label class="onboarding-inputs--radio--radioText" for="no">
              <input
                class="onboarding-inputs--radio"
                type="radio"
                v-on:click="updateSwimNo"
                v-model="tookSwimTest"
                id="no"
                value="no"
              />
              <img class="checkmark" :src="swimNoImage" alt="checkmark" />
              No
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="onboarding-section">
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> Transfer Credits (Optional)</span>
      </div>
      <div class="onboarding-inputs">
        <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
          <div class="onboarding-subHeader">
            <span class="onboarding-subHeader--font">AP Credits</span>
          </div>
          <div class="onboarding-subsection">
            <div
              class="onboarding-section"
              id="college"
              v-for="(options, index) in displayOptions.exam"
              :key="index + 'AP'"
              :style="{ borderColor: options.type.boxBorder }"
              v-click-outside:[index]="closeAPDropdownIfOpen"
            >
              <div v-if="options.type.placeholder != 'IB'" class="onboarding-selectWrapperRow">
                <div class="onboarding-select--columnWide">
                  <label class="onboarding-label">Subject</label>
                  <div class="onboarding-select onboarding-input">
                    <div
                      class="onboarding-dropdown-placeholder college-wrapper"
                      @click="showHideSubjectContent(index)"
                    >
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
                <div class="onboarding-select--column">
                  <label class="onboarding-label">Score</label>
                  <div class="onboarding-select onboarding-input">
                    <div
                      class="onboarding-dropdown-placeholder college-wrapper"
                      @click="showHideScoreContent(index)"
                    >
                      <div
                        class="onboarding-dropdown-placeholder college-placeholder"
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
                        v-for="(score, acronym) in scoresAP"
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
                <div class="onboarding-select--columnCenter">
                  <label class="onboarding-label">Credits</label>
                  <label class="college-placeholder">{{ getExamCredit(options) }}</label>
                </div>
                <div class="onboarding-select--column-removeExam">
                  <div
                    class="onboarding-remove"
                    @click="removeExam(index)"
                    :class="{
                      'onboarding--hidden':
                        countExamType(displayOptions.exam, 'AP') === 1 &&
                        options.subject.placeholder == placeholderText,
                    }"
                  >
                    <img src="@/assets/images/x-green.svg" alt="x" />
                  </div>
                </div>
              </div>
            </div>
            <div class="onboarding-addRemoveWrapper">
              <div class="onboarding-add" @click="addExam('AP')">+ add another subject</div>
            </div>
          </div>
          <div class="onboarding-subHeader">
            <span class="onboarding-subHeader--font">IB Credits</span>
          </div>
          <div class="onboarding-inputs">
            <div
              class="onboarding-section"
              id="college"
              v-for="(options, index) in displayOptions.exam"
              :key="index"
              :style="{ borderColor: options.type.boxBorder }"
              v-click-outside:[index]="closeIBDropdownIfOpen"
            >
              <div v-if="options.type.placeholder != 'AP'" class="onboarding-selectWrapperRow">
                <div class="onboarding-select--columnWide">
                  <label class="onboarding-label">Subject</label>
                  <div class="onboarding-select onboarding-input">
                    <div
                      class="onboarding-dropdown-placeholder college-wrapper"
                      @click="showHideSubjectContent(index)"
                    >
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
                <div class="onboarding-select--column">
                  <label class="onboarding-label">Score</label>
                  <div class="onboarding-select onboarding-input">
                    <div
                      class="onboarding-dropdown-placeholder college-wrapper"
                      @click="showHideScoreContent(index)"
                    >
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
                        v-for="(score, acronym) in scoresIB"
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
                <div class="onboarding-select--columnCenter">
                  <label class="onboarding-label">Credits</label>
                  <label class="college-placeholder">{{ getExamCredit(options) }}</label>
                </div>
                <div class="onboarding-select--column-removeExam">
                  <div
                    class="onboarding-remove"
                    @click="removeExam(index)"
                    :class="{
                      'onboarding--hidden':
                        countExamType(displayOptions.exam, 'IB') === 1 &&
                        options.subject.placeholder == placeholderText,
                    }"
                  >
                    <img src="@/assets/images/x-green.svg" alt="x" />
                  </div>
                </div>
              </div>
            </div>
            <div class="onboarding-addRemoveWrapper">
              <div class="onboarding-add" @click="addExam('IB')">+ add another subject</div>
            </div>
          </div>
        </div>
        <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
          <div class="onboarding-subHeader">
            <span class="onboarding-subHeader--font">Transferred Course Credits</span>
          </div>
          <div class="onboarding-inputs">
            <label class="onboarding-label">Equivalent Cornell Class</label>
            <div
              v-for="(options, index) in displayOptions.class"
              :key="index"
              class="onboarding-selectWrapperRow"
            >
              <div class="onboarding-select--columnFill">
                <newCourse
                  :semesterID="index"
                  :isOnboard="true"
                  :placeholderText="options.class"
                  :key="displayOptions.class.length"
                  @addItem="addItem"
                >
                </newCourse>
              </div>
              <div class="onboarding-select--column-remove">
                <div
                  class="onboarding-remove"
                  @click="removeTransfer(index)"
                  :class="{
                    'onboarding--hidden':
                      displayOptions.class.length === 1 &&
                      (options.class == placeholderText || options.class == null),
                  }"
                >
                  <img src="@/assets/images/x-green.svg" alt="x" />
                </div>
              </div>
            </div>
            <div class="onboarding-addRemoveWrapper">
              <div class="onboarding-add" @click="addTransfer">+ add another subject</div>
            </div>
          </div>
          <div class="onboarding-addRemoveWrapper">
            <div class="onboarding-add" @click="addTransfer">Add</div>
          </div>
        </div>
        <div class="onboarding-bottomWrapper">
          <div class="onboarding-label--bottom">
            <label class="onboarding-label">Total Non-Cornell Credits</label>
          </div>
          <div class="onboarding-label--bottom">
            <label class="onboarding-label onboarding-label--bottom---bold"
              >{{ totalCredits }}
            </label>
            <label class="onboarding-label"> Credits</label>
          </div>
        </div>
        <div class="onboarding-bottomWrapper">
          <div class="onboarding-label--bottom">
            <label class="onboarding-label">Total Transfer Credits:</label>
          </div>
          <div class="onboarding-label--bottom">
            <label class="onboarding-label onboarding-label--bottom---bold"
              >{{ totalCredits }}
            </label>
            <label class="onboarding-label"> Credits</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { examData as reqsData } from '@/requirements/data/exams/ExamCredit';
import coursesJSON from '@/assets/courses/courses.json';
import checkmarkSelected from '@/assets/images/checkmark-onboarding.svg';
import checkmarkUnselected from '@/assets/images/checkmark-empty.svg';
import NewCourse from '@/components/Modals/NewCourse/NewCourse.vue';
import { clickOutside } from '@/utilities';
import { AppUser, FirestoreTransferClass } from '@/user-data';
// @ts-ignore
import { inactiveGray, yuxuanBlue, lightPlaceholderGray } from '@/assets/scss/_variables.scss';

Vue.component('newCourse', NewCourse);

const placeholderText = 'Select one';
const placeholderColor = lightPlaceholderGray;

type Section = 'type' | 'subject' | 'score';

type DisplayOption = {
  shown: boolean;
  stopClose: boolean;
  boxBorder: string;
  arrowColor: string;
  placeholderColor: string;
  placeholder: string;
  acronym: string;
};

type Data = {
  tookSwimTest: string;
  scoresAP: number[];
  scoresIB: number[];
  classes: [];
  exams: string[];
  placeholderText: string;
  subjects: string[][];
  firstName: string;
  middleName?: string;
  lastName: string;
  displayOptions: {
    exam: Record<'type' | 'subject' | 'score', DisplayOption>[];
    class: FirestoreTransferClass[];
  };
  key: number;
  transferJSON: any;
  isError: boolean;
  totalCredits: number;
  swimYesImage: string;
  swimNoImage: string;
};

export default Vue.extend({
  props: {
    user: Object as PropType<AppUser>,
  },
  data(): Data {
    return {
      tookSwimTest: '',
      scoresAP: [1, 2, 3, 4, 5],
      scoresIB: [1, 2, 3, 4, 5, 6, 7],
      classes: [],
      exams: [],
      placeholderText,
      subjects: [[]],
      firstName: this.user.firstName,
      middleName: this.user.middleName,
      lastName: this.user.lastName,
      displayOptions: {
        exam: [],
        class: [],
      },
      key: 0,
      transferJSON: {},
      isError: false,
      totalCredits: 0,
      swimYesImage: '',
      swimNoImage: '',
    };
  },
  directives: {
    'click-outside': clickOutside,
  },
  mounted() {
    this.getClasses();
    this.setExamsMap();
    this.setSubjectList();
    this.getCredits();
    this.setSwimImages();
  },
  methods: {
    getClasses() {
      let credits = 0;
      const exams: Record<Section, DisplayOption>[] = [];
      const sections = ['type', 'subject', 'score'] as const;
      if ('exam' in this.user && this.user.exam.length > 0) {
        for (let x = 0; x < this.user.exam.length; x += 1) {
          // @ts-ignore
          const exam: Record<'type' | 'subject' | 'score', DisplayOption> = {};
          for (const sec of sections) {
            exam[sec] = {
              shown: false,
              stopClose: false,
              boxBorder: '',
              arrowColor: '',
              placeholderColor: lightPlaceholderGray,
              placeholder: String(this.user.exam[x][sec]),
              acronym: '',
            };
          }
          if (typeof this.user.exam[x].subject !== 'undefined') {
            exams.push(exam);
            // @ts-ignore
            credits += this.user.exam[x].credits;
            // @ts-ignore
            exam.equivCourse = this.user.exam[x].equivCourse;
          }
        }
      }
      // @ts-ignore
      const examAP: Record<Section, DisplayOption> = {};
      // @ts-ignore
      const exam: Record<Section, DisplayOption> = {};
      for (const sect of sections) {
        let placeholderSect = placeholderText;
        if (sect === 'type') {
          placeholderSect = 'AP';
        } else if (sect === 'score') {
          placeholderSect = '0';
        }
        examAP[sect] = {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: '',
          placeholder: placeholderSect,
          acronym: '',
        };
      }
      exams.push(examAP);
      // @ts-ignore
      const examIB: Record<Section, DisplayOption> = {};
      for (const sect of sections) {
        let placeholderSect = placeholderText;
        if (sect === 'type') {
          placeholderSect = 'IB';
        } else if (sect === 'score') {
          placeholderSect = '0';
        }
        examIB[sect] = {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: '',
          placeholder: placeholderSect,
          acronym: '',
        };
      }
      exams.push(examIB);
      this.displayOptions.exam = exams;
      const swim = typeof this.user.tookSwim !== 'undefined' ? this.user.tookSwim : 'no';
      this.tookSwimTest = swim;
      const transferClass: FirestoreTransferClass[] = [];
      this.user.transferCourse.forEach(course => {
        transferClass.push(course);
      });
      // @ts-ignore
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
    getExamCredit(exam: Record<'type' | 'subject' | 'score', DisplayOption>) {
      const name = exam.subject.placeholder;
      if (this.transferJSON !== null) {
        if (name in this.transferJSON) {
          return this.transferJSON[name].credits;
        }
      }
      return 0;
    },
    getTransferMap() {
      const TransferJSON: Record<string, { credits: number; type: 'AP' | 'IB' }> = {};
      reqsData.AP.forEach(sub => {
        TransferJSON[sub.name] = {
          credits: sub.fulfillment.credits,
          type: 'AP',
        };
      });
      reqsData.IB.forEach(sub => {
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
    showHideContent(type: 'exam' | 'class', section: Section, i: number) {
      let displayOptions: any = this.displayOptions[type][i];
      if (type === 'exam') {
        displayOptions = displayOptions[section];
      }
      const contentShown = displayOptions.shown;
      displayOptions.shown = !contentShown;
      if (contentShown) {
        displayOptions.boxBorder = inactiveGray;
        displayOptions.arrowColor = inactiveGray;
      } else {
        displayOptions.boxBorder = yuxuanBlue;
        displayOptions.arrowColor = yuxuanBlue;
      }
    },
    showHideExamContent(i: number) {
      this.showHideContent('exam', 'type', i);
    },
    showHideSubjectContent(i: number) {
      this.showHideContent('exam', 'subject', i);
    },
    showHideScoreContent(i: number) {
      this.showHideContent('exam', 'score', i);
    },
    showHideClassContent(i: number) {
      // @ts-ignore
      this.showHideContent('class', '', i);
    },
    closeDropdownIfOpen(section: 'exam' | 'class', type: 'AP' | 'IB' | null, i: number) {
      const displayOptions: any = this.displayOptions[section][i];
      if (section === 'exam') {
        Object.keys(displayOptions).forEach(key => {
          if (key !== 'equivCourse' && displayOptions[key].stopClose) {
            displayOptions[key].stopClose = false;
          } else if (
            key !== 'equivCourse' &&
            displayOptions[key].shown &&
            displayOptions.type.placeholder === type
          ) {
            displayOptions[key].shown = false;
            displayOptions[key].boxBorder = inactiveGray;
            displayOptions[key].arrowColor = inactiveGray;
          }
        });
      } else if (displayOptions.stopClose) {
        displayOptions.stopClose = false;
      } else if ('equivCourse' && displayOptions.shown) {
        displayOptions.shown = false;
        displayOptions.boxBorder = inactiveGray;
        displayOptions.arrowColor = inactiveGray;
      }
    },
    closeIBDropdownIfOpen(event: unknown, i: number) {
      this.closeDropdownIfOpen('exam', 'IB', i);
    },
    closeAPDropdownIfOpen(event: unknown, i: number) {
      this.closeDropdownIfOpen('exam', 'AP', i);
    },
    closeClassDropdownIfOpen(event: unknown, i: number) {
      this.closeDropdownIfOpen('class', null, i);
    },
    // Set the exam map to with acronym keys and full name values
    setExamsMap() {
      const exams: string[] = [];
      Object.keys(reqsData).forEach(key => {
        exams.push(key);
      });
      this.exams = exams;
    },
    // Set the subject map to with acronym keys and full name values
    setSubjectList() {
      /** @type {Object.<string, string>} */
      const totalSubjects: string[][] = [];
      this.displayOptions.exam.forEach(exam => {
        if (exam.type.placeholder !== placeholderText) {
          // @ts-ignore
          const examType: 'AP' | 'IB' = exam.type.placeholder;
          const subjects: string[] = [];
          if (examType in reqsData && examType !== null) {
            reqsData[examType].forEach(sub => {
              subjects.push(sub.name);
            });
            totalSubjects.push(subjects);
          }
        }
      });
      this.subjects = totalSubjects;
    },
    // Didn't want to seperate into two functions but v-model wouldn't work unless clicked twice?
    updateSwimYes() {
      this.tookSwimTest = 'yes';
      this.swimYesImage = checkmarkSelected;
      this.swimNoImage = checkmarkUnselected;
      this.$emit(
        'updateTransfer',
        this.displayOptions.exam,
        this.displayOptions.class,
        this.tookSwimTest
      );
    },
    updateSwimNo() {
      this.tookSwimTest = 'no';
      this.swimNoImage = checkmarkSelected;
      this.swimYesImage = checkmarkUnselected;
      this.$emit(
        'updateTransfer',
        this.displayOptions.exam,
        this.displayOptions.class,
        this.tookSwimTest
      );
    },
    setSwimImages() {
      this.swimYesImage = this.tookSwimTest === 'yes' ? checkmarkSelected : checkmarkUnselected;
      this.swimNoImage = this.tookSwimTest === 'no' ? checkmarkSelected : checkmarkUnselected;
    },
    selectOption(
      type: 'exam' | 'class',
      section: Section,
      text: string,
      acronym: string | number,
      i: number
    ) {
      let displayOptions: any = this.displayOptions[type][i];
      if (type === 'exam') {
        displayOptions = displayOptions[section];
      }
      displayOptions.placeholder = text;
      displayOptions.shown = false;
      displayOptions.arrowColor = inactiveGray;
      displayOptions.boxBorder = inactiveGray;
      displayOptions.placeholderColor = lightPlaceholderGray;
    },
    selectExam(text: string, acronym: string | number, i: number) {
      this.selectOption('exam', 'type', text, acronym, i);
      this.setSubjectList();
    },
    selectScore(text: number, acronym: string | number, i: number) {
      this.selectOption('exam', 'score', String(text), acronym, i);
    },
    selectSubject(text: string, acronym: string | number, i: number) {
      // @ts-ignore
      const type: 'AP' | 'IB' = this.displayOptions.exam[i].type.placeholder;
      this.selectOption('exam', 'subject', text, acronym, i);
    },
    selectClass(text: string, acronym: string | number, i: number) {
      // @ts-ignore
      this.selectOption('class', 'placholder', text, acronym, i);
    },
    addExam(type: 'AP' | 'IB') {
      const exam = {
        type: {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: '',
          placeholder: type,
          acronym: '',
        },
        subject: {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: placeholderText,
          placeholder: placeholderText,
          acronym: '',
        },
        score: {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: '',
          placeholder: '0',
          acronym: '',
        },
      };
      this.displayOptions.exam.push(exam);
      this.setSubjectList();
      this.getCredits();
    },
    getCourseFromExam(type: 'AP' | 'IB', subject: string) {
      let courses: Record<string, number[]> | undefined;
      for (const exam of reqsData[type]) {
        if (exam.name === subject) {
          courses = exam.fulfillment.courseEquivalents;
          // as a default takes the first equivalent course
          // TODO will need to add requirements menu if editiable.
          break;
        }
      }
      return courses;
    },
    removeExam(index: number) {
      this.displayOptions.exam.splice(index, 1);
      if (this.countExamType(this.displayOptions.exam, 'AP') === 0) {
        this.addExam('AP');
      }
      if (this.countExamType(this.displayOptions.exam, 'IB') === 0) {
        this.addExam('IB');
      }
      this.getCredits();
      this.key += 1;
    },
    removeTransfer(index: number) {
      this.displayOptions.class.splice(index, 1);
      if (this.displayOptions.class.length === 0) {
        this.addTransfer();
      }
      this.getCredits();
    },
    addTransfer() {
      // @ts-ignore
      this.displayOptions.class.push({ class: placeholderText, credits: 0 });
    },
    countExamType(exams: Record<'type' | 'subject' | 'score', DisplayOption>[], type: 'AP' | 'IB') {
      let counter = 0;
      for (let i = 0; i < exams.length; i += 1) {
        if (exams[i].type.placeholder === type) {
          counter += 1;
        }
      }
      return counter;
    },
    updateTransfer() {
      this.$emit(
        'updateTransfer',
        this.displayOptions.exam,
        this.displayOptions.class,
        this.tookSwimTest
      );
    },
    addItem(id: number) {
      const dropdown = document.getElementById(`dropdown-${id}`)!;
      // @ts-ignore
      const title: string = dropdown.value;
      const courseCode = title.substring(0, title.indexOf(':'));
      const subject = courseCode.split(' ')[0];
      const number = courseCode.split(' ')[1];
      fetch(
        `https://classes.cornell.edu/api/2.0/search/classes.json?roster=FA14&subject=${subject}&q=${courseCode}`
      ) // should be removed later
        .then(res => res.json())
        .then(resultJSON => {
          // check catalogNbr of resultJSON class matches number of course to add
          resultJSON.data.classes.forEach((resultJSONclass: any) => {
            if (resultJSONclass.catalogNbr === number) {
              const course = resultJSONclass;
              const creditsC = course.credits || course.enrollGroups[0].unitsMaximum;
              this.displayOptions.class[id] = {
                class: courseCode,
                course,
                credits: creditsC,
              };
              this.getCredits();
            }
          });
        });
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

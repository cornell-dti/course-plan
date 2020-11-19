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
                  :key="index"
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
                :key="index"
                class="onboarding-selectWrapper">
                <newCourse
                :semesterID="index"
                :isOnboard="true"
                :placeholderText="options.class"
                @addItem="addItem"
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

<script lang="ts">
import Vue, { PropType } from 'vue';
import { examData as reqsData } from '@/requirements/data/exams/ExamCredit';
import coursesJSON from '../../assets/courses/courses.json';
import NewCourse from '@/components/Modals/NewCourse.vue';
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
  scores: number[];
  classes: [];
  exams: string[];
  subjects: string[][];
  firstName: string;
  middleName?: string;
  lastName: string;
  displayOptions: {
    exam: Record<'type' | 'subject' | 'score', DisplayOption>[];
    class: FirestoreTransferClass[];
  };
  transferJSON: any,
  isError: boolean;
  totalCredits: number;
};

export default Vue.extend({
  props: {
    user: Object as PropType<AppUser>
  },
  data(): Data {
    return {
      tookSwimTest: '',
      scores: [],
      classes: [],
      exams: [],
      subjects: [[]],
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
              acronym: ''
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
      const exam: Record<Section, DisplayOption> = {};
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
      const TransferJSON: Record<string, { credits: number; type: 'AP' | 'IB' }> = {};
      reqsData.AP.forEach(sub => {
        TransferJSON[sub.name] = {
          credits: sub.fulfillment.credits,
          type: 'AP'
        };
      });
      reqsData.IB.forEach(sub => {
        TransferJSON[sub.name] = {
          credits: sub.fulfillment.credits,
          type: 'IB'
        };
      });
      this.transferJSON = TransferJSON;
      if (typeof this.displayOptions !== 'undefined') {
        this.$emit('updateTransfer', this.displayOptions.exam, this.displayOptions.class, this.tookSwimTest);
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
    closeDropdownIfOpen(section: 'exam' | 'class', i: number) {
      const displayOptions: any = this.displayOptions[section][i];
      if (section === 'exam') {
        Object.keys(displayOptions).forEach(key => {
          if (key !== 'equivCourse' && displayOptions[key].stopClose) {
            displayOptions[key].stopClose = false;
          } else if (key !== 'equivCourse' && displayOptions[key].shown) {
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
    closeTypeDropdownIfOpen(event: unknown, i: number) {
      this.closeDropdownIfOpen('exam', i);
    },
    closeClassDropdownIfOpen(event: unknown, i: number) {
      this.closeDropdownIfOpen('class', i);
    },
    // Set the colleges map to with acronym keys and full name values
    setExamsMap() {
      const exams: string[] = [];
      Object.keys(reqsData).forEach(key => {
        exams.push(key);
      });
      this.exams = exams;
    },
    // Set the majors map to with acronym keys and full name values
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
    selectOption(type: 'exam' | 'class', section: Section, text: string, acronym: string | number, i: number) {
      let displayOptions: any = this.displayOptions[type][i];
      if (type === 'exam') {
        displayOptions = displayOptions[section];
      }
      displayOptions.placeholder = text;
      displayOptions.shown = false;
      displayOptions.arrowColor = inactiveGray;
      displayOptions.boxBorder = inactiveGray;
      displayOptions.placeholderColor = lightPlaceholderGray;
      this.$emit('updateTransfer', this.displayOptions.exam, this.displayOptions.class, this.tookSwimTest);
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
      const course = this.getCourseFromExam(type, text);
      // @ts-ignore
      this.displayOptions.exam[i].equivCourse = course;
      this.selectOption('exam', 'subject', text, acronym, i);
    },
    selectClass(text: string, acronym: string | number, i: number) {
      // @ts-ignore
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
      this.displayOptions.exam.push(exam);
    },
    getCourseFromExam(type: 'AP' | 'IB', subject: string) {
      let courses: Record<string, number> | undefined;
      for (const exam of reqsData[type]) {
        if (exam.name === subject) {
          courses = exam.fulfillment.courseEquivalents
          // as a default takes the first equivalent course
          // TODO will need to add requirements menu if editiable.
          break;
        }
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
      // @ts-ignore
      this.displayOptions.class.push(placeholderText);
    },
    addItem(id: number) {
      const dropdown = document.getElementById(`dropdown-${id}`)!;
      // @ts-ignore
      const title: string = dropdown.value;
      const courseCode = title.substring(0, title.indexOf(':'));
      const subject = courseCode.split(' ')[0];
      const number = courseCode.split(' ')[1];
      fetch(`https://classes.cornell.edu/api/2.0/search/classes.json?roster=FA14&subject=${subject}&q=${courseCode}`) // should be removed later
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
                credits: creditsC
              };
              this.getCredits();
              this.$emit('updateTransfer', this.displayOptions.exam, this.displayOptions.class, this.tookSwimTest);
            }
          });
        });
    }
  }
});

</script>

<style scoped lang="scss">
  @import '@/components/Modals/Onboarding.scss';
</style>

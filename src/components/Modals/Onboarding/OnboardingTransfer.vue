<template>
  <div class="onboarding">
    <onboarding-transfer-swimming
      :tookSwimTest="tookSwimTest === 'yes'"
      @update-swim="updateSwim"
    />
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
            <div class="onboarding-section" v-for="(exam, index) in examsAP" :key="index">
              <div class="onboarding-selectWrapperRow">
                <onboarding-transfer-exam-property-dropdown
                  property-name="Subject"
                  :columnWide="true"
                  :availableOptions="subjectsAP"
                  :choice="exam.subject"
                  @on-select="subject => selectAPSubject(subject, index)"
                />
                <onboarding-transfer-exam-property-dropdown
                  property-name="Score"
                  :columnWide="false"
                  :availableOptions="scoresAP"
                  :choice="exam.score"
                  @on-select="score => selectAPScore(score, index)"
                />
                <div class="onboarding-select--columnCenter">
                  <label class="onboarding-label">Credits</label>
                  <label class="college-major-minor-placeholder">{{ getExamCredit(exam) }}</label>
                </div>
                <div class="onboarding-select--column-removeExam">
                  <div
                    class="onboarding-remove"
                    @click="removeExam('AP', index)"
                    :class="{
                      'onboarding--hidden':
                        examsAP.length === 1 && exam.subject === placeholderText,
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
            <div class="onboarding-section" v-for="(exam, index) in examsIB" :key="index">
              <div class="onboarding-selectWrapperRow">
                <onboarding-transfer-exam-property-dropdown
                  property-name="Subject"
                  :columnWide="true"
                  :availableOptions="subjectsIB"
                  :choice="exam.subject"
                  @on-select="subject => selectIBSubject(subject, index)"
                />
                <onboarding-transfer-exam-property-dropdown
                  property-name="Score"
                  :columnWide="false"
                  :availableOptions="scoresIB"
                  :choice="exam.score"
                  @on-select="score => selectIBScore(score, index)"
                />
                <div class="onboarding-select--columnCenter">
                  <label class="onboarding-label">Credits</label>
                  <label class="college-major-minor-placeholder">{{ getExamCredit(exam) }}</label>
                </div>
                <div class="onboarding-select--column-removeExam">
                  <div
                    class="onboarding-remove"
                    @click="removeExam('IB', index)"
                    :class="{
                      'onboarding--hidden':
                        examsIB.length === 1 && exam.subject === placeholderText,
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
              v-for="(options, index) in classes"
              :key="index"
              class="onboarding-selectWrapperRow"
            >
              <div class="onboarding-select--columnFill">
                <course-selector
                  :searchBoxClassName="transferClassSearchboxClassname(options.class)"
                  :placeholder="getTransferClassSearchboxPlaceholder(options.class)"
                  :autoFocus="false"
                  @on-select="course => onCourseSelection(index, course)"
                />
              </div>
              <div class="onboarding-select--column-remove">
                <div
                  class="onboarding-remove"
                  @click="removeTransfer(index)"
                  :class="{
                    'onboarding--hidden':
                      classes.length === 1 &&
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
import { AppUser, FirestoreAPIBExam, CornellCourseRosterCourse } from '@/user-data';
import OnboardingTransferSwimming from './OnboardingTransferSwimming.vue';
import OnboardingTransferExamPropertyDropdown from './OnboardingTransferExamPropertyDropdown.vue';
import CourseSelector, { MatchingCourseSearchResult } from '../NewCourse/CourseSelector.vue';

const placeholderText = 'Select one';

type TransferClassWithOptionalCourse = {
  class: string;
  credits: number;
  course?: CornellCourseRosterCourse;
};

type Data = {
  tookSwimTest: 'yes' | 'no';
  scoresAP: readonly number[];
  scoresIB: readonly number[];
  subjectsAP: readonly string[];
  subjectsIB: readonly string[];
  placeholderText: string;
  examsAP: FirestoreAPIBExam[];
  examsIB: FirestoreAPIBExam[];
  classes: TransferClassWithOptionalCourse[];
};

const scoresAP = [1, 2, 3, 4, 5];
const scoresIB = [1, 2, 3, 4, 5, 6, 7];
const subjectsAP = reqsData.AP.map(it => it.name);
const subjectsIB = reqsData.IB.map(it => it.name);

export const getExamCredit = (exam: FirestoreAPIBExam): number => {
  const relevantExamFromExamData = reqsData[exam.type].find(it => it.name === exam.subject);
  if (relevantExamFromExamData == null) return 0;
  const { fulfillment } = relevantExamFromExamData;
  return exam.score < fulfillment.minimumScore ? 0 : fulfillment.credits;
};

export default Vue.extend({
  components: {
    CourseSelector,
    OnboardingTransferSwimming,
    OnboardingTransferExamPropertyDropdown,
  },
  props: {
    user: Object as PropType<AppUser>,
  },
  data(): Data {
    const examsAP: FirestoreAPIBExam[] = [];
    const examsIB: FirestoreAPIBExam[] = [];
    this.user.exam.forEach(exam => {
      (exam.type === 'AP' ? examsAP : examsIB).push(exam);
    });
    examsAP.push({ type: 'AP', subject: placeholderText, score: 0 });
    examsIB.push({ type: 'IB', subject: placeholderText, score: 0 });
    const transferClasses: TransferClassWithOptionalCourse[] = [];
    this.user.transferCourse.forEach(course => {
      transferClasses.push(course);
    });
    transferClasses.push({ class: placeholderText, credits: 0 });
    return {
      tookSwimTest: typeof this.user.tookSwim !== 'undefined' ? this.user.tookSwim : 'no',
      scoresAP,
      scoresIB,
      subjectsAP,
      subjectsIB,
      examsAP,
      examsIB,
      classes: transferClasses,
      placeholderText,
    };
  },
  computed: {
    totalCredits(): number {
      let count = 0;
      [...this.examsAP, ...this.examsIB].forEach(exam => {
        count += this.getExamCredit(exam);
      });
      this.classes.forEach(clas => {
        count += clas.credits;
      });
      return count;
    },
  },
  methods: {
    getExamCredit,
    getTransferClassSearchboxPlaceholder(text: string): string {
      return text !== placeholderText ? text : '"CS1110", "Multivariable Calculus", etc';
    },
    transferClassSearchboxClassname(text: string): string {
      return text !== placeholderText
        ? 'new-course-onboarding'
        : 'new-course-onboarding new-course-onboarding-empty';
    },
    updateSwim(tookSwimTest: boolean) {
      this.tookSwimTest = tookSwimTest ? 'yes' : 'no';
      this.updateTransfer();
    },
    selectAPSubject(subject: string, i: number) {
      this.examsAP = this.examsAP.map((exam, index) => (index === i ? { ...exam, subject } : exam));
      this.updateTransfer();
    },
    selectIBSubject(subject: string, i: number) {
      this.examsIB = this.examsIB.map((exam, index) => (index === i ? { ...exam, subject } : exam));
      this.updateTransfer();
    },
    selectAPScore(score: number, i: number) {
      this.examsAP = this.examsAP.map((exam, index) => (index === i ? { ...exam, score } : exam));
      this.updateTransfer();
    },
    selectIBScore(score: number, i: number) {
      this.examsIB = this.examsIB.map((exam, index) => (index === i ? { ...exam, score } : exam));
      this.updateTransfer();
    },
    addExam(type: 'AP' | 'IB') {
      const exam = { type, subject: placeholderText, score: 0 };
      (type === 'AP' ? this.examsAP : this.examsIB).push(exam);
    },
    removeExam(type: 'AP' | 'IB', index: number) {
      const exams = type === 'AP' ? this.examsAP : this.examsIB;
      exams.splice(index, 1);
      if (exams.length === 0) this.addExam(type);
      this.updateTransfer();
    },
    removeTransfer(index: number) {
      this.classes.splice(index, 1);
      if (this.classes.length === 0) {
        this.addTransfer();
      }
      this.updateTransfer();
    },
    addTransfer() {
      this.classes.push({ class: placeholderText, credits: 0 });
    },
    updateTransfer() {
      this.$emit(
        'updateTransfer',
        [...this.examsAP, ...this.examsIB],
        this.classes,
        this.tookSwimTest
      );
    },
    onCourseSelection(id: number, { title }: MatchingCourseSearchResult) {
      const courseCode = title.substring(0, title.indexOf(':'));
      const subject = courseCode.split(' ')[0];
      const number = courseCode.split(' ')[1];
      fetch(
        `https://classes.cornell.edu/api/2.0/search/classes.json?roster=FA14&subject=${subject}&q=${courseCode}`
      ) // should be removed later
        .then(res => res.json())
        .then(resultJSON => {
          // check catalogNbr of resultJSON class matches number of course to add
          resultJSON.data.classes.forEach((resultJSONclass: CornellCourseRosterCourse) => {
            if (resultJSONclass.catalogNbr === number) {
              const course = resultJSONclass;
              const creditsC = course.enrollGroups[0].unitsMaximum;
              const classes = [...this.classes];
              classes[id] = { class: courseCode, course, credits: creditsC };
              this.classes = classes;
              this.updateTransfer();
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
<style lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
.new-course {
  &-onboarding {
    font-size: 14px;
    line-height: 17px;
    color: $black;
    width: 100%;
    border-radius: 3px;
    padding: 0.5rem;
    border: 0.5px solid $darkPlaceholderGray;
    border-radius: 0px;
    background-color: $white;
    &::placeholder {
      color: $lightPlaceholderGray;
    }
  }
  &-onboarding-empty {
    &::placeholder {
      color: $darkPlaceholderGray;
    }
  }
}
</style>

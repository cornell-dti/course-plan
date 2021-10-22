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
      <div class="onboarding-transferCredits onboarding-inputs">
        <div
          class="onboarding-inputWrapper onboarding-inputWrapper--college onboarding-inputWrapper--description"
        >
          <div class="onboarding-subHeader">
            <span class="onboarding-subHeader--font">AP Credits</span>
          </div>
          <div class="onboarding-subsection onboarding-transferCreditsSection">
            <div class="onboarding-section" v-for="(exam, index) in examsAP" :key="index">
              <div class="onboarding-selectWrapperRow">
                <onboarding-transfer-exam-property-dropdown
                  property-name="Subject"
                  :columnWide="true"
                  :availableOptions="getSelectableOptions(examsAP, subjectsAP, exam.subject)"
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
                <div class="onboarding-select--column-removeExam">
                  <button
                    class="onboarding-remove"
                    @click="removeExam('AP', index)"
                    v-if="hasExams(examsAP, exam)"
                  >
                    <img
                      src="@/assets/images/x-green.svg"
                      :alt="`x to remove AP exam ${exam.type} ${exam.subject}`"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div class="onboarding-addRemoveWrapper">
              <button class="onboarding-add" @click="addExam('AP')">+ another subject</button>
            </div>
          </div>
          <div class="onboarding-subHeader">
            <span class="onboarding-subHeader--font">IB Credits</span>
          </div>
          <div class="onboarding-inputs onboarding-transferCreditsSection">
            <div class="onboarding-section" v-for="(exam, index) in examsIB" :key="index">
              <div class="onboarding-selectWrapperRow">
                <onboarding-transfer-exam-property-dropdown
                  property-name="Subject"
                  :columnWide="true"
                  :availableOptions="getSelectableOptions(examsIB, subjectsIB, exam.subject)"
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
                <div class="onboarding-select--column-removeExam">
                  <button
                    class="onboarding-remove"
                    @click="removeExam('IB', index)"
                    v-if="hasExams(examsIB, exam)"
                  >
                    <img
                      src="@/assets/images/x-green.svg"
                      :alt="`x to remove IB exam ${exam.type} ${exam.subject}`"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div class="onboarding-addRemoveWrapper">
              <button class="onboarding-add" @click="addExam('IB')">+ another subject</button>
            </div>
          </div>
        </div>
        <div class="onboarding-transferCreditDescription">
          *To add credit from external institutions, please add the equivalent Cornell course to
          your schedule later. Learn more about Transfer Credits
          <a target="_blank" href="https://courses.cornell.edu/content.php?catoid=41&navoid=11629"
            >here</a
          >.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { examData as reqsData, ExamRequirements } from '@/requirements/data/exams/ExamCredit';
import OnboardingTransferSwimming from './OnboardingTransferSwimming.vue';
import OnboardingTransferExamPropertyDropdown from './OnboardingTransferExamPropertyDropdown.vue';

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

const scoresAP = [5, 4, 3, 2, 1];
const scoresIB = [7, 6, 5, 4, 3, 2, 1];
const existingAP: Record<string, boolean> = {};
const unmodifiedReqsData = { ...reqsData };
// filter duplicate exam names and ones already selected
reqsData.AP = reqsData.AP.filter(ap => {
  const inExisting = ap.name in existingAP;
  existingAP[ap.name] = true;
  return !inExisting;
});
const existingIB: Record<string, boolean> = {};
// filter duplicate exam names and ones already selected
reqsData.IB = reqsData.IB.filter(ib => {
  const inExisting = ib.name in existingIB;
  existingIB[ib.name] = true;
  return !inExisting;
});
const subjectsAP = reqsData.AP.map(it => it.name);
const subjectsIB = reqsData.IB.map(it => it.name);

export const getExamCredit = (exam: FirestoreAPIBExam): number => {
  const allExamsWithSameName: ExamRequirements[] = unmodifiedReqsData[exam.type].filter(
    it => it.name === exam.subject
  );
  let mostPossibleCredit = 0;
  for (const examWithSameName of allExamsWithSameName) {
    if (exam.score >= examWithSameName.fulfillment.minimumScore) {
      mostPossibleCredit = Math.max(mostPossibleCredit, examWithSameName.fulfillment.credits);
    }
  }
  return mostPossibleCredit;
};

export default defineComponent({
  components: {
    OnboardingTransferSwimming,
    OnboardingTransferExamPropertyDropdown,
  },
  props: {
    onboardingData: { type: Object as PropType<AppOnboardingData>, required: true },
  },
  data(): Data {
    const examsAP: FirestoreAPIBExam[] = [];
    const examsIB: FirestoreAPIBExam[] = [];
    this.onboardingData.exam.forEach(exam => {
      (exam.type === 'AP' ? examsAP : examsIB).push(exam);
    });
    examsAP.push({ type: 'AP', subject: placeholderText, score: 0 });
    examsIB.push({ type: 'IB', subject: placeholderText, score: 0 });
    const transferClasses: TransferClassWithOptionalCourse[] = [];
    transferClasses.push({ class: placeholderText, credits: 0 });
    return {
      tookSwimTest:
        typeof this.onboardingData.tookSwim !== 'undefined' ? this.onboardingData.tookSwim : 'no',
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
      this.$emit('updateTransfer', [...this.examsAP, ...this.examsIB], this.tookSwimTest);
    },
    onCourseSelection(id: number, course: CornellCourseRosterCourse) {
      const courseCode = `${course.subject} ${course.catalogNbr}`;
      const creditsC = course.enrollGroups[0].unitsMaximum;
      const classes = [...this.classes];
      classes[id] = { class: courseCode, course, credits: creditsC };
      this.classes = classes;
      this.updateTransfer();
    },
    getSelectableOptions(
      // exams already picked
      selectedExams: FirestoreAPIBExam[],
      // array of ap/ib exams
      allSubjects: readonly string[],
      choice: string
    ) {
      const selectedExamsNames = selectedExams.map(exam => exam.subject);
      const selectableOptions: string[] = [];
      // copy all of the possible options over but exclude already selected ones
      for (const subject of allSubjects) {
        // don't include selected ones
        if (!selectedExamsNames.includes(subject)) {
          selectableOptions.push(subject);
        }
      }
      // add the current selection associated with this input into the availableChoices
      if (choice !== placeholderText) {
        selectableOptions.push(choice);
      }
      return selectableOptions;
    },
    hasExams(exams: FirestoreAPIBExam[], exam: FirestoreAPIBExam): boolean {
      return !(exams.length === 1 && exam.subject === placeholderText);
    },
  },
});
</script>

<style scoped lang="scss">
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

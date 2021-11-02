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
          <onboarding-transfer-credits-source
            examName="AP"
            :exams="examsAP"
            :subjects="subjectsAP"
            :scores="scoresAP"
            :placeholderText="placeholderText"
            @on-subject-select="selectAPSubject"
            @on-score-select="selectAPScore"
            @on-remove="removeExam"
            @on-add="addExam"
          />
          <onboarding-transfer-credits-source
            examName="IB"
            :exams="examsIB"
            :subjects="subjectsIB"
            :scores="scoresIB"
            :placeholderText="placeholderText"
            @on-subject-select="selectIBSubject"
            @on-score-select="selectIBScore"
            @on-remove="removeExam"
            @on-add="addExam"
          />
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
import { examSubjects, getExamCredit } from '@/requirements/requirement-exam-utils';
import OnboardingTransferSwimming from './OnboardingTransferSwimming.vue';
import OnboardingTransferCreditsSource from './OnboardingTransferCreditsSource.vue';

type TransferClassWithOptionalCourse = {
  class: string;
  credits: number;
  course?: CornellCourseRosterCourse;
};

type Data = {
  tookSwimTest: 'yes' | 'no';
  scoresAP: readonly number[];
  scoresIB: readonly number[];
  placeholderText: string;
  examsAP: FirestoreAPIBExam[];
  examsIB: FirestoreAPIBExam[];
  classes: TransferClassWithOptionalCourse[];
};

const scoresAP = [5, 4, 3, 2, 1];
const scoresIB = [7, 6, 5, 4, 3, 2, 1];

export default defineComponent({
  components: {
    OnboardingTransferSwimming,
    OnboardingTransferCreditsSource,
  },
  props: {
    onboardingData: {
      type: Object as PropType<AppOnboardingData>,
      required: true,
    },
  },
  data(): Data {
    const placeholderText = 'Select one';
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
        count += getExamCredit(exam);
      });
      this.classes.forEach(clas => {
        count += clas.credits;
      });
      return count;
    },
    subjectsAP(): string[] {
      const currentSubjects = new Set(this.examsAP.map(exam => exam.subject));
      return examSubjects.AP.filter(subject => !currentSubjects.has(subject));
    },
    subjectsIB(): string[] {
      const currentSubjects = new Set(this.examsIB.map(exam => exam.subject));
      return examSubjects.IB.filter(subject => !currentSubjects.has(subject));
    }
  },
  methods: {
    getTransferClassSearchboxPlaceholder(text: string): string {
      return text !== this.placeholderText ? text : '"CS1110", "Multivariable Calculus", etc';
    },
    transferClassSearchboxClassname(text: string): string {
      return text !== this.placeholderText
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
      const exam = { type, subject: this.placeholderText, score: 0 };
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
      this.classes.push({ class: this.placeholderText, credits: 0 });
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

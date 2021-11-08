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
            :exams="exams.AP"
            :subjects="subjects.AP"
            :scores="scores.AP"
            :placeholderText="placeholderText"
            @on-subject-select="selectAPSubject"
            @on-score-select="selectAPScore"
            @on-remove="removeExam"
            @on-add="addExam"
          />
          <onboarding-transfer-credits-source
            examName="IB"
            :exams="exams.IB"
            :subjects="subjects.IB"
            :scores="scores.IB"
            :placeholderText="placeholderText"
            @on-subject-select="selectIBSubject"
            @on-score-select="selectIBScore"
            @on-remove="removeExam"
            @on-add="addExam"
          />
          <onboarding-transfer-credits-source
            examName="CASE"
            :exams="exams.CASE"
            :subjects="subjects.CASE"
            :placeholderText="placeholderText"
            @on-subject-select="selectCASESubject"
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
  exams: {
    AP: FirestoreTransferExam[];
    IB: FirestoreTransferExam[];
    CASE: FirestoreTransferExam[];
  };
  classes: TransferClassWithOptionalCourse[];
};

const scoresAP = [5, 4, 3, 2, 1];
const scoresIB = [7, 6, 5, 4, 3, 2, 1];

const asAPIB = (exam: FirestoreTransferExam) => {
  const { name } = exam;
  if (name === 'CASE') {
    throw new TypeError('Cannot fetch credit from CASE exam');
  }
  return { ...exam, type: name };
};

const asAPIBArray = (exams: FirestoreTransferExam[]) => exams.map(asAPIB);


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
    const exams = {
      AP: [] as FirestoreTransferExam[],
      IB: [] as FirestoreTransferExam[],
      CASE: [] as FirestoreTransferExam[],
    } as const;
    this.onboardingData.exam.forEach(exam => {
      exams[exam.type].push({ ...exam, name: exam.type });
    });
    exams.AP.push({ name: 'AP', subject: placeholderText, score: 0 });
    exams.IB.push({ name: 'IB', subject: placeholderText, score: 0 });
    exams.CASE.push({ name: 'CASE', subject: placeholderText, score: 0 });
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
      const aggregated = [...asAPIBArray(this.exams.AP), ...asAPIBArray(this.exams.IB)];
      aggregated.forEach(exam => {
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
    },
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
    selectSubject(subject: string, i: number, name: TransferExam) {
      this.exams[name] = this.exams[name].map((exam, index) =>
        index === i ? { ...exam, subject } : exam
      );
      this.updateTransfer();
    },
    selectAPSubject(subject: string, i: number) {
      this.selectSubject(subject, i, 'AP');
    },
    selectIBSubject(subject: string, i: number) {
      this.selectSubject(subject, i, 'IB');
    },
    selectCASESubject(subject: string, i: number) {
      this.selectSubject(subject, i, 'CASE');
    },
    selectScore(score: number, i: number, name: TransferExam) {
      this.exams[name] = this.exams[name].map((exam, index) =>
        index === i ? { ...exam, score } : exam
      );
      this.updateTransfer();
    },
    selectAPScore(score: number, i: number) {
      this.selectScore(score, i, 'AP');
    },
    selectIBScore(score: number, i: number) {
      this.selectScore(score, i, 'IB');
    },
    addExam(name: TransferExam) {
      const exam = { name, subject: this.placeholderText, score: 0 };
      this.exams[name].push(exam);
    },
    removeExam(name: TransferExam, index: number) {
      const transerExams = this.exams[name];
      transerExams.splice(index, 1);
      if (transerExams.length === 0) this.addExam(name);
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
      this.$emit(
        'updateTransfer',
        [...asAPIBArray(this.exams.AP), ...asAPIBArray(this.exams.IB)],
        this.tookSwimTest
      );
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

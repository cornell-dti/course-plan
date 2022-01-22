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
            examType="AP"
            :exams="exams.AP"
            :subjects="subjectsAP"
            :placeholderText="placeholderText"
            @on-subject-select="selectAPSubject"
            @on-score-select="selectAPScore"
            @on-remove="removeExam"
            @on-add="addExam"
          />
          <onboarding-transfer-credits-source
            examType="IB"
            :exams="exams.IB"
            :subjects="subjectsIB"
            :placeholderText="placeholderText"
            @on-subject-select="selectIBSubject"
            @on-score-select="selectIBScore"
            @on-remove="removeExam"
            @on-add="addExam"
          />
          <onboarding-transfer-credits-source
            v-if="caseEnabled"
            examType="CASE"
            :exams="exams.CASE"
            :subjects="subjectsCASE"
            :placeholderText="placeholderText"
            @on-subject-select="selectCASESubject"
            @on-score-select="selectCASEScore"
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
import featureFlagCheckers from '@/feature-flags';
import OnboardingTransferSwimming from './OnboardingTransferSwimming.vue';
import OnboardingTransferCreditsSource from './OnboardingTransferCreditsSource.vue';

type TransferClassWithOptionalCourse = {
  class: string;
  credits: number;
  course?: CornellCourseRosterCourse;
};

type Data = {
  tookSwimTest: 'yes' | 'no';
  placeholderText: string;
  exams: {
    AP: FirestoreTransferExam[];
    IB: FirestoreTransferExam[];
    CASE: FirestoreTransferExam[];
  };
  classes: TransferClassWithOptionalCourse[];
};

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
    };
    this.onboardingData.exam.forEach(exam => {
      exams[exam.examType].push(exam);
    });
    exams.AP.push({ examType: 'AP', subject: placeholderText, score: '' });
    exams.IB.push({ examType: 'IB', subject: placeholderText, score: '' });
    exams.CASE.push({ examType: 'CASE', subject: placeholderText, score: '' });
    const transferClasses: TransferClassWithOptionalCourse[] = [];
    transferClasses.push({ class: placeholderText, credits: 0 });
    return {
      tookSwimTest:
        typeof this.onboardingData.tookSwim !== 'undefined' ? this.onboardingData.tookSwim : 'no',
      exams,
      classes: transferClasses,
      placeholderText,
    };
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
    selectSubject(subject: string, i: number, examType: TransferExamType) {
      this.exams[examType] = this.exams[examType].map((exam, index) =>
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
    selectScore(score: string | number, i: number, examType: TransferExamType) {
      this.exams[examType] = this.exams[examType].map((exam, index) =>
        index === i ? { ...exam, score } : exam
      );
      this.updateTransfer();
    },
    selectAPScore(score: string | number, i: number) {
      this.selectScore(score, i, 'AP');
    },
    selectIBScore(score: string | number, i: number) {
      this.selectScore(score, i, 'IB');
    },
    selectCASEScore(score: string | number, i: number) {
      this.selectScore(score, i, 'CASE');
    },
    addExam(examType: TransferExamType) {
      const exam = {
        examType,
        subject: this.placeholderText,
        score: '',
      };
      this.exams[examType].push(exam);
    },
    removeExam(examType: TransferExamType, index: number) {
      const transferExams = this.exams[examType];
      transferExams.splice(index, 1);
      if (transferExams.length === 0) this.addExam(examType);
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
        [...this.exams.AP, ...this.exams.IB, ...this.exams.CASE],
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
    subjects(examType: TransferExamType) {
      const currentSubjects = new Set(this.exams[examType].map(({ subject }) => subject));
      // stub in CASE exams here for now
      return examSubjects[examType].filter(subject => !currentSubjects.has(subject));
    },
  },
  computed: {
    totalCredits(): number {
      let count = 0;
      const aggregated = [...this.exams.AP, ...this.exams.IB, ...this.exams.CASE];
      aggregated.forEach(exam => {
        count += getExamCredit(exam);
      });
      this.classes.forEach(clas => {
        count += clas.credits;
      });
      return count;
    },
    subjectsAP(): string[] {
      return this.subjects('AP');
    },
    subjectsIB(): string[] {
      return this.subjects('IB');
    },
    subjectsCASE(): string[] {
      return this.subjects('CASE');
    },
    caseEnabled(): boolean {
      return featureFlagCheckers.isCaseEnabled();
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

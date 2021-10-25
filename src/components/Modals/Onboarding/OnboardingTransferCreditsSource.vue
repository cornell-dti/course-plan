<template>
  <div>
    <div class="onboarding-subHeader">
      <span class="onboarding-subHeader--font">{{ examName }} Credits</span>
    </div>
    <div class="onboarding-subsection onboarding-transferCreditsSection">
      <div class="onboarding-section" v-for="(exam, index) in exams" :key="index">
        <div class="onboarding-selectWrapperRow">
          <onboarding-transfer-exam-property-dropdown
            property-name="Subject"
            :columnWide="true"
            :availableOptions="getSelectableOptions(exams, subjects, exam.subject)"
            :choice="exam.subject"
            @on-select="subject => selectSubject(subject, index)"
          />
          <onboarding-transfer-exam-property-dropdown
            v-if="scoresDropdown"
            property-name="Score"
            :columnWide="false"
            :availableOptions="scoresDropdown.scores"
            :choice="exam.score"
            @on-select="score => onSelect(score, index)"
          />
          <div class="onboarding-select--column-removeExam">
            <button
              class="onboarding-remove"
              @click="removeExam(examName, index)"
              v-if="hasExams(exams, exam)"
            >
              <img
                src="@/assets/images/x-green.svg"
                :alt="`x to remove ${examName} exam ${exam.type} ${exam.subject}`"
              />
            </button>
          </div>
        </div>
      </div>
      <div class="onboarding-addRemoveWrapper">
        <button class="onboarding-add" @click="addExam(examName)">+ another subject</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import OnboardingTransferExamPropertyDropdown from './OnboardingTransferExamPropertyDropdown.vue';

/** Represents an exam one can take for transfer credit */
type Exam = 'AP' | 'IB';

type GetSelectableOptions = (
  selectedExams: readonly FirestoreAPIBExam[],
  allSubjects: readonly string[],
  choice: string
) => string[];

type SelectSubject = (subject: string, i: number) => void;

/** Represents the information needed to represent a score dropdown menu */
type ScoreDropdown = {
  /** The scores achievable on the test */
  readonly scores: readonly number[];
  /** A callback to execute upon selection of a score */
  readonly selectScore: (score: number, index: number) => void;
};

type RemoveExam = (name: Exam, index: number) => void;

type HasExams = (exams: readonly FirestoreAPIBExam[], exam: FirestoreAPIBExam) => boolean;

type AddExam = (name: Exam) => void;

export default defineComponent({
  components: {
    OnboardingTransferExamPropertyDropdown,
  },
  props: {
    examName: { type: String as PropType<Exam>, required: true },
    exams: {
      type: Array as PropType<readonly FirestoreAPIBExam[]>,
      required: true,
    },
    subjects: {
      type: Array as PropType<readonly string[]>,
      required: true,
    },
    getSelectableOptions: {
      type: Function as PropType<GetSelectableOptions>,
      required: true,
    },
    selectSubject: {
      type: Function as PropType<SelectSubject>,
      required: true,
    },
    scoresDropdown: {
      type: Object as PropType<ScoreDropdown>,
      required: false,
      default: undefined,
    },
    removeExam: {
      type: Function as PropType<RemoveExam>,
      required: true,
    },
    hasExams: {
      type: Function as PropType<HasExams>,
      required: true,
    },
    addExam: {
      type: Function as PropType<AddExam>,
      required: true,
    },
  },
  methods: {
    onSelect(score: number, index: number) {
      if (this.scoresDropdown) this.scoresDropdown.selectScore(score, index);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

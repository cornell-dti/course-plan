<template>
  <div class="onboarding">
    <div class="onboarding-section">
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> Basic Information</span>
        <span>
          <button class="onboarding-button-previous" @click="editBasicInformation()">
            <img src="@/assets/images/edit-review.svg" alt="edit icon" />
          </button>
        </span>
      </div>
      <div class="onboarding-subsection onboarding-inputs--review">
        <div class="onboarding-subHeader2-fillRow">
          <span class="onboarding-subHeader2-review"> Your Name</span>
        </div>
        <div class="onboarding-selectWrapperRow-review">
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
            <label class="onboarding-label"><span> First Name</span></label>
            <label class="onboarding-label--review"
              ><span> {{ userName.firstName }}</span></label
            >
          </div>
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
            <label class="onboarding-label"><span> Middle Name</span></label>
            <label class="onboarding-label--review"
              ><span> {{ userName.middleName }}</span></label
            >
          </div>
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
            <label class="onboarding-label"><span>Last Name</span></label>
            <label class="onboarding-label--review"
              ><span> {{ userName.lastName }}</span></label
            >
          </div>
          <div
            class="onboarding-inputWrapper onboarding-inputWrapper--name onboarding-inputWrapper--description"
          >
            <label class="onboarding-label"><span>Entrance Season</span></label>
            <label class="onboarding-label--review"
              ><span data-cyId="onboarding-entranceSeason">{{ entranceSemText }}</span></label
            >
          </div>
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
            <label class="onboarding-label"><span>Entrance Year</span></label>
            <label class="onboarding-label--review"
              ><span data-cyId="onboarding-entranceYear">{{ entranceYearText }}</span></label
            >
          </div>
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name"></div>
          <div
            class="onboarding-inputWrapper onboarding-inputWrapper--name onboarding-inputWrapper--noMargin"
          >
            <label class="onboarding-label"><span>Graduation Season</span></label>
            <label class="onboarding-label--review"
              ><span data-cyId="onboarding-gradSeason">{{ gradSemText }}</span></label
            >
          </div>
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
            <label class="onboarding-label"><span>Graduation Year</span></label>
            <label class="onboarding-label--review"
              ><span data-cyId="onboarding-gradYear">{{ gradYearText }}</span></label
            >
          </div>
        </div>
        <div class="onboarding-subHeader2-fillRow">
          <span class="onboarding-subHeader2-review"> Your Undergraduate Degree</span>
        </div>
        <div class="onboarding-selectWrapper">
          <div class="onboarding-selectWrapper-review">
            <label class="onboarding-label">College</label>
            <div>
              <label
                class="onboarding-label--review"
                v-if="onboardingData.college"
                data-cyId="onboarding-college"
              >
                {{ collegeText }}
              </label>
            </div>
          </div>
          <div class="onboarding-selectWrapper-review">
            <label class="onboarding-label">Major</label>
            <div v-for="(major, index) in onboardingData.major" :key="index">
              <label class="onboarding-label--review" data-cyId="onboarding-major">{{
                getMajorFullName(major)
              }}</label>
            </div>
          </div>
          <div class="onboarding-selectWrapper-review">
            <label class="onboarding-label">Minors</label>
            <div v-for="(minor, index) in onboardingData.minor" :key="index">
              <label class="onboarding-label--review">{{ getMinorFullName(minor) }}</label>
            </div>
          </div>
        </div>
        <div class="onboarding-subHeader2-fillRow">
          <span class="onboarding-subHeader2-review"> Your Graduate Degree</span>
        </div>
        <div class="onboarding-selectWrapper-review">
          <label class="onboarding-label">Program</label>
          <div>
            <label class="onboarding-label--review" v-if="onboardingData.grad">
              {{ gradText }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="onboarding-section" v-if="!isGraduateOnly">
      <!-- TODO: Multiple colleges -->
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> Transfer Credits</span>
        <span>
          <button class="onboarding-button-previous" @click="editTransferCredits()">
            <img src="@/assets/images/edit-review.svg" alt="edit icon" />
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
              <img
                class="checkmark"
                src="@/assets/images/checkmark-onboarding.svg"
                alt="checkmark"
              />
              {{ onboardingData.tookSwim === 'yes' ? 'Yes' : 'No' }}
            </label>
          </div>
        </div>
        <div class="onboarding-subHeader2-fillRow">
          <span class="onboarding-subHeader2-review"> Test Credits</span>
        </div>
        <div class="onboarding-selectWrapper">
          <div class="onboarding-selectWrapper-reviewExam">
            <div class="alignLeft">
              <label class="onboarding-label onboarding-label--header">AP Credits</label>
              <label class="onboarding-label--subject">Subject</label>
              <div v-for="(exam, index) in onboardingData.exam" :key="'AP' + index">
                <label v-if="exam.type == 'AP'" class="onboarding-label--review">{{
                  exam.subject
                }}</label>
              </div>
              <label class="onboarding-label addSpaceTop onboarding-label--header"
                >IB Credits</label
              >
              <label class="onboarding-label--subject">Subject</label>
              <div v-for="(exam, index) in onboardingData.exam" :key="'IB' + index">
                <label v-if="exam.type == 'IB'" class="onboarding-label--review">{{
                  exam.subject
                }}</label>
              </div>
            </div>
            <div class="alignCenter">
              <label class="onboarding-label--subject">Score</label>
              <div v-for="(exam, index) in onboardingData.exam" :key="'APScore' + index">
                <label v-if="exam.type == 'AP'" class="onboarding-label--review">{{
                  exam.score
                }}</label>
              </div>
              <label class="onboarding-label addSpaceTop--score">Score</label>
              <div v-for="(exam, index) in onboardingData.exam" :key="'IBScore' + index">
                <label v-if="exam.type == 'IB'" class="onboarding-label--review">{{
                  exam.score
                }}</label>
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

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { getExamCredit } from '@/requirements/requirement-exam-utils';
import {
  getCollegeFullName,
  getMajorFullName,
  getMinorFullName,
  getGradFullName,
} from '@/utilities';
import { GTagEvent } from '@/gtag';

const placeholderText = 'Select one';

export default defineComponent({
  props: {
    userName: { type: Object as PropType<FirestoreUserName>, required: true },
    onboardingData: { type: Object as PropType<AppOnboardingData>, required: true },
  },
  emits: {
    setPage(page: number) {
      return typeof page === 'number';
    },
  },
  computed: {
    collegeText(): string {
      return getCollegeFullName(this.onboardingData.college);
    },
    gradText(): string {
      return getGradFullName(this.onboardingData.grad);
    },
    gradYearText(): string {
      return this.onboardingData.gradYear !== '' ? this.onboardingData.gradYear : placeholderText;
    },
    entranceYearText(): string {
      return this.onboardingData.entranceYear !== ''
        ? this.onboardingData.entranceYear
        : placeholderText;
    },
    gradSemText(): string {
      return this.onboardingData.gradSem ?? placeholderText;
    },
    entranceSemText(): string {
      return this.onboardingData.entranceSem ?? placeholderText;
    },
    totalCredits(): number {
      let count = 0;
      this.onboardingData.exam.forEach(exam => {
        count += getExamCredit(exam);
      });
      return count;
    },
    isGraduateOnly(): boolean {
      return this.onboardingData.grad !== '' && this.onboardingData.college === '';
    },
  },
  methods: {
    editBasicInformation(): void {
      this.setPage(1);
      GTagEvent(this.$gtag, 'onboarding-edit-basic-information');
    },
    editTransferCredits(): void {
      this.setPage(2);
      GTagEvent(this.$gtag, 'onboarding-edit-transfer-credits');
    },
    getMajorFullName,
    getMinorFullName,
    setPage(page: number): void {
      this.$emit('setPage', page);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

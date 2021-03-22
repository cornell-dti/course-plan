<template>
  <div class="onboarding">
    <div class="onboarding-section">
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> Basic Information</span>
        <span>
          <button class="onboarding-button-previous" @click="editBasicInformation()">
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
              ><span> {{ userName.firstName }}</span></label
            >
          </div>
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
            <label class="onboarding-label"><span> Middle Name </span></label>
            <label class="onboarding-label--review"
              ><span> {{ userName.middleName }}</span></label
            >
          </div>
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
            <label class="onboarding-label"><span> Last Name </span></label>
            <label class="onboarding-label--review"
              ><span> {{ userName.lastName }}</span></label
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
              <label class="onboarding-label--review">{{ collegeText }}</label>
            </div>
          </div>
          <div class="onboarding-selectWrapper-review">
            <label class="onboarding-label">Major</label>
            <div v-for="(major, index) in onboardingData.major" :key="index">
              <label class="onboarding-label--review">{{ getMajorFullName(major) }}</label>
            </div>
          </div>
        </div>
        <div class="onboarding-subHeader2-fillRow">
          <span class="onboarding-subHeader2-review"> Your Minor</span>
        </div>
        <div class="onboarding-selectWrapper">
          <label class="onboarding-label">Minors:</label>
          <div v-for="(minor, index) in onboardingData.minor" :key="index">
            <label class="onboarding-label--review">{{ getMinorFullName(minor) }}</label>
          </div>
        </div>
      </div>
    </div>
    <div class="onboarding-section">
      <!-- TODO: Multiple colleges -->
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> Transfer Credits</span>
        <span>
          <button class="onboarding-button-previous" @click="editTransferCredits()">
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
              <label class="onboarding-label">AP Credits</label>
              <div v-for="(exam, index) in onboardingData.exam" :key="'AP' + index">
                <label v-if="exam.type == 'AP'" class="onboarding-label--review">{{
                  exam.subject
                }}</label>
              </div>
              <label class="onboarding-label addSpaceTop">IB Credits</label>
              <div v-for="(exam, index) in onboardingData.exam" :key="'IB' + index">
                <label v-if="exam.type == 'IB'" class="onboarding-label--review">{{
                  exam.subject
                }}</label>
              </div>
            </div>
            <div class="alignCenter">
              <label class="onboarding-label">Score</label>
              <div v-for="(exam, index) in onboardingData.exam" :key="'APScore' + index">
                <label v-if="exam.type == 'AP'" class="onboarding-label--review">{{
                  exam.score
                }}</label>
              </div>
              <label class="onboarding-label addSpaceTop">Score</label>
              <div v-for="(exam, index) in onboardingData.exam" :key="'IBScore' + index">
                <label v-if="exam.type == 'IB'" class="onboarding-label--review">{{
                  exam.score
                }}</label>
              </div>
            </div>
            <div class="alignCenter">
              <label class="onboarding-label">Credit</label>
              <div v-for="(exam, index) in onboardingData.exam" :key="'APCredit' + index">
                <label v-if="exam.type == 'AP'" class="onboarding-label--review">{{
                  getExamCredit(exam)
                }}</label>
              </div>
              <label class="onboarding-label addSpaceTop">Credit</label>
              <div v-for="(exam, index) in onboardingData.exam" :key="'IBCredit' + index">
                <label v-if="exam.type == 'IB'" class="onboarding-label--review">{{
                  getExamCredit(exam)
                }}</label>
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
              <div v-for="(course, index) in onboardingData.transferCourse" :key="index">
                <label class="onboarding-label--review">{{ course.class }}</label>
              </div>
            </div>
            <div class="alignEnd">
              <div v-for="(course, index) in onboardingData.transferCourse" :key="index">
                <label class="onboarding-label--review"> {{ course.credits }} Credits </label>
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
import Vue, { PropType } from 'vue';
import { getExamCredit } from '@/components/Modals/Onboarding/OnboardingTransfer.vue';
import { getCollegeFullName, getMajorFullName, getMinorFullName } from '@/utilities';
import { GTagEvent } from '@/gtag';

const placeholderText = 'Select one';

export default Vue.extend({
  props: {
    userName: { type: Object as PropType<FirestoreUserName>, required: true },
    onboardingData: { type: Object as PropType<AppOnboardingData>, required: true },
  },
  computed: {
    collegeText(): string {
      return this.onboardingData.college !== ''
        ? getCollegeFullName(this.onboardingData.college)
        : placeholderText;
    },
    totalCredits(): number {
      let count = 0;
      this.onboardingData.exam.forEach(exam => {
        count += getExamCredit(exam);
      });
      this.onboardingData.transferCourse.forEach(clas => {
        count += clas.credits;
      });
      return count;
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
    getExamCredit,
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

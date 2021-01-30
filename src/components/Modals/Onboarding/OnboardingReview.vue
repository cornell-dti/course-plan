<template>
  <div class="onboarding">
    <div class="onboarding-section">
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> Basic Information</span>
        <span>
          <button class="onboarding-button-previous" @click="setPage(1)">
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
              ><span> {{ user.firstName }}</span></label
            >
          </div>
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
            <label class="onboarding-label"><span> Middle Name </span></label>
            <label class="onboarding-label--review"
              ><span> {{ user.middleName }}</span></label
            >
          </div>
          <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
            <label class="onboarding-label"><span> Last Name </span></label>
            <label class="onboarding-label--review"
              ><span> {{ user.lastName }}</span></label
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
            <div v-for="(major, index) in user.majorFN" :key="index">
              <label class="onboarding-label--review">{{ major }}</label>
            </div>
          </div>
        </div>
        <div class="onboarding-subHeader2-fillRow">
          <span class="onboarding-subHeader2-review"> Your Minor</span>
        </div>
        <div class="onboarding-selectWrapper">
          <label class="onboarding-label">Minors:</label>
          <div v-for="(minor, index) in user.minorFN" :key="index">
            <label class="onboarding-label--review">{{ minor }}</label>
          </div>
        </div>
      </div>
    </div>
    <div class="onboarding-section">
      <!-- TODO: Multiple colleges -->
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> Transfer Credits</span>
        <span>
          <button class="onboarding-button-previous" @click="setPage(2)">
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
              {{ this.user.tookSwim === 'yes' ? 'Yes' : 'No' }}
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
              <div v-for="(options, index) in displayOptions.exam" :key="'AP' + index">
                <label
                  v-if="typeof options.type != undefined && options.type.placeholder == 'AP'"
                  class="onboarding-label--review"
                  >{{ options.subject.placeholder }}</label
                >
              </div>
              <label class="onboarding-label addSpaceTop">IB Credits</label>
              <div v-for="(options, index) in displayOptions.exam" :key="'IB' + index">
                <label
                  v-if="typeof options.type != undefined && options.type.placeholder == 'IB'"
                  class="onboarding-label--review"
                  >{{ options.subject.placeholder }}</label
                >
              </div>
            </div>
            <div class="alignCenter">
              <label class="onboarding-label">Score</label>
              <div v-for="(options, index) in displayOptions.exam" :key="'APScore' + index">
                <label
                  v-if="typeof options.type != undefined && options.type.placeholder == 'AP'"
                  class="onboarding-label--review"
                  >{{ options.score.placeholder }}</label
                >
              </div>
              <label class="onboarding-label addSpaceTop">Score</label>
              <div v-for="(options, index) in displayOptions.exam" :key="'IBScore' + index">
                <label
                  v-if="typeof options.type != undefined && options.type.placeholder == 'IB'"
                  class="onboarding-label--review"
                  >{{ options.score.placeholder }}</label
                >
              </div>
            </div>
            <div class="alignCenter">
              <label class="onboarding-label">Credit</label>
              <div v-for="(options, index) in displayOptions.exam" :key="'APCredit' + index">
                <!-- TODO replace credit with true value rather than dummy json value, or remove credit from showing -->
                <label
                  v-if="typeof options.type != undefined && options.type.placeholder == 'AP'"
                  class="onboarding-label--review"
                  >{{ getExamCredit(options) }}</label
                >
              </div>
              <label class="onboarding-label addSpaceTop">Credit</label>
              <div v-for="(options, index) in displayOptions.exam" :key="'IBCredit' + index">
                <label
                  v-if="typeof options.type != undefined && options.type.placeholder == 'IB'"
                  class="onboarding-label--review"
                  >{{ getExamCredit(options) }}</label
                >
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
              <div v-for="(options, index) in displayOptions.class" :key="index">
                <label v-if="options.class !== 'Select one'" class="onboarding-label--review">
                  {{ options.class }}
                </label>
              </div>
            </div>
            <div class="alignEnd">
              <div v-for="(options, index) in displayOptions.class" :key="index">
                <label v-if="options.class !== 'Select one'" class="onboarding-label--review">
                  {{ options.credits }} Credits
                </label>
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

<script>
// TODO: move repeated functions in all onboarding pages to a separate file
import Vue from 'vue';
import { examData } from '@/requirements/data/exams/ExamCredit';

const placeholderText = 'Select one';

export default Vue.extend({
  props: { user: Object },
  computed: {
    collegeText() {
      return this.user.college !== '' ? this.user.collegeFN : placeholderText;
    },
  },
  data() {
    return {
      placeholderText,
      totalCredits: 0,
      transferJSON: {},
      displayOptions: {
        exam: [
          {
            // unnecessary but required for type check, as this is not ts file yet, whats a better way to deal with this?
            placeholder: placeholderText,
            type: { placeholder: '' },
            subject: { placeholder: '' },
            score: { placeholder: '' },
          },
        ],
        class: [
          // unnecessary but required for type check, as this is not ts file yet
          { class: placeholderText, credits: 0 },
        ],
      },
    };
  },
  mounted() {
    this.getClasses();
    this.getTransferMap();
    this.getCredits();
  },
  methods: {
    getClasses() {
      const exams = [];
      const sections = ['type', 'subject', 'score'];
      if ('exam' in this.user && this.user.exam.length > 0) {
        for (let x = 0; x < this.user.exam.length; x += 1) {
          const exam = {};
          for (const sec of sections) {
            exam[sec] = { placeholder: this.user.exam[x][sec] };
          }
          if (typeof this.user.exam[x].subject !== 'undefined') {
            exams.push(exam);
            exam.equivCourse = this.user.exam[x].equivCourse;
          }
        }
      }
      const exam = {};
      for (const sec of sections) {
        exam[sec] = { placeholder: placeholderText };
      }
      exams.push(exam);
      this.displayOptions.exam = exams;
      const swim = typeof this.user.tookSwim !== 'undefined' ? this.user.tookSwim : 'no';
      this.tookSwimTest = swim;
      const transferClass = [];
      this.user.transferCourse.forEach(course => {
        transferClass.push(course);
      });
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
    getExamCredit(exam) {
      const name = exam.subject.placeholder;
      if (this.transferJSON !== null) {
        if (name in this.transferJSON) {
          return this.transferJSON[name].credits;
        }
      }
      return 0;
    },
    getTransferMap() {
      const TransferJSON = {};
      examData.AP.forEach(sub => {
        TransferJSON[sub.name] = {
          credits: sub.fulfillment.credits,
          type: 'AP',
        };
      });
      examData.IB.forEach(sub => {
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
    setPage(page) {
      this.$emit('setPage', page);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

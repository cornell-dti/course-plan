<template>
  <div class="onboarding">
    <div class="onboarding-section">
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> Your Name</span>
      </div>
      <div class="onboarding-inputs onboarding-inputs--name">
        <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
          <label class="onboarding-label"
            ><span class="onboarding-subHeader--font"
              >First Name<span class="onboarding-required-star">*</span>
            </span></label
          >
          <input class="onboarding-input" v-model="firstName" @input="updateBasic()" />
        </div>
        <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
          <label class="onboarding-label"
            ><span class="onboarding-subHeader--font">Middle Name</span></label
          >
          <input class="onboarding-input" v-model="middleName" @input="updateBasic()" />
        </div>
        <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
          <label class="onboarding-label"
            ><span class="onboarding-subHeader--font"
              >Last Name<span class="onboarding-required-star">*</span>
            </span></label
          >
          <input class="onboarding-input" v-model="lastName" @input="updateBasic()" />
        </div>
      </div>
    </div>
    <div class="onboarding-section">
      <!-- TODO: Multiple colleges -->
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font">Your Major</span>
      </div>
      <div class="onboarding-inputs">
        <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
          <label class="onboarding-label"
            >College<span class="onboarding-required-star">*</span></label
          >
          <div class="onboarding-selectWrapper">
            <onboarding-basic-single-dropdown
              :availableChoices="colleges"
              :choice="collegeAcronym"
              :cannotBeRemoved="true"
              @on-select="selectCollege"
            />
          </div>
        </div>
        <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
          <label class="onboarding-label"
            >Major<span class="onboarding-required-star">*</span></label
          >
          <onboarding-basic-multi-dropdown
            :availableChoices="majors"
            :dropdownChoices="majorAcronyms"
            add-dropdown-text="+ another major"
            @on-select="selectMajor"
            @on-remove="removeMajor"
            @on-add="addMajor"
          />
          <div class="requestForm">
            *Don't see your major/minor? We are working hard to add them soon! Get updated when we
            add it by signing up
            <a href="https://forms.gle/MDvVDoRapUp2VeBb9" target="_blank" class="link">here</a>
          </div>
        </div>
      </div>
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font">Your Minor</span>
      </div>
      <div class="onboarding-inputs">
        <div class="onboarding-inputWrapper">
          <label class="onboarding-label">Minor</label>
          <onboarding-basic-multi-dropdown
            :availableChoices="minors"
            :dropdownChoices="minorAcronyms"
            add-dropdown-text="+ another minor"
            @on-select="selectMinor"
            @on-remove="removeMinor"
            @on-add="addMinor"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import reqsData from '@/requirements/typed-requirement-json';
import { clickOutside } from '@/utilities';
import OnboardingBasicMultiDropdown from './OnboardingBasicMultiDropdown.vue';
import OnboardingBasicSingleDropdown from './OnboardingBasicSingleDropdown.vue';

const placeholderText = 'Select one';

export default Vue.extend({
  components: { OnboardingBasicMultiDropdown, OnboardingBasicSingleDropdown },
  props: {
    userName: { type: Object as PropType<FirestoreUserName>, required: true },
    onboardingData: { type: Object as PropType<AppOnboardingData>, required: true },
  },
  data() {
    const majorAcronyms = [...this.onboardingData.major];
    const minorAcronyms = [...this.onboardingData.minor];
    if (majorAcronyms.length === 0) majorAcronyms.push('');
    if (minorAcronyms.length === 0) minorAcronyms.push('');
    return {
      firstName: this.userName.firstName,
      middleName: this.userName.middleName,
      lastName: this.userName.lastName,
      placeholderText,
      collegeAcronym: this.onboardingData.college,
      majorAcronyms,
      minorAcronyms,
    };
  },
  directives: {
    'click-outside': clickOutside,
  },
  computed: {
    colleges(): Readonly<Record<string, string>> {
      return Object.fromEntries(
        Object.entries(reqsData.college).map(([key, { name }]) => [key, name])
      );
    },
    majors(): Readonly<Record<string, string>> {
      const majors: Record<string, string> = {};
      const majorJSON = reqsData.major;
      Object.keys(majorJSON).forEach(key => {
        // only show majors for schools the user is in
        if (majorJSON[key].schools.includes(this.collegeAcronym)) {
          majors[key] = majorJSON[key].name;
        }
      });
      return majors;
    },
    minors(): Readonly<Record<string, string>> {
      const minors: Record<string, string> = {};
      const minorJSON = reqsData.minor;
      Object.keys(minorJSON).forEach(key => {
        // only show majors for schools the user is in
        minors[key] = minorJSON[key].name;
      });
      return minors;
    },
  },
  methods: {
    updateBasic() {
      this.$emit(
        'updateBasic',
        this.collegeAcronym,
        this.majorAcronyms.filter(it => it !== ''),
        this.minorAcronyms.filter(it => it !== ''),
        { firstName: this.firstName, middleName: this.middleName, lastName: this.lastName }
      );
    },
    // Clear a major if a new college is selected and the major is not in it
    clearMajorIfNotInCollege() {
      const majorJSON = reqsData.major;
      for (let x = 0; x < this.majorAcronyms.length; x += 1) {
        const majorAcronym = this.majorAcronyms[x];
        let foundCollege = false;
        // Do nothing if no major set
        if (majorAcronym !== '') {
          if (majorJSON[majorAcronym].schools.includes(this.collegeAcronym)) {
            foundCollege = true;
          }
        }
        if (!foundCollege) {
          this.majorAcronyms[x] = '';
        }
      }
    },
    selectCollege(acronym: string) {
      this.collegeAcronym = acronym;
      this.clearMajorIfNotInCollege();
      this.updateBasic();
    },
    selectMajor(acronym: string, i: number) {
      this.majorAcronyms = this.majorAcronyms.map((dropdown, index) =>
        index === i ? acronym : dropdown
      );
      this.updateBasic();
    },
    selectMinor(acronym: string, i: number) {
      this.minorAcronyms = this.minorAcronyms.map((dropdown, index) =>
        index === i ? acronym : dropdown
      );
      this.updateBasic();
    },
    removeMajor(index: number) {
      this.majorAcronyms.splice(index, 1);
      if (this.majorAcronyms.length === 0) {
        this.addMajor();
      }
      this.updateBasic();
    },
    removeMinor(index: number) {
      this.minorAcronyms.splice(index, 1);
      if (this.minorAcronyms.length === 0) {
        this.addMinor();
      }
      this.updateBasic();
    },
    addMajor() {
      this.majorAcronyms.push('');
    },
    addMinor() {
      this.minorAcronyms.push('');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

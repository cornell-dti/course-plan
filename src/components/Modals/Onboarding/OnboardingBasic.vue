<template>
  <div class="onboarding">
    <div class="onboarding-section">
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> Your Name</span>
      </div>
      <div class="onboarding-inputs onboarding-inputs--name">
        <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
          <label class="onboarding-label"
            ><span class="onboarding-subHeader--font"> First Name* </span></label
          >
          <input class="onboarding-input" v-model="firstName" />
        </div>
        <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
          <label class="onboarding-label"
            ><span class="onboarding-subHeader--font"> Middle Name </span></label
          >
          <input class="onboarding-input" v-model="middleName" />
        </div>
        <div class="onboarding-inputWrapper onboarding-inputWrapper--name">
          <label class="onboarding-label"
            ><span class="onboarding-subHeader--font"> Last Name* </span></label
          >
          <input class="onboarding-input" v-model="lastName" />
        </div>
      </div>
    </div>
    <div class="onboarding-section">
      <!-- TODO: Multiple colleges -->
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> College</span>
      </div>
      <div class="onboarding-inputs">
        <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
          <label class="onboarding-label">College*</label>
          <div class="onboarding-selectWrapper">
            <div
              class="onboarding-select onboarding-input"
              :class="{ 'onboarding-select--disabled': Object.keys(colleges).length <= 0 }"
              v-for="(options, index) in displayOptions.college"
              :key="index"
              :style="{ borderColor: options.boxBorder }"
              v-click-outside:[index]="closeCollegeDropdownIfOpen"
            >
              <div
                class="onboarding-dropdown-placeholder college-major-minor-wrapper"
                @click="showHideCollegeContent(index)"
              >
                <div
                  class="onboarding-dropdown-placeholder college-major-minor-placeholder"
                  :style="{ color: options.placeholderColor }"
                >
                  {{ options.placeholder }}
                </div>
                <div
                  class="onboarding-dropdown-placeholder college-major-minor-arrow"
                  :style="{ borderTopColor: options.arrowColor }"
                ></div>
              </div>
              <div class="onboarding-dropdown-content" v-if="options.shown">
                <div
                  v-for="(college, acronym) in colleges"
                  :key="acronym"
                  class="onboarding-dropdown-content-item"
                  @click="selectCollege(college, acronym, index)"
                >
                  {{ college }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="onboarding-inputWrapper onboarding-inputWrapper--college">
          <label class="onboarding-label">Major</label>
          <div
            class="onboarding-selectWrapperRow onboarding-section"
            :class="{ 'onboarding-select--disabled': Object.keys(majors).length <= 0 }"
            v-for="(options, index) in displayOptions.major"
            :key="index"
            :style="{ borderColor: options.boxBorder }"
            v-click-outside:[index]="closeMajorDropdownIfOpen"
          >
            <div class="onboarding-select onboarding-input">
              <div
                class="onboarding-dropdown-placeholder college-major-minor-wrapper"
                @click="showHideMajorContent(index)"
              >
                <div
                  class="onboarding-dropdown-placeholder college-major-minor-placeholder"
                  :style="{ color: options.placeholderColor }"
                >
                  {{ options.placeholder }}
                </div>
                <div
                  class="onboarding-dropdown-placeholder college-major-minor-arrow"
                  :style="{ borderTopColor: options.arrowColor }"
                ></div>
              </div>
              <div class="onboarding-dropdown-content" v-if="options.shown">
                <div
                  v-for="(major, acronym) in majors"
                  :key="acronym"
                  class="onboarding-dropdown-content-item"
                  @click="selectMajor(major, acronym, index)"
                >
                  {{ major }}
                </div>
              </div>
            </div>
            <div
              class="onboarding-remove"
              @click="removeMajor(index)"
              :class="{
                'onboarding--hidden':
                  displayOptions.major.length === 1 &&
                  displayOptions.major[0].placeholder == placeholderText,
              }"
            >
              <img src="@/assets/images/x-green.svg" alt="x" />
            </div>
          </div>
          <div
            class="onboarding-addRemoveWrapper"
            :class="{ 'onboarding--hidden': displayOptions.major.length <= 0 }"
          >
            <div class="onboarding-add" @click="addMajor">+ add another major</div>
          </div>
        </div>
      </div>
      <div class="onboarding-subHeader">
        <span class="onboarding-subHeader--font"> Minor</span>
      </div>
      <div class="onboarding-inputs">
        <div class="onboarding-inputWrapper">
          <label class="onboarding-label">Minor</label>
          <div>
            <div
              class="onboarding-selectWrapperRow"
              v-for="(options, index) in displayOptions.minor"
              :key="index"
              :style="{ borderColor: options.boxBorder }"
              v-click-outside:[index]="closeMinorDropdownIfOpen"
            >
              <div class="onboarding-select onboarding-input">
                <div
                  class="onboarding-dropdown-placeholder college-major-minor-wrapper"
                  @click="showHideMinorContent(index)"
                >
                  <div
                    class="onboarding-dropdown-placeholder college-major-minor-placeholder"
                    :style="{ color: options.placeholderColor }"
                  >
                    {{ options.placeholder }}
                  </div>
                  <div
                    class="onboarding-dropdown-placeholder college-major-minor-arrow"
                    :style="{ borderTopColor: options.arrowColor }"
                  ></div>
                </div>
                <div class="onboarding-dropdown-content" v-if="options.shown">
                  <div
                    v-for="(minor, acronym) in minors"
                    :key="acronym"
                    class="onboarding-dropdown-content-item"
                    @click="selectMinor(minor, acronym, index)"
                  >
                    {{ minor }}
                  </div>
                </div>
                <div
                  class="onboarding-dropdown-placeholder college-major-minor-arrow"
                  :style="{ borderTopColor: options.arrowColor }"
                ></div>
              </div>
              <div
                class="onboarding-remove"
                @click="removeMinor(index)"
                :class="{
                  'onboarding--hidden':
                    displayOptions.minor.length === 1 &&
                    displayOptions.minor[0].placeholder == placeholderText,
                }"
              >
                <img src="@/assets/images/x-green.svg" alt="x" />
              </div>
            </div>
          </div>
          <div
            class="onboarding-addRemoveWrapper"
            :class="{ 'onboarding--hidden': Object.keys(minors).length <= 0 }"
          >
            <div class="onboarding-add" @click="addMinor">+ add another minor</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import reqsData from '@/requirements/typed-requirement-json';
import { clickOutside } from '@/utilities';
// @ts-expect-error: typescript cannot understand scss variable imports.
import { inactiveGray, yuxuanBlue, lightPlaceholderGray } from '@/assets/scss/_variables.scss';
import { AppUser } from '@/user-data';

const placeholderText = 'Select one';

type DisplayOption = {
  shown: boolean;
  stopClose: boolean;
  boxBorder: string;
  arrowColor: string;
  placeholderColor: string;
  placeholder: string;
  acronym: string;
};

export default Vue.extend({
  props: {
    user: Object as PropType<AppUser>,
  },
  data() {
    // Set dropdown colleges and majors if already filled out
    let collegeText = this.user.college || placeholderText;
    let collegeAcronym = this.user.college;
    let collegePlaceholderColor = '';
    if (this.user.college !== '') {
      collegeText = this.user.collegeFN;
      collegeAcronym = this.user.college;
      collegePlaceholderColor = lightPlaceholderGray;
    }
    const majors: DisplayOption[] = [];
    const minors: DisplayOption[] = [];
    if (this.user.major.length > 0) {
      this.user.major.forEach((majorAcronym, i) => {
        majors.push({
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: lightPlaceholderGray,
          placeholder: this.user.majorFN[i],
          acronym: majorAcronym,
        });
      });
    } else {
      majors.push({
        shown: false,
        stopClose: false,
        boxBorder: '',
        arrowColor: '',
        placeholderColor: '',
        placeholder: placeholderText,
        acronym: '',
      });
    }
    if (this.user.minor.length > 0) {
      this.user.minor.forEach((minorAcronym, i) => {
        minors.push({
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: lightPlaceholderGray,
          placeholder: this.user.minorFN[i],
          acronym: minorAcronym,
        });
      });
    } else {
      minors.push({
        shown: false,
        stopClose: false,
        boxBorder: '',
        arrowColor: '',
        placeholderColor: '',
        placeholder: placeholderText,
        acronym: '',
      });
    }
    return {
      firstName: this.user.firstName,
      middleName: this.user.middleName,
      lastName: this.user.lastName,
      placeholderText,
      displayOptions: {
        college: [
          {
            shown: false,
            stopClose: false,
            boxBorder: '',
            arrowColor: '',
            placeholderColor: collegePlaceholderColor,
            placeholder: collegeText,
            acronym: collegeAcronym,
          },
        ],
        major: majors,
        minor: minors,
      },
      isError: false,
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
        // make sure name defined
        // only show majors for schools the user is in
        for (let i = 0; i < this.displayOptions.college.length; i += 1) {
          const college = this.displayOptions.college[i];
          if (majorJSON[key].schools.includes(college.acronym)) {
            majors[key] = majorJSON[key].name;
          }
        }
      });
      return majors;
    },
    minors(): Readonly<Record<string, string>> {
      const minors: Record<string, string> = {};
      const minorJSON = reqsData.minor;
      for (const key in minorJSON) {
        // make sure name defined
        if ('name' in minorJSON[key]) {
          // only show majors for schools the user is in
          for (let i = 0; i < this.displayOptions.college.length; i += 1) {
            minors[key] = minorJSON[key].name;
          }
        }
      }
      return minors;
    },
  },
  methods: {
    updateBasic() {
      const name = {
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
      };
      this.$emit(
        'updateBasic',
        this.displayOptions.major,
        this.displayOptions.college,
        this.displayOptions.minor,
        name
      );
    },
    // Clear a major if a new college is selected and the major is not in it
    clearMajorIfNotInCollege() {
      const majorJSON = reqsData.major;
      for (let x = 0; x < this.displayOptions.major.length; x += 1) {
        const major = this.displayOptions.major[x];
        let foundCollege = false;
        // Do nothing if no major set
        if (major.acronym !== '') {
          for (let i = 0; i < this.displayOptions.college.length; i += 1) {
            const college = this.displayOptions.college[i];
            if (majorJSON[major.acronym].schools.includes(college.acronym)) {
              foundCollege = true;
              break;
            }
          }
        }
        if (!foundCollege) {
          major.placeholderColor = '';
          major.placeholder = placeholderText;
          major.acronym = '';
        }
      }
    },
    showHideContent(type: 'college' | 'major' | 'minor', i: number) {
      const displayOptions = this.displayOptions[type][i];
      const contentShown = displayOptions.shown;
      displayOptions.shown = !contentShown;

      if (contentShown) {
        // clicked box when content shown. So then hide content
        displayOptions.boxBorder = inactiveGray;
        displayOptions.arrowColor = inactiveGray;
      } else {
        displayOptions.boxBorder = yuxuanBlue;
        displayOptions.arrowColor = yuxuanBlue;
      }
    },
    showHideCollegeContent(i: number) {
      this.showHideContent('college', i);
    },
    showHideMajorContent(i: number) {
      this.showHideContent('major', i);
    },
    showHideMinorContent(i: number) {
      this.showHideContent('minor', i);
    },
    closeDropdownIfOpen(type: 'college' | 'major' | 'minor', i: number) {
      const displayOptions = this.displayOptions[type][i];
      if (displayOptions.stopClose) {
        displayOptions.stopClose = false;
      } else if (displayOptions.shown) {
        displayOptions.shown = false;
        displayOptions.boxBorder = inactiveGray;
        displayOptions.arrowColor = inactiveGray;
      }
    },
    closeCollegeDropdownIfOpen(_: unknown, i: number) {
      this.closeDropdownIfOpen('college', i);
    },
    closeMajorDropdownIfOpen(_: unknown, i: number) {
      this.closeDropdownIfOpen('major', i);
    },
    closeMinorDropdownIfOpen(_: unknown, i: number) {
      this.closeDropdownIfOpen('minor', i);
    },
    selectOption(type: 'college' | 'major' | 'minor', text: string, acronym: string, i: number) {
      const displayOptions = this.displayOptions[type][i];
      displayOptions.placeholder = text;
      displayOptions.acronym = acronym;
      displayOptions.shown = false;
      displayOptions.arrowColor = inactiveGray;
      displayOptions.boxBorder = inactiveGray;
      displayOptions.placeholderColor = lightPlaceholderGray;
    },
    selectCollege(text: string, acronym: string, i: number) {
      this.selectOption('college', text, acronym, i);
      this.clearMajorIfNotInCollege();
    },
    selectMajor(text: string, acronym: string, i: number) {
      this.selectOption('major', text, acronym, i);
    },
    selectMinor(text: string, acronym: string, i: number) {
      this.selectOption('minor', text, acronym, i);
    },
    removeMajor(index: number) {
      this.displayOptions.major.splice(index, 1);
      if (this.displayOptions.major.length === 0) {
        this.addMajor();
      }
    },
    removeMinor(index: number) {
      this.displayOptions.minor.splice(index, 1);
      if (this.displayOptions.minor.length === 0) {
        this.addMinor();
      }
    },
    addMajor() {
      const newMajor = {
        shown: false,
        stopClose: false,
        boxBorder: '',
        arrowColor: '',
        placeholderColor: '',
        placeholder: placeholderText,
        acronym: '',
      };
      this.displayOptions.major.push(newMajor);
    },
    addMinor() {
      const minor = {
        shown: false,
        stopClose: false,
        boxBorder: '',
        arrowColor: '',
        placeholderColor: '',
        placeholder: placeholderText,
        acronym: '',
      };
      this.displayOptions.minor.push(minor);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

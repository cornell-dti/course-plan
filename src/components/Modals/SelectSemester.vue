<template>
  <div>
    <div class="selectSemester">
      <div class="selectSemester-section selectSemester-type">
        <label v-if="!isCourseModelSelectingSemester" class="selectSemester-label" for="type"
          >Type</label
        >
        <div
          :class="[{ duplicate: isDuplicate() }, { 'selectSemester-select': !isDuplicate() }]"
          class="position-relative"
          v-click-outside="closeSeasonDropdownIfOpen"
        >
          <div
            class="selectSemester-dropdown-placeholder season-wrapper"
            @click="showHideSeasonContent"
            data-cyId="newSemester-seasonWrapper"
          >
            <div
              class="selectSemester-dropdown-placeholder season-placeholder"
              :style="{ color: displayOptions.season.placeholderColor }"
            >
              {{ seasonPlaceholder }}
            </div>
            <div
              class="selectSemester-dropdown-placeholder season-arrow"
              :style="{ borderTopColor: displayOptions.season.arrowColor }"
            ></div>
          </div>
          <div
            class="selectSemester-dropdown-content season-content position-absolute w-100"
            v-if="displayOptions.season.shown"
          >
            <div
              :class="{ warning: isDuplicate }"
              v-for="s in seasons"
              :key="s[1]"
              class="selectSemester-dropdown-content-item"
              @click="selectSeason(s[1])"
              data-cyId="newSemester-seasonItem"
            >
              <img
                :src="s[0]"
                class="selectSemester-dropdown-content-season"
                :alt="`${s[1]} icon`"
              />
              {{ s[1] }}
            </div>
          </div>
        </div>
      </div>
      <div class="selectSemester-section selectSemester-year">
        <label v-if="!isCourseModelSelectingSemester" class="selectSemester-label" for="year"
          >Year</label
        >
        <div
          :class="[{ duplicate: isDuplicate() }, { 'selectSemester-select': !isDuplicate() }]"
          class="position-relative"
          v-click-outside="closeYearDropdownIfOpen"
        >
          <div
            class="selectSemester-dropdown-placeholder year-wrapper"
            @click="showHideYearContent"
            data-cyId="newSemester-yearWrapper"
          >
            <div
              class="selectSemester-dropdown-placeholder year-placeholder"
              :style="{ color: displayOptions.year.placeholderColor }"
            >
              {{ yearPlaceholder }}
            </div>
            <div
              class="selectSemester-dropdown-placeholder year-arrow"
              :style="{ borderTopColor: displayOptions.year.arrowColor }"
            ></div>
          </div>
          <div
            class="selectSemester-dropdown-content year-content position-absolute"
            v-if="displayOptions.year.shown"
          >
            <div
              v-for="yearChoice in years"
              :key="yearChoice"
              :ref="`year-ref-${yearChoice}`"
              class="selectSemester-dropdown-content-item"
              @click="selectYear(yearChoice)"
              data-cyId="newSemester-yearItem"
            >
              {{ yearChoice }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isDuplicate()" class="selectSemester-duplicate">Duplicate Semester</div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { getCurrentSeason, getCurrentYear, clickOutside, entranceYearRange } from '@/utilities';
import store from '@/store';

import fall from '@/assets/images/fallEmoji.svg';
import spring from '@/assets/images/springEmoji.svg';
import winter from '@/assets/images/winterEmoji.svg';
import summer from '@/assets/images/summerEmoji.svg';
import { inactiveGray, yuxuanBlue, darkPlaceholderGray } from '@/assets/constants/scss-variables';

type DisplayOption = {
  shown: boolean;
  stopClose: boolean;
  boxBorder: string;
  arrowColor: string;
  placeholderColor: string;
};

type Data = {
  readonly seasons: readonly (readonly [string, FirestoreSemesterSeason])[];
  readonly years: readonly number[];
  seasonText: string;
  yearText: number;
  readonly displayOptions: {
    readonly year: DisplayOption;
    readonly season: DisplayOption;
  };
};

export default defineComponent({
  props: {
    currentSemesters: {
      type: Array as PropType<readonly FirestoreSemester[] | null>,
      default: null,
    },
    isEdit: { type: Boolean, default: false },
    year: { type: Number, default: 0 },
    season: { type: String as PropType<FirestoreSemesterSeason>, default: '' },
    isCourseModelSelectingSemester: { type: Boolean, default: false },
  },
  emits: {
    updateSemProps: (season: string, year: number): boolean =>
      typeof season === 'string' && typeof year === 'number',
    duplicateSemester: (duplicate: boolean): boolean => typeof duplicate === 'boolean',
  },
  data(): Data {
    // years
    const currentYear = getCurrentYear();
    const seasons: readonly (readonly [string, FirestoreSemesterSeason])[] = [
      [fall, 'Fall'],
      [spring, 'Spring'],
      [summer, 'Summer'],
      [winter, 'Winter'],
    ] as const;
    const years = [];
    let startYear = currentYear - entranceYearRange;
    while (startYear <= currentYear + entranceYearRange) {
      years.push(startYear);
      startYear += 1;
    }

    const placeholderColor = darkPlaceholderGray;

    return {
      seasons,
      years,
      seasonText: '',
      yearText: 0,
      displayOptions: {
        season: {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor,
        },
        year: {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor,
        },
      },
    };
  },
  computed: {
    seasonPlaceholder(): string {
      // set current season to winter in january, spring from february to may, summer from june to august, and fall from september to december
      let defaultSeason: string = getCurrentSeason();
      if (this.isCourseModelSelectingSemester) {
        defaultSeason = 'Select';
      }
      return this.seasonText || this.season || defaultSeason;
    },
    yearPlaceholder(): string {
      let defaultYear = String(getCurrentYear());
      if (this.isCourseModelSelectingSemester) {
        defaultYear = 'Select';
      }
      return String(this.yearText || this.year || defaultYear);
    },
    // scroll the bottom of the year dropdown to 4 years after the user's entrance year, or the current year if undefined
    scrollTopToElement(): number {
      const topYear = store.state.onboardingData.entranceYear
        ? store.state.onboardingData.entranceYear
        : '2017';
      return Number(topYear);
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  mounted(): void {
    this.$emit('updateSemProps', this.seasonPlaceholder, Number(this.yearPlaceholder));
  },
  methods: {
    showHideContent(type: 'season' | 'year') {
      const displayOptions = this.displayOptions[type];
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

      // scroll to the middle of the year div after visible (on the next tick)
      if (!contentShown && type === 'year') {
        this.$nextTick(() => {
          (this.$refs[`year-ref-${this.scrollTopToElement}`] as Element).scrollIntoView({
            behavior: 'auto',
          });
        });
      }
    },
    showHideSeasonContent() {
      this.showHideContent('season');
    },
    showHideYearContent() {
      this.showHideContent('year');
    },
    closeDropdownIfOpen(type: 'season' | 'year') {
      const displayOptions = this.displayOptions[type];
      if (displayOptions.stopClose) {
        displayOptions.stopClose = false;
      } else if (displayOptions.shown) {
        displayOptions.shown = false;
        displayOptions.boxBorder = inactiveGray;
        displayOptions.arrowColor = inactiveGray;
      }
    },
    closeSeasonDropdownIfOpen() {
      this.closeDropdownIfOpen('season');
    },
    closeYearDropdownIfOpen() {
      this.closeDropdownIfOpen('year');
    },
    selectOption(type: 'season' | 'year'): void {
      const displayOptions = this.displayOptions[type];
      displayOptions.shown = false;
      displayOptions.boxBorder = '#C4C4C4';
      displayOptions.arrowColor = '#C4C4C4';
      displayOptions.placeholderColor = '#757575';
      this.$emit(
        'updateSemProps',
        this.seasonText || this.seasonPlaceholder,
        this.yearText || Number(this.yearPlaceholder)
      );
    },
    selectSeason(season: string) {
      this.seasonText = season;
      this.selectOption('season');
    },
    selectYear(year: number) {
      this.yearText = year;
      this.selectOption('year');
    },
    isDuplicate(): boolean {
      let isDup = false;
      const semesters = this.currentSemesters;
      if (semesters != null) {
        semesters.forEach(semester => {
          if (
            semester.year === Number(this.yearPlaceholder) &&
            semester.season === this.seasonPlaceholder
          ) {
            if (
              !this.isEdit ||
              (this.isEdit &&
                (Number(this.yearPlaceholder) !== this.year ||
                  this.seasonPlaceholder !== this.season))
            ) {
              isDup = true;
            }
          }
        });
      }
      this.$emit('duplicateSemester', isDup);
      return isDup;
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.duplicate-p {
  color: red;
}
.duplicate {
  border-radius: 3px;
  border: 1px solid red;
}
.selectSemester {
  display: flex;
  flex-direction: row;
  &-duplicate {
    color: red;
    font-size: 14px;
    margin-top: 0.5rem;
  }
  &-section {
    font-size: 14px;
    line-height: 15px;
    color: #757575;
    display: flex;
    flex-direction: column;
  }

  &-type {
    margin-right: 1rem;
    width: 60%;
  }

  &-year {
    width: 40%;
  }

  &-label {
    margin-bottom: 0.5rem;
  }

  &-select {
    background: #ffffff;
    // border: 1px solid #32A0F2;

    //when selected border-color: #32A0F2;

    box-sizing: border-box;
    border-radius: 2px;
    width: 100%;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 14px;

    color: $darkPlaceholderGray;
  }

  &-icon {
    width: 12px;
    height: 12px;
  }
  &-dropdown {
    &-placeholder {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 15px;

      color: #757575;

      background-color: white;
      color: #757575;

      &.season-wrapper,
      &.year-wrapper {
        display: flex;
        flex-direction: row;
        width: 100%;
        border-radius: 2px;
        border: 1px solid #c4c4c4;
        cursor: pointer;
      }

      &.season-placeholder,
      &.year-placeholder {
        margin-left: 7px;
        margin-top: 5px;
        margin-bottom: 5px;
        width: 70%;
      }

      &.season-arrow,
      &.year-arrow {
        width: 6.24px;
        height: 6.24px;
        border-left: 6.24px solid transparent;
        border-right: 6.24px solid transparent;
        border-top: 6.24px solid #c4c4c4;

        //when clicked border-top-color: #32A0F2;

        margin-top: 10.17px;
        margin-bottom: 10.17px;

        margin-right: 8.7px;
        margin-left: 5px;
      }

      &.year-arrow {
        margin-right: 9.17px;
        margin-left: 17px;
      }

      &.year-placeholder {
        width: 62px;
        height: 16px;
        left: 581px;
        top: 188px;
      }
    }
  }

  &-dropdown-content {
    max-height: 8rem;

    background: #ffffff;
    box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
    border-radius: 0px 0px 7px 7px;

    &.year-content {
      z-index: 1;
      width: 100%;

      background: #ffffff;
      box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);

      overflow-y: scroll;
      overflow-x: hidden;
    }
    &-season {
      padding-left: 0px;
      padding-right: 10px;
      height: 14px;
    }
    &-item {
      height: 31px;
      left: 454px;
      top: 213px;

      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 15px;
      display: flex;
      align-items: center;
      color: #757575;
      padding-left: 10px;
      cursor: pointer;

      &:last-child {
        border-radius: 0px 0px 7px 7px;
      }
    }
  }

  &-dropdown-content div:hover {
    background: rgba(50, 160, 242, 0.15);
    width: 100%;
  }
}

select option {
  color: black;
}
select option:first-child {
  color: grey;
}
select.empty {
  color: grey;
}
/* Hidden placeholder */
select option[disabled]:first-child {
  display: none;
}
</style>

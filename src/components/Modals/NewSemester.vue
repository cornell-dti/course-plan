<template>
  <div>
    <div class="newSemester">
      <div class="newSemester-section newSemester-type">
        <label v-if="!isCourseModelSelectingSemester" class="newSemester-label" for="type"
          >Type</label
        >
        <div
          v-bind:class="[{ duplicate: isDuplicate() }, { 'newSemester-select': !isDuplicate() }]"
          class="position-relative"
          v-click-outside="closeSeasonDropdownIfOpen"
        >
          <div
            class="newSemester-dropdown-placeholder season-wrapper"
            @click="showHideSeasonContent"
          >
            <div
              class="newSemester-dropdown-placeholder season-placeholder"
              :style="{ color: displayOptions.season.placeholderColor }"
            >
              {{ seasonPlaceholder }}
            </div>
            <div
              class="newSemester-dropdown-placeholder season-arrow"
              :style="{ borderTopColor: displayOptions.season.arrowColor }"
            ></div>
          </div>
          <div
            class="newSemester-dropdown-content season-content position-absolute w-100"
            v-if="displayOptions.season.shown"
          >
            <div
              v-bind:class="{ warning: isDuplicate }"
              v-for="season in seasons"
              :key="seasonValue(season)"
              class="newSemester-dropdown-content-item"
              @click="selectSeason(season[1])"
            >
              <img v-bind:src="season[0]" class="newSemester-dropdown-content-season" />
              {{ season[1] }}
            </div>
          </div>
        </div>
      </div>
      <div class="newSemester-section newSemester-year">
        <label v-if="!isCourseModelSelectingSemester" class="newSemester-label" for="year"
          >Year</label
        >
        <div
          v-bind:class="[{ duplicate: isDuplicate() }, { 'newSemester-select': !isDuplicate() }]"
          class="position-relative"
          v-click-outside="closeYearDropdownIfOpen"
        >
          <div class="newSemester-dropdown-placeholder year-wrapper" @click="showHideYearContent">
            <div
              class="newSemester-dropdown-placeholder year-placeholder"
              :style="{ color: displayOptions.year.placeholderColor }"
            >
              {{ yearPlaceholder }}
            </div>
            <div
              class="newSemester-dropdown-placeholder year-arrow"
              :style="{ borderTopColor: displayOptions.year.arrowColor }"
            ></div>
          </div>
          <div
            class="newSemester-dropdown-content year-content position-absolute"
            v-if="displayOptions.year.shown"
          >
            <div
              v-for="year in years"
              :key="year"
              class="newSemester-dropdown-content-item"
              @click="selectYear(year)"
            >
              {{ year }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isDuplicate()" class="newSemester-duplicate">Duplicate Semester</div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { clickOutside } from '@/utilities';

import fall from '@/assets/images/fallEmoji.svg';
import spring from '@/assets/images/springEmoji.svg';
import winter from '@/assets/images/winterEmoji.svg';
import summer from '@/assets/images/summerEmoji.svg';
import { inactiveGray, yuxuanBlue, darkPlaceholderGray } from '@/assets/scss/_variables.scss';
import { FirestoreSemesterType, AppSemester } from '@/user-data';

// enum to define seasons as integers in season order
const SeasonsEnum = Object.freeze({
  winter: 0,
  spring: 1,
  summer: 2,
  fall: 3,
});

type DisplayOption = {
  shown: boolean;
  stopClose: boolean;
  boxBorder: string;
  arrowColor: string;
  placeholderColor: string;
};

type Data = {
  readonly seasons: readonly (readonly [string, FirestoreSemesterType])[];
  readonly years: readonly number[];
  seasonText: string;
  yearText: number;
  readonly displayOptions: {
    readonly year: DisplayOption;
    readonly season: DisplayOption;
  };
};

export default Vue.extend({
  props: {
    currentSemesters: Array as PropType<readonly AppSemester[] | null>,
    id: Number,
    isEdit: Boolean,
    year: Number,
    type: String as PropType<FirestoreSemesterType>,
    isCourseModelSelectingSemester: Boolean,
  },
  data(): Data {
    // years
    const currentYear = new Date().getFullYear();
    const seasons: readonly (readonly [string, FirestoreSemesterType])[] = [
      [fall, 'Fall'],
      [spring, 'Spring'],
      [summer, 'Summer'],
      [winter, 'Winter'],
    ] as const;
    const years = [];
    let startYear = currentYear - 10;
    while (startYear <= currentYear + 10) {
      years.push(startYear);
      startYear += 1;
    }

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
          placeholderColor: '',
        },
        year: {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: '',
        },
      },
    };
  },
  computed: {
    seasonPlaceholder(): string {
      // set current season to winter in january, spring from february to may, summer from june to august, and fall from september to december
      const currentSeason = this.getCurrentSeason();
      return this.seasonText || this.type || currentSeason;
    },
    yearPlaceholder(): number {
      const currentYear = new Date().getFullYear();
      return Number(this.yearText || this.year || currentYear);
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  mounted(): void {
    this.$emit('updateSemProps', this.seasonPlaceholder, this.yearPlaceholder);
  },
  methods: {
    seasonValue(season: readonly [string, string]): number {
      // @ts-expect-error: TS cannot understand lowercasing the string produces the right field name.
      return SeasonsEnum[season[1].toLowerCase()];
    },
    getCurrentSeason(): FirestoreSemesterType {
      let currentSeason: FirestoreSemesterType;
      const currentMonth = new Date().getMonth();
      if (currentMonth === 0) {
        currentSeason = 'Winter';
      } else if (currentMonth <= 4) {
        currentSeason = 'Spring';
      } else if (currentMonth <= 7) {
        currentSeason = 'Summer';
      } else {
        currentSeason = 'Fall';
      }
      return currentSeason;
    },
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
        this.yearText || this.yearPlaceholder
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
    resetDropdown(type: 'season' | 'year') {
      const displayOptions = this.displayOptions[type];
      displayOptions.shown = false;
      displayOptions.stopClose = false;
      displayOptions.boxBorder = inactiveGray;
      displayOptions.arrowColor = inactiveGray;
      displayOptions.placeholderColor = darkPlaceholderGray;

      if (type === 'season') {
        this.seasonText = '';
      } else {
        this.yearText = 0;
      }
    },
    resetDropdowns() {
      // reset season dropdown
      this.resetDropdown('season');

      // reset year dropdown
      this.resetDropdown('year');
    },
    isDuplicate(): boolean {
      let isDup = false;
      const semesters = this.currentSemesters;
      if (semesters != null) {
        semesters.forEach(semester => {
          if (semester.year === this.yearPlaceholder && semester.type === this.seasonPlaceholder) {
            if (
              !this.isEdit ||
              (this.isEdit &&
                (this.yearPlaceholder !== this.year || this.seasonPlaceholder !== this.type))
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
.duplicate-p {
  color: red;
}
.duplicate {
  border-radius: 3px;
  border: 1px solid red;
}
.newSemester {
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

    color: #b6b6b6;
  }

  &-icon {
    width: 12px;
    height: 12px;
  }
  &-emoji-text {
    height: 14px;
    padding: 0px;
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
    max-height: 140px;

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

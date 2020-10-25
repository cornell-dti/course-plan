<template>
  <div>
  <div class="newSemester">
    <div class="newSemester-section newSemester-type">
      <label class="newSemester-label" for="type">Type</label>
      <div
        v-bind:class="[{ duplicate:  isDuplicate()}, { 'newSemester-select' : !isDuplicate()}  ]"
        id="season"
        v-click-outside="closeSeasonDropdownIfOpen"
      >
        <div class="newSemester-dropdown-placeholder season-wrapper" @click="showHideSeasonContent">
          <div
            v-if= "isEdit"
            class="newSemester-dropdown-placeholder season-placeholder"
            :id="'season-placeholder-' + id"
            :style="{ color: displayOptions.season.placeholderColor }"
          >
            {{ seasonPlaceholder }}
          </div>
          <div
            v-else
            class="newSemester-dropdown-placeholder season-placeholder"
            id="season-placeholder"
            :style="{ color: displayOptions.season.placeholderColor }"
          >
            {{ seasonPlaceholder }}
          </div>
          <div
            class="newSemester-dropdown-placeholder season-arrow"
            id="season-arrow"
            :style="{ borderTopColor: displayOptions.season.arrowColor }"
          ></div>
        </div>
        <div
          class="newSemester-dropdown-content season-content"
          id="season-content"
          v-if="displayOptions.season.shown"
        >
          <div
            v-bind:class="{ warning: isDuplicate}"
            v-for="season in seasons"
            :key="seasonValue(season)"
            :id="season"
            class="newSemester-dropdown-content-item"
            @click="selectSeason(season[1])"
          >
          <img
            v-bind:src='season[0]'
            class= "newSemester-dropdown-content-season"
          />
            {{ season[1] }}
          </div>
        </div>
      </div>
    </div>
    <div class="newSemester-section newSemester-year">
      <label class="newSemester-label" for="year">Year</label>
      <div
        v-bind:class="[{ duplicate:  isDuplicate()}, { 'newSemester-select' : !isDuplicate()}  ]"
        id="year"

        v-click-outside="closeYearDropdownIfOpen"
      >
        <div class="newSemester-dropdown-placeholder year-wrapper" @click="showHideYearContent">
          <div
            v-if="isEdit"
            class="newSemester-dropdown-placeholder year-placeholder"
            :id="'year-placeholder-' + id"
            :style="{ color: displayOptions.year.placeholderColor }"
          >
            {{ yearPlaceholder }}
          </div>
          <div
            v-else
            class="newSemester-dropdown-placeholder year-placeholder"
            id="year-placeholder"
            :style="{ color: displayOptions.year.placeholderColor }"
          >
            {{ yearPlaceholder }}
          </div>
          <div
            class="newSemester-dropdown-placeholder year-arrow"
            id="year-arrow"
            :style="{ borderTopColor: displayOptions.year.arrowColor }"
          ></div>
        </div>
        <div
          class="newSemester-dropdown-content year-content"
          id="year-content"
          v-if="displayOptions.year.shown"
        >
          <div
            v-for="year in years"
            :key="year"
            :id="year"
            class="newSemester-dropdown-content-item"
            @click="selectYear(year)"
          >
            {{ year }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isDuplicate()" class= "newSemester-duplicate" >Duplicate Semester</div>
  </div>

</template>

<script>

import fall from '@/assets/images/fallEmoji.svg';
import spring from '@/assets/images/springEmoji.svg';
import winter from '@/assets/images/winterEmoji.svg';
import summer from '@/assets/images/summerEmoji.svg';
import {
  inactiveGray, yuxuanBlue, lightPlaceholderGray, darkPlaceholderGray
} from '@/assets/scss/_variables.scss';


const clickOutside = {
  bind(el, binding, vnode) {
    el.event = event => {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.event);
  },
  unbind(el) {
    document.body.removeEventListener('click', el.event);
  }
};

// enum to define seasons as integers in season order
const SeasonsEnum = Object.freeze({
  winter: 0,
  spring: 1,
  summer: 2,
  fall: 3
});

export default {
  props: {
    currentSemesters: Array,
    id: Number,
    isEdit: Boolean,
    year: Number,
    type: String
  },
  data() {
    // years
    const currentYear = new Date().getFullYear();
    const seasons = [[fall, 'Fall'], [spring, 'Spring'], [summer, 'Summer'], [winter, 'Winter']];
    const years = [];
    let startYear = currentYear - 10;
    while (startYear <= currentYear + 10) {
      years.push(startYear);
      startYear += 1;
    }
    years.map(String);

    return {
      seasons,
      years,
      seasonText: '',
      yearText: '',
      displayOptions: {
        season: {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: ''
        },
        year: {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor: ''
        }
      }
    };
  },
  computed: {
    seasonPlaceholder() {
      // set current season to winter in january, spring from february to may, summer from june to august, and fall from september to december
      const currentSeason = this.getCurrentSeason();
      return this.seasonText || this.type || currentSeason;
    },
    yearPlaceholder() {
      const currentYear = new Date().getFullYear();
      return this.yearText || this.year || currentYear;
    }
  },
  directives: {
    'click-outside': clickOutside
  },
  methods: {
    seasonValue(season) {
      return SeasonsEnum[season[1].toLowerCase()];
    },
    getCurrentSeason() {
      let currentSeason;
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
    showHideContent(type) {
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
    closeDropdownIfOpen(type) {
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
    selectOption(type, text) {
      if (type === 'season') {
        this.seasonText = text;
      } else {
        this.yearText = text;
      }
      const displayOptions = this.displayOptions[type];
      displayOptions.shown = false;
      displayOptions.boxBorder = inactiveGray;
      displayOptions.arrowColor = inactiveGray;
      displayOptions.placeholderColor = lightPlaceholderGray;
    },
    selectSeason(text) {
      this.selectOption('season', text);
    },
    selectYear(text) {
      this.selectOption('year', text);
    },
    resetDropdown(type) {
      const displayOptions = this.displayOptions[type];
      displayOptions.shown = false;
      displayOptions.stopClose = false;
      displayOptions.boxBorder = inactiveGray;
      displayOptions.arrowColor = inactiveGray;
      displayOptions.placeholderColor = darkPlaceholderGray;

      if (type === 'season') {
        this.seasonText = '';
      } else {
        this.yearText = '';
      }
    },
    resetDropdowns() {
      // reset season dropdown
      this.resetDropdown('season');

      // reset year dropdown
      this.resetDropdown('year');
    },
    isDuplicate() {
      let isDup = false;
      if (this.currentSemesters != null) {
        this.currentSemesters.forEach(semester => {
          if (semester.year === this.yearPlaceholder && semester.type === this.seasonPlaceholder) {
            if (!this.isEdit || (this.isEdit && this.id !== semester.id)) {
              isDup = true;
            }
          }
        });
      }
      this.$emit('duplicateSemester', isDup);
      return isDup;
    }
  }
};
</script>

<style lang="scss">
.duplicate-p {
  color : red;
}
.duplicate {
  border: 1px solid red;
}
.newSemester {
  display: flex;
  flex-direction: row;
  &-duplicate {
    color: red;
    font-size: 14px;
    margin-top: .5rem;
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
    width: 114px;
    height: 26px;
    left: 444px;
    top: 183px;

    background: #ffffff;
    // border: 1px solid #32A0F2;

    border: 1px solid #c4c4c4;

    //when selected border-color: #32A0F2;

    box-sizing: border-box;
    border-radius: 1px;
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
  &-emoji-text{
    height: 14px;
    padding: 0px;
  }
  &-dropdown {
    &-placeholder {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 15px;

      color: #b6b6b6;

      background-color: white;
      color: #b6b6b6;

      &.season-wrapper,
      &.year-wrapper {
        display: flex;
        flex-direction: row;
        // width: 121px;
        // height: 16px;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      &.year-wrapper {
        // width: 62px;
        // height: 16px;
        width: 100%;
        height: 100%;
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
    width: 114px;
    height: 134px;
    left: 444px;

    background: #ffffff;
    box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
    border-radius: 7px;

    margin-top: 3px;

    &.year-content {
      width: 100%;
      height: 223px;
      left: 574px;
      top: 209px;

      background: #ffffff;
      box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
      border-radius: 7px;

      overflow: scroll;
    }
    &-season {
      padding-left: 0px;
      padding-right: 10px;
      height: 14px;
    }
    &-item {
      width: 106px;
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

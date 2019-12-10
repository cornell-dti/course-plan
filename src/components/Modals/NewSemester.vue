<template>
  <div class="newSemester">
    <div class="newSemester-section newSemester-type">
      <label class="newSemester-label" for="type">{{ typeText }}</label>
      <div
        class="newSemester-select"
        id="type"
        v-bind:style="{ borderColor: displayOptions.season.boxBorder }"
      >
        <div
          class="newSemester-dropdown-placeholder season-wrapper"
          v-on:click="showHideSeasonContent"
        >
          <div class="newSemester-dropdown-placeholder season-placeholder" id="season-placeholder">
            {{ seasonPlaceholder }}
          </div>
          <div
            class="newSemester-dropdown-placeholder season-arrow"
            id="season-arrow"
            v-bind:style="{ borderTopColor: displayOptions.season.arrowColor }"
          ></div>
        </div>
        <div
          class="newSemester-dropdown-content season-content"
          id="season-content"
          v-if="displayOptions.season.shown"
        >
          <div
            class="newSemester-dropdown-content-item"
            id="fall"
            v-on:click="selectSeason('fall')"
          >
            🍂 Fall
          </div>
          <div
            class="newSemester-dropdown-content-item"
            id="spring"
            v-on:click="selectSeason('spring')"
          >
            🌸 Spring
          </div>
          <div
            class="newSemester-dropdown-content-item"
            id="summer"
            v-on:click="selectSeason('summer')"
          >
            ☀️ Summer
          </div>
          <div
            class="newSemester-dropdown-content-item"
            id="winter"
            v-on:click="selectSeason('winter')"
          >
            ❄️ Winter
          </div>
        </div>
      </div>
    </div>
    <div class="newSemester-section newSemester-year">
      <label class="newSemester-label" for="year">{{ yearText }}</label>
      <div
        class="newSemester-select"
        id="year"
        v-bind:style="{ borderColor: displayOptions.year.boxBorder }"
      >
        <div class="newSemester-dropdown-placeholder year-wrapper" v-on:click="showHideYearContent">
          <div class="newSemester-dropdown-placeholder year-placeholder" id="year-placeholder">
            {{ yearPlaceholder }}
          </div>
          <div
            class="newSemester-dropdown-placeholder year-arrow"
            id="year-arrow"
            v-bind:style="{ borderTopColor: displayOptions.year.arrowColor }"
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
            v-on:click="selectYear(year)"
          >
            {{ year }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // years
    const currentYear = new Date().getFullYear();
    const years = [];
    let startYear = currentYear - 10;
    while (startYear <= currentYear + 10) {
      years.push(startYear);
      startYear += 1;
    }
    years.map(String);

    return {
      seasonPlaceholder: 'Select One',
      yearPlaceholder: new Date().getFullYear(),
      years,
      displayOptions: {
        season: {
          shown: false,
          boxBorder: '',
          arrowColor: ''
        },
        year: {
          shown: false,
          boxBorder: '',
          arrowColor: ''
        }
      }
    };
  },
  computed: {
    typeText() {
      return 'Type';
    },
    yearText() {
      return 'Year';
    }
  },
  methods: {
    showHideContent(contentID) {
      const displayOptions = this.displayOptions[contentID];
      const contentShown = displayOptions.shown;
      displayOptions.shown = !contentShown;

      if (contentShown) {
        // clicked box when content shown. So then hide content
        displayOptions.boxBorder = '#C4C4C4';
        displayOptions.arrowColor = '#C4C4C4';
      } else {
        displayOptions.boxBorder = '#32A0F2';
        displayOptions.arrowColor = '#32A0F2';
      }
    },
    showHideSeasonContent() {
      this.showHideContent('season');
    },
    showHideYearContent() {
      this.showHideContent('year');
    },
    selectOption(isSeasonOption, selectedID, contentID, placeholderID) {
      const selectedOption = document.getElementById(selectedID);

      if (isSeasonOption) {
        this.seasonPlaceholder = selectedOption.innerText;
      } else {
        this.yearPlaceholder = selectedOption.innerText;
      }

      const placeholderText = document.getElementById(placeholderID);
      placeholderText.style.color = '#757575';

      const displayOptions = this.displayOptions[contentID];
      displayOptions.shown = false;
      displayOptions.arrowColor = '#C4C4C4';
    },
    selectSeason(selectedID) {
      this.selectOption(true, selectedID, 'season', 'season-placeholder');
    },
    selectYear(selectedID) {
      this.selectOption(false, selectedID, 'year', 'year-placeholder');
    },
    resetDropdown(isSeasonDropdown, boxID) {
      if (isSeasonDropdown) {
        this.displayOptions.season.shown = false;
        this.displayOptions.season.boxBorder = '#C4C4C4';
        this.displayOptions.season.arrowColor = '#C4C4C4';
      } else {
        this.displayOptions.year.shown = false;
        this.displayOptions.year.boxBorder = '#C4C4C4';
        this.displayOptions.year.arrowColor = '#C4C4C4';
      }

      const placeholderID = isSeasonDropdown ? 'season-placeholder' : 'year-placeholder';
      const placeholderText = document.getElementById(placeholderID);
      placeholderText.style.color = '#B6B6B6';
      if (isSeasonDropdown) {
        this.seasonPlaceholder = 'Select One';
      } else {
        this.yearPlaceholder = new Date().getFullYear();
      }
    },
    resetDropdowns() {
      // reset season dropdown
      this.resetDropdown(true);

      // reset year dropdown
      this.resetDropdown(false);
    }
  }
};
</script>

<style lang="scss">
.newSemester {
  display: flex;
  flex-direction: row;

  &-section {
    font-size: 14px;
    line-height: 17px;
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
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;

    color: #b6b6b6;
  }

  &-icon {
    width: 12px;
    height: 12px;
  }

  &-dropdown {
    &-placeholder {
      font-family: Helvetica Neue;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;

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
      width: 114px;
      height: 223px;
      left: 574px;
      top: 209px;

      background: #ffffff;
      box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
      border-radius: 7px;

      overflow: scroll;
    }

    &-item {
      width: 106px;
      height: 31px;
      left: 454px;
      top: 213px;

      font-family: Helvetica Neue;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;
      display: flex;
      align-items: center;

      color: #757575;

      padding-left: 10px;
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

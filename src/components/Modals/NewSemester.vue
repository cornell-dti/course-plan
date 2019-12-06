<template>
  <div class="newSemester">
    <div class="newSemester-section newSemester-type">
      <label class="newSemester-label" for="type">{{ typeText }}</label>
      <div class="newSemester-select" id="type">
        <div class="newSemester-dropdown-placeholder season-wrapper" v-on:click="showHideSeasonContent">
          <div class="newSemester-dropdown-placeholder season-placeholder" id="season-placeholder">{{seasonPlaceholder}}</div>
          <div class="newSemester-dropdown-placeholder season-arrow" id="season-arrow"></div>
        </div>
        <div class="newSemester-dropdown-content season-content" id="season-content">
          <div class="newSemester-dropdown-content-item" id="fall" v-on:click="selectSeason('fall')">
            🍂 Fall
          </div>
          <div class="newSemester-dropdown-content-item" id="spring" v-on:click="selectSeason('spring')">
            🌸 Spring
          </div>
          <div class="newSemester-dropdown-content-item" id="summer" v-on:click="selectSeason('summer')">
            ☀️ Summer
          </div>
          <div class="newSemester-dropdown-content-item" id="winter" v-on:click="selectSeason('winter')">
            ❄️ Winter
          </div>
        </div>
      </div>
    </div>
    <div class="newSemester-section newSemester-year">
      <label class="newSemester-label" for="year">{{ yearText }}</label>
      <div class="newSemester-select" id="year">
        <div class="newSemester-dropdown-placeholder year-wrapper" v-on:click="showHideYearContent">
          <div class="newSemester-dropdown-placeholder year-placeholder" id="year-placeholder">{{ yearPlaceholder }}</div>
          <div class="newSemester-dropdown-placeholder year-arrow" id="year-arrow"></div>
        </div>
        <div class="newSemester-dropdown-content year-content" id="year-content">
          <div v-for="year in years" :key="year" :id = year class="newSemester-dropdown-content-item" v-on:click="selectYear(year)">{{year}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TODO: gray out initial dropdown options
export default {
  data: function() {
    //years
    const currentYear = new Date().getFullYear();
    const years = [];
    let startYear = currentYear - 10;
    while (startYear <= currentYear + 10) {
      years.push(startYear);
      startYear += 1;
    }
    years.map(String);

    return {
      seasonPlaceholder: "Select One",
      yearPlaceholder: (new Date()).getFullYear(),
      years
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
    showHideSeasonContent() {
      const season_content = document.getElementById('season-content');

      const content_shown = season_content.style.display == 'block';
      
      if (content_shown){ //clicked box when content shown. So then hide content
        season_content.style.display = 'none';
      }

      else{ //show season content
      season_content.style.display = 'block';
      }

      //change input box styling
      const season_box = document.getElementById('type');
      season_box.style.borderColor = '#32A0F2';

      const season_arrow = document.getElementById('season-arrow');
      season_arrow.style.borderTopColor = '#32A0F2';
    },
    showHideYearContent() {
      const year_content = document.getElementById('year-content');
      
      const content_shown = year_content.style.display == 'block';
      
      if (content_shown){ //clicked box when content shown. So then hide content
        year_content.style.display = 'none';
      }

      else{ //show year_content 
      year_content.style.display = 'block';
      }

      //change input box styling
      const year_box = document.getElementById('year');
      year_box.style.borderColor = '#32A0F2';

      const year_arrow = document.getElementById('year-arrow');
      year_arrow.style.borderTopColor = '#32A0F2';
    },
    selectSeason(selected_id){
      const selected_season = document.getElementById(selected_id);

      this.seasonPlaceholder = selected_season.innerText;

      const season_arrow = document.getElementById('season-arrow');
      season_arrow.style.borderTopColor = '#C4C4C4';

      const season_placeholder_text = document.getElementById('season-placeholder');
      season_placeholder_text.style.color = '#757575'; 

      const season_content = document.getElementById('season-content');
      season_content.style.display = 'none';

    },
    selectYear(selected_id){
      const selected_year = document.getElementById(selected_id);

      this.yearPlaceholder = selected_year.innerText;

      const year_arrow = document.getElementById('year-arrow');
      year_arrow.style.borderTopColor = '#C4C4C4';

      const year_placeholder_text = document.getElementById('year-placeholder');
      year_placeholder_text.style.color = '#757575'; 

      const year_content = document.getElementById('year-content');
      year_content.style.display = 'none';
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

    background: #FFFFFF;
    // border: 1px solid #32A0F2;

    border: 1px solid #C4C4C4;

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

      color: #B6B6B6;

      background-color: white;
      color: #B6B6B6;

      &.season-wrapper, &.year-wrapper {
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

      &.season-placeholder, &.year-placeholder {
        margin-left: 7px;
        margin-top: 5px;
        margin-bottom: 5px;
        width: 70%;
      }


      &.season-arrow, &.year-arrow {
          width: 6.24px;
          height: 6.24px;
          border-left: 6.24px solid transparent;
          border-right: 6.24px solid transparent;
          
          border-top: 6.24px solid #C4C4C4;
          
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

  &-dropdown-content{
    display: none;
    width: 114px;
    height: 134px;
    left: 444px;

    background: #FFFFFF;
    box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
    border-radius: 7px;

    margin-top: 3px;

    &.year-content{
      width: 114px;
      height: 223px;
      left: 574px;
      top: 209px;

      background: #FFFFFF;
      box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
      border-radius: 7px;

      overflow: scroll;
    }

    &-item{
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

  &-dropdown-content div:hover{
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

<template>
  <div class="newSemester">
    <div class="newSemester-section newSemester-type">
      <label class="newSemester-label" for="type">{{ typeText }}</label>
      <select class="newSemester-select" :placeholder="typePlaceholder" id="type">
        <option value="" selected disabled>Select one</option>
        <option value="fall">
          🍂 Fall
        </option>
        <option value="spring">
          🌸 Spring
        </option>
        <option value="summer">
          ☀️ Summer
        </option>
        <option value="winter">
          ❄️ Winter
        </option>
      </select>
    </div>
    <div class="newSemester-section newSemester-year">
      <label class="newSemester-label" for="year">{{ yearText }}</label>
      <select class="newSemester-select" id="year" v-html="yearOptions" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

// TODO: gray out initial dropdown options
export default {
  computed: {
    typeText() {
      return 'Type';
    },
    yearText() {
      return 'Year';
    },
    typePlaceholder() {
      return 'Select one';
    },
    yearOptions() {
      // TODO: what years are valid?
      const currentYear = new Date().getFullYear();
      const years = [];
      let startYear = currentYear - 10;
      while (startYear <= currentYear + 10) {
        years.push(startYear);
        startYear += 1;
      }
      years.map(String);

      // const years = ['2019', '2020', '2021', '2022'];
      let str = '';
      for (let i = 0; i < years.length; i += 1) {
        if (years[i] === currentYear) {
          str += `<option value=${years[i]} selected>${years[i]}</option>`;
        } else {
          str += `<option value=${years[i]}>${years[i]}</option>`;
        }
      }
      return str;
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
    border: 1px solid #32a0f2;
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

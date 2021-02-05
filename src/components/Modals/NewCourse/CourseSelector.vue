<template>
  <div class="autocomplete">
    <input
      v-bind:class="['search-box', searchBoxClassName]"
      ref="dropdownInput"
      v-model="searchText"
      :placeholder="placeholder"
      @keyup.esc="onEscape"
      @keyup.enter="onEnter"
      @keyup.up="changeFocus(currentFocus - 1)"
      @keyup.down="changeFocus(currentFocus + 1)"
    />
    <div v-if="matches.length > 0" class="autocomplete-items">
      <div
        v-for="(matchingCourse, index) in matches"
        :key="matchingCourse.id"
        v-bind:class="['search-result', currentFocus === index ? 'autocomplete-active' : '']"
        @click="selectCourse(matchingCourse)"
      >
        {{ matchingCourse.title }}
        <input type="hidden" :value="matchingCourse.title" :name="matchingCourse.roster" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import coursesJSON from '@/assets/courses/courses.json';

import { CourseJson } from '@/requirements/courses-json-generator';

export type MatchingCourseSearchResult = {
  readonly title: string;
  readonly roster: string;
  readonly id: number;
};

const getMatchingCourses = (
  searchText: string,
  courses: CourseJson
): readonly MatchingCourseSearchResult[] => {
  // search after value length of 2 to reduce search times of courses
  if (!searchText || searchText.length < 2) return [];
  /* code array for results that contain course code and title array for results that contain title */
  const code: MatchingCourseSearchResult[] = [];
  const title: MatchingCourseSearchResult[] = [];

  for (const attr in courses) {
    if (courses[attr]) {
      const result = {
        title: `${attr}: ${courses[attr].t}`,
        roster: courses[attr].r,
        id: courses[attr].i,
      };
      if (attr.toUpperCase().includes(searchText) && attr !== 'lastScanned') {
        code.push(result);
      } else if (courses[attr].t && courses[attr].t.toUpperCase().includes(searchText)) {
        title.push(result);
      }
    }
  }

  // Sort both results by title
  code.sort((first, second) => first.title.localeCompare(second.title));
  title.sort((first, second) => first.title.localeCompare(second.title));

  /* prioritize code matches over title matches */
  // limit the number of results to 10
  return code.concat(title).slice(0, 10);
};

export default Vue.extend({
  props: { searchBoxClassName: String, placeholder: String, autoFocus: Boolean },
  data() {
    return {
      searchText: '',
      currentFocus: -1,
    };
  },
  computed: {
    matches(): readonly MatchingCourseSearchResult[] {
      return getMatchingCourses(this.searchText.toUpperCase(), coursesJSON);
    },
  },
  mounted() {
    // Activate focus and set input to empty
    const input = this.dropdownInputRef();
    if (this.autoFocus) input.focus();
  },
  methods: {
    dropdownInputRef(): HTMLInputElement {
      return this.$refs.dropdownInput as HTMLInputElement;
    },
    onEscape() {
      this.$emit('on-escape');
    },
    changeFocus(newFocusIndex: number) {
      const wraparoundLimit = this.matches.length;
      this.currentFocus = ((newFocusIndex % wraparoundLimit) + wraparoundLimit) % wraparoundLimit;
    },
    selectCourse(result: MatchingCourseSearchResult) {
      this.$emit('on-select', result);
      this.searchText = result.title;
      this.currentFocus = -1;
    },
    onEnter() {
      const result = this.matches[this.currentFocus];
      if (result != null) this.selectCourse(result);
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.search-box {
  border: 1px solid transparent;
  background-color: $searchBoxWhite;
  padding: 10px;
  font-size: 16px;
}
.autocomplete {
  /*the container must be positioned relative:*/
  position: relative;
  display: inline-block;
  width: 100%;
  margin-top: 0.5rem;
  padding-bottom: 12px;
}
.autocomplete-items {
  position: absolute;
  border: 1px solid $searchBoxBorderGray;
  border-bottom: none;
  border-top: none;
  z-index: 99;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 0;
  right: 0;
  box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 7px;

  .search-result {
    padding: 10px;
    cursor: pointer;
    background-color: $white;

    &:hover {
      background-color: $searchBoxHoverGray;
    }
  }
}
.autocomplete-active {
  /*when navigating through the items using the arrow keys:*/
  background-color: DodgerBlue !important;
  color: $white;
}
</style>

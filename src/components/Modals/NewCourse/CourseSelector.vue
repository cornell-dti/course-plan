<template>
  <div class="autocomplete">
    <input
      :class="['search-box', searchBoxClassName]"
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
        :key="index"
        :class="['search-result', currentFocus === index ? 'autocomplete-active' : '']"
        @click="selectCourse(matchingCourse)"
        data-cyId="newCourse-searchResult"
      >
        <span
          v-for="(part, idx) in highlightMatch(
            matchingCourse.subject + ' ' + matchingCourse.catalogNbr
          )"
          :key="'code' + idx"
        >
          <strong v-if="part.match" v-text="part.text"></strong>
          <span v-else v-text="part.text"></span>
        </span>
        :
        <span v-for="(part, idx) in highlightMatch(matchingCourse.titleLong)" :key="'title' + idx">
          <strong v-if="part.match" v-text="part.text"></strong>
          <span v-else v-text="part.text"></span>
        </span>
      </div>
    </div>
    <!-- No results message with option to add blank course card -->
    <div
      v-else-if="searchText.length >= 2 && allowBlankCard"
      class="no-results-container"
      @click="addBlankCourseCard"
    >
      <div class="no-results-message">Can't find your class? Add blank course card!</div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { fullCoursesArray } from '@/assets/courses/typed-full-courses';

const getMatchingCourses = (
  searchText: string,
  coursesArray?: readonly CornellCourseRosterCourse[],
  filter?: (course: CornellCourseRosterCourse) => boolean
): readonly CornellCourseRosterCourse[] => {
  // search after value length of 2 to reduce search times of courses
  if (!searchText || searchText.length < 2) return [];
  /* code array for results that contain course code and title array for results that contain title */
  const code: CornellCourseRosterCourse[] = [];
  const title: CornellCourseRosterCourse[] = [];
  const codeAndTitle: CornellCourseRosterCourse[] = [];

  let filteredCourses: readonly CornellCourseRosterCourse[] = [];
  if (coursesArray !== undefined) {
    filteredCourses = coursesArray;
  } else {
    filteredCourses = filter != null ? fullCoursesArray.filter(filter) : fullCoursesArray;
  }
  const normalizedSearchText = searchText.toUpperCase().replace(/\s+/g, '').replace(/:/g, '');
  for (const course of filteredCourses) {
    const courseCode = `${course.subject}${course.catalogNbr}`.toUpperCase().replace(/\s+/g, '');
    const courseTitle = course.titleLong.toUpperCase().replace(/\s+/g, '');
    if (courseCode.includes(normalizedSearchText)) {
      code.push(course);
    } else if (courseTitle.includes(normalizedSearchText)) {
      title.push(course);
    } else if ((courseCode + courseTitle).includes(normalizedSearchText)) {
      codeAndTitle.push(course);
    }
  }
  // Sort all results by title, and prioritize code matches over other matches.
  code.sort((first, second) => first.titleLong.localeCompare(second.titleLong));
  title.sort((first, second) => first.titleLong.localeCompare(second.titleLong));
  codeAndTitle.sort((first, second) => first.titleLong.localeCompare(second.titleLong));

  return code.concat(title).concat(codeAndTitle);
  // limit the number of results to 10
  // return code.concat(title).slice(0, 10);
};

export default defineComponent({
  props: {
    searchBoxClassName: { type: String, required: true },
    placeholder: { type: String, required: true },
    autoFocus: { type: Boolean, required: true },
    coursesArray: {
      type: Object as PropType<readonly CornellCourseRosterCourse[]>,
      required: false,
      default: undefined,
    },
    allowBlankCard: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: {
    'on-escape': () => true,
    'on-select': (result: CornellCourseRosterCourse) => typeof result === 'object',
    'on-add-blank-course': () => true,
  },
  data() {
    return {
      searchText: '',
      currentFocus: -1,
    };
  },
  computed: {
    matches(): readonly CornellCourseRosterCourse[] {
      return getMatchingCourses(this.searchText.toUpperCase(), this.coursesArray);
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
    selectCourse(result: CornellCourseRosterCourse) {
      this.$emit('on-select', result);
      this.searchText = '';
      this.currentFocus = -1;
    },
    onEnter() {
      const result = this.matches[this.currentFocus];
      if (result != null) this.selectCourse(result);
    },
    addBlankCourseCard() {
      this.$emit('on-add-blank-course');
    },
    /**
     * Highlights the matching text in the search results
     * @param text - the text to highlight
     * @returns an array of objects with the text and whether it is a match
     */
    highlightMatch(text: string) {
      const searchText = this.searchText.trim();
      if (!searchText) return [{ text, match: false }];

      const regex = new RegExp(`(${searchText})`, 'gi');
      const parts = text.split(regex);

      return parts.map(part => ({
        text: part,
        match: part.toLowerCase() === searchText.toLowerCase(),
      }));
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

  // TODO: add a specific focus style
  // &:focus {
  //   border-color: $yuxuanBlue; /* Replace with your desired border color */
  //   outline: none; /* Remove the default outline */
  // }
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
  max-height: 50vh;
  overflow-y: auto;

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

.no-results-container {
  margin-top: 8px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 4px;
  text-align: left;
  color: $sangBlue;
  cursor: pointer;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e9e9e9;
  }
}

.no-results-message {
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
}
</style>

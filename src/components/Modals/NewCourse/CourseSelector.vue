<template>
  <div class="autocomplete">
    <input
      :class="['search-box', searchBoxClassName]"
      ref="dropdownInput"
      v-model="searchText"
      :placeholder="placeholder"
      @keydown.esc.prevent.stop="onEscape"
      @keydown.enter.prevent="onEnter"
      @keydown.up.prevent="changeFocus(currentFocus < 0 ? matches.length - 1 : currentFocus - 1)"
      @keydown.down.prevent="changeFocus(currentFocus + 1)"
      @keydown.tab="focusPreviewButton"
    />
    <div v-if="matches.length > 0" ref="dropdownResults" class="autocomplete-items">
      <div
        v-for="(matchingCourse, index) in matches"
        :key="index"
        :class="['search-result', currentFocus === index ? 'autocomplete-active' : '']"
        @click="selectCourse(matchingCourse)"
        data-cyId="newCourse-searchResult"
      >
        <div class="search-result-text">
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
          <span
            v-for="(part, idx) in highlightMatch(matchingCourse.titleLong)"
            :key="'title' + idx"
          >
            <strong v-if="part.match" v-text="part.text"></strong>
            <span v-else v-text="part.text"></span>
          </span>
        </div>
        <button
          type="button"
          class="search-result-preview"
          :aria-label="`Preview ${matchingCourse.subject} ${matchingCourse.catalogNbr}`"
          :tabindex="index === Math.max(currentFocus, 0) ? 0 : -1"
          @click.stop="previewCourse(matchingCourse)"
          @keydown.esc.prevent.stop="onEscape"
          data-cyId="course-search-preview"
        >
          <span class="search-result-chevron" aria-hidden="true"></span>
        </button>
      </div>
    </div>
    <!-- No results message with option to add blank course card -->
    <div
      v-else-if="searchText.length >= 2"
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
  },
  emits: {
    'on-escape': () => true,
    'on-select': (result: CornellCourseRosterCourse) => typeof result === 'object',
    'on-preview': (result: CornellCourseRosterCourse) => typeof result === 'object',
    'on-add-blank-course': () => true,
  },
  data() {
    return {
      searchText: '',
      currentFocus: -1,
      previewContext: { start: 0, end: 0, scrollTop: 0 },
    };
  },
  computed: {
    matches(): readonly CornellCourseRosterCourse[] {
      return getMatchingCourses(this.searchText.toUpperCase(), this.coursesArray);
    },
  },
  watch: {
    searchText() {
      this.currentFocus = -1;
    },
    matches() {
      if (this.currentFocus >= this.matches.length) this.currentFocus = -1;
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
      if (wraparoundLimit === 0) {
        this.currentFocus = -1;
        return;
      }
      this.currentFocus = ((newFocusIndex % wraparoundLimit) + wraparoundLimit) % wraparoundLimit;
      this.$nextTick(() => {
        const results = this.$refs.dropdownResults as HTMLElement | undefined;
        results?.children[this.currentFocus]?.scrollIntoView({ block: 'nearest' });
      });
    },
    focusPreviewButton(event: KeyboardEvent) {
      if (event.shiftKey || this.currentFocus < 0 || !this.matches[this.currentFocus]) return;
      const results = this.$refs.dropdownResults as HTMLElement;
      const button = results.children[this.currentFocus].querySelector('button');
      if (button) {
        event.preventDefault();
        button.focus();
      }
    },
    previewCourse(course: CornellCourseRosterCourse) {
      const input = this.dropdownInputRef();
      this.previewContext = {
        start: input.selectionStart ?? 0,
        end: input.selectionEnd ?? 0,
        scrollTop: (this.$refs.dropdownResults as HTMLElement).scrollTop,
      };
      this.$emit('on-preview', course);
    },
    async restorePreviewContext() {
      await this.$nextTick();
      const input = this.dropdownInputRef();
      input.focus({ preventScroll: true });
      input.setSelectionRange(this.previewContext.start, this.previewContext.end);
      const results = this.$refs.dropdownResults as HTMLElement | undefined;
      if (results) results.scrollTop = this.previewContext.scrollTop;
    },
    selectCourse(result: CornellCourseRosterCourse) {
      this.$emit('on-select', result);
      this.searchText = '';
      this.currentFocus = -1;
    },
    onEnter() {
      const result = this.matches[this.currentFocus] ?? this.matches[0];
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

      const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedSearchText})`, 'gi');
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
    position: relative;
    padding: 10px 44px 10px 10px;
    cursor: pointer;
    background-color: $white;

    &:hover {
      background-color: $searchBoxHoverGray;
    }

    &-preview {
      position: absolute;
      right: 0;
      top: 0;
      width: 40px;
      height: 100%;
      min-height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      background: transparent;
      color: $darkPlaceholderGray;
      opacity: 0;

      &:hover {
        color: $emGreen;
        opacity: 1;
      }

      &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: -3px;
      }
    }

    &-chevron {
      width: 14px;
      height: 8px;
      background-color: currentColor;
      mask: url('@/assets/images/downarrow-white.svg') center / 14px 8px no-repeat;
    }

    &:hover .search-result-preview,
    &:focus-within .search-result-preview,
    &.autocomplete-active .search-result-preview {
      opacity: 1;
    }

    &.autocomplete-active .search-result-preview {
      color: $white;

      &:hover {
        opacity: 0.5;
      }
    }
  }
}

@media (hover: none), (pointer: coarse) {
  .autocomplete-items .search-result-preview {
    opacity: 1;
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

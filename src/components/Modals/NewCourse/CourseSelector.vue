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
        {{ matchingCourse.subject }} {{ matchingCourse.catalogNbr }}: {{ matchingCourse.titleLong }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { fullCoursesArray } from '@/assets/courses/typed-full-courses';

const getMatchingCourses = (
  searchText: string,
  filter?: (course: CornellCourseRosterCourse) => boolean
): readonly CornellCourseRosterCourse[] => {
  // search after value length of 2 to reduce search times of courses
  if (!searchText || searchText.length < 2) return [];
  /* code array for results that contain course code and title array for results that contain title */
  const code: CornellCourseRosterCourse[] = [];
  const title: CornellCourseRosterCourse[] = [];
  const filteredCourses = fullCoursesArray.filter(
    course =>
      (filter ? filter(course) : true) &&
      (course.subject
        .concat(' ', course.catalogNbr)
        .toUpperCase()
        .includes(searchText.toUpperCase()) ||
        course.titleLong.toUpperCase().includes(searchText.toUpperCase()))
  );
  for (const course of filteredCourses) {
    const courseCode = `${course.subject} ${course.catalogNbr}`;
    if (courseCode.toUpperCase().includes(searchText)) {
      code.push(course);
    } else if (course.titleLong.toUpperCase().includes(searchText)) {
      title.push(course);
    }
  }
  // Sort both results by title
  code.sort((first, second) => first.titleLong.localeCompare(second.titleLong));
  title.sort((first, second) => first.titleLong.localeCompare(second.titleLong));

  /* prioritize code matches over title matches */
  // limit the number of results to 10
  return code.concat(title).slice(0, 10);
};

export default defineComponent({
  props: {
    searchBoxClassName: { type: String, required: true },
    placeholder: { type: String, required: true },
    courseFilter: {
      type: (Function as unknown) as PropType<
        ((course: CornellCourseRosterCourse) => boolean) | undefined
      >,
      default: undefined,
    },
    autoFocus: { type: Boolean, required: true },
  },
  emits: {
    'on-escape': () => true,
    'on-select': (result: CornellCourseRosterCourse) => typeof result === 'object',
  },
  data() {
    return {
      searchText: '',
      currentFocus: -1,
    };
  },
  computed: {
    matches(): readonly CornellCourseRosterCourse[] {
      return getMatchingCourses(this.searchText.toUpperCase(), this.courseFilter);
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
      this.searchText = `${result.subject} ${result.catalogNbr}: ${result.titleLong}`;
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

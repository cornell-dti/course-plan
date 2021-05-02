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
      >
        {{ matchingCourse.subject }} {{ matchingCourse.catalogNbr }}: {{ matchingCourse.titleLong }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import Fuse from 'fuse.js';
import { fullCoursesArray } from '@/assets/courses/typed-full-courses';

const getMatchingCourses = (
  searchText: string,
  filter?: (course: CornellCourseRosterCourse) => boolean
): readonly CornellCourseRosterCourse[] => {
  interface SearchableCourse extends CornellCourseRosterCourse {
    courseCode?: string;
    fullCourseString?: string;
  }

  const courses: readonly SearchableCourse[] =
    filter != null ? fullCoursesArray.filter(filter) : fullCoursesArray;
  courses.map((course: SearchableCourse) => {
    course.courseCode = `${course.subject} ${course.catalogNbr}`;
    course.fullCourseString = `${course.subject} ${course.catalogNbr} ${course.titleLong}`;
    return course;
  });


  // Assume first word is subject
  const firstWord = searchText.includes(' ') ? searchText.split(' ')[0] : searchText;

  // Performed under the assumption that the user will refer the to the subject as the first string.
  // Step 1: Check for first string
  const subjectOptions = {
    includeScore: true,
    keys: ['subject'],
  };
  const firstWordSearch = new Fuse(courses, subjectOptions);
  const firstWordResult: Fuse.FuseResult<SearchableCourse>[] = firstWordSearch.search(firstWord, {
    limit: 5,
  });

  let courseCodeResult: Fuse.FuseResult<SearchableCourse>[] = [];
  const indexOfFirstSpace = searchText.indexOf(' ');
  if (indexOfFirstSpace !== -1) {
    const indexOfSecondSpace = searchText.indexOf(' ', indexOfFirstSpace + 1);
    const firstTwoWords = searchText.substr(0, indexOfSecondSpace);
    // Step 2: Check for courseCode
    if (/^[A-Za-z]+ [0-9]+$/.test(firstTwoWords)) {
      const courseCodeOptions = {
        includeScore: true,
        keys: ['courseCode'],
      };
      const courseCodeSearch = new Fuse(courses, courseCodeOptions);
      courseCodeResult = courseCodeSearch.search(firstTwoWords, { limit: 5 });
    }
  }


  // Step 3: General search
  const options = {
    includeScore: true,
    keys: [
      { name: 'courseCode', weight: 2 },
      { name: 'subject', weight: 3 },
      { name: 'fullCourseString', weight: 2.5 },
      { name: 'catalogNbr', weight: 1.5 },
      { name: 'titleLong', weight: 1 },
    ],
  };
  const fuse = new Fuse(courses, options);
  const generalResult = fuse.search(searchText, { limit: 10 });
  // const result: readonly CornellCourseRosterCourse[] = fuse
  //   .search(searchText, { limit: 10 })
  //   .map(elem => {
  //     delete elem.item.courseCode;
  //     delete elem.item.fullCourseString;
  //     return elem.item;
  //   });

  const allSearchResults = firstWordResult.concat(courseCodeResult).concat(generalResult);
  arr.filter((v,i,a)=>a.findIndex(t=>(t.place === v.place && t.name===v.name))===i)
  allSearchResults.filter((v,i,a)=>a.findIndex(t=>(t.item.)));
  allSearchResults.sort((a,b) => a.score - b.score);
  return result;
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
      return getMatchingCourses(this.searchText, this.courseFilter);
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

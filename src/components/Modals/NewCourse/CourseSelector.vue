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

interface SearchableCourse extends CornellCourseRosterCourse {
  courseCode?: string;
  fullCourseString?: string;
}

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
      if (!this.searchText || this.searchText.length < 2) return [];
      const options = {
        keys: [
          { name: 'courseCode', weight: 2 },
          { name: 'subject', weight: 3 },
          { name: 'fullCourseString', weight: 2.5 },
          { name: 'catalogNbr', weight: 1.5 },
          { name: 'titleLong', weight: 1 },
        ],
      };

      const fuse = new Fuse(this.searchableCourses, options);
      const result: readonly SearchableCourse[] = fuse
        .search(this.searchText, { limit: 10 })
        .map(elem => elem.item);
      return result;
    },
    searchableCourses(): readonly SearchableCourse[] {
      const courses: readonly SearchableCourse[] =
        this.courseFilter != null ? fullCoursesArray.filter(this.courseFilter) : fullCoursesArray;
      courses.map((course: SearchableCourse) => {
        course.courseCode = `${course.subject} ${course.catalogNbr}`;
        course.fullCourseString = `${course.subject} ${course.catalogNbr} ${course.titleLong}`;
        return course;
      });
      return courses;
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

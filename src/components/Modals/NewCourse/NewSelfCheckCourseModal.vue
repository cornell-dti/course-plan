<template>
  <flexible-modal
    title="Add Course"
    content-class="content-course"
    :leftButtonText="leftButtonText"
    :rightButtonText="rightButtonText"
    :rightButtonIsDisabled="selectedCourse == null"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backOrCancel"
    @right-button-clicked="addCourse"
  >
    <div class="newCourse-text">Search Course Roster</div>
    <course-selector
      search-box-class-name="newCourse-dropdown"
      :key="courseSelectorKey"
      placeholder='"CS 1110", "Multivariable Calculus", etc'
      :autoFocus="true"
      @on-escape="closeCurrentModal"
      @on-select="setCourse"
    />
    <div>
      <div class="newCourse-title">Add this class to the following semester</div>
      <div class="newCourse-semester-edit">
        <new-semester
          :type="season"
          :year="year"
          :isCourseModelSelectingSemester="true"
          @updateSemProps="updateSemProps"
        />
      </div>
    </div>
  </flexible-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import FlexibleModal from '@/components/Modals/FlexibleModal.vue';
import NewSemester from '@/components/Modals/NewSemester.vue';
import CourseSelector, {
  MatchingCourseSearchResult,
} from '@/components/Modals/NewCourse/CourseSelector.vue';

export default Vue.extend({
  components: { CourseSelector, FlexibleModal, NewSemester },
  data() {
    return {
      selectedCourse: null as MatchingCourseSearchResult | null,
      courseSelectorKey: 0,
      season: '' as FirestoreSemesterType,
      year: 0,
    };
  },
  computed: {
    leftButtonText(): string {
      return 'CANCEL';
    },
    rightButtonText(): string {
      return 'ADD';
    },
  },
  methods: {
    closeCurrentModal() {
      this.reset();
      this.$emit('close-course-modal');
    },
    setCourse(result: MatchingCourseSearchResult) {
      this.selectedCourse = result;
    },
    addCourse() {
      if (this.selectedCourse == null) return;

      const { roster, title } = this.selectedCourse;

      const courseCode = title.substring(0, title.indexOf(':'));
      const subject = courseCode.split(' ')[0];
      const number = courseCode.split(' ')[1];

      fetch(
        `https://classes.cornell.edu/api/2.0/search/classes.json?roster=${roster}&subject=${subject}&q=${courseCode}`
      )
        .then(res => res.json())
        .then(resultJSON => {
          // check catalogNbr of resultJSON class matches number of course to add
          resultJSON.data.classes.forEach((resultJSONclass: CornellCourseRosterCourse) => {
            if (resultJSONclass.catalogNbr === number) {
              const course = { ...resultJSONclass, roster };
              this.$emit('add-course', course, this.season, this.year);
            }
          });
        });

      this.reset();
      this.closeCurrentModal();
    },
    reset() {
      this.courseSelectorKey += 1;
      this.selectedCourse = null;
    },
    backOrCancel() {
      this.closeCurrentModal();
    },
    updateSemProps(season: FirestoreSemesterType, year: number) {
      this.season = season;
      this.year = year;
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
.newCourse {
  &-text {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
  }
  &-dropdown {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    width: 100%;
    border-radius: 3px;
    padding: 0.5rem;
    border: 0.5px solid $inactiveGray;
    &::placeholder {
      color: $darkPlaceholderGray;
    }
  }
  &-semester {
    &-edit {
      width: 50%;
    }
  }
  &-title {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    margin-bottom: 6px;
  }
}

.content-course {
  width: 27.75rem;
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-course {
    width: 100%;
  }
}
</style>

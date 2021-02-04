<template>
  <flexible-modal
    title="Add Course"
    contentClass="content-course"
    :leftButtonText="leftButtonText"
    :rightButtonText="rightButtonText"
    :rightButtonIsDisabled="isDisabled"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backOrCancel"
    @right-button-clicked="addItem"
  >
    <newCourse
      :isOnboard="false"
      :semesterID="semesterID"
      :currentSemesters="currentSemesters"
      :isCourseModelSelectingSemester="isCourseModelSelectingSemester"
      placeholderText='"CS 1110", "Multivariable Calculus", etc.'
      @duplicateSemester="disableButton"
      @close-course-modal="closeCourseModal"
      @updateSemProps="updateSemProps"
      @toggle-left-button="toggleLeftButton"
      @allow-add="disableButton"
      @on-course-select="selectCourse"
      @edit-mode="editMode"
      ref="modalBodyComponent"
      :season="season"
      :year="year"
      :goBack="goBack"
      :reqs="reqs"
    />
  </flexible-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import NewCourse from '@/components/Modals/NewCourse/NewCourse.vue';
import { AppSemester, CornellCourseRosterCourse } from '@/user-data';
import { SingleMenuRequirement } from '@/requirements/types';
import { MatchingCourseSearchResult } from './CourseSelector.vue';

Vue.component('newCourse', NewCourse);

export default Vue.extend({
  data() {
    return {
      selectedCourse: null as MatchingCourseSearchResult | null,
      courseIsAddable: true,
      isDisabled: true,
      leftButtonText: 'CANCEL',
      rightButtonText: 'ADD',
      goBack: false,
      season: '',
      year: 0,
    };
  },
  props: {
    type: String,
    semesterID: String,
    currentSemesters: Array as PropType<readonly AppSemester[]>,
    isOpen: Boolean,
    isCourseModelSelectingSemester: Boolean,
    reqs: Array as PropType<readonly SingleMenuRequirement[]>,
  },
  methods: {
    selectCourse(result: MatchingCourseSearchResult) {
      this.selectedCourse = result;
    },
    disableButton(bool: boolean) {
      this.isDisabled = bool;
    },
    closeCourseModal() {
      this.$emit('close-course-modal');
    },
    closeCurrentModal() {
      // @ts-expect-error: TS cannot understand $ref's component.
      this.$refs.modalBodyComponent.reset();
      this.isDisabled = true;
      this.$emit('close-course-modal');
    },
    // Note: Currently not used
    checkCourseDuplicate(key: string) {
      this.$emit('check-course-duplicate', key);
    },
    addItem() {
      if (this.rightButtonText === 'NEXT') {
        this.rightButtonText = 'ADD';
        // @ts-expect-error: TS cannot understand $ref's component.
        this.$refs.modalBodyComponent.next();
      } else {
        this.addCourse();
      }
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
              if (this.courseIsAddable) {
                this.$emit('add-course', course, this.season, this.year);
              }
            }
          });
        });

      // @ts-expect-error: TS cannot understand $ref's component.
      this.$refs.modalBodyComponent.reset();
      this.closeCurrentModal();
    },
    toggleLeftButton() {
      if (this.leftButtonText === 'CANCEL') {
        this.leftButtonText = 'BACK';
      } else {
        this.leftButtonText = 'CANCEL';
      }
    },
    backOrCancel() {
      if (this.leftButtonText === 'BACK') {
        this.goBack = !this.goBack;
        // @ts-expect-error: TS cannot understand $ref's component.
        this.$refs.modalBodyComponent.goBack();
      } else {
        this.closeCurrentModal();
      }
    },
    updateSemProps(season: string, year: number) {
      this.season = season;
      this.year = year;
    },
    editMode() {
      this.leftButtonText = 'BACK';
      this.rightButtonText = 'NEXT';
    },
  },
});
</script>

<style lang="scss">
.content-course {
  width: 27.75rem;
}

@media only screen and (max-width: 600px) {
  .content-course {
    width: 100%;
  }
}
</style>

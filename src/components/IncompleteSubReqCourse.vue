<template>
  <div class="incompletesubreqcourse">
    <div
      class="draggable-requirements-wrapper"
      v-if="displayDescription && crseInfoObjects.length > 0"
    >
      <div class="draggable-requirements-heading">
        <div class="draggable-requirements-heading-label">{{ addCourseLabel }}</div>
        <div
          v-if="showSeeAllLabel"
          class="draggable-requirements-heading-seeAll"
          @click="onShowAllCourses"
        >
          {{ seeAll }}
        </div>
      </div>
      <div
        v-if="displayCourses"
        class="draggable-requirements-courses"
        v-dragula="courseObjects"
        bag="first-bag"
      >
        <div
          v-for="course in courseObjects"
          :key="course.uniqueID"
          class="requirements-courseWrapper"
        >
          <course
            v-bind="course"
            :courseObj="course"
            :id="course.subject + course.number"
            :uniqueID="course.uniqueID"
            :compact="true"
            :active="false"
            class="requirements-course"
          />
        </div>
      </div>
      <div class="separator"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import firebase from 'firebase/app';
import Course from '@/components/Course.vue';
import { DisplayableRequirementFulfillment } from '@/requirements/types';
import { AppCourse, FirestoreSemesterCourse } from '@/user-data';

require('firebase/functions');

const functions = firebase.functions();
const FetchCourses = firebase.functions().httpsCallable('FetchCourses');

Vue.component('course', Course);

type CrseInfo = {
  roster: string;
  crseIds: number[];
};

type Data = {
  courseObjects: AppCourse[];
  scrollable: boolean;
  displayCourses: boolean;
};

export default Vue.extend({
  mounted() {
    this.$el.addEventListener('touchmove', this.dragListener, { passive: false });
    // @ts-ignore
    const service = Vue.$dragula.$service;
    service.eventBus.$on('drag', () => {
      this.scrollable = true;
    });
    service.eventBus.$on('drop', () => {
      this.scrollable = true;
    });
  },
  data(): Data {
    return {
      courseObjects: [],
      scrollable: false,
      displayCourses: false,
    };
  },
  beforeDestroy() {
    this.$el.removeEventListener('touchmove', this.dragListener);
  },
  props: {
    subReq: Object as PropType<DisplayableRequirementFulfillment>,
    subReqCourseId: Number,
    crseInfoObjects: Array as PropType<CrseInfo[]>,
    subReqCourseObjectsNotTakenArray: Array as PropType<AppCourse[]>,
    subReqCoursesNotTakenArray: Array as PropType<CrseInfo[][]>,
    dataReady: Boolean,
    displayDescription: Boolean,
  },
  watch: {
    dataReady: {
      immediate: true,
      handler(dataReady) {
        if (dataReady && this.subReqCourseObjectsNotTakenArray.length > 0) {
          this.getFirstFourCourseObjects();
          this.displayCourses = true;
        }
      },
    },
  },
  computed: {
    addCourseLabel() {
      let label = 'Add Course';
      if (this.subReq.fulfilledBy === 'courses') {
        label = `Add Course ${this.subReqCourseId + 1}`;
      }
      return label;
    },
    seeAll() {
      return 'See all >';
    },
    showSeeAllLabel() {
      // Only show See all label when there are more than 4 courses
      const allCrseIds = this.crseInfoObjects.map(crseInfoObject => crseInfoObject.crseIds).flat();
      return allCrseIds.length > 4;
    },
  },
  methods: {
    dragListener(event: { preventDefault: () => void }) {
      if (!this.$data.scrollable) event.preventDefault();
    },
    getFirstFourCourseObjects() {
      const firstFourCourseObjects: AppCourse[] = [];
      for (
        let i = 0;
        firstFourCourseObjects.length < 4 && i < this.crseInfoObjects.length;
        i += 1
      ) {
        const crseInfoObject = this.crseInfoObjects[i];
        const filteredCourses: AppCourse[] = this.subReqCourseObjectsNotTakenArray.filter(course =>
          crseInfoObject.crseIds.includes(course.crseId)
        );
        const numRemainingCourses = Math.min(
          4 - firstFourCourseObjects.length,
          filteredCourses.length
        );
        firstFourCourseObjects.push(...filteredCourses.slice(0, numRemainingCourses));
      }
      this.courseObjects = firstFourCourseObjects;
    },
    getAllCrseInfoFromSemester(): CrseInfo[] {
      const subReqCrseInfoObjectsToFetch: CrseInfo[] = [];
      this.subReqCoursesNotTakenArray.forEach(subReqCourseArray => {
        const crseInfoFromSemester = subReqCourseArray.filter((crseInfo: CrseInfo) => {
          return crseInfo.roster === 'FA20';
        });
        subReqCrseInfoObjectsToFetch.push(crseInfoFromSemester[0]);
      });
      return subReqCrseInfoObjectsToFetch;
    },
    onShowAllCourses(courses: AppCourse[]) {
      const subReqCrseInfoObjectsToFetch = this.getAllCrseInfoFromSemester();
      let fetchedCourses;
      FetchCourses({
        crseInfo: subReqCrseInfoObjectsToFetch,
        allowSameCourseForDifferentRosters: false,
      })
        .then(result => {
          fetchedCourses = result.data.courses;
          fetchedCourses.forEach((course: FirestoreSemesterCourse) => {
            // @ts-ignore
            const createdCourse = this.$parent.$parent.$parent.$parent.createCourse(course, true);
            createdCourse.compact = true;
            this.subReqCourseObjectsNotTakenArray.push(createdCourse);
          });
          this.$emit('onShowAllCourses', this.subReqCourseObjectsNotTakenArray);
        })
        .catch(error => {
          console.log('FetchCourses() Error: ', error);
        });
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.separator {
  height: 1px;
  width: 100%;
  background-color: $inactiveGray;
}

.draggable-requirements {
  &-wrapper {
    margin-top: 2%;
    margin-bottom: 2%;
  }
  &-heading {
    display: flex;
    justify-content: space-between;
    &-label {
      font-size: 14px;
      line-height: 17px;
      color: $lightLabelGray;
    }
    &-seeAll {
      font-size: 12px;
      line-height: 15px;
      color: $yuxuanBlue;
      padding: 1%;
      cursor: pointer;
    }
  }

  &-courses {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: -1%;
    margin-bottom: 2%;
    width: 100%;
  }
}

.requirements {
  &-courseWrapper {
    padding: 1%;
    max-width: 50%;
  }
  &-course {
    touch-action: none;
    cursor: grab;
  }
  &-course:active:hover {
    touch-action: none;
    cursor: grabbing;
  }
}
</style>

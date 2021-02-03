<template>
  <div class="incompletesubreqcourse">
    <div class="draggable-requirements-wrapper" v-if="displayDescription">
      <div class="separator"></div>
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
      <div v-if="!dataReady && crseInfoObjects.length > 0" class="loading-requirements-courses">
        <vue-skeleton-loader
          v-for="n in defaultNumberofLoadingCards"
          :key="n"
          class="loading-courseWrapper"
          type="rect"
          :width="loadingCoursePixelWidth"
          :height="loadingCoursePixelHeight"
          animation="fade"
          :rounded="true"
        />
      </div>
      <div
        v-if="displayCourses && crseInfoObjects.length > 0"
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
            :uniqueID="course.uniqueID"
            :compact="true"
            :active="false"
            class="requirements-course"
          />
        </div>
      </div>
      <div v-if="subReq.fulfilledBy === 'self-check'">
        <addcoursebutton :compact="true" :shouldClearPadding="true" @click="onAddCourse" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import VueSkeletonLoader from 'skeleton-loader-vue';
import Course from '@/components/Course.vue';
import AddCourseButton from '@/components/AddCourseButton.vue';
import {
  DisplayableRequirementFulfillment,
  SubReqCourseSlot,
  CrseInfo,
} from '@/requirements/types';
import { AppCourse } from '@/user-data';

Vue.component('vue-skeleton-loader', VueSkeletonLoader);
Vue.component('course', Course);
Vue.component('addcoursebutton', AddCourseButton);

type Data = {
  courseObjects: AppCourse[];
  scrollable: boolean;
  displayCourses: boolean;
};

export default Vue.extend({
  mounted() {
    this.$el.addEventListener('touchmove', this.dragListener, { passive: false });
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
    subReqFetchedCourseObjectsNotTakenArray: Array as PropType<AppCourse[]>,
    subReqCoursesArray: Array as PropType<SubReqCourseSlot[]>,
    dataReady: Boolean,
    displayDescription: Boolean,
    lastLoadedShowAllCourseId: Number,
  },
  watch: {
    dataReady: {
      immediate: true,
      handler(dataReady) {
        if (dataReady && this.subReqFetchedCourseObjectsNotTakenArray.length > 0) {
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
    defaultNumberofLoadingCards() {
      return 4;
    },
    loadingCoursePixelWidth() {
      return '160';
    },
    loadingCoursePixelHeight() {
      return '34';
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
        const filteredCourses: AppCourse[] = this.subReqFetchedCourseObjectsNotTakenArray.filter(
          course => crseInfoObject.crseIds.includes(course.crseId)
        );
        const numRemainingCourses = Math.min(
          4 - firstFourCourseObjects.length,
          filteredCourses.length
        );
        firstFourCourseObjects.push(...filteredCourses.slice(0, numRemainingCourses));
      }
      this.courseObjects = firstFourCourseObjects;
    },
    onShowAllCourses() {
      this.$emit('onShowAllCourses', {
        requirementName: this.subReq.requirement.name,
        subReqCoursesArray: this.subReqCoursesArray,
      });
    },
    onAddCourse() {
      const dashboardRef = this.$parent.$parent.$parent.$parent as any;
      dashboardRef.$refs.semesterview.$refs.semester[0].openCourseModal(true);
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

.draggable-requirements,
.loading-requirements {
  &-wrapper {
    margin-top: 0.6rem;
    margin-bottom: 0.6rem;
  }
  &-heading {
    display: flex;
    justify-content: space-between;
    margin-top: 0.2rem;
    &-label {
      font-size: 14px;
      line-height: 17px;
      color: $lightPlaceholderGray;
    }
    &-seeAll {
      font-size: 14px;
      line-height: 15px;
      color: $yuxuanBlue;
      padding: 0.2rem;
      cursor: pointer;
    }
  }

  &-courses {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: -0.2rem;
    margin-bottom: 0.2rem;
    width: 100%;
  }
}

.requirements,
.loading {
  &-courseWrapper {
    padding: 0.2rem;
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

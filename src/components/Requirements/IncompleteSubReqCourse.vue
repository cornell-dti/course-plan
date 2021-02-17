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
      <div v-if="!dataReady && courseIDs.length > 0" class="loading-requirements-courses">
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
      <draggable
        v-if="displayCourses && courseIDs.length > 0"
        class="draggable-requirements-courses"
        group="draggable-semester-courses"
        :value="firstFourCourseObjects"
        @start="onDrag"
        @end="onDrop"
      >
        <div
          v-for="course in firstFourCourseObjects"
          :key="course.uniqueID"
          class="requirements-courseWrapper"
        >
          <course
            v-bind="course"
            :courseObj="course"
            :isReqCourse="true"
            :compact="true"
            :active="false"
            class="requirements-course"
          />
        </div>
      </draggable>
      <div v-if="subReq.fulfilledBy === 'self-check'">
        <add-course-button :compact="true" :shouldClearPadding="true" @click="onAddCourse" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import draggable from 'vuedraggable';
import VueSkeletonLoader from 'skeleton-loader-vue';
import Course from '@/components/Course.vue';
import AddCourseButton from '@/components/AddCourseButton.vue';

export default Vue.extend({
  components: { draggable, AddCourseButton, Course, VueSkeletonLoader },
  mounted() {
    this.$el.addEventListener('touchmove', this.dragListener, { passive: false });
  },
  data() {
    return {
      scrollable: false,
      displayCourses: false,
    };
  },
  beforeDestroy() {
    this.$el.removeEventListener('touchmove', this.dragListener);
  },
  props: {
    subReq: { type: Object as PropType<RequirementFulfillment>, required: true },
    subReqCourseId: { type: Number, required: true },
    courseIDs: { type: Array as PropType<readonly (readonly number[])[]>, required: true },
    subReqFetchedCourseObjectsNotTakenArray: {
      type: Array as PropType<FirestoreSemesterCourse[]>,
      required: true,
    },
    dataReady: { type: Boolean, required: true },
    displayDescription: { type: Boolean, required: true },
    lastLoadedShowAllCourseId: { type: Number, required: true },
  },
  watch: {
    dataReady: {
      immediate: true,
      handler(dataReady) {
        if (dataReady && this.subReqFetchedCourseObjectsNotTakenArray.length > 0) {
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
      const allCrseIds = this.courseIDs.flat();
      return allCrseIds.length > 4;
    },
    firstFourCourseObjects(): readonly FirestoreSemesterCourse[] {
      const firstFourCourseObjects: FirestoreSemesterCourse[] = [];
      for (let i = 0; firstFourCourseObjects.length < 4 && i < this.courseIDs.length; i += 1) {
        const currentSlotCourseIDs = this.courseIDs[i];
        const filteredCourses: FirestoreSemesterCourse[] = this.subReqFetchedCourseObjectsNotTakenArray.filter(
          course => currentSlotCourseIDs.includes(course.crseId)
        );
        const numRemainingCourses = Math.min(
          4 - firstFourCourseObjects.length,
          filteredCourses.length
        );
        firstFourCourseObjects.push(...filteredCourses.slice(0, numRemainingCourses));
      }
      return firstFourCourseObjects;
    },
  },
  methods: {
    onDrag() {
      this.scrollable = true;
    },
    onDrop() {
      this.scrollable = true;
    },
    dragListener(event: { preventDefault: () => void }) {
      if (!this.scrollable) event.preventDefault();
    },
    onShowAllCourses() {
      this.$emit('onShowAllCourses');
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

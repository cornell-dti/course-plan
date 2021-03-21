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
      <draggable
        v-if="courses.length > 0"
        class="draggable-requirements-courses"
        :group="{ name: 'draggable-semester-courses', put: false }"
        :value="courses"
        :clone="cloneCourse"
        @start="onDrag"
        @end="onDrop"
      >
        <div v-for="(course, index) in courses" :key="index" class="requirements-courseWrapper">
          <course
            :courseObj="course"
            :isReqCourse="true"
            :compact="true"
            :active="false"
            class="requirements-course"
          />
        </div>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import draggable from 'vuedraggable';
import Course from '@/components/Course/Course.vue';
import { incrementUniqueID } from '@/global-firestore-data';

export default Vue.extend({
  components: { draggable, Course },
  mounted() {
    this.$el.addEventListener('touchmove', this.dragListener, { passive: false });
  },
  data() {
    return {
      scrollable: false,
    };
  },
  beforeDestroy() {
    this.$el.removeEventListener('touchmove', this.dragListener);
  },
  props: {
    subReq: { type: Object as PropType<RequirementFulfillment>, required: true },
    subReqCourseId: { type: Number, required: true },
    courses: { type: Array as PropType<readonly FirestoreSemesterCourse[]>, required: true },
    showSeeAllLabel: { type: Boolean, required: true },
    displayDescription: { type: Boolean, required: true },
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
    cloneCourse(courseWithDummyUniqueID: FirestoreSemesterCourse): FirestoreSemesterCourse {
      return { ...courseWithDummyUniqueID, uniqueID: incrementUniqueID() };
    },
    onShowAllCourses() {
      this.$emit('onShowAllCourses', this.subReqCourseId);
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
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
    &-label {
      font-size: 14px;
      line-height: 17px;
      color: $lightPlaceholderGray;
    }
    &-seeAll {
      font-size: 14px;
      line-height: 15px;
      color: $yuxuanBlue;
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

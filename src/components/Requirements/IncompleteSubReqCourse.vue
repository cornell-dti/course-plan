<template>
  <div class="incompletesubreqcourse" v-if="courses.length > 0">
    <div class="draggable-requirements-wrapper" v-if="displayDescription">
      <div class="separator"></div>
      <div class="draggable-requirements-heading">
        <div class="draggable-requirements-heading-label">{{ addCourseLabel }}</div>
        <button
          v-if="showSeeAllLabel"
          class="draggable-requirements-heading-seeAll"
          @click="onShowAllCourses"
        >
          {{ seeAll }}
        </button>
      </div>
      <draggable
        class="draggable-requirements-courses"
        :group="{ name: 'draggable-semester-courses', put: false }"
        :modelValue="courses"
        :clone="cloneCourse"
        item-key="code"
        @start="onDrag"
        @end="onDrop"
      >
        <template #item="{ element }">
          <div class="requirements-courseWrapper">
            <course
              :courseObj="element"
              :isReqCourse="true"
              :compact="true"
              :active="false"
              class="requirements-course"
              :isSemesterCourseCard="true"
            />
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import draggable from 'vuedraggable';
import Course from '@/components/Course/Course.vue';
import { incrementUniqueID } from '@/global-firestore-data';
import { GTagEvent } from '@/gtag';

export default defineComponent({
  components: { draggable, Course },
  mounted() {
    this.$el.addEventListener('touchmove', this.dragListener, { passive: false });
  },
  data() {
    return {
      scrollable: false,
    };
  },
  beforeUnmount() {
    this.$el.removeEventListener('touchmove', this.dragListener);
  },
  props: {
    subReq: { type: Object as PropType<RequirementFulfillment>, required: true },
    slotName: { type: String, required: true },
    courses: {
      type: Array as PropType<readonly AppFirestoreSemesterCourseWithRequirementID[]>,
      required: true,
    },
    showSeeAllLabel: { type: Boolean, required: true },
    displayDescription: { type: Boolean, required: true },
  },
  emits: ['onShowAllCourses'],
  computed: {
    addCourseLabel(): string {
      let label = 'Add Course';
      if (this.subReq.fulfillment.fulfilledBy === 'courses') {
        label = `Add ${this.slotName}`;
      }
      return label;
    },
    defaultNumberofLoadingCards(): number {
      return 4;
    },
    loadingCoursePixelWidth(): string {
      return '160';
    },
    loadingCoursePixelHeight(): string {
      return '34';
    },
    seeAll(): string {
      return 'See all >';
    },
    coursesWithoutRequirementID(): readonly FirestoreSemesterCourse[] {
      return this.courses.map(({ requirementID: _, ...rest }) => rest);
    },
  },
  methods: {
    onDrag() {
      this.scrollable = true;
    },
    onDrop() {
      this.scrollable = true;
      GTagEvent(this.$gtag, 'requirements-bar-course-drag-and-drop');
    },
    dragListener(event: { preventDefault: () => void }) {
      if (!this.scrollable) event.preventDefault();
    },
    cloneCourse(
      courseWithDummyUniqueID: AppFirestoreSemesterCourseWithRequirementID
    ): AppFirestoreSemesterCourseWithRequirementID {
      return { ...courseWithDummyUniqueID, uniqueID: incrementUniqueID() };
    },
    onShowAllCourses() {
      this.$emit('onShowAllCourses');
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
      white-space: nowrap;
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
    width: 10.25rem;
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

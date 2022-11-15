<template>
  <div class="incompletesubreqcourse" v-if="courses.length > 0">
    <replace-course-modal
      v-if="replaceModalVisible"
      @close-replace-course-modal="onReplaceCourseModalClose"
    />
    <div class="draggable-requirements-wrapper" v-if="displayDescription">
      <div class="separator"></div>
      <div class="draggable-requirements-heading">
        <div class="draggable-requirements-heading-label">{{ addCourseLabel }}</div>
        <button
          class="reqCourse-button"
          @click="openReplaceSlotMenu"
          data-cyId="gear-incomplete-subreq"
        ></button>
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
            />
          </div>
        </template>
      </draggable>
    </div>
    <replace-slot-menu
      v-if="replaceSlotMenuOpen"
      :position="replaceSlotMenuPosition"
      @close-slot-menu="closeReplaceSlotMenu"
      @open-replace-slot-modal="onReplaceModalOpen"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import draggable from 'vuedraggable';
import Course from '@/components/Course/Course.vue';
import incrementUniqueID from '@/global-firestore-data/user-unique-incrementer';
import { GTagEvent } from '@/gtag';
import ReplaceSlotMenu from '@/components/Modals/ReplaceSlotMenu.vue';
import ReplaceCourseModal from '@/components/Modals/ReplaceCourseModal.vue';

export default defineComponent({
  components: { draggable, Course, ReplaceSlotMenu, ReplaceCourseModal },
  data: () => ({
    replaceModalVisible: false,
    scrollable: false,
    replaceSlotMenuOpen: false,
    mousePosition: { x: 0, y: 0 },
  }),
  mounted() {
    this.$el.addEventListener('touchmove', this.dragListener, { passive: false });
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
    replaceSlotMenuPosition(): { x: number; y: number } {
      return window.innerWidth > 863
        ? { x: this.mousePosition.x + 10, y: this.mousePosition.y - 14 }
        : { x: this.mousePosition.x - 120, y: this.mousePosition.y - 7 };
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
    onReplaceModalOpen(): void {
      this.replaceModalVisible = true;
    },
    onReplaceCourseModalClose(): void {
      this.replaceModalVisible = false;
    },
    openReplaceSlotMenu(e: MouseEvent) {
      this.mousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
      this.replaceSlotMenuOpen = true;
    },
    closeReplaceSlotMenu() {
      this.replaceSlotMenuOpen = false;
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

.reqCourse-button {
  padding: 0 0.5rem 0rem;
  cursor: pointer;
  background: url('@/assets/images/gear.svg') no-repeat;
  &:hover {
    background: url('@/assets/images/settingsBlue.svg') no-repeat;
  }
}
</style>

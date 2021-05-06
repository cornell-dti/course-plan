<template>
  <div
    class="semester"
    :class="{ 'semester--compact': compact }"
    data-intro-group="pageTour"
    data-step="3"
    :data-intro="walkthroughText()"
    data-disable-interaction="1"
    data-tooltipClass="tooltipCenter"
  >
    <new-course-modal
      class="semester-modal"
      v-model="isCourseModalOpen"
      v-if="isCourseModalOpen"
      @add-course="addCourse"
    />
    <confirmation
      class="confirmation-modal"
      :text="confirmationText"
      v-model="isConfirmationOpen"
      v-if="isConfirmationOpen"
    />
    <delete-semester
      class="semester-modal"
      @delete-semester="deleteSemester"
      :deleteSemType="type"
      :deleteSemYear="year"
      ref="deletesemester"
      v-model="isDeleteSemesterOpen"
      v-if="isDeleteSemesterOpen"
    />
    <edit-semester
      class="semester-modal"
      @edit-semester="editSemester"
      :deleteSemType="type"
      :deleteSemYear="year"
      ref="modalBodyComponent"
      v-model="isEditSemesterOpen"
      v-if="isEditSemesterOpen"
    />
    <button v-if="isFirstSem" class="semester-addSemesterButton" @click="openSemesterModal">
      + New Semester
    </button>
    <div class="semester-content">
      <div class="semester-top" :class="{ 'semester-top--compact': compact }">
        <div class="semester-left" :class="{ 'semester-left--compact': compact }">
          <span class="semester-name"
            ><img class="season-emoji" :src="seasonImg[type]" alt="" /> {{ type }} {{ year }}</span
          >
          <span class="semester-credits">{{ creditString }}</span>
        </div>
        <div class="semester-right" :class="{ 'semester-right--compact': compact }">
          <button class="semester-dotRow" @click="openSemesterMenu">
            <img src="@/assets/images/dots/threeDots.svg" alt="open menu for semester" />
          </button>
        </div>
      </div>
      <div class="semester-courses">
        <draggable
          ref="droppable"
          class="draggable-semester-courses"
          group="draggable-semester-courses"
          v-model="coursesForDraggable"
          item-key="uniqueID"
          :componentData="{ style: { height: courseContainerHeight + 'rem' } }"
          @start="onDragStart"
          @sort="onDropped"
          @end="onDragEnd"
        >
          <template #item="{ element }">
            <div class="semester-courseWrapper">
              <course
                :courseObj="element"
                :isReqCourse="false"
                :compact="compact"
                :active="activatedCourse.uniqueID === element.uniqueID"
                class="semester-course"
                :semesterIndex="semesterIndex + 1"
                @delete-course="deleteCourse"
                @color-course="colorCourse"
                @course-on-click="courseOnClick"
                @edit-course-credit="editCourseCredit"
              />
            </div>
          </template>
        </draggable>
        <add-course-button :compact="compact" @click="openCourseModal" />
      </div>
    </div>
    <semester-menu
      v-if="semesterMenuOpen"
      class="semester-menu"
      @open-delete-semester-modal="openDeleteSemesterModal"
      @open-edit-semester-modal="openEditSemesterModal"
      v-click-outside="closeSemesterMenuIfOpen"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import draggable from 'vuedraggable';
import Course from '@/components/Course/Course.vue';
import NewCourseModal from '@/components/Modals/NewCourse/NewCourseModal.vue';
import Confirmation from '@/components/Modals/Confirmation.vue';
import SemesterMenu from '@/components/Modals/SemesterMenu.vue';
import DeleteSemester from '@/components/Modals/DeleteSemester.vue';
import EditSemester from '@/components/Modals/EditSemester.vue';
import AddCourseButton from '@/components/AddCourseButton.vue';

import { clickOutside } from '@/utilities';

import fall from '@/assets/images/fallEmoji.svg';
import spring from '@/assets/images/springEmoji.svg';
import winter from '@/assets/images/winterEmoji.svg';
import summer from '@/assets/images/summerEmoji.svg';
import {
  editSemester,
  addCourseToSemester,
  deleteCourseFromSemester,
  addCourseToSelectableRequirements,
} from '@/global-firestore-data';
import { cornellCourseRosterCourseToFirebaseSemesterCourse } from '@/user-data-converter';

type ComponentRef = { $el: HTMLDivElement };

export default defineComponent({
  components: {
    draggable,
    AddCourseButton,
    Confirmation,
    Course,
    DeleteSemester,
    EditSemester,
    NewCourseModal,
    SemesterMenu,
  },
  data() {
    return {
      confirmationText: '',
      isConfirmationOpen: false,
      scrollable: true,
      semesterMenuOpen: false,
      stopCloseFlag: false,

      isDeleteSemesterOpen: false,
      isEditSemesterOpen: false,
      // Keep track of how many levels has a card enters in the droppable zone.
      // Inspired by https://stackoverflow.com/a/21002544
      isShadowCounter: 0,
      isDraggedFrom: false,
      isCourseModalOpen: false,

      seasonImg: {
        Fall: fall,
        Spring: spring,
        Winter: winter,
        Summer: summer,
      },
    };
  },
  props: {
    semesterIndex: { type: Number, required: true },
    type: {
      type: String as PropType<FirestoreSemesterType>,
      required: true,
    },
    year: { type: Number, required: true },
    courses: {
      type: Array as PropType<readonly FirestoreSemesterCourse[]>,
      required: true,
    },
    compact: { type: Boolean, required: true },
    activatedCourse: {
      type: Object as PropType<FirestoreSemesterCourse>,
      required: true,
    },
    isFirstSem: { type: Boolean, required: true },
  },
  emits: {
    'new-semester': () => true,
    'course-onclick': (course: FirestoreSemesterCourse) => typeof course === 'object',
    'delete-semester': (type: string, year: number) =>
      typeof type === 'string' && typeof year === 'number',
  },
  mounted() {
    this.$el.addEventListener('touchmove', this.dragListener, {
      passive: false,
    });
    const droppable = (this.$refs.droppable as ComponentRef).$el;
    droppable.addEventListener('dragenter', this.onDragEnter);
    droppable.addEventListener('dragleave', this.onDragExit);
  },
  beforeUnmount() {
    this.$el.removeEventListener('touchmove', this.dragListener);
    const droppable = (this.$refs.droppable as ComponentRef).$el;
    droppable.removeEventListener('dragenter', this.onDragEnter);
    droppable.removeEventListener('dragleave', this.onDragExit);
  },

  computed: {
    coursesForDraggable: {
      get(): readonly FirestoreSemesterCourse[] {
        return this.courses;
      },
      set(newCourses: readonly AppFirestoreSemesterCourseWithRequirementID[]) {
        const courses = newCourses.map(({ requirementID: _, ...rest }) => rest);
        editSemester(
          this.year,
          this.type,
          (semester: FirestoreSemester): FirestoreSemester => ({
            ...semester,
            courses,
          })
        );
        newCourses.forEach(({ uniqueID, requirementID }) =>
          addCourseToSelectableRequirements(uniqueID, requirementID)
        );
      },
    },
    // Add space for a course if there is a "shadow" of it, decrease if it is from the current sem
    courseContainerHeight(): number {
      let factor = 6.1;
      let extraIncrementer = 0;
      if (this.isShadowCounter > 0) {
        extraIncrementer += 1;
      }
      if (this.isDraggedFrom) {
        extraIncrementer -= 1;
      }
      if (this.compact) {
        factor = 2.6;
      }
      return (this.courses.length + 1 + extraIncrementer) * factor;
    },
    creditString() {
      let credits = 0;
      this.courses.forEach(course => {
        credits += course.credits;
      });
      if (credits === 1) {
        return `${credits.toString()} credit`;
      }
      return `${credits.toString()} credits`;
    },
    // Note: Currently not used
    deleteDuplicateCourses(): readonly FirestoreSemesterCourse[] {
      const uniqueCoursesNames: string[] = [];
      const uniqueCourses: FirestoreSemesterCourse[] = [];
      this.courses.forEach(course => {
        if (uniqueCoursesNames.indexOf(course.name) === -1) {
          uniqueCourses.push(course);
          uniqueCoursesNames.push(course.name);
        }
      });
      return uniqueCourses;
    },
  },
  methods: {
    onDragStart() {
      this.isDraggedFrom = true;
      this.scrollable = true;
      this.isShadowCounter = 0;
    },
    onDragEnter() {
      this.isShadowCounter += 1;
    },
    onDragExit() {
      this.isShadowCounter -= 1;
    },
    onDropped() {
      this.isShadowCounter = 0;
    },
    onDragEnd() {
      this.isShadowCounter = 0;
      this.scrollable = false;
      this.isDraggedFrom = false;
    },
    openCourseModal() {
      // Delete confirmation for the use case of adding multiple courses consecutively
      this.closeConfirmationModal();
      this.isCourseModalOpen = !this.isCourseModalOpen;
    },
    openSemesterModal() {
      // Delete confirmation for the use case of adding multiple semesters consecutively
      this.closeConfirmationModal();

      this.$emit('new-semester');
    },
    openConfirmationModal(msg: string) {
      // Set text and display confirmation modal, then have it disappear after 3 seconds
      this.confirmationText = msg;
      this.isConfirmationOpen = true;

      setTimeout(() => {
        this.closeConfirmationModal();
      }, 3000);
    },
    closeConfirmationModal() {
      this.isConfirmationOpen = false;
    },
    addCourse(data: CornellCourseRosterCourse, requirementID: string) {
      const newCourse = cornellCourseRosterCourseToFirebaseSemesterCourse(data);
      addCourseToSemester(this.type, this.year, newCourse, requirementID, this.$gtag);

      const courseCode = `${data.subject} ${data.catalogNbr}`;
      this.openConfirmationModal(`Added ${courseCode} to ${this.type} ${this.year}`);
    },
    deleteCourse(courseCode: string, uniqueID: number) {
      deleteCourseFromSemester(this.type, this.year, uniqueID, this.$gtag);
      // Update requirements menu
      this.openConfirmationModal(`Removed ${courseCode} from ${this.type} ${this.year}`);
    },
    colorCourse(color: string, uniqueID: number) {
      editSemester(
        this.year,
        this.type,
        (semester: FirestoreSemester): FirestoreSemester => ({
          ...semester,
          courses: this.courses.map(course =>
            course.uniqueID === uniqueID ? { ...course, color } : course
          ),
        })
      );
    },
    courseOnClick(course: FirestoreSemesterCourse) {
      this.$emit('course-onclick', course);
    },
    editCourseCredit(credit: number, uniqueID: number) {
      editSemester(
        this.year,
        this.type,
        (semester: FirestoreSemester): FirestoreSemester => ({
          ...semester,
          courses: this.courses.map(course =>
            course.uniqueID === uniqueID ? { ...course, credits: credit } : course
          ),
        })
      );
    },
    dragListener(event: Event) {
      if (!this.$data.scrollable) event.preventDefault();
    },
    openSemesterMenu() {
      this.stopCloseFlag = true;
      this.semesterMenuOpen = true;
    },
    closeSemesterMenuIfOpen() {
      if (this.stopCloseFlag) {
        this.stopCloseFlag = false;
      } else if (this.semesterMenuOpen) {
        this.semesterMenuOpen = false;
      }
    },
    openDeleteSemesterModal() {
      this.isDeleteSemesterOpen = true;
    },
    deleteSemester(type: string, year: number) {
      this.$emit('delete-semester', type, year);
      this.openConfirmationModal(`Deleted ${type} ${year} from plan`);
    },
    openEditSemesterModal() {
      this.isEditSemesterOpen = true;
    },
    editSemester(seasonInput: string, yearInput: number) {
      editSemester(
        this.year,
        this.type,
        (oldSemester: FirestoreSemester): FirestoreSemester => ({
          ...oldSemester,
          type: seasonInput as FirestoreSemesterType,
          year: yearInput,
        })
      );
    },
    walkthroughText() {
      return `<div class="introjs-tooltipTop"><div class="introjs-customTitle">Add Classes to your Schedule</div><div class="introjs-customProgress">3/4</div>
      </div><div class = "introjs-bodytext">Press "+ Course" to add classes! Edit semesters using the ellipses on the top right and drag courses between semesters.</div>`;
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.semester {
  width: 24rem;
  box-sizing: border-box;
  position: relative;
  border-radius: 11px;

  &-addSemesterButton {
    background: $sangBlue;
    border-radius: 8px;
    min-height: 2.5rem;
    min-width: 9rem;
    color: $white;
    border: none;
    position: absolute;
    top: -3.3rem;
    font-size: 16px;
  }

  &-content {
    padding: 0.875rem 0;
    border: 2px solid $borderGray;
    border-radius: 11px;
  }

  &--compact {
    width: 16rem;
    padding: 0.875rem 1.125rem;
  }

  &-confirmation {
    top: 16px;
    display: none;
  }

  &-top {
    display: flex;
    justify-content: space-between;
    color: $medGray;
    margin-left: 1.125rem;
    margin-right: 1.125rem;
  }

  &-left {
    display: flex;
    flex-direction: column;

    &--compact {
      justify-content: space-between;
    }
  }

  &-right {
    &--compact {
      margin-top: 0.25rem;
    }
  }

  &-dotRow {
    padding: 8px 0;
    display: flex;
    position: relative;
    &:hover,
    &:active,
    &:focus {
      cursor: pointer;
    }
  }

  &-menu {
    position: absolute;
    right: -3rem;
    top: 2rem;
    z-index: 1;
  }

  &-name {
    font-size: 18px;
    line-height: 18px;
    margin-right: 0.5rem;
    font-weight: bold;
  }

  &-icon {
    width: 14px;
    height: 14px;
  }

  &-credits {
    font-size: 14px;
    line-height: 17px;
  }

  &-courseWrapper {
    margin: 0.5rem 0 0.5rem 0;
  }

  &-course {
    touch-action: none;
    cursor: grab;
  }

  &-course:active:hover {
    touch-action: none;
    cursor: grabbing;
  }

  .season-emoji {
    height: 18px;
    margin-top: -4px;
  }

  /* The Modal (background) */
  .semester-modal {
    display: none;
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }

  .draggable-semester-courses {
    padding-top: 5px;
    padding-left: 1.125rem;
    padding-right: 1.125rem;
  }

  .semester-modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 2; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

    &--block {
      display: block;
    }
  }

  .modal {
    &--block {
      display: block;
    }
  }
}

@media only screen and (max-width: $medium-breakpoint) {
  .semester {
    width: 16rem;

    &-menu {
      right: 0rem;
    }
  }
}

@media only screen and (max-width: $small-breakpoint) {
  .semester,
  .semester--compact {
    width: calc(100vw - 4rem);
    padding: 0;
  }
}
</style>

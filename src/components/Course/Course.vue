<template>
  <div :class="{ 'course--min': compact, active: active }" class="course">
    <div class="course-color" :style="cssVars" :class="{ 'course-color--active': active }">
      <img src="@/assets/images/dots/sixDots.svg" alt="" />
    </div>
    <div class="course-content" @click="courseOnClick()">
      <div class="course-main">
        <div class="course-top">
          <div class="course-code">{{ courseObj.code }}</div>
          <button v-if="!isReqCourse" class="course-dotRow" @click="openMenu">
            <img src="@/assets/images/dots/threeDots.svg" alt="open menu for course card" />
          </button>
        </div>
        <div v-if="!compact" class="course-name">{{ courseObj.name }}</div>
        <div v-if="!compact" class="course-info">
          <span class="course-credits">{{ creditString }}</span>
          <span v-if="semesterString" class="course-semesters">{{ semesterString }}</span>
          <course-caution v-if="!isReqCourse" :course="courseObj" />
        </div>
      </div>
    </div>
    <course-menu
      v-if="menuOpen"
      :semesterIndex="semesterIndex"
      :isCompact="compact"
      @delete-course="deleteCourse"
      @color-course="colorCourse"
      @edit-course-credit="editCourseCredit"
      :getCreditRange="getCreditRange || []"
      v-click-outside="closeMenuIfOpen"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import CourseMenu from '@/components/Modals/CourseMenu.vue';
import CourseCaution from '@/components/Course/CourseCaution.vue';
import {
  addCourseToBottomBar,
  reportCourseColorChange,
} from '@/components/BottomBar/BottomBarState';
import { clickOutside } from '@/utilities';

export default defineComponent({
  components: { CourseCaution, CourseMenu },
  props: {
    courseObj: { type: Object as PropType<FirestoreSemesterCourse>, required: true },
    compact: { type: Boolean, required: true },
    active: { type: Boolean, required: true },
    isReqCourse: { type: Boolean, required: true },
    semesterIndex: { type: Number, required: false, default: 0 },
  },
  emits: {
    'delete-course': (code: string, uniqueID: number) =>
      typeof code === 'string' && typeof uniqueID === 'number',
    'color-course': (color: string, uniqueID: number) =>
      typeof color === 'string' && typeof uniqueID === 'number',
    'course-on-click': (course: FirestoreSemesterCourse) => typeof course === 'object',
    'edit-course-credit': (credit: number, uniqueID: number) =>
      typeof credit === 'number' && typeof uniqueID === 'number',
  },
  data() {
    return {
      menuOpen: false,
      stopCloseFlag: false,
      getCreditRange: this.courseObj.creditRange,
    };
  },
  computed: {
    semesterString(): string {
      let semesterString = '';
      this.courseObj.semesters.forEach(semester => {
        semesterString += `${semester}, `;
      });
      if (semesterString.length > 0) {
        return semesterString.substring(0, semesterString.length - 2);
      }

      return semesterString;
    },

    creditString(): string {
      if (this.courseObj.credits === 1) {
        return `${this.courseObj.credits} credit`;
      }
      return `${this.courseObj.credits} credits`;
    },

    cssVars(): { '--bg-color': string } {
      return {
        '--bg-color': `#${this.courseObj.color}`,
      };
    },
  },
  methods: {
    openMenu() {
      this.stopCloseFlag = true;
      this.menuOpen = true;
    },
    closeMenuIfOpen() {
      if (this.stopCloseFlag) {
        this.stopCloseFlag = false;
      } else if (this.menuOpen) {
        this.menuOpen = false;
      }
    },
    deleteCourse() {
      this.$emit('delete-course', this.courseObj.code, this.courseObj.uniqueID);
      this.closeMenuIfOpen();
    },
    colorCourse(color: string) {
      this.$emit('color-course', color, this.courseObj.uniqueID);
      reportCourseColorChange(this.courseObj.uniqueID, color);
      this.closeMenuIfOpen();
    },
    courseOnClick() {
      if (!this.menuOpen) {
        this.$emit('course-on-click', this.courseObj);
        addCourseToBottomBar(this.courseObj);
      }
    },
    editCourseCredit(credit: number) {
      this.$emit('edit-course-credit', credit, this.courseObj.uniqueID);
      this.closeMenuIfOpen();
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
});
</script>

<style scoped lang="scss">
// TODO: font families
@import '@/assets/scss/_variables.scss';

$colored-grabber-width: 1.25rem;

.course {
  box-sizing: border-box;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  background-color: $white;
  box-shadow: 0px 0px 10px 4px $boxShadowGray;
  position: relative;
  height: 5.625rem;
  touch-action: none;
  cursor: grab;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:active:hover {
    touch-action: none;
    cursor: grabbing;
  }

  &--min {
    height: 2.125rem;

    & .course-content {
      padding: 0 0.5em;
    }
  }

  &-main {
    width: 100%;
  }

  &-color {
    width: $colored-grabber-width;
    border-radius: 0.42rem 0 0 0.42rem;
    background-color: var(--bg-color);
    display: flex;
    align-items: center;
    justify-content: center;
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

  &-content {
    width: calc(100% - #{$colored-grabber-width});
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-top {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  &-code {
    flex: 1 1 auto;
    font-size: 14px;
    line-height: 17px;
    color: $primaryGray;
  }

  &-name {
    font-size: 16px;
    line-height: 19px;
    color: $primaryGray;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-info {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    display: flex;
    align-items: center;
  }

  &-credits {
    white-space: nowrap;
  }

  &-semesters {
    margin-left: 0.2rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &:before {
      margin-right: 0.2rem;
      font-style: normal;
      content: '|';
    }
  }

  &-buttons {
    display: flex;
    justify-content: space-around;
    margin: 0.5rem;
  }
}

.active {
  border: 1px solid $yuxuanBlue;
}
</style>

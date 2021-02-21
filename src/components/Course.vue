<template>
  <div :class="{ 'course--min': compact, active: active }" class="course" @click="courseOnClick()">
    <div class="course-color" :style="cssVars" :class="{ 'course-color--active': active }">
      <img src="@/assets/images/dots/sixDots.svg" alt="dots" />
    </div>
    <div class="course-content">
      <div class="course-main">
        <div class="course-top">
          <div class="course-code">{{ courseObj.code }}</div>
          <div v-if="!isReqCourse" class="course-dotRow" @click="openMenu">
            <img src="@/assets/images/dots/threeDots.svg" alt="dots" />
          </div>
        </div>
        <div v-if="!compact" class="course-name">{{ courseObj.name }}</div>
        <div class="course-info">
          <span v-if="!compact" class="course-credits">{{ creditString }}</span>
          <span v-if="!compact && semesterString" class="course-semesters">{{
            semesterString
          }}</span>
          <course-caution v-if="cautionString" :compact="compact" :cautionString="cautionString" />
        </div>
      </div>
    </div>
    <course-menu
      v-if="menuOpen"
      :semesterIndex="semesterIndex"
      :isCompact="compact"
      class="course-menu"
      @delete-course="deleteCourse"
      @color-course="colorCourse"
      @edit-course-credit="editCourseCredit"
      :getCreditRange="getCreditRange"
      v-click-outside="closeMenuIfOpen"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import CourseMenu from '@/components/Modals/CourseMenu.vue';
import CourseCaution from '@/components/CourseCaution.vue';
import {
  addCourseToBottomBar,
  reportCourseColorChange,
} from '@/components/BottomBar/BottomBarState';
import { clickOutside } from '@/utilities';

export default Vue.extend({
  components: { CourseCaution, CourseMenu },
  props: {
    courseObj: {
      type: Object as PropType<FirestoreSemesterCourse>,
      required: true,
    },
    duplicatedCourseCodeList: {
      type: Array as PropType<readonly string[]>,
      required: false,
      default: null,
    },
    compact: { type: Boolean, required: true },
    active: { type: Boolean, required: true },
    isReqCourse: { type: Boolean, required: true },
    semesterIndex: { type: Number, required: false, default: 0 },
  },
  data() {
    return {
      menuOpen: false,
      stopCloseFlag: false,
      getCreditRange: this.courseObj.creditRange,
    };
  },
  computed: {
    cautionString(): string | null {
      if (this.duplicatedCourseCodeList == null) return null;
      return this.duplicatedCourseCodeList.includes(this.courseObj.code) ? 'Duplicate' : null;
    },
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
    review(): string {
      const [subject, number] = this.courseObj.code;
      return `https://www.cureviews.org/course/${subject}/${number}`;
    },

    roster(): string {
      const [subject, number] = this.courseObj.code;
      return `https://classes.cornell.edu/browse/roster/FA18/class/${subject}/${number}`;
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

.course {
  width: 21.375rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  background-color: $white;
  box-shadow: 0px 0px 10px 4px $boxShadowGray;
  position: relative;
  height: 5.625rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &--min {
    width: 10rem;
    height: 2.125rem;

    & .course-content {
      margin: 0 0.5em;
    }
  }

  &-main {
    width: 100%;
  }

  &-color {
    width: 1.25rem;
    border-radius: 0.42rem 0 0 0.42rem;
    background-color: var(--bg-color);
    display: flex;
    align-items: center;
    justify-content: center;

    &--active {
      width: 1.188rem;
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

  &-content {
    flex: 1 1 auto;
    margin: 0 1rem;
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
    width: 18rem;

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
    max-width: 14rem;

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

  &-menu {
    position: absolute;
    right: -3rem;
    top: 2rem;
    z-index: 1;
  }
}

.active {
  border: 1px solid $yuxuanBlue;
}

@media only screen and (max-width: $medium-breakpoint) {
  .course {
    width: 17rem;
    &--min {
      width: 10rem;
      height: 2.125rem;
    }
    &-color {
      &--active {
        width: 1.188rem;
      }
    }

    &-name {
      width: 14rem;
    }

    &-menu {
      right: -1rem;
    }
  }
}
</style>

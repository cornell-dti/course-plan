<template>
  <div :class="{ 'course--min': compact, active: active }" class="course" @click="updateBar()">
    <div
      class="course-color"
      :style="cssVars"
      :class="{ 'course-color--active': active, 'course-color--min': compact }"
    >
      <img src="@/assets/images/dots/sixDots.svg" alt="dots" />
    </div>
    <div :class="{ 'course-content--min': compact }" class="course-content">
      <div :class="{ 'course-main--min': compact }" class="course-main">
        <div :class="{ 'course-top--min': compact }" class="course-top">
          <div :class="{ 'course-code--min': compact }" class="course-code">
            {{ subject }} {{ number }}
          </div>
          <div v-if="!isReqCourse" class="course-dotRow" @click="openMenu">
            <img src="@/assets/images/dots/threeDots.svg" alt="dots" />
          </div>
        </div>
        <div v-if="!compact" class="course-name">{{ name }}</div>
        <div class="course-info">
          <span v-if="!compact" class="course-credits">{{ creditString }}</span>
          <span v-if="!compact && semesterString" class="course-semesters">{{
            semesterString
          }}</span>
          <course-caution v-if="cautionString" :compact="compact" :cautionString="cautionString" />
        </div>
      </div>
    </div>
    <coursemenu
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
import { clickOutside } from '@/utilities';
import { AppCourse } from '@/user-data';

Vue.component('coursemenu', CourseMenu);
Vue.component('course-caution', CourseCaution);

export default Vue.extend({
  props: {
    courseObj: Object as PropType<AppCourse>,
    subject: String,
    number: String,
    name: String,
    credits: Number,
    creditRange: (Array as PropType<readonly number[]>) as PropType<readonly [number, number]>,
    prereqs: String,
    semesters: Array,
    color: String,
    duplicatedCourseCodeList: {
      required: false,
      type: Array,
    },
    compact: Boolean,
    uniqueID: Number,
    active: Boolean,
    semesterIndex: Number,
    isReqCourse: Boolean,
  },
  data() {
    return {
      menuOpen: false,
      stopCloseFlag: false,
      getCreditRange: this.creditRange,
      colorJustChanged: false,
    };
  },
  computed: {
    cautionString(): string | null {
      if (this.duplicatedCourseCodeList == null) return null;
      return this.duplicatedCourseCodeList.includes(`${this.subject} ${this.number}`)
        ? 'Duplicate'
        : null;
    },
    semesterString(): string {
      let semesterString = '';
      this.semesters.forEach(semester => {
        semesterString += `${semester}, `;
      });
      if (semesterString.length > 0) {
        return semesterString.substring(0, semesterString.length - 2);
      }

      return semesterString;
    },

    creditString(): string {
      if (this.credits === 1) {
        return `${this.credits} credit`;
      }
      return `${this.credits} credits`;
    },
    review(): string {
      return `https://www.cureviews.org/course/${this.subject}/${this.number}`;
    },

    roster(): string {
      return `https://classes.cornell.edu/browse/roster/FA18/class/${this.subject}/${this.number}`;
    },

    cssVars(): { '--bg-color': string } {
      return {
        '--bg-color': `#${this.color}`,
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
      this.$emit('delete-course', this.subject, this.number, this.uniqueID);
      this.closeMenuIfOpen();
    },
    colorCourse(color: string) {
      this.$emit('color-course', color, this.uniqueID);
      this.closeMenuIfOpen();
      this.colorJustChanged = true;
    },
    updateBar() {
      if (!this.menuOpen) {
        this.$emit('updateBar', this.courseObj, this.colorJustChanged, this.color);
      }
      this.colorJustChanged = false;
    },
    editCourseCredit(credit: number) {
      this.$emit('edit-course-credit', credit, this.uniqueID);
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
  }

  &-main {
    &--min {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
    }
  }

  &-color {
    width: 1.25rem;
    height: 5.625rem;
    border-radius: 0.42rem 0 0 0.42rem;
    background-color: var(--bg-color);
    display: flex;
    align-items: center;
    justify-content: center;

    &--active {
      width: 19px;
      height: 5.5rem;
    }

    &--min {
      height: 2.125rem;

      &.course-color--active {
        height: 2rem;
      }
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
    width: 18rem;
    margin: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &--min {
      width: 9.25rem;
      margin-bottom: 0;
      margin-top: 0;
      margin-right: 0.5rem;
      margin-left: 0.5rem;
    }
  }

  &-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &--min {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  }

  &-code {
    font-size: 14px;
    line-height: 17px;
    color: $primaryGray;

    &--min {
      color: $primaryGray;
    }
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
  height: 5.625rem;
  width: 21.375rem;

  &.course--min {
    height: 2.125rem;
    width: 10rem;
  }
}

@media only screen and (max-width: 878px) {
  .course {
    width: 17rem;
    &--min {
      width: 10rem;
      height: 2.125rem;
    }
    &-main {
      &--min {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
      }
    }
    &-color {
      width: 1.25rem;
      height: 5.625rem;
      border-radius: 0.42rem 0 0 0.42rem;
      background-color: var(--bg-color);
      display: flex;
      align-items: center;
      justify-content: center;

      &--active {
        width: 19px;
        height: 5.5rem;
      }

      &--min {
        height: 2.125rem;

        &.course-color--active {
          height: 2rem;
        }
      }
    }

    &-content {
      width: 17rem;
      &--min {
        width: 9.25rem;
        margin-bottom: 0;
        margin-top: 0;
        margin-right: 0.5rem;
      }
    }

    &-top {
      width: 14rem;
      &--min {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }

    &-name {
      width: 14rem;
    }

    &-menu {
      right: -1rem;
    }
  }
  .active {
    border: 1px solid $yuxuanBlue;
    height: 5.625rem;
    width: 17rem;

    &.course--min {
      height: 2.125rem;
      width: 10rem;
    }
  }
}
</style>

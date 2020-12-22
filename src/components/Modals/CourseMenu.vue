<template>
  <div class="courseMenu">
    <div class="courseMenu-content">
      <div
        class="courseMenu-section"
        @mouseover="setDisplayColors(true)"
        @mouseleave="setDisplayColors(false)"
      >
        <img v-if="isLeft" class="courseMenu-arrow" src="@/assets/images/sidearrowleft.svg" />
        <div class="courseMenu-left">
          <img class="courseMenu-icon" src="@/assets/images/paint.svg" />
          <span class="courseMenu-text">Edit Color</span>
        </div>
        <img v-if="!isLeft" class="courseMenu-arrow" src="@/assets/images/sidearrow.svg" />

        <div
          v-if="displayColors"
          class="courseMenu-content courseMenu-colors"
          :class="{ 'courseMenu-colors--left': isLeft }"
        >
          <div
            v-for="(color, index) in colors"
            :key="index"
            class="courseMenu-section"
            @click="colorCourse(color)"
          >
            <div class="courseMenu-left">
              <div
                class="courseMenu-icon courseMenu-icon--color"
                :style="{ backgroundColor: color.hex }"
              ></div>
              <span class="courseMenu-text">{{ color.text }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="courseMenu-section"
        @mouseover="setDisplayEditCourseCredits(true)"
        @mouseleave="setDisplayEditCourseCredits(false)"
        v-if="this.getCreditRange[0] != this.getCreditRange[1]"
      >
        <img v-if="isLeft" class="courseMenu-arrow" src="@/assets/images/sidearrowleft.svg" />
        <div class="courseMenu-left">
          <img
            class="courseMenu-icon"
            :class="{ 'courseMenu-icon--left': isLeft }"
            src="@/assets/images/edit-credits.svg"
          />
          <span class="courseMenu-text">Edit Credits</span>
        </div>
        <img v-if="!isLeft" class="courseMenu-arrow" src="@/assets/images/sidearrow.svg" />
        <div
          v-if="displayEditCourseCredits"
          class="courseMenu-content courseMenu-editCredits courseMenu-centerCredits"
          :class="{ 'courseMenu-editCredits--left': isLeft }"
        >
          <div
            v-for="credit in makeCreditArary()"
            :key="credit"
            class="courseMenu-section courseMenu-section--credits"
            @click="editCourseCredit(credit)"
          >
            <div class="courseMenu-left">
              <span class="courseMenu-text">{{ credit }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="courseMenu-section"
        :class="{ 'courseMenu-section--left': isLeft }"
        @click="deleteCourse"
      >
        <div class="courseMenu-left">
          <img class="courseMenu-icon" src="@/assets/images/trash.svg" />
          <span class="courseMenu-text">Delete</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Course from '@/components/Course.vue';
import { coursesColorSet } from '@/assets/constants/colors';

export default Vue.extend({
  props: {
    getCreditRange: (Array as PropType<readonly number[]>) as PropType<readonly [number, number]>,
    semId: Number,
    isCompact: Boolean,
  },
  data() {
    return {
      isLeft: (this.semId % 2 === 0 && !this.isCompact) || (this.semId % 4 === 0 && this.isCompact),
      // TODO: better version for all breakpoints
      // isLeft: this.semId % numPerRow() === 0,
      colors: coursesColorSet,
      displayColors: false,
      displayEditCourseCredits: false,
    };
  },
  computed: {
    // TODO: implement this without DOM manipulation and with semID changing (right now, stays the same if a sem is added)
    numPerRow(): number {
      const itemWidth = 406; // width of a semester div
      const itemWidthCompact = 232; // width of a compact semester div in px

      const grid = document.getElementsByClassName('semesterView-content')[0];
      // @ts-ignore
      const gridStyle = grid.currentStyle || window.getComputedStyle(grid);
      const gridWidth =
        grid.clientWidth - (parseFloat(gridStyle.paddingLeft) + parseFloat(gridStyle.paddingRight));

      let numPerRow = 0;
      if (this.isCompact) {
        numPerRow = Math.min(Math.floor(gridWidth / itemWidthCompact), 4);
      } else {
        numPerRow = Math.min(Math.floor(gridWidth / itemWidth), 2);
      }
      return numPerRow;
    },
  },
  methods: {
    deleteCourse() {
      this.$emit('delete-course');
    },
    colorCourse(color: { hex: string }) {
      this.$emit('color-course', color.hex.substring(1));
    },
    setDisplayColors(bool: boolean) {
      this.displayColors = bool;
    },
    setDisplayEditCourseCredits(bool: boolean) {
      this.displayEditCourseCredits = bool;
    },
    editCourseCredit(credit: number) {
      this.$emit('edit-course-credit', credit);
    },
    makeCreditArary() {
      const creditArray: number[] = [];
      let accu = this.getCreditRange[0] < 1 ? 0 : this.getCreditRange[0] - 1;

      for (let i = accu; i < this.getCreditRange[1]; i += 1) {
        if (this.getCreditRange[0] < 1) {
          accu += 0.5;
          creditArray.push(accu);
          accu += 0.5;
          creditArray.push(accu);
        } else {
          accu += 1;
          creditArray.push(accu);
        }
      }
      return creditArray;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.courseMenu {
  &-content {
    background: $white;
    border: 1px solid #acacac;
    box-sizing: border-box;
    border-radius: 9px;
    font-size: 14px;
    color: #404040;
    width: 9rem;
  }

  &-section {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    position: relative;
    cursor: pointer;
    &:hover,
    &:active,
    &:focus {
      background-color: rgba(50, 160, 242, 0.15);
    }

    &:first-child {
      border-top-left-radius: 9px;
      border-top-right-radius: 9px;
    }

    &:last-child {
      border-bottom-left-radius: 9px;
      border-bottom-right-radius: 9px;
    }

    &--credits {
      padding-left: 0;
      padding-right: 0;
      width: 100%;
      display: flex;
      justify-content: center;
    }

    &--left {
      padding-left: 2.25rem;
    }
  }

  &-left {
    display: flex;
    align-items: center;
  }

  &-icon {
    margin-right: 1rem;

    &--color {
      width: 16px;
      height: 16px;
    }

    &--left {
      margin-right: 0.25rem;
    }
  }
  &-colors {
    position: absolute;
    right: -9rem;

    &--left {
      right: 8.87rem;
    }
  }
  &-editCredits {
    position: absolute;
    width: 2.75rem;
    right: -2.75rem;
    padding: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    &--left {
      right: 8.87rem;
    }
  }
}

@media only screen and (max-width: 878px) {
  .courseMenu {
    &-arrow {
      display: none;
    }
    &-colors {
      right: 0rem;
      left: -9rem;
    }
  }
}
</style>

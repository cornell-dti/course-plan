<template>
  <div class="courseMenu">
    <div class="courseMenu-content">
      <div
        class="courseMenu-section"
        @mouseover="setDisplayColors(true)"
        @mouseleave="setDisplayColors(false)"
      >
        <div class="courseMenu-left">
          <img class="courseMenu-icon" src="../../assets/images/paint.svg" />
          <span class="courseMenu-text">Edit Color</span>
        </div>
        <img class="courseMenu-arrow" src="../../assets/images/sidearrow.svg" />

        <div v-if="displayColors" class="courseMenu-content courseMenu-colors">
          <div
            v-for="color in colors"
            :key="color.id"
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
      <div class="courseMenu-section" @click="deleteCourse">
        <div class="courseMenu-left">
          <img class="courseMenu-icon" src="../../assets/images/trash.svg" />
          <span class="courseMenu-text">Delete</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colors: [
        {
          text: 'Gray',
          hex: '#C4C4C4'
        },
        {
          text: 'Red',
          hex: '#DA4A4A'
        },
        {
          text: 'Orange',
          hex: '#FFA53C'
        },
        {
          text: 'Yellow',
          hex: '#FFE142'
        },
        {
          text: 'Green',
          hex: '#58C913'
        },
        {
          text: 'Blue',
          hex: '#139DC9'
        },
        {
          text: 'Purple',
          hex: '#C478FF'
        },
        {
          text: 'Pink',
          hex: '#F296D3'
        }
      ],
      displayColors: false
    };
  },
  methods: {
    deleteCourse() {
      this.$emit('delete-course');
    },
    colorCourse(color) {
      this.$emit('color-course', color.hex.substring(1));
    },
    setDisplayColors(bool) {
      this.displayColors = bool;
    }
  }
};
</script>

<style scoped lang="scss">
.courseMenu {
  &-content {
    background: #ffffff;
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

    &:hover,
    &:active,
    &:focus {
      background-color: rgba(50, 160, 242, 0.15);
    }

    &:first-child {
      padding-top: 1rem;
      border-top-left-radius: 9px;
      border-top-right-radius: 9px;
    }

    &:last-child {
      padding-bottom: 1rem;
      border-bottom-left-radius: 9px;
      border-bottom-right-radius: 9px;
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
  }

  &-colors {
    position: absolute;
    right: -9rem;
  }
}
</style>

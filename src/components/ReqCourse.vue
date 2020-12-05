<template>
  <div
    :class="{ 'reqcourse--min': compact, completedReqCourse: isCompletedReqCourse }"
    class="reqcourse"
    :style="borderColorCSSvar"
  >
    <div
      v-if="!isCompletedReqCourse"
      class="reqcourse-color"
      :style="courseColorCSSvar"
      :class="{ 'reqcourse-color--min': compact }"
    >
      <img src="@/assets/images/dots/sixDots.svg" alt="dots" />
    </div>
    <div :class="{ 'reqcourse-content--min': compact }" class="reqcourse-content">
      <div :class="{ 'reqcourse-main--min': compact }" class="reqcourse-main">
        <div :class="{ 'reqcourse-top--min': compact }" class="reqcourse-top">
          <div
            :class="{ 'reqcourse-code--min': compact }"
            :title="courseCodeLabel"
            class="reqcourse-code"
          >
            {{ courseCodeLabel }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import firebase from 'firebase/app';

export default Vue.extend({
  props: {
    color: String,
    subject: String,
    number: String,
    isCompletedReqCourse: Boolean,
    compact: Boolean,
  },
  computed: {
    borderColorCSSvar(): any {
      return {
        '--border-color': `#${this.color}`,
      };
    },
    courseColorCSSvar(): any {
      return {
        '--bg-color': `#${this.color}`,
      };
    },
    courseCodeLabel(): string {
      return `${this.subject} ${this.number}`;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.reqcourse {
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

    &--min {
      height: 2.125rem;
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
    color: $medGray;

    &--min {
      color: $primaryGray;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 0.5rem;
    }
  }
}

.completedReqCourse {
  border: 1px solid;
  border-color: var(--border-color);
}
</style>

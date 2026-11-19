<template>
  <div
    :class="{
      'reqcourse--min': compact,
      completedReqCourse: isCompletedReqCourse,
      conflict: isConflict,
    }"
    class="reqcourse"
    :style="borderColorCSSvar"
  >
    <div
      v-if="!isCompletedReqCourse"
      class="reqcourse-color"
      :style="courseColorCSSvar"
      :class="{ 'reqcourse-color--min': compact }"
    ></div>
    <div :class="{ 'reqcourse-content--min': compact }" class="reqcourse-content">
      <div :class="{ 'reqcourse-main--min': compact }" class="reqcourse-main">
        <div :class="{ 'reqcourse-top--min': compact }" class="reqcourse-top">
          <div
            :class="{ 'reqcourse-code--min': compact }"
            :title="courseCode"
            class="reqcourse-code"
            data-cyId="reqcourse-code"
          >
            {{ courseCode }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CSSProperties, defineComponent } from 'vue';

export default defineComponent({
  props: {
    color: { type: String, required: true },
    courseCode: { type: String, required: true },
    isCompletedReqCourse: { type: Boolean, required: true },
    compact: { type: Boolean, required: true },
    isConflict: { type: Boolean, required: true },
  },
  computed: {
    borderColorCSSvar(): CSSProperties {
      return { '--border-color': `#${this.color}` } as CSSProperties;
    },
    courseColorCSSvar(): CSSProperties {
      return { '--bg-color': `#${this.color}` } as CSSProperties;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_tokens.scss';

// a course counted toward a requirement: a small V2 course card
.reqcourse {
  @include cp-font;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: row;
  gap: 8px;
  min-height: 56px;
  padding: 8px 12px 8px 8px;
  background: #fff;
  border: 1px solid $cp-line;
  border-radius: $cp-r-md;
  box-shadow: $cp-shadow-rest;
  position: relative;

  &--min {
    min-height: 36px;
    padding-top: 6px;
    padding-bottom: 6px;
  }

  &-main {
    width: 100%;
    min-width: 0;
  }

  &-color {
    width: 4px;
    flex-shrink: 0;
    align-self: stretch;
    border-radius: 999px;
    background-color: var(--bg-color);
  }

  &-content {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  &-top {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  &-code {
    @include cp-text(13px, 18px, 600);
    color: $cp-ink;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// completed: the success surface, bordered in the requirement color
.completedReqCourse {
  background: $cp-success-bg;
  border-color: var(--border-color);
  padding-left: 12px;
}

.conflict {
  border-color: $cp-warn-line;
  box-shadow: inset 0 0 0 1px $cp-warn-line;
}
</style>

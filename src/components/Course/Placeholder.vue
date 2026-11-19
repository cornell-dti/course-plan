<template>
  <div :class="{ 'placeholder--min': compact }" class="placeholder">
    <div class="placeholder-color"></div>
    <div class="placeholder-content" @click="openModal()">
      <div class="placeholder-name" :class="{ 'placeholder-name--min': compact }">
        {{ placeholderObj.name }}
      </div>
      <course-caution
        :course="placeholderObj"
        :semesterIndex="semesterIndex"
        :isCompactView="compact"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import CourseCaution from '@/components/Course/CourseCaution.vue';

export default defineComponent({
  components: { CourseCaution },
  props: {
    placeholderObj: { type: Object as PropType<FirestoreSemesterPlaceholder>, required: true },
    compact: { type: Boolean, required: true },
    semesterIndex: { type: Number, required: false, default: 0 },
  },
  methods: {
    openModal() {
      // TODO: open modal to assign a course to a placeholder
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_tokens.scss';

// V2 open slot: laid out like a course card with a gray bar, on a quiet dashed surface.
// Hover turns it white with a 2px dashed brand border (padding shrinks 1px to keep its size).
.placeholder {
  @include cp-font;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 8px;
  min-height: 56px;
  padding: 8px 12px 8px 8px;
  background: $cp-subtle;
  border: 1px dashed $cp-line-strong;
  border-radius: $cp-r-md;
  cursor: grab;
  transition: border-color 150ms, background-color 150ms;

  &:hover,
  &:active,
  &.focus {
    padding: 7px 11px 7px 7px;
    background: #fff;
    border: 2px dashed $cp-brand;
  }

  &--min {
    min-height: 36px;
    padding-top: 6px;
    padding-bottom: 6px;

    &:hover,
    &:active,
    &.focus {
      padding-top: 5px;
      padding-bottom: 5px;
    }
  }

  &-color {
    width: 4px;
    flex-shrink: 0;
    align-self: stretch;
    border-radius: $cp-r-sm;
    background: $cp-disabled;
  }

  &-content {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  &-name {
    @include cp-text(13px, 18px, 500);
    color: $cp-ink;

    &--min {
      @include cp-text(12px, 16px, 500);
    }
  }
}
</style>

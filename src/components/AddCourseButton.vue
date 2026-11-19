<template>
  <button
    type="button"
    class="semester-addWrapper"
    :class="{
      'semester-addWrapper--compact': compact,
      'my-2 mx-0': shouldClearPadding,
    }"
    @click="onClick"
  >
    <span class="semester-buttonText" :class="{ 'semester-buttonText--compact': compact }">
      {{ addCourseText }}
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    compact: { type: Boolean, required: true },
    shouldClearPadding: { type: Boolean, default: false },
  },
  emits: ['click'],
  computed: {
    addCourseText() {
      return '+ Course';
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_tokens.scss';

// V2 "+ Course": a small dashed button under the semester's cards
.semester {
  &-addWrapper {
    @include cp-dashed-button;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 26px;

    &--compact {
      min-height: 24px;
    }

    &:hover .semester-buttonText,
    &:focus .semester-buttonText {
      color: $cp-link;
    }
  }

  &-buttonText {
    @include cp-text(12px, 16px, 500);
    color: $cp-muted;
  }
}
</style>

<template>
  <div
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    compact: { type: Boolean, required: true },
    shouldClearPadding: { type: Boolean, default: false },
  },
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
@import '@/assets/scss/_variables.scss';

@mixin hover-button {
  border-color: $yuxuanBlue;
  background: rgba(0, 0, 0, 0.03);
  color: $yuxuanBlue;
  cursor: pointer;
}

.semester {
  &-addWrapper {
    margin-top: -5rem;
    margin-bottom: 0.5rem;
    height: 4.625rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed $borderGray;
    color: $medGray;
    margin-left: 1.125rem;
    margin-right: 1.125rem;

    &--compact {
      margin-top: -1.2rem;
      height: 2rem;
    }

    &:hover,
    &:active,
    &:focus {
      @include hover-button();
    }
  }

  &-buttonText {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: $medGray;

    &--compact {
      font-size: 14px;
      line-height: 17px;
    }
  }
}
</style>

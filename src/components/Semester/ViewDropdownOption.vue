<template>
  <button class="dropdown-button full-opacity-on-hover">
    <div class="dropdown-button-option">
      <img :src="image" class="dropdown-button-image" :alt="alt" />
      {{ label }}
    </div>
    <img v-if="selected" :src="checkmark" class="dropdown-button-image" alt="checkmark" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import checkmark from '@/assets/images/views/checkmark.svg';

export default defineComponent({
  props: {
    alt: { type: String, required: true },
    selected: { type: Boolean, required: true },
    image: { type: String, required: true },
    label: { type: String, required: true },
  },
  data() {
    return {
      checkmark,
    };
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_tokens.scss';
.dropdown-button {
  @include cp-reset-button;
  @include cp-text(13px, 18px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  border-radius: $cp-r-sm;
  color: $cp-ink;
  text-align: left;
  &:hover {
    background: $cp-subtle;
  }
  &:active {
    background: $cp-hover;
  }
  &-option {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &-image {
    width: 14px;
    height: 14px;
  }
}
</style>

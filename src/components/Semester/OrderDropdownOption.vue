<template>
  <button class="dropdown-button full-opacity-on-hover">
    <div class="dropdown-button-option">
      <img :src="image" class="dropdown-button-image" :alt="alt" />
      {{ label }}
    </div>
    <img
      v-if="selected"
      :src="checkmark"
      class="dropdown-button-image"
      alt="checkmark"
    />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import checkmark from '@/assets/images/schedule-view/view-settings/checkmark.svg';

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
@import '@/assets/scss/_variables.scss';
.dropdown-button {
  padding: 0.5rem 1rem;
  align-items: center;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  &:hover {
    background: $einBlueTransparent;
  }
  &-option {
    color: $dropdownGray;
    font-size: 1rem;
    line-height: 1rem;
    align-items: center;
    display: flex;
    gap: 1rem;
  }
  &-image {
    min-width: 1rem;
    max-width: 1rem;
    &--checkmark {
      content: url('@/assets/images/schedule-view/view-settings/checkmark.svg');
    }
  }
}
</style>

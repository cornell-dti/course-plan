<template>
  <div class="modal">
    <div v-bind:class="['modal-content', contentClass]">
      <div class="modal-top">
        <span class="modal-title">{{ title }}</span>
        <img class="modal-exit" src="@/assets/images/x.png" @click="closeCurrentModal" />
      </div>
      <slot class="modal-body"></slot>
      <div class="modal-buttonWrapper">
        <button class="modal-button" @click="leftButtonClicked">{{ leftButtonText }}</button>
        <button
          class="modal-button modal-button--add"
          :class="{ 'modal-button--disabled': rightButtonIsDisabled }"
          @click="rightButtonClicked"
        >
          {{ rightButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: { type: String, required: true },
    contentClass: { type: String, required: true },
    leftButtonText: { type: String, required: true },
    rightButtonText: { type: String, required: true },
    rightButtonIsDisabled: { type: Boolean, required: true },
  },
  methods: {
    closeCurrentModal(): void {
      this.$emit('modal-closed');
    },
    leftButtonClicked(): void {
      this.$emit('left-button-clicked');
    },
    rightButtonClicked(): void {
      this.$emit('right-button-clicked');
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.modal {
  padding: 1rem;

  &-content {
    background: $white;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
  }

  &-body {
    padding: 0;
  }

  &-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  &-exit {
    cursor: pointer;
    width: 10.5px;
    height: 10.5px;
  }

  &-title {
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: $primaryGray;
  }

  &-buttonWrapper {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }

  &-button {
    width: 4.75rem;
    height: 1.8rem;
    color: $activeGray;
    border-radius: 3px;
    border: 1px solid $primaryGray;
    background-color: $white;
    display: flex;
    justify-content: center;
    align-items: center;

    &--add {
      color: $white;
      background-color: $sangBlue;
      margin-left: 0.5rem;
      border: none;
    }

    &--disabled {
      pointer-events: none;
      opacity: 0.3;
      border: 1px solid $sangBlue;
      background-color: $disabledGray;
    }
  }
}
</style>

<template>
  <Teleport
    to="#modalTarget"
    v-if="modelValue"
    @click="checkClickOutside"
    ref="modalBackground"
    aria-modal="true"
  >
    <div class="teleport" @click="closeOnClickOutside">
      <div :class="['modal-content', contentClass]">
        <div class="modal-top">
          <h1>{{ title }}</h1>
          <button @click="close">
            <img class="modal-exit" src="@/assets/images/x.png" alt="x to close modal" />
          </button>
        </div>
        <slot class="modal-body"></slot>
        <div class="modal-buttonWrapper">
          <button class="modal-button" @click="leftButtonClicked">
            {{ leftButtonText }}
          </button>
          <button
            class="modal-button modal-button--add"
            :class="{ 'modal-button--disabled': rightButtonIsDisabled }"
            @click="rightButtonClicked"
          >
            <img
              v-if="rightButtonImage"
              class="modal-icon"
              :src="rightButtonImage"
              :alt="rightButtonAlt"
            />
            {{ rightButtonText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    modelValue: { required: true, type: Boolean },
    title: { type: String, required: true },
    contentClass: { type: String, required: true },
    leftButtonText: { type: String, required: true },
    rightButtonText: { type: String, required: true },
    rightButtonImage: { type: String, default: '' },
    rightButtonAlt: { type: String, default: '' },
    rightButtonIsDisabled: { type: Boolean, required: true },
  },
  emits: ['left-button-clicked', 'right-button-clicked', 'modal-closed'],
  setup(props, { emit }) {
    const modalBackground = ref((null as unknown) as HTMLDivElement);

    const close = () => {
      emit('modal-closed', true);
    };

    const closeOnClickOutside = (e: MouseEvent) => {
      if (e.target === modalBackground.value) close();
    };

    const leftButtonClicked = () => {
      emit('left-button-clicked');
    };

    const rightButtonClicked = () => {
      emit('right-button-clicked');
    };

    return { close, closeOnClickOutside, leftButtonClicked, rightButtonClicked, modalBackground };
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.teleport {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 3;
  padding: 1rem;
}

.modal {
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
    width: 10.5px;
    height: 10.5px;
  }

  &-icon {
    margin-right: 0.25rem;
  }

  &-buttonWrapper {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }

  &-button {
    width: 4.75rem;
    height: 1.8rem;
    color: $sangBlue;
    border-radius: 3px;
    border: 1px solid $sangBlue;
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

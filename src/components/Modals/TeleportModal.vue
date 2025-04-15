<template>
  <Teleport to="#modalTarget" aria-modal="true">
    <div
      class="teleport"
      :class="{
        'teleport-simple': isSimpleModal,
        'teleport-noBackground': hasNoBackground,
        'teleport-transparentBackground': hasClickableTransparentBackground,
      }"
      @click="closeOnClickOutside"
      ref="modalBackground"
      data-cyId="teleportModal"
    >
      <div
        :class="['modal-content', contentClass, { 'modal-simple': isSimpleModal }]"
        :style="customPosition"
      >
        <div v-if="!isSimpleModal" class="modal-top">
          <slot name="title">
            <h1>{{ title }}</h1>
          </slot>
          <button v-if="showCloseButton" @click="close" data-cyId="modal-exit">
            <img class="modal-exit" src="@/assets/images/x.png" alt="x to close modal" />
          </button>
        </div>
        <slot class="modal-body"></slot>
        <div
          v-if="!isSimpleModal"
          :class="[
            {
              'modal-buttonWrapper': !isSaveCourseModal,
              'modal-buttonWrapperCollection': isSaveCourseModal,
            },
          ]"
        >
          <button
            :class="{ 'modal-button--big': isPlanModal || isCollectionModal }"
            v-if="leftButtonText"
            class="modal-button"
            @click="leftButtonClicked"
          >
            {{ leftButtonText }}
          </button>
          <button
            class="modal-button modal-button--add"
            :class="{
              'modal-button--disabled': rightButtonIsDisabled,
              'modal-button--highlighted': rightButtonIsHighlighted,
              'modal-button--big': isPlanModal || isCollectionModal,
              'modal-button--addCollection': isSaveCourseModal,
            }"
            @click="rightButtonClicked"
            data-cyId="modal-button"
            :disabled="rightButtonIsDisabled"
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
import { defineComponent, ref, PropType } from 'vue';
import store from '@/store';

export default defineComponent({
  props: {
    title: { type: String, default: '' },
    contentClass: { type: String, required: true },
    leftButtonText: { type: String, default: '' },
    rightButtonText: { type: String, default: '' },
    rightButtonImage: { type: String, default: '' },
    rightButtonAlt: { type: String, default: '' },
    rightButtonIsDisabled: { type: Boolean, default: false },
    rightButtonIsHighlighted: { type: Boolean, default: false },
    isSimpleModal: { type: Boolean, default: false }, // true if the modal will set its own styling for its position
    hasNoBackground: { type: Boolean, default: false }, // true for modals without the gray overlay behind them
    hasClickableTransparentBackground: { type: Boolean, default: false }, // modals without a gray overlay behind them AND clicking on the background closes the modal
    hasCustomPosition: { type: Boolean, default: false }, // true if you want to set custom position for modal
    isPlanModal: { type: Boolean, default: false },
    isCollectionModal: { type: Boolean, default: false },
    position: {
      type: Object as PropType<{ x: number; y: number }>,
      default: () => ({ x: 0, y: 0 }),
    }, // custom position (hasCustomPosition must be true)
    showCloseButton: { type: Boolean, default: true }, // controls the visibility of the close button,
    isSaveCourseModal: { type: Boolean, default: false },
  },
  data() {
    const customPosition = this.hasCustomPosition
      ? {
          left: `${this.position.x}px`,
          top: `${this.position.y}px`,
        }
      : {};
    return {
      customPosition,
    };
  },
  emits: ['left-button-clicked', 'right-button-clicked', 'modal-closed'],
  setup(props, { emit }) {
    const modalBackground = ref((null as unknown) as HTMLDivElement);

    const close = () => {
      store.commit('setIsTeleportModalOpen', false);
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

    store.commit('setIsTeleportModalOpen', true);

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
  z-index: 4;
  padding: 1rem;

  &-simple {
    padding: 0rem;
  }

  &-noBackground {
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    min-height: 0;
    pointer-events: none;
  }

  &-transparentBackground {
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    min-height: 100vh;
  }
}

.modal {
  &-content {
    background: $white;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
  }

  &-simple {
    background: none;
    padding: 0;
    min-height: 100vh;
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
    margin-top: -11px;
  }

  &-icon {
    margin-right: 0.25rem;
  }

  &-buttonWrapper {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  &-buttonWrapperCollection {
    display: flex;
    justify-content: flex-end;
    align-items: center;
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

    &--highlighted {
      border: 2px solid $error;
    }

    &--big {
      width: 7rem;
    }

    &--addCollection {
      margin-top: 1rem;
      margin-right: 0.2rem;
    }
  }
}

// custom styling for different modals depending on contentClass
.content {
  &-confirmation {
    border: none;
    margin-top: 1rem;
    min-height: 0;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  &-slotmenu {
    background-color: $white;
    min-height: 0;
    width: 7rem;
    position: fixed;
  }
}
</style>

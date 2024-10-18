<template>
  <div
    class="teleport"
    :class="{
      'teleport-noBackground': hasNoBackground,
      'teleport-transparentBackground': hasClickableTransparentBackground,
    }"
    @click="closeOnClickOutside"
    data-cyId="giveaway-exit"
    ref="modalBackground"
  >
    <div class="modal-content">
      <div class="modal-top">
        <button @click="close" class="modal-exitbutton" data-cyId="giveaway-exit">
          <img class="modal-exit" src="@/assets/images/x.png" alt="x to close modal" />
        </button>
      </div>
      <div class="modal-textWrapper">
        <img class="modal-logo" src="@/assets/images/branding/logo.svg" />
        <h1 class="modal-title">{{ title }}</h1>
        <div>Sign up for your chance to win a $25 gift card!</div>
        <div class="textInput">
          <label class="textInput-label">Cornell NetID</label>
          <div class="textInput-wrapper">
            <input class="textInput-userinput" placeholder="Enter netid" v-model="netId" />
          </div>
          <label class="textInput-label">Instagram Username</label>
          <div class="textInput-wrapper">
            <input class="textInput-userinput" placeholder="Enter username" v-model="igUsername" />
          </div>
        </div>
      </div>
      <div class="modal-buttonWrapper">
        <button
          class="modal-button modal-button--add"
          :class="{
            'modal-button--highlighted': rightButtonIsHighlighted,
          }"
          @click="submitEntry"
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
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import enterGiveaway from '@/global-firestore-data/giveaway-entries';
import { updateSawGiveaway } from '@/global-firestore-data';

export default defineComponent({
  props: {
    title: { type: String, default: '' },
    rightButtonText: { type: String, default: '' },
    rightButtonImage: { type: String, default: '' },
    rightButtonAlt: { type: String, default: '' },
    rightButtonIsHighlighted: { type: Boolean, default: false },
    hasNoBackground: { type: Boolean, default: false }, // true for modals without the gray overlay behind them
    hasClickableTransparentBackground: { type: Boolean, default: false }, // modals without a gray overlay behind them AND clicking on the background closes the modal
  },
  emits: ['left-button-clicked', 'right-button-clicked', 'modal-closed'],
  data() {
    return { netId: '', igUsername: '' };
  },
  methods: {
    submitEntry() {
      if (this.netId !== '' && this.igUsername !== '') {
        enterGiveaway(this.netId, this.igUsername);
        this.$emit('modal-closed', true);
      }
      updateSawGiveaway(true);
    },
  },
  setup(props, { emit }) {
    const modalBackground = ref((null as unknown) as HTMLDivElement);

    const close = () => {
      updateSawGiveaway(true);
      emit('modal-closed', true);
    };

    const closeOnClickOutside = (e: MouseEvent) => {
      if (e.target === modalBackground.value) close();
    };

    return { close, closeOnClickOutside, modalBackground };
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
    width: 24rem;
    background: $white;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
    background-image: url('@/assets/images/confetti.gif');
  }
  &-logo {
    margin-bottom: 1rem;
  }
  &-textWrapper {
    text-align: center;
  }
  &-body {
    padding: 0;
  }

  &-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  &-exitbutton {
    margin-left: auto;
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

    &--highlighted {
      border: 2px solid $error;
    }

    &--big {
      width: 7rem;
    }
  }
}

.textInput {
  width: 20rem;
  margin: auto;
  margin-top: 0.5rem;
  &-label {
    font-weight: bold;
    top: 0.5rem;
    position: relative;
    float: left;
  }
  &-wrapper {
    height: 4.2rem;
    width: 20rem;
    margin: auto;
  }
  &-userinput {
    border: 1px solid $darkPlaceholderGray;
    top: 0.5rem;
    position: relative;
    width: 100%;
    height: 2rem;
    padding-left: 0.5rem;
    border-radius: 3px;
    &::placeholder {
      color: $darkPlaceholderGray;
    }
  }
}
</style>

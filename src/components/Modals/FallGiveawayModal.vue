<template>
  <div
    class="teleport"
    :class="{
      'teleport-noBackground': hasNoBackground,
      'teleport-transparentBackground': hasClickableTransparentBackground,
    }"
    @click="closeOnClickOutside"
    ref="modalBackground"
  >
    <div class="modal-content">
      <div class="modal-top">
        <button @click="close" class="modal-exitbutton">
          <img class="modal-exit" src="@/assets/images/x.png" alt="x to close modal" />
        </button>
      </div>
      <div class="modal-textWrapper">
        <img class="modal-logo" src="@/assets/images/branding/logo.svg" />
        <h1 class="modal-title">{{ title }}</h1>
        <h2 class="modal-subtitle">
          <p>Plan your semester by April 17th<br />and win a free prize!</p>
        </h2>

        <div class="modal-steps">
          <div class="modal-step">
            <div class="modal-step-circle">1</div>
            <p>Make your F25 Plan</p>
          </div>
          <div class="modal-step">
            <div class="modal-step-circle">2</div>
            <p>Add a<br />Note</p>
          </div>
          <div class="modal-step">
            <div class="modal-step-circle">3</div>
            <p>Generate a Schedule</p>
          </div>
        </div>

        <button class="modal-button modal-button--big modal-button--ready" @click="submitEntry">
          I’m ready to plan!
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
    hasNoBackground: { type: Boolean, default: false },
    hasClickableTransparentBackground: { type: Boolean, default: false },
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
    width: 393.14px;
    height: 386px;
    background: $white;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
    background-image: url('@/assets/images/confetti.gif');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    box-sizing: border-box;
  }

  &-logo {
    margin-bottom: 1rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  &-textWrapper {
    text-align: center;
  }

  &-title {
    font-size: 1.05rem;
    font-family: 'ProximaNovabold', sans-serif;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  &-subtitle {
    font-size: 0.85rem;
    font-family: 'ProximaNovabold', sans-serif;
    font-weight: 800;
    margin-bottom: 1.5rem;
    color: $darkGray;
  }

  &-steps {
    display: flex;
    justify-content: center; // center instead of spreading
    gap: 1rem; // smaller space between items
    margin-top: 1rem;
    margin-bottom: 2rem;

    .modal-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 0.8rem;

      .modal-step-circle {
        background-color: transparent;
        color: $sangBlue;
        border: 2px solid $sangBlue;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-bottom: 0.25rem;
      }

      p {
        margin: 0.3rem 0 0 0;
        text-align: center;
        max-width: 80px; // 👈 limit line length so words wrap
        word-wrap: break-word;
      }
    }
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

    &--ready {
      width: fit-content;
      background-color: $sangBlue;
      color: white;
      // font-weight: bold;
      height: 2.2rem;
      border-radius: 6px;
      font-size: 1rem;
      margin-top: 1rem;
      margin-bottom: 1.5rem;
      padding: 0 1.25rem;
      margin-left: auto;
      margin-right: auto;
    }
  }
}

.textInput {
  width: 20rem;
  margin: auto;
  margin-top: 1rem;

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

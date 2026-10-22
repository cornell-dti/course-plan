<template>
  <teleport-modal content-class="content-tour" :isSimpleModal="true">
    <div class="tour" data-cyId="tour">
      <div class="intropage">
        <div class="top">
          <div class="dtiLogoWrapper">
            <img
              class="dtiLogo"
              src="@/assets/images/walkthrough/dti-wordmark.png"
              alt="dti logo"
            />
          </div>
          <div class="picture">
            <img
              v-if="!isFinalStep"
              class="image"
              src="@/assets/images/walkthrough/walkthrough-start.png"
              alt="person planning"
            />
            <img
              v-else
              class="image"
              src="@/assets/images/walkthrough/walkthrough-end.png"
              alt="person planning"
            />
          </div>
        </div>
        <div class="content">
          <div class="title">
            {{ title }}
          </div>
          <div v-if="!isFinalStep" class="body">
            {{ text }}
          </div>
          <div v-else class="body body--left">
            <div class="body-topText">{{ text }}</div>
            <div>
              Submit bugs &amp; feature requests using the Feedback button found on the right side
              of the page or contact us at
              <a href="mailto:courseplan.io@gmail.com">courseplan.io@gmail.com</a>.
            </div>
          </div>
          <button class="startButton" data-cyId="tour-startButton" @click="startTour()">
            {{ buttonText }}
          </button>
          <button class="skipButton" data-cyId="tour-exitButton" @click="skipTour()">
            {{ exit }}
          </button>
        </div>
      </div>
    </div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { clickOutside } from '@/utilities';
import { GTagEvent } from '@/gtag';
import TeleportModal from '@/components/Modals/TeleportModal.vue';

export default defineComponent({
  components: { TeleportModal },
  props: {
    title: { type: String, required: true },
    text: { type: String, required: true },
    isFinalStep: { type: Boolean, required: false, default: false },
    exit: { type: String, required: true },
    buttonText: { type: String, required: true },
  },
  emits: {
    startTour: () => true,
    closeTourWindow: () => true,
  },
  data() {
    return {
      hideOnClick: '',
    };
  },
  directives: {
    'click-outside': clickOutside,
  },
  methods: {
    startTour(): void {
      this.$emit('startTour');
      this.$emit('closeTourWindow');
      GTagEvent(this.$gtag, 'start-walkthrough');
    },
    skipTour(): void {
      this.$emit('closeTourWindow');
      GTagEvent(this.$gtag, 'skip-walkthrough');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.tour {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.intropage {
  width: 40vw;
  background-color: $white;
  opacity: 1;
  position: absolute;
  border-radius: 9px;
  padding: 0px;
}
.top {
  width: 100%;
  height: 25.25rem;
  display: flex;
  flex-direction: column;
  background-color: $emGreen;
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
  padding: 1rem 1.5rem;
}
.dtiLogoWrapper {
  margin-bottom: 1rem;
}
.picture {
  display: flex;
  justify-content: center;
}
.image {
  height: 100%;
}
.content {
  width: 100%;
  min-height: 15.25rem;
  padding-top: 1.75rem;
  padding-bottom: 1.25rem;
  border-radius: 9px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  .title {
    font-weight: 600;
    font-size: 24px;
    line-height: 24px;
    color: $primaryGray;
  }
  .body {
    font-size: 0.9em;
    text-align: center;
    color: $lightPlaceholderGray;
    width: 90%;

    &-topText {
      margin-bottom: 1rem;
    }

    &--left {
      text-align: left;
      margin-top: 1.75rem;
      margin-bottom: 1.25rem;
    }
  }
  .startButton {
    background-color: $sangBlue;
    color: $white;
    border: none;
    padding-right: 0.7em;
    padding-left: 0.7em;
    padding-top: 0.3em;
    padding-bottom: 0.3em;
    font-style: normal;
    font-weight: normal;
    border-radius: 3px;
  }
  .skipButton {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font-weight: normal;
    color: $sangBlue;
  }
  a {
    font-weight: normal;
    color: $sangBlue;
  }
}
</style>

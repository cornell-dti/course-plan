<template>
  <div class="tour">
    <div class="blackout">
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
            <img class="image" :src="image" alt="person planning" />
          </div>
        </div>
        <div class="content">
          <div class="title">
            {{ title }}
          </div>
          <div v-if="secondText == ''" class="body">
            {{ text }}
          </div>
          <div v-else class="body body--left">
            <div class="body-topText">{{ text }}</div>
            <div>{{ secondText }}</div>
          </div>
          <button
            @click="
              $emit('hide');
              $emit('startTour');
            "
          >
            {{ buttonText }}
          </button>
          <a @click="$emit('skip')">
            {{ exit }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { clickOutside } from '@/utilities';

export default Vue.extend({
  props: {
    title: { type: String, required: true },
    text: { type: String, required: true },
    secondText: { type: String, required: false, default: '' },
    exit: { type: String, required: true },
    buttonText: { type: String, required: true },
    image: { type: String, required: true },
  },
  data() {
    return {
      hideOnClick: '',
    };
  },
  directives: {
    'click-outside': clickOutside,
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.blackout {
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100vw;
  height: 100%;
  left: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.intropage {
  z-index: 200;
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
  button {
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
  a {
    font-weight: normal;
    color: $sangBlue;
  }
}
</style>

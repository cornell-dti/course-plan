<template>
  <div class="tour">
    <div class="blackout">
      <div class="intropage">
        <div class="top">
          <div class="text">
            <span class="maintitle">Welcome to CoursePlan!</span>
            <span class="subtitle">created by Cornell Design &amp; Tech Initiative</span>
          </div>
          <div class="picture">
            <img
              class="image"
              src="@/assets/images/branding/walkthrough.png"
              alt="people planning"
            />
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
  align-items: center;
  background-color: $emGreen;
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
}
.text {
  margin-top: 2.25rem;
  margin-bottom: 2.25rem;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.maintitle {
  color: $white;
  font-weight: 600;
  font-size: 36px;
  line-height: 36px;
}
.subtitle {
  margin-top: 1.75rem;
  font-weight: 600;
  font-size: 18px;
  line-height: 18px;
  color: $primaryGray;
}
.image {
  height: 100%;
}
.content {
  width: 100%;
  height: 15.25rem;
  border-radius: 9px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  padding-top: 2%;
  padding-bottom: 2%;
  .title {
    font-weight: 600;
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

<template>
  <div class="tour">
    <div class="blackout">
      <div class="intropage">
        <div class="picture">
          <img src="@/assets/images/Person_planning.svg" alt="person planning" />
        </div>
        <div class="content">
          <div class="title">
            {{ title }}
          </div>
          <div class="body" v-html="text"></div>
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
    title: String,
    text: String,
    exit: String,
    buttonText: String,
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
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.intropage {
  z-index: 200;
  width: 40vw;
  height: 80vh;
  background-color: white;
  opacity: 1;
  position: absolute;
  border-radius: 9px;
  padding: 0px;
}
.picture {
  width: 100%;
  height: 66%;
  display: flex;
  justify-content: center;
  background-color: $emGreen;
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
  img {
    height: 100%;
  }
}
.content {
  width: 100%;
  height: 34%;
  border-radius: 9px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  padding-top: 2%;
  padding-bottom: 2%;
  .title {
    font-weight: 600;
  }
  .body {
    font-size: 0.9em;
    text-align: center;
    color: #757575;
    width: 90%;
  }
  button {
    background-color: $sangBlue;
    color: white;
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
  }
}
</style>

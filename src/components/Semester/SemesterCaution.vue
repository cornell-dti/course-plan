<template>
  <div class="caution">
    <div class="caution-left">
      <img class="caution-icon" src="@/assets/images/caution-white.svg" />
    </div>
    <div class="caution-text">{{ text }}</div>
    <div class="caution-right">
      <!-- TODO: implement undo functionality -->
      <!-- <span class="undo-buttonText">{{ undo }}</span> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    text: String,
  },

  computed: {
    // TODO: implement undo functionality
    // undo() {
    //   return 'UNDO';
    // }
  },
});
</script>

<style scoped lang="scss">
.caution {
  position: fixed;
  z-index: 10;
  top: 16px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: -4px -4px 10px #efefef, 4px 4px 10px #efefef;
  display: flex;
  flex-direction: row;

  &-left {
    min-width: 42px;
    min-height: 42px;

    background: #eb6d6d;
    border-radius: 5px;
  }

  &-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &-left img {
    width: 20px;
    height: 20px;

    margin: auto;
  }

  &-text {
    height: 16px;
    min-width: 10rem;

    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    display: flex;
    align-items: center;

    color: #7b7d7e;

    margin-left: 8px;
    margin-right: 16px;
    margin-top: 13px;
    margin-bottom: 12px;
  }

  &-right {
    width: 48px;
    height: 16px;

    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;

    color: #32a0f2;
    margin-left: 16px;
    margin-right: 16px;
    margin-top: 13px;
    margin-bottom: 12px;
  }
}

@media only screen and (max-width: 440px) {
  .caution {
    width: 75%;
    &-left {
      width: 15%;
    }
    &-text {
      width: 85%;
    }
    &-right {
      width: 0%;
      margin-left: 0rem;
      margin-right: 0rem;
    }
  }
}
</style>

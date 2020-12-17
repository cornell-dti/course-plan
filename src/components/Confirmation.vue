<template>
  <div class="confirmation">
    <div class="confirmation-left">
      <img class="confirmation-icon" src="@/assets/images/checkmark.svg" alt="checkmark" />
    </div>
    <div class="confirmation-text">{{ text }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    text: String,
  },
});
</script>

<style scoped lang="scss">
.confirmation {
  position: fixed;
  z-index: 10;
  top: 16px;
  left: 29.5rem;
  right: 0;
  margin: 0 auto;
  width: max-content;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: -4px -4px 10px #efefef, 4px 4px 10px #efefef;
  display: flex;
  flex-direction: row;

  &-left {
    min-width: 42px;
    min-height: 42px;

    background: #3eb53b;
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

    margin: 14px 16px 12px 16px;
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

@media only screen and (max-width: 976px) {
  .confirmation {
    left: 25.5rem;
  }
}

@media only screen and (max-width: 878px) {
  .confirmation {
    left: 0;
  }
}

@media only screen and (max-width: 440px) {
  .confirmation {
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

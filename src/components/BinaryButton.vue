<template>
  <div class="binary-button">
    <div @click="onClick(true)" :class="{'binary-button-selected': leftChosen}">{{ choices[0] }}</div>
    <div @click="onClick(false)" :class="{'binary-button-selected': !leftChosen}">{{ choices[1] }}</div>
  </div>
</template>

<script>
export default {
  props: {
    choices: Array
  },
  data() {
    return {
      leftChosen: true
    };
  },
  methods: {
    onClick(left) {
      this.leftChosen = left;
    }
  }
};
</script>

<style scoped lang="scss">
  .binary-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-grow: 1;
    width: 438px;
    height: 36px;
    border: 1px solid #2BBCC6;
    border-radius: 4px;
    color: #2BBCC6;
    margin-bottom: 20px;
    cursor: pointer;
    div {
      text-align: center;
      font-weight: 500;
      font-size: 14px;
      line-height: 36px;
      width: 204px;
      &:first-of-type {
        border-right: 1px solid #2BBCC6;
      }
    }
    &-selected {
      background: #2BBCC6;
      color: #FFFFFF;
    }
  }
</style>

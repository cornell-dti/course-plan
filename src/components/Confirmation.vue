// One prop for text // Otherwise - the same for courses and semesters // Can leave as display: none
like the 2 modals in Semester.vue until necessary? Or can itself be created from the addCourse()
method - unsure what the right move is right now

<template>
  <div class="confirmation">
    <div class="confirmation-left">
      <img class="confirmation-icon" src="../assets/images/checkmark.svg" />
    </div>
    <div class="confirmation-text">{{ text }}</div>
    <div class="confirmation-right">
      <span class="undo-buttonText">{{ undo }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: String
  },

  computed: {
    undo() {
      return 'UNDO';
    }
  }
};
</script>

<style scoped lang="scss">
.confirmation {
  position: fixed;
  z-index: 10;
  height: 41px;
  left: 295px;
  top: 16px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #2b6693;
  display: flex;
  flex-direction: row;

  &-left {
    // position: absolute;
    width: 41px;
    height: 39px;
    left: 295px;
    top: 16px;

    background: #3eb53b;
    border-radius: 5px;
  }

  &-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &-left img {
    // position: absolute;
    width: 20px;
    height: 20px;
    left: 307px;
    top: 27px;

    margin: auto;
  }

  &-text {
    // width: 274px;
    height: 16px;
    left: 349px;
    top: 29px;

    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    display: flex;
    align-items: center;

    color: #7b7d7e;

    margin-left: 11px;
    margin-right: 19px;
    margin-top: 13px;
    margin-bottom: 12px;
  }

  &-right {
    // position: absolute;
    width: 49px;
    height: 16px;
    left: 642px;
    top: 29px;

    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    align-items: center;

    color: #32a0f2;
    margin-left: 19px;
    margin-right: 14px;
    margin-top: 13px;
    margin-bottom: 12px;
  }
}
</style>

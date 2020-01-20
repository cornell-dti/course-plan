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
      <!-- <span class="undo-buttonText">{{ undo }}</span> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: String
  },

  computed: {
    // undo() {
    //   return 'UNDO';
    // }
  }
};
</script>

<style scoped lang="scss">
.confirmation {
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

    // font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    display: flex;
    align-items: center;

    color: #7B7D7E;

    margin-left: 8px;
    margin-right: 16px;
    margin-top: 13px;
    margin-bottom: 12px;
  }

  &-right {
    width: 48px;
    height: 16px;

    font-family: Helvetica Neue;
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
</style>

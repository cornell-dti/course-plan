<template>
  <div class="binary-button">
    <div
      @click="onClick(true)"
      :class="{ 'binary-button-selected': leftChosen }"
      class="binary-button-child"
    >
      <img
        v-if="leftChosen"
        class="confirmation-icon binary-button-check"
        src="@/assets/images/check.svg"
        alt="checkmark"
      />
      <div>
        {{ choices[0] }}
      </div>
      <img v-if="leftChosen" class="confirmation-icon hidden" src="@/assets/images/check.svg" />
    </div>
    <div
      @click="onClick(false)"
      :class="{ 'binary-button-selected': !leftChosen }"
      class="binary-button-child"
    >
      <img
        v-if="!leftChosen"
        class="confirmation-icon binary-button-check"
        src="@/assets/images/check.svg"
        alt="checkmark"
      />
      <div>
        {{ choices[1] }}
      </div>
      <img v-if="!leftChosen" class="confirmation-icon hidden" src="@/assets/images/check.svg" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    choices: Array,
  },
  data() {
    return {
      leftChosen: true,
    };
  },
  methods: {
    onClick(left) {
      this.leftChosen = left;
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.binary-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
  height: 36px;
  border: 1px solid $emGreen;
  border-radius: 4px;
  color: $emGreen;
  margin-bottom: 20px;
  cursor: pointer;
  &-child {
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    line-height: 36px;
    width: 204px;
  }
  &-selected {
    background: $emGreen;
    color: $white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .hidden {
      visibility: hidden;
    }
  }
  &-check {
    padding-left: 7px;
  }
}
</style>

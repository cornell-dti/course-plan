<template>
  <div class="requirement-radio-button">
    <div
      v-for="choice in choices"
      :key="choice.id"
      @click="onClick(choice.id)"
      :class="{ 'requirement-radio-button-selected': chosenID === choice.id }"
      class="requirement-radio-button-child"
    >
      <img
        v-if="chosenID === choice.id"
        class="confirmation-icon requirement-radio-button-check"
        src="@/assets/images/check.svg"
        alt="checkmark"
      />
      <div class="radio-button-text">{{ choice.name }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    chosenID: { type: String, required: true },
    choices: {
      type: Array as PropType<readonly { readonly id: string; readonly name: string }[]>,
      required: true,
    },
  },
  methods: {
    onClick(id: string) {
      this.$emit('on-select', id, this.choices);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.requirement-radio-button {
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
    font-weight: 500;
    font-size: 14px;
    line-height: 36px;
    width: 204px;
  }
  & .radio-button-text {
    flex: 1 1 auto;
    text-align: center;
  }
  &-selected {
    background: $emGreen;
    color: $white;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    & .radio-button-text {
      margin-left: -21px;
    }
  }
  &-check {
    padding: 0 7px;
    width: 2rem;
  }
}
</style>

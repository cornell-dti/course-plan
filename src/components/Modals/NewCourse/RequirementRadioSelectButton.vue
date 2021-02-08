<template>
  <div class="binary-button">
    <div
      v-for="choice in choices"
      :key="choice.id"
      @click="onClick(choice.id)"
      :class="{ 'binary-button-selected': chosenID === choice.id }"
      class="binary-button-child"
    >
      <img
        v-if="chosenID === choice.id"
        class="confirmation-icon binary-button-check"
        src="@/assets/images/check.svg"
        alt="checkmark"
      />
      <div>
        {{ choice.name }}
      </div>
      <img
        v-if="chosenID === choice.id"
        class="confirmation-icon hidden"
        src="@/assets/images/check.svg"
      />
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

<template>
  <div
    class="edit-requirement"
    :class="{ 'edit-requirement-selected': selected, 'edit-requirement-pointer': isClickable }"
    v-on="isClickable ? { click: () => onClick() } : { click: $event => $event.preventDefault() }"
  >
    <img
      v-if="selected"
      class="confirmation-icon edit-requirement-check"
      src="@/assets/images/check.svg"
      alt="checkmark"
    />
    <div class="edit-requirement-text" :class="{ 'edit-requirement-multiline': multiline }">
      {{ name }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    name: String,
    selected: Boolean,
    isClickable: Boolean,
  },
  data() {
    return {
      isSelected: false,
    };
  },
  computed: {
    multiline(): boolean {
      return this.selected ? this.name.length >= 26 : this.name.length > 30;
    },
  },
  methods: {
    onClick() {
      this.$emit('on-select');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.edit-requirement {
  border: 1px solid $emGreen;
  box-sizing: border-box;
  border-radius: 4px;
  color: $emGreen;
  height: 36px;
  width: 196px;
  margin-bottom: 20px;
  &-text {
    line-height: 36px;
    font-weight: 500;
    font-size: 14px;
    text-align: center;
  }
  &-selected {
    @extend .edit-requirement, .edit-requirement-text;
    background: $emGreen;
    color: $white;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  &-multiline {
    line-height: 17px;
  }
  &-pointer {
    cursor: pointer;
  }
  &-check {
    padding: 0 7px;
    width: 2rem;
  }
}
</style>

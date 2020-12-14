<template>
  <div
    class="edit-requirement"
    :class="{ 'edit-requirement-selected': selected, 'edit-requirement-pointer': isClickable }"
    v-on="isClickable ? { click: () => onClick() } : { click: $event => $event.preventDefault() }"
  >
    <img
      v-if="selected"
      class="confirmation-icon edit-requirement-check"
      src="/images/check.svg"
    />
    <div class="edit-requirement-text" :class="{ 'edit-requirement-multiline': multiline }">
      {{ name }}
    </div>
    <img v-if="selected" class="confirmation-icon hidden" src="/images/check.svg" />
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    selected: Boolean,
    isClickable: Boolean,
  },
  data() {
    return {
      multiline: this.selected ? this.name.length >= 24 : this.name.length > 30,
    };
  },
  methods: {
    onClick() {
      this.selected = !this.selected;
    },
  },
};
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
    justify-content: space-between;
    .hidden {
      visibility: hidden;
    }
  }
  &-multiline {
    line-height: 17px;
  }
  &-pointer {
    cursor: pointer;
  }
  &-check {
    padding-left: 7px;
  }
}
</style>

<template>
  <div
    class="edit-requirement"
    :class="{'edit-requirement-selected': selected, 'edit-requirement-pointer': isClickable}"
    v-on="isClickable ? { click: () => onClick() } : {click: ($event) => $event.preventDefault() }"
  >
    <img v-if="selected" class="confirmation-icon" src="../assets/images/check.svg" />
    <div
      class="edit-requirement-text"
      :class="{'edit-requirement-multiline': multiline}"
    >
      {{ name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    selected: Boolean,
    isClickable: Boolean
  },
  data() {
    return {
      multiline: this.selected ? this.name.length >= 24 : this.name.length > 30
    };
  },
  methods: {
    onClick() {
      this.selected = !this.selected;
    }
  }
};
</script>

<style scoped lang="scss">
  .edit-requirement {
    border: 1px solid #2BBCC6;
    box-sizing: border-box;
    border-radius: 4px;
    color: #2BBCC6;
    height: 36px;
    width: 196px;
    margin-bottom: 20px;
    &-text{
      line-height: 36px;
      font-weight: 500;
      font-size: 14px;
      text-align: center;
    }
    &-selected {
      @extend .edit-requirement, .edit-requirement-text;
      background: #2BBCC6;
      color: #FFFFFF;
      display: flex;
      flex-direction: row;
      img {
        padding-left: 7px;
        padding-right: 10px;
      }
    }
    &-multiline {
      line-height: 17px;
    }
    &-pointer {
      cursor: pointer;
    }
  }
</style>

<template>
  <svg
    viewBox="0 0 15 15"
    :class="{ 'arrow-up': isFlipped, 'arrow-left': isPointingLeft }"
    class="arrow"
    :fill="fillColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14.1424 7.07107L7.07129 14.1421L0.000221372 7.07107H14.1424Z" />
  </svg>
</template>

<script>
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    fillColor: String,
    isFlipped: Boolean,
    isPointingLeft: Boolean,
  },
});
</script>

<style scoped lang="scss">
.arrow {
  height: 14px;
  width: 14px;
  margin-top: -4px;
  &-left {
    height: 14px;
    width: 14px;
    margin-top: 1px;
    transform: rotate(90deg);
  }
  &-up {
    height: 14px;
    width: 14px;
    margin-top: 1px;
    transform: rotate(180deg);
  }
}
</style>

<template>
  <svg
    viewBox="0 0 15 15"
    :class="{
      'arrow-up': isFlipped,
      'arrow-left': isPointingLeft,
      'arrow-up-header': isHeader && isFlipped,
      subreq: isSubReq && !isFlipped,
      'subreq-flipped': isSubReq && isFlipped,
    }"
    class="arrow"
    :fill="fillColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14.1424 7.07107L7.07129 14.1421L0.000221372 7.07107H14.1424Z" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    fillColor: { type: String, required: true },
    isFlipped: { type: Boolean, default: false },
    isPointingLeft: { type: Boolean, default: false },
    isHeader: { type: Boolean, default: false },
    isSubReq: { type: Boolean, default: false },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
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
    &-header {
      margin-top: 0;
      margin-bottom: -6px;
    }
  }
}
.subreq {
  margin-top: -6px;
  &-flipped {
    margin-top: 4px;
  }
}
</style>

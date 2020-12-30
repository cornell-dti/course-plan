<template>
  <div
    class="bottombartitle"
    :style="{ background: `#${color}` }"
    v-bind:class="{ expandedBottomBarTitle: isExpanded }"
  >
    <div class="bottombar-square-title">{{ name }}</div>
    <img
      v-if="!isExpanded"
      class="bottombartitle-arrow"
      src="@/assets/images/uparrow-white.svg"
      alt="collapse bottom bar class"
    />
    <img
      v-if="isExpanded"
      class="bottombartitle-arrow"
      src="@/assets/images/downarrow-white.svg"
      alt="expand bottom bar class"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    color: String,
    name: String,
    isExpanded: Boolean,
  },
});
</script>

<style scoped lang="scss">
.bottombartitle {
  padding-left: 0.5rem;
  height: 2.5rem;
  line-height: 40px;
  background-color: #25a2aa;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  filter: brightness(100%);

  position: fixed;
  bottom: 0rem;
  width: 100%;

  left: 29.5rem;
  width: calc(100vw - 29.5rem);

  &:hover {
    filter: brightness(95%);
    transition: all 0.2s ease;
  }

  .bottombar-square-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.bottombartitle-arrow {
  position: absolute;
  right: 2%;
  top: 40%;
}

.expandedBottomBarTitle {
  position: fixed;
  bottom: 16.25rem;
}

@media only screen and (max-width: 976px) {
  .bottombartitle {
    left: 25.5rem;
    width: calc(100vw - 25.5rem);
  }
}

@media only screen and (max-width: 878px) {
  .bottombartitle {
    left: 0rem;
    width: 100%;
  }
}

@media only screen and (max-width: 440px) {
  .expandedBottomBarTitle {
    bottom: 9.25rem;
  }
}
</style>

<template>
  <div class="bottombartitle" :style="{ background: `#${color}` }" v-bind:class="{ expandedBottomBarTitle: isExpanded }">
    <div class="bottombar-square-title">{{ name }}</div>
  </div>
</template>

<script>

export default {
  props: {
    color: String,
    name: String,
    isExpanded: Boolean
  }
};

</script>

<style scoped lang="scss">
.bottombartitle {
  padding-left: 24px;
  height: 40px;
  line-height: 40px;
  background-color: #25A2AA;
  color: #FFF;
  font-size: 16px;
  cursor: pointer;
  filter: brightness(100%);

  // TODO: change to rem
  position: fixed;
  bottom: 0px;
  width: 100%;

  left: 29.5rem;
  width: calc(100vw - 29.5rem);

  &:hover {
    filter: brightness(95%);
    transition: all 0.2s ease;
  }
}

.expandedBottomBarTitle{
    position: fixed;
    bottom: 260px;
}

</style>

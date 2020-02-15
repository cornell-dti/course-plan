<template>
  <div class="bottombartitle" :style="{ background: `#${color}` }">
    <div class="bottombar-square-title">{{ name }}</div>
  </div>
</template>

<script>

export default {
  props: {
    color: String,
    name: String
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
  bottom: 260px;
  width: 100%;

  &:hover {
    filter: brightness(95%);
    transition: all 0.2s ease;
  }
}

</style>

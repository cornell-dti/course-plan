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
  padding-left: 1.5rem;
  height: 2.5rem;
  line-height: 40px;
  background-color: #25A2AA;
  color: #FFF;
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
}

.expandedBottomBarTitle{
    position: fixed;
    bottom: 16.25rem;
}

@media only screen and (max-width: 976px) {
  .bottombartitle {
    left: 25.5rem;
    width: calc(100vw - 25.5rem);
  }
}

// @media only screen and (max-width: 1347px) {
//   .bottombartitle {
//     left: 0rem;
//     width: 100%;
//   }
// }

</style>

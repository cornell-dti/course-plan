<template>
  <div class="toolsContainer">
    <div class="toolsContainer-header">
      <div class="toolsContainer-title">
        <span><strong>Hi Courseplanner!</strong></span>
      </div>
      <div class="toolsContainer-subtitle">
        <span>Here are some resources to help you plan.</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.toolsContainer {
  background-color: #f6fafc;
  padding: 3rem 7rem;

  &-title {
    font-size: 40px;
    color: #3c3c3c;
  }

  &-subtitle {
    font-size: 24px;
    color: #757575;
  }
}

@media only screen and (max-width: $medium-breakpoint) {
  .toolsContainer {
    padding: 5rem 4rem;

    &-title {
      font-size: 30px;
    }

    &-subtitle {
      font-size: 12px;
    }
  }
}
</style>

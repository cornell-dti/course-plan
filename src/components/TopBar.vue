<template>
  <div class="container p-0">
    <div class="row top-bar justify-content-between no-gutters">
      <div class="col-10">
        <img class="logo" src="@/assets/images/branding/logoWithText.svg" alt="logo" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style scoped lang="scss">
.logo {
  width: 12rem;
}
.container {
  max-width: 100%;
}
.top-bar {
  padding: 3.75rem 0px 0px 6.5rem;

  @media (max-width: 1154px) {
    padding: 3.75rem 6.5rem 0px 6.5rem;
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 1154px) {
  .top-bar {
    padding: 3.125rem;
  }
}
</style>

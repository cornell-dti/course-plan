<template>
  <div id="app">
    <router-view :class="{ 'disable-scroll': isModalOpen }" />
    <div id="modalTarget"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';

export default defineComponent({
  computed: {
    isModalOpen() {
      return store.state.isTeleportModalOpen;
    },
  },
});
</script>

<style scoped lang="scss">
.disable-scroll {
  height: 100vh;
  overflow-y: hidden;
}
</style>

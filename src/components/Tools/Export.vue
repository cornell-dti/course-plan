<template>
  <div class="export">
    <img src="@/assets/images/download.svg" alt="export schedule" @click="exportSchedule" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import genPDF from '@/export-plan';

export default defineComponent({
  methods: {
    async exportSchedule() {
      await genPDF();
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.export {
  width: 30px;
  img:hover {
    cursor: pointer;
  }
}
</style>

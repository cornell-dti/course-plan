<template>
  <div class="export">
    <img class="export-icon" src="@/assets/images/download.svg" alt="export schedule" />
    <span class="export-text">Export your schedule as PDF and share with your friends!</span>
    <button class="export-button" @click="exportSchedule">Download</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { generatePDF } from '@/tools/export-plan';

export default defineComponent({
  methods: {
    async exportSchedule() {
      generatePDF();
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.export {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  &-text {
    text-align: center;
    margin-bottom: 1rem;
  }

  &-icon {
    size: 2rem;
    margin-bottom: 1rem;
  }

  &-button {
    border-radius: 3px;
    background-color: #4d7d92;
    color: white;
    font-size: 1rem;
    padding: 0.25rem 0 0.25rem 0;
    width: 75%;
  }
}
</style>

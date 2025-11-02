<template>
  <div class="card">
    <div class="card-top">
      <div class="card-name">{{ name }}</div>
    </div>
    <hr class="card-divider" />
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.card {
  box-sizing: border-box;
  box-shadow: 0 0 10px 4px $boxShadowGray;
  position: relative;
  border-radius: 10px;
  border-width: 0;
  align-items: center;
  background-color: $white;
  margin: 0;

  &-top {
    :first-child {
      margin-right: auto;
    }

    :last-child {
      margin-left: auto;
    }

    display: flex;
    width: 100%;
    height: 50px;
    min-height: 50px;
    justify-content: center;
    align-items: center;
  }

  &-divider {
    width: calc(100% - 64px);
    align-self: center;
    margin: 0;
  }

  &-content {
    margin: 0.875rem 2rem 0.875rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% - 64px);
    height: 100%;
  }

  &-name {
    display: flex;
    font-size: 16px;
    color: #192a3e;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

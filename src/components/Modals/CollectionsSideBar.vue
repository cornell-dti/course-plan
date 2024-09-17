<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="separator-header"></div>
      <h1 class="top header-title">Collections</h1>
    </div>
    <div>
      <button class="dropdown-item-button">
        <img src="@/assets/images/dropdown.svg" alt="open dropdown" class="hover-image" />
        <span class="dropdown-header-title">All</span>
      </button>
      <div class="separator"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// import store from '@/store';

export default defineComponent({
  // components: {},
  // props: {},
  // emits: [],
  // // data() {
  // // },
  // computed: {},
  // methods: {},
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.sidebar {
  width: 22.5rem;
  z-index: 100;
  height: 100%;
  position: fixed;

  &-header {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
}

.serparator-header {
  width: 335px;
  height: 2px;
  background: #587c91;
}

.top.header-title {
  margin: 1.5rem 0 0rem 0;

  &-small {
    margin: 0px;
  }
}

.dropdown-item-button {
  display: flex;
  width: 335px;
  padding: 15px 2px;
  align-items: center;
  gap: 14px;
  border: none;
  background: none;
  cursor: pointer;
}

.dropdown-item-placeholder {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 15.994px;
  height: 11.994px;
  flex-shrink: 0;
}

.dropdown-header-title {
  display: flex;
  align-items: center;
  width: 226px;
  height: 17.126px;
  color: #3c3c3c;
  font-size: 14px;
  font-style: bold;
  font-weight: 700;
  line-height: normal;
}

.separator {
  width: 335px;
  height: 2px;
  background: rgba(196, 196, 196, 0.4);
}
</style>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="serparator-header"></div>
      <h1 class="top header-title">Collections</h1>
    </div>
    <div>
      <div class="dropdown-item">
        <img
          src="@/assets/images/dropdown.svg"
          class="dropdown-item-placeholder"
          alt="open dropdown"
        />
        <div class="dropdown-header-title">All</div>
      </div>
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

.top {
  margin: 1.5rem 0 0rem 0;

  &-small {
    margin: 0px;
  }
}

.dropdown-item {
  display: flex;
  &:hover {
    border-radius: 9px;
    background: rgba(20, 132, 129, 0.2);
  }
  width: 352px;
  padding: 15px 2px;
  align-items: center;
  gap: 14px;
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

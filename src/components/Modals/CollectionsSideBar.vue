<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h1 class="top header-title">Collections</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import store from '@/store';

export default defineComponent({
  components: {},
  props: {},
  emits: ['openCollectionModal'],
  computed: {},
  methods: {
    // open the collection modal
    openCollectionModal() {
      this.$emit('openCollectionModal');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.sidebar {
  width: 25rem;
  background-color: $white;
  padding: 1.625rem 1.5rem;
  overflow-y: scroll;

  &-header {
    margin-bottom: 1rem;
  }
}

.top {
  margin: 1.5rem 0 1rem 0;

  &-small {
    margin: 0px;
  }
}

.header-title {
  color: $darkGray;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
}
</style>

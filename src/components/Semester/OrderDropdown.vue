<template>
  <div class="dropdown">
    <button class="dropdown-button" data-cyId="dropdown-button">
      <img class="dropdown-button--image" />
      View
    </button>
    <div class="dropdown-content">
      <order-dropdown-option
        :selected="!compact"
        image="/src/assets/images/schedule-view/view-settings/default-sem.svg"
        label="Default"
        @click.stop="$emit('click-compact', false)"
      />
      <order-dropdown-option
        :selected="compact"
        image="/src/assets/images/schedule-view/view-settings/four-column.svg"
        label="Compact"
        @click.stop="$emit('click-compact', true)"
      />
      <div class="dropdown-content--hline" />
      <order-dropdown-option
        :selected="orderByNewest"
        image="/src/assets/images/schedule-view/view-settings/newest-arrow.svg"
        label="Newest"
        @click.stop="onOrderClick(true)"
      />
      <order-dropdown-option
        :selected="!orderByNewest"
        image="/src/assets/images/schedule-view/view-settings/oldest-arrow.svg"
        label="Oldest"
        @click.stop="onOrderClick(false)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import { toggleOrderByNewest } from '@/global-firestore-data';
import OrderDropdownOption from './OrderDropdownOption.vue';

export default defineComponent({
  components: { OrderDropdownOption },
  props: {
    compact: { type: Boolean, required: true },
  },

  computed: {
    orderByNewest() {
      return store.state.orderByNewest;
    },
  },

  emits: {
    'click-compact': (value: boolean) => typeof value === 'boolean',
  },

  methods: {
    onOrderClick(orderByNewest: boolean) {
      if (orderByNewest !== this.orderByNewest) {
        toggleOrderByNewest();
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.dropdown {
  z-index: 999;
  position: relative;
  float: right;
  &-button {
    &--image {
      margin-right: 0.3em;
      width: 1em;
      content: url('@/assets/images/schedule-view/view-settings/settings.svg');
      :hover > & {
        content: url('@/assets/images/schedule-view/view-settings/settings-on-hover.svg');
      }
    }
    border: none;
    display: flex;
    align-items: center;
    line-height: 19px;
    font-size: 19px;
    color: $inactiveGray;
    padding-bottom: 0.5rem;
    &:hover {
      color: $viewButtonBlue;
    }
  }
  &-content {
    display: none;
    position: absolute;
    right: 0;
    border-radius: 8px;
    min-height: 2.5rem;
    min-width: 12rem;
    align-items: center;
    padding: 0.5rem 0rem 0.5rem 0rem;
    background-color: $white;
    border: 1px solid $borderGray;
    box-sizing: border-box;
    box-shadow: 0px 5px 8px 2px $boxShadowGray;
    border-radius: 4px;
    :hover > & {
      display: flex;
      flex-direction: column;
    }
    &--hline {
      width: calc(100% - 2rem);
      height: 0;
      border: 0.5px solid $hlineGray;
      margin: 0.5rem 0rem 0.5rem 0rem;
    }
  }
}
</style>

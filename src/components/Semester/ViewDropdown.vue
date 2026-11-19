<template>
  <div
    v-click-outside="close"
    class="dropdown"
    :data-intro-group="dataIntroGroup"
    :data-intro="dataIntro"
    :data-disable-interaction="dataDisableInteraction"
    :data-step="dataStep"
    :data-tooltipClass="dataTooltipClass"
  >
    <button class="dropdown-button" data-cyId="dropdown-button" @click="toggle">
      <img class="dropdown-button--image" />
      <span class="dropdown-button--label">View</span>
    </button>
    <div v-if="open" class="dropdown-content">
      <view-dropdown-option
        alt="not compact"
        :selected="!compact"
        :image="defaultSem"
        label="Default"
        @click="$emit('click-compact', false)"
      />
      <view-dropdown-option
        alt="compact"
        :selected="compact"
        :image="compactSem"
        label="Compact"
        @click="$emit('click-compact', true)"
      />
      <div class="dropdown-content--hline" />
      <view-dropdown-option
        alt="order by newest"
        :selected="orderByNewest"
        :image="newestArrow"
        label="Newest"
        @click="onOrderClick(true)"
      />
      <view-dropdown-option
        alt="order by oldest"
        :selected="!orderByNewest"
        :image="oldestArrow"
        label="Oldest"
        @click="onOrderClick(false)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import { setOrderByNewest } from '@/global-firestore-data/user-semesters';
import defaultSem from '@/assets/images/views/twoColumnSelected.svg';
import compactSem from '@/assets/images/views/fourColumnSelected.svg';
import newestArrow from '@/assets/images/views/newestArrow.svg';
import oldestArrow from '@/assets/images/views/oldestArrow.svg';
import { clickOutside } from '@/utilities';
import ViewDropdownOption from './ViewDropdownOption.vue';

const requiredStringProp = { type: String, reqiured: true, default: '' };

export default defineComponent({
  components: { ViewDropdownOption },
  props: {
    compact: { type: Boolean, required: true },
    dataIntroGroup: requiredStringProp,
    dataIntro: requiredStringProp,
    dataDisableInteraction: requiredStringProp,
    dataStep: requiredStringProp,
    dataTooltipClass: requiredStringProp,
  },
  data() {
    return {
      open: false,
      defaultSem,
      compactSem,
      newestArrow,
      oldestArrow,
    };
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
      setOrderByNewest(orderByNewest);
    },
    toggle() {
      this.open = !this.open;
    },
    close() {
      this.open = false;
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_tokens.scss';
.dropdown {
  z-index: 2;
  position: relative;
  &-button {
    @include cp-button-secondary;
    gap: 8px;
    padding-left: 12px;
    &--label {
      color: $cp-ink;
    }
    &--image {
      width: 14px;
      content: url('@/assets/images/views/settings.svg');
    }
  }
  &-content {
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px;
    background: #fff;
    border: 1px solid $cp-line;
    border-radius: $cp-r-md;
    box-shadow: $cp-shadow-pop;
    animation: cp-in 160ms ease-out both;
    &--hline {
      height: 1px;
      margin: 2px 0;
      background: $cp-line;
    }
  }
}
@keyframes cp-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>

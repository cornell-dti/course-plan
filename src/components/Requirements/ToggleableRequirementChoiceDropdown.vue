<template>
  <div class="toggleable-requirements-select-wrapper">
    <div
      class="toggleable-requirements-select toggleable-requirements-input"
      v-click-outside="closeMenuIfOpen"
    >
      <div
        class="toggleable-requirements-dropdown-placeholder toggleable-requirements-dropdown-wrapper"
        @click="showFulfillmentOptionsDropdown = !showFulfillmentOptionsDropdown"
      >
        <span>{{ selectedFulfillmentOption }}</span>
      </div>
      <div
        class="toggleable-requirements-dropdown-placeholder toggleable-requirements-dropdown-arrow"
      ></div>
    </div>
    <div class="toggleable-requirements-dropdown-content" v-if="showFulfillmentOptionsDropdown">
      <div
        v-for="optionName in Object.keys(toggleableRequirement.fulfillmentOptions)"
        :key="optionName"
        class="toggleable-requirements-dropdown-content-item"
        @click="chooseFulfillmentOption(optionName)"
      >
        <span>{{ optionName }}</span>
      </div>
    </div>
    {{ toggleableRequirement.fulfillmentOptions[selectedFulfillmentOption].description }}
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

import { clickOutside } from '@/utilities';

export default defineComponent({
  props: {
    toggleableRequirement: {
      type: Object as PropType<ToggleableRequirementFulfillmentInformation & { id: string }>,
      required: true,
    },
    toggleableRequirementChoice: { type: String, default: null },
  },
  emits: {
    changeToggleableRequirementChoice(id: string, option: string) {
      return typeof id === 'string' && typeof option === 'string';
    },
  },
  data() {
    return { showFulfillmentOptionsDropdown: false };
  },
  computed: {
    selectedFulfillmentOption(): string {
      if (this.toggleableRequirement.fulfilledBy !== 'toggleable') {
        return '';
      }
      return (
        this.toggleableRequirementChoice ||
        Object.keys(this.toggleableRequirement.fulfillmentOptions)[0]
      );
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  methods: {
    closeMenuIfOpen() {
      this.showFulfillmentOptionsDropdown = false;
    },
    chooseFulfillmentOption(option: string) {
      this.showFulfillmentOptionsDropdown = false;
      this.$emit('changeToggleableRequirementChoice', this.toggleableRequirement.id, option);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_tokens.scss';

.toggleable-requirements {
  &-select {
    @include cp-input;
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    margin: 0 0 8px;
    padding: 0 12px 0 0;
    cursor: pointer;

    &:hover {
      background: $cp-hover;
    }

    &--disabled {
      background: #fff;
      border-color: $cp-disabled;
      color: $cp-disabled-ink;
      pointer-events: none;
    }

    &-wrapper {
      @include cp-text(13px, 18px);
      position: relative;
      color: $cp-ink;
    }
  }
  &-dropdown {
    &-placeholder {
      display: flex;
      align-items: center;
      background: transparent;
      color: $cp-ink;
    }
    &-wrapper {
      flex: 1;
      padding: 8px 12px;
    }
    &-innerPlaceholder {
      margin: 4px 0;
      width: 100%;
    }
    &-arrow {
      @include cp-css-chevron;
    }
    &-content {
      @include cp-menu;
      z-index: 2;
      position: absolute;
      width: 100%;
      margin-top: -4px;
      &-item {
        @include cp-menu-item;
      }
    }
  }
}
</style>

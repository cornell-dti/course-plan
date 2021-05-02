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
@import '@/assets/scss/_variables.scss';

.toggleable-requirements {
  &-select {
    display: flex;
    flex-direction: row;
    align-items: center;
    background: $white;
    border: 0.5px solid $inactiveGray;
    box-sizing: border-box;
    border-radius: 2px;
    width: 100%;
    font-size: 14px;
    line-height: 17px;
    color: $darkPlaceholderGray;
    position: relative;
    min-height: 1.625rem;
    margin: 0.75rem 0;

    &:not(:first-child) {
      margin-top: 0.5rem;
    }

    &--disabled {
      opacity: 0.3;
      pointer-events: none;
    }

    &-wrapper {
      position: relative;
      margin-bottom: 1rem;
    }
  }
  &-dropdown {
    &-placeholder {
      height: 100%;
      font-size: 14px;
      line-height: 17px;
      margin-left: 0.5rem;
      display: flex;
      align-items: center;
      color: $lightPlaceholderGray;
      background: transparent;
      cursor: pointer;
    }
    &-wrapper {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
    }
    &-innerPlaceholder {
      margin-top: 5px;
      margin-bottom: 5px;
      width: 100%;
    }
    &-arrow {
      border-left: 6.24px solid transparent;
      border-right: 6.24px solid transparent;
      border-top: 6.24px solid $inactiveGray;
      background: transparent;
      margin-right: 8.7px;
      margin-left: 5px;
      margin-top: auto;
      margin-bottom: auto;
    }
    &-content {
      z-index: 2;
      position: absolute;
      width: 100%;
      background: $white;
      box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
      border-radius: 7px;
      margin-top: 3px;
      &-item {
        height: 2.25rem;
        font-size: 14px;
        line-height: 17px;
        display: flex;
        align-items: center;
        color: $lightPlaceholderGray;
        padding-left: 10px;
        cursor: pointer;

        &:first-child {
          border-radius: 7px 7px 0px 0px;
        }

        &:last-child {
          border-radius: 0px 0px 7px 7px;
        }
      }
    }
  }
  &-dropdown-content div:hover {
    background: rgba(50, 160, 242, 0.15);
    width: 100%;
  }
}
</style>

<template>
  <div
    :class="columnWide ? 'onboarding-select--columnWide' : 'onboarding-select--column'"
    :style="{ borderColor: boxBorder }"
    v-click-outside="closeDropdownIfOpen"
  >
    <label class="onboarding-label">{{ propertyName }}</label>
    <div class="onboarding-select onboarding-input">
      <div
        class="onboarding-dropdown-placeholder college-major-minor-wrapper"
        @click="showHideContent()"
      >
        <div
          class="onboarding-dropdown-placeholder college-major-minor-placeholder"
          :style="{ color: placeholderColor }"
        >
          {{ choice }}
        </div>
        <div
          class="onboarding-dropdown-placeholder college-test-credits-arrow"
          :style="{ borderTopColor: arrowColor }"
        ></div>
        <div
          class="onboarding-dropdown-placeholder college-arrow"
          :style="{ borderTopColor: arrowColor }"
        ></div>
      </div>
      <div class="onboarding-dropdown-content college-content" v-if="shown">
        <div
          v-for="(option, index) in availableOptions"
          :key="index"
          class="onboarding-dropdown-content-item"
          @click="selectChoice(option)"
        >
          {{ option }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { clickOutside } from '@/utilities';
import { inactiveGray, yuxuanBlue, lightPlaceholderGray } from '@/assets/constants/scss-variables';

const placeholderText = 'Select one';

export default defineComponent({
  props: {
    propertyName: { type: String, required: true },
    columnWide: { type: Boolean, required: true },
    availableOptions: { type: Array as PropType<readonly unknown[]>, required: true },
    choice: { type: [String, Number], required: true },
  },
  emits: {
    // Need any to pass emit type checker
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'on-select': (choice: any) => choice !== undefined,
  },
  data() {
    return {
      shown: false,
      stopClose: false,
      boxBorder: '',
      arrowColor: '',
      placeholderColor: this.choice && this.choice !== placeholderText ? lightPlaceholderGray : '',
    };
  },
  directives: {
    'click-outside': clickOutside,
  },
  methods: {
    showHideContent() {
      const contentShown = this.shown;
      this.shown = !contentShown;
      if (contentShown) {
        this.boxBorder = inactiveGray;
        this.arrowColor = inactiveGray;
      } else {
        this.boxBorder = yuxuanBlue;
        this.arrowColor = yuxuanBlue;
      }
    },
    closeDropdownIfOpen() {
      if (this.stopClose) {
        this.stopClose = false;
      } else if (this.shown) {
        this.shown = false;
        this.boxBorder = inactiveGray;
        this.arrowColor = inactiveGray;
      }
    },
    selectChoice(choice: unknown) {
      this.$emit('on-select', choice);
      this.shown = false;
      this.arrowColor = inactiveGray;
      this.boxBorder = inactiveGray;
      this.placeholderColor = lightPlaceholderGray;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

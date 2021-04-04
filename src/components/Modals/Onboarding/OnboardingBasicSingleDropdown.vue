<template>
  <div
    class="onboarding-selectWrapperRow"
    :style="{ borderColor: boxBorder }"
    v-click-outside="closeDropdownIfOpen"
  >
    <div class="onboarding-select onboarding-input">
      <div
        class="onboarding-dropdown-placeholder college-major-minor-wrapper"
        @click="showHideDropdown()"
      >
        <div
          class="onboarding-dropdown-placeholder college-major-minor-placeholder"
          :style="{ color: placeholderColor }"
        >
          {{ availableChoices[choice] || 'Select one' }}
        </div>
        <div
          class="onboarding-dropdown-placeholder college-major-minor-arrow"
          :style="{ borderTopColor: arrowColor }"
        ></div>
      </div>
      <div class="onboarding-dropdown-content" v-if="shown">
        <div
          v-for="(fullName, key) in availableChoices"
          :key="key"
          class="onboarding-dropdown-content-item"
          ref="scrollRef"
          @click="onSelect(key)"
        >
          {{ fullName }}
        </div>
      </div>
    </div>
    <button
      class="onboarding-remove"
      @click="onRemove()"
      :class="{
        'onboarding--hidden': cannotBeRemoved,
      }"
    >
      <img src="@/assets/images/x-green.svg" alt="x to delete dropdown" />
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { clickOutside } from '@/utilities';
import { inactiveGray, yuxuanBlue, lightPlaceholderGray } from '@/assets/scss/_variables.scss';

export default Vue.extend({
  props: {
    /** Mapping from acronym to full name */
    availableChoices: {
      type: Object as PropType<Readonly<Record<string, string>>>,
      required: true,
    },
    choice: { type: String, required: true },
    cannotBeRemoved: { type: Boolean, required: true },
    scrollBottomToIndex: { type: Number, default: 0 },
  },
  data() {
    return {
      shown: false,
      stopClose: false,
      boxBorder: '',
      arrowColor: '',
      placeholderColor: this.choice !== '' ? lightPlaceholderGray : '',
    };
  },
  directives: {
    'click-outside': clickOutside,
  },
  methods: {
    showHideDropdown() {
      const contentShown = this.shown;
      this.shown = !contentShown;

      if (contentShown) {
        // clicked box when content shown. So then hide content
        this.boxBorder = inactiveGray;
        this.arrowColor = inactiveGray;
      } else {
        this.boxBorder = yuxuanBlue;
        this.arrowColor = yuxuanBlue;
      }

      // scroll the bottom of the graduation year dropdown to scrollBottomToIndex
      if (!contentShown && this.scrollBottomToIndex > 0) {
        this.$nextTick(() => {
          const el = (this.$refs.scrollRef as Element[])[this.scrollBottomToIndex];
          el.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        });
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
    onSelect(acronym: string) {
      this.shown = false;
      this.arrowColor = inactiveGray;
      this.boxBorder = inactiveGray;
      this.placeholderColor = lightPlaceholderGray;
      this.$emit('on-select', acronym);
    },
    onRemove() {
      this.$emit('on-remove');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

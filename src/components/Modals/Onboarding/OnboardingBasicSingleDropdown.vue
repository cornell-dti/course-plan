<template>
  <div
    class="onboarding-selectWrapperRow"
    :style="{ borderColor: boxBorder }"
    v-click-outside="closeDropdownIfOpen"
  >
    <div class="onboarding-select onboarding-input" data-cyId="onboarding-dropdown">
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
          :ref="`scroll-ref-${key}`"
          @click="onSelect(key)"
          data-cyId="onboarding-dropdownItem"
        >
          {{ fullName }}
        </div>
      </div>
    </div>
    <button class="onboarding-remove" @click="onRemove()" v-if="!cannotBeRemoved">
      <img src="@/assets/images/x-green.svg" alt="x to delete dropdown" />
    </button>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { clickOutside } from '@/utilities';
import { inactiveGray, yuxuanBlue, lightPlaceholderGray } from '@/assets/scss/_variables.scss';

export default defineComponent({
  props: {
    /** Mapping from acronym to full name */
    availableChoices: {
      type: Object as PropType<Readonly<Record<string, string>>>,
      required: true,
    },
    choice: { type: String, required: true },
    cannotBeRemoved: { type: Boolean, required: true },
    scrollBottomToElement: { type: Number, default: 0 },
  },
  emits: {
    'on-select': (acronym: string) => typeof acronym === 'string',
    'on-remove': () => true,
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

      // scroll the bottom of the graduation year dropdown to scrollBottomToElement
      if (!contentShown && this.scrollBottomToElement > 0) {
        // @ts-expect-error: weird complaints about emit string type not assignable
        this.$nextTick(() => {
          (this.$refs[`scroll-ref-${this.scrollBottomToElement}`] as Element).scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
          });
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
      this.placeholderColor = '';
      this.$emit('on-remove');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

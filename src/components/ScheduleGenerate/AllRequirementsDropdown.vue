<template>
  <div
    class="requirementDropdown-selectWrapperRow"
    :style="{ borderColor: boxBorder }"
    v-click-outside="closeDropdownIfOpen"
  >
    <div class="requirementDropdown-select requirementDropdown-input">
      <div
        class="requirementDropdown-dropdown-placeholder requirement-wrapper"
        @click="showHideDropdown()"
      >
        <input
          type="text"
          class="requirementDropdown-dropdown-placeholder requirement-placeholder"
          :style="{ color: placeholderColor, border: 'none', outline: 'none' }"
          :placeholder="prevQuery || 'Select Requirement'"
          v-model="curQuery"
          tabindex="-1"
          ref="selectbox"
          @keyup="onKeyUp"
        />
        <div
          class="requirementDropdown-dropdown-placeholder requirement-arrow"
          :style="{ borderTopColor: arrowColor }"
        ></div>
      </div>
      <div class="requirementDropdown-dropdown-content" v-if="shown">
        <div
          v-for="[key, fullName] in foundChoices"
          :key="key"
          class="requirementDropdown-dropdown-content-item"
          :ref="`scroll-ref-${key}`"
          @click="onSelect([key, fullName])"
        >
          {{ fullName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { clickOutside } from '@/utilities';
import { inactiveGray, yuxuanBlue, lightPlaceholderGray } from '@/assets/constants/scss-variables';

export default defineComponent({
  props: {
    /** Mapping from acronym to full name */
    availableChoices: {
      type: Object as PropType<Readonly<Record<string, string>>>,
      required: true,
    },
    choice: { type: String, required: true },
    scrollBottomToElement: { type: Number, default: 0 },
  },
  mounted() {
    this.curQuery = this.choice;
    this.prevQuery = this.curQuery;
  },
  emits: {
    'on-select': (acronym: string) => typeof acronym === 'string',
    'on-remove': () => true,
  },
  data() {
    return {
      shown: false,
      curQuery: '',
      prevQuery: '',
      stopClose: false,
      boxBorder: '',
      arrowColor: '',
      placeholderColor: this.choice !== '' ? lightPlaceholderGray : '',
    };
  },
  computed: {
    foundChoices(): [string, string][] {
      return Object.entries(this.availableChoices).filter(v =>
        v[1].toLowerCase().startsWith(this.curQuery.toLowerCase())
      );
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  watch: {
    choice(newVal) {
      this.curQuery = newVal || '';
      this.prevQuery = this.curQuery;
    },
  },
  methods: {
    showHideDropdown() {
      const contentShown = this.shown;
      this.shown = !contentShown;

      const box = this.$refs.selectbox as HTMLInputElement;
      if (contentShown) {
        // clicked box when content shown. So then hide content
        this.boxBorder = inactiveGray;
        this.arrowColor = inactiveGray;
        this.curQuery = this.prevQuery;
      } else {
        box.focus();
        this.prevQuery = this.curQuery;
        this.curQuery = '';
        this.boxBorder = yuxuanBlue;
        this.arrowColor = yuxuanBlue;
      }

      // scroll the bottom of the graduation year dropdown to scrollBottomToElement
      if (!contentShown && this.scrollBottomToElement > 0) {
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
        this.curQuery = this.prevQuery;
        this.boxBorder = inactiveGray;
        this.arrowColor = inactiveGray;
      }
    },
    onSelect([acronym, name]: [string, string]) {
      const box = this.$refs.selectbox as HTMLInputElement;
      this.shown = false;
      this.arrowColor = inactiveGray;
      this.boxBorder = inactiveGray;
      this.placeholderColor = lightPlaceholderGray;
      this.$emit('on-select', acronym);
      this.curQuery = name;
      this.prevQuery = name;
      box.blur();
    },
    matchSelected() {
      if (this.foundChoices.length > 0) {
        this.onSelect(this.foundChoices[0]);
      } else {
        this.curQuery = this.prevQuery;
      }
    },
    onKeyUp(e: KeyboardEvent) {
      if (e.code === 'Enter') {
        this.matchSelected();
      }
    },
  },
});
</script>

// a lot of this styling is copied from Onboarding.scss

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.requirementDropdown {
  padding: 1rem;
  width: 100%;

  &-selectWrapperRow {
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  &-select {
    background: $white;
    border: 1px solid $inactiveGray;

    box-sizing: border-box;
    border-radius: 1px;
    width: 100%;
    font-size: 14px;
    line-height: 17px;
    padding-left: 0;

    color: $darkPlaceholderGray;
    position: relative;

    &--disabled {
      opacity: 0.3;
      pointer-events: none;
    }

    &--column {
      display: flex;
      flex-direction: column;
      margin-right: 4px;
      margin-left: 32px;
    }
    &--columnCenter {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    &--column-remove {
      display: flex;
      flex-direction: column-reverse;
      justify-content: center;
    }
    &--column-removeExam {
      display: flex;
      flex-direction: column-reverse;
    }
    &--columnWide {
      display: flex;
      flex-direction: column;
      width: 380px;
    }
    &--columnFill {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }

  &-input {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    width: 100%;
    height: auto;
    min-height: 1.75rem;
    padding: 5px 8px;
    background-color: $white;
    border: 0.5px solid $inactiveGray;
    box-sizing: border-box;
    border-radius: 2px;
  }

  &-dropdown {
    &-placeholder {
      height: 100%;
      font-size: 14px;
      line-height: 17px;
      margin-left: 0.25rem;
      display: flex;
      align-items: center;

      color: $darkPlaceholderGray;

      background: transparent;

      &.requirement-wrapper {
        width: 100%;
        height: 100%;
      }

      &.requirement-placeholder {
        width: 100%;
      }

      &.requirement-arrow {
        border-left: 6.24px solid transparent;
        border-right: 6.24px solid transparent;

        border-top: 6.24px solid $inactiveGray;
        background: transparent;

        //when clicked border-top-color: #32A0F2;

        height: auto;
        margin-right: 8.7px;
        margin-left: 5px;
      }

      &.college-test-credits-arrow {
        border-left: 6.24px solid transparent;
        border-right: 6.24px solid transparent;

        border-top: 6.24px solid $inactiveGray;
        background: transparent;

        //when clicked border-top-color: #32A0F2;
        height: auto;
        margin-right: 6px;
        margin-left: 15px;
      }
    }
  }

  &-dropdown-content {
    z-index: 2;
    position: absolute;
    width: inherit;
    background: $white;
    box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
    border-radius: 7px;
    max-height: 150px;
    overflow: auto;
    left: 0px;

    margin-top: 6px;

    &-item {
      height: 2.25rem;
      font-size: 14px;
      line-height: 17px;
      display: flex;
      align-items: center;

      color: $lightPlaceholderGray;

      padding-left: 8px;
    }
  }

  &-dropdown-content div:hover {
    background: rgba(50, 160, 242, 0.15);
    width: 100%;
  }
}
</style>

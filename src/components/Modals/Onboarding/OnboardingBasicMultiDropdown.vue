<template>
  <div>
    <onboarding-basic-single-dropdown
      v-for="(choice, index) in dropdownChoices"
      :key="choice"
      :availableChoices="getRemainingChoicesAfterChoice(choice)"
      :choice="choice"
      :cannotBeRemoved="dropdownChoices.length === 1 && choice === ''"
      @on-select="choice => onSelect(choice, index)"
      @on-remove="() => onRemove(index)"
    />
    <div
      class="onboarding-addRemoveWrapper"
      :class="{ 'onboarding--hidden': dropdownChoices.length <= 0 }"
    >
      <div class="onboarding-add" @click="addDropdown">{{ addDropdownText }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import OnboardingBasicSingleDropdown from '@/components/Modals/Onboarding/OnboardingBasicSingleDropdown.vue';

export default Vue.extend({
  components: { OnboardingBasicSingleDropdown },
  props: {
    /** Mapping from acronym to full name */
    availableChoices: {
      type: Object as PropType<Readonly<Record<string, string>>>,
      required: true,
    },
    dropdownChoices: { type: Array as PropType<readonly string[]>, required: true },
    addDropdownText: { type: String, required: true },
  },
  data() {
    const remainingAvailableChoices = { ...this.availableChoices };
    return {
      remainingAvailableChoices,
    };
  },
  methods: {
    onSelect(key: string, index: number) {
      this.$emit('on-select', key, index);
    },
    onRemove(index: number) {
      this.$emit('on-remove', index);
    },
    addDropdown() {
      this.$emit('on-add');
    },
    getRemainingChoicesAfterChoice(removeChoice: string) {
      const returnValue = { ...this.remainingAvailableChoices };
      delete this.remainingAvailableChoices[removeChoice];
      return returnValue;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

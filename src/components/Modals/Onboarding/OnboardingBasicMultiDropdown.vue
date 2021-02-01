<template>
  <div>
    <onboarding-basic-single-dropdown
      v-for="(choice, index) in dropdownChoices"
      :key="choice"
      :availableChoices="availableChoices"
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
    availableChoices: Object as PropType<Readonly<Record<string, string>>>,
    dropdownChoices: Array as PropType<readonly string[]>,
    addDropdownText: String,
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
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

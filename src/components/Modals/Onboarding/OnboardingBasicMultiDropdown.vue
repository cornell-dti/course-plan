<template>
  <div>
    <onboarding-basic-single-dropdown
      v-for="(choice, index) in dropdownChoices"
      :key="choice"
      :availableChoices="getSelectableOptions(choice)"
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
    getSelectableOptions(choice: string) {
      const selectableOptions: Record<string, string> = {};
      // copy availableChoices but don't include ones that are already selected
      for (const key of Object.keys(this.availableChoices)) {
        // don't include selected ones
        if (!this.dropdownChoices.includes(key)) {
          selectableOptions[key] = this.availableChoices[key];
        }
      }
      // add the current selection associated with this input into the availableChoices
      if (choice !== '') {
        selectableOptions[choice] = this.availableChoices[choice];
      }
      return selectableOptions;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/Modals/Onboarding/Onboarding.scss';
</style>

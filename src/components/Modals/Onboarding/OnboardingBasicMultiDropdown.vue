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
    <div class="onboarding-addRemoveWrapper" v-if="showAddDropdown">
      <button class="onboarding-add" @click="addDropdown">{{ addDropdownText }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import OnboardingBasicSingleDropdown from '@/components/Modals/Onboarding/OnboardingBasicSingleDropdown.vue';

export default defineComponent({
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
  emits: {
    'on-select': (key: string, index: number) =>
      typeof key === 'string' && typeof index === 'number',
    'on-remove': (index: number) => typeof index === 'number',
    'on-add': () => true,
  },
  computed: {
    // show add dropdown only if a dropdown choice has been selected (so an element exists at index 0 besides the empty string)
    showAddDropdown(): boolean {
      return this.dropdownChoices.length > 0 && this.dropdownChoices[0].length > 0;
    },
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

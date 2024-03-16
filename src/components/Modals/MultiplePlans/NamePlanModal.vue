<template>
  <text-input-modal
    title="Name Plan"
    content-class="content-plan"
    left-button-text="Back"
    right-button-text="Add Plan"
    label="Name"
    @plan-name="copyPlanName"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backCopyPlan"
    @right-button-clicked="addPlan"
    @warn-state="isWarn"
    :placeholderPlan="selectedPlan"
    :rightButtonIsDisabled="canSave"
  >
  </text-input-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import TextInputModal from './TextInputModal.vue';

export default defineComponent({
  props: {
    plan: { type: String, default: 'No additional plans yet' },
    selectedPlanCopy: { type: String, default: '' },
  },
  components: { TextInputModal },
  emits: {
    'close-name-modal': () => true,
    'open-copy-modal': () => true,
    'add-plan': (name: string, copysem: string) =>
      typeof name === 'string' && typeof copysem === 'string',
  },
  data() {
    return { isDisabled: false, shown: false, planName: '', warn: true };
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-name-modal');
    },
    closeDropdownIfOpen() {
      this.shown = !this.shown;
    },
    backCopyPlan() {
      this.$emit('open-copy-modal');
      this.$emit('close-name-modal');
    },
    addPlan() {
      if (!this.warn) {
        this.$emit('add-plan', this.planName, this.selectedPlanCopy);
        this.$emit('close-name-modal');
      }
    },
    copyPlanName(planName: string) {
      this.planName = planName;
    },
    isWarn(warn: boolean) {
      this.warn = warn;
    },
  },
  computed: {
    otherPlans() {
      const filtered = this.plans.filter(plan => plan !== this.currPlan);
      return filtered.length === 0 ? ['No additional plans yet'] : filtered;
    },
    plans() {
      return store.state.plans.map(plan => plan.name);
    },
    currPlan() {
      return store.state.currentPlan.name;
    },
    canSave() {
      return this.warn;
    },
    selectedPlan() {
      return `${this.selectedPlanCopy} copy`;
    },
  },
});
</script>

<style lang="scss">
@import '@/components/Modals/MultiplePlans/PlanModalDropdown.scss';

.content-plan {
  width: 20rem;
}

.modal {
  &--block {
    display: block;
  }
  &--flex {
    display: flex;
  }
}
</style>

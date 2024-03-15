<template>
  <text-input-modal
    title="Edit Plan"
    content-class="content-plan"
    left-button-text="Cancel"
    right-button-text="Save Changes"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="saveChanges"
    @plan-name="setPlanName"
    @warn-state="isWarn"
    :placeholderPlan="currPlan"
    :rightButtonIsDisabled="canSave"
    :isPlanModal="true"
    label="Name"
  >
    <button class="editPlan-delete" @click="deletePlan" :disabled="!canDelete">DELETE PLAN</button>
  </text-input-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import TextInputModal from './TextInputModal.vue';

export default defineComponent({
  props: {
    plan: { type: String, default: 'No additional plans yet' },
  },
  components: { TextInputModal },
  emits: {
    'close-edit-modal': () => true,
    'open-copy-modal': () => true,
    'delete-plan': (name: string) => typeof name === 'string',
    'edit-plan': (name: string, oldname: string) =>
      typeof name === 'string' && typeof oldname === 'string',
  },
  data() {
    return { isDisabled: false, shown: false, planName: '', warn: true };
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-edit-modal');
    },
    backCopyPlan() {
      this.$emit('open-copy-modal');
      this.$emit('close-edit-modal');
    },
    saveChanges() {
      if (!this.warn) {
        this.$emit('edit-plan', this.planName, this.currPlan);
        this.$emit('close-edit-modal');
      }
    },
    deletePlan() {
      this.$emit('delete-plan', this.currPlan);
      this.$emit('close-edit-modal');
    },
    setPlanName(planName: string) {
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
    canDelete() {
      return store.state.plans.length > 1;
    },
    canSave() {
      return this.warn;
    },
  },
});
</script>

<style lang="scss">
@import '@/components/Modals/MultiplePlans/PlanModalDropdown.scss';

.editPlan {
  &-delete {
    position: relative;
    bottom: 0.25rem;
    width: 100%;
    color: $primary;
    font-weight: 800;
    text-decoration: underline;
    &:disabled {
      color: $disabledGray;
      &:hover {
        opacity: 1;
      }
    }
  }
}

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

<template>
  <text-input-modal
    title="Edit Plan"
    content-class="content-plan"
    left-button-text="Cancel"
    right-button-text="Save Changes"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="addPlan"
    :isPlanModal="true"
    label="Name"
  >
    <button class="editPlan-delete">DELETE PLAN</button>
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
  },
  data() {
    return { isDisabled: false, shown: false };
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-edit-modal');
    },
    closeDropdownIfOpen() {
      this.shown = !this.shown;
    },
    planClicked(plan: string) {
      if (this.plans.length !== 1) this.currPlan = plan;
    },
    backCopyPlan() {
      this.$emit('open-copy-modal');
      this.$emit('close-edit-modal');
    },
    addPlan() {
      this.$emit('close-edit-modal');
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
  },
});
</script>

<style lang="scss">
@import '@/components/Modals/PlanModalDropdown.scss';

.editPlan {
  &-delete {
    position: relative;
    bottom: 0.5rem;
    width: 100%;
    color: $primary;
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

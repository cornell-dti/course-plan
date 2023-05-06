<template>
  <text-input-modal
    title="Name Plan"
    content-class="content-plan"
    left-button-text="Back"
    right-button-text="Add Plan"
    label="Name"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backCopyPlan"
    @right-button-clicked="addPlan"
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
  },
  components: { TextInputModal },
  emits: {
    'close-name-modal': () => true,
    'open-copy-modal': () => true,
  },
  data() {
    return { isDisabled: false, shown: false };
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-name-modal');
    },
    closeDropdownIfOpen() {
      this.shown = !this.shown;
    },
    planClicked(plan: string) {
      if (this.plans.length !== 1) this.currPlan = plan;
    },
    backCopyPlan() {
      this.$emit('open-copy-modal');
      this.$emit('close-name-modal');
    },
    addPlan() {
      this.$emit('close-name-modal');
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

<template>
  <teleport-modal
    title="Copy a Plan"
    content-class="content-plan"
    left-button-text="Back"
    right-button-text="Copy Plan"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backAddPlan"
    @right-button-clicked="namePlan"
  >
    <div class="selectPlan">
      <label class="selectPlan-label">Copy Plan</label>
      <div class="selectPlan-dropdown">
        <div class="multiplePlansModal-dropdown">
          <div
            class="multiplePlansModal-dropdown-placeholder wrapper"
            @click="closeDropdownIfOpen()"
          >
            <div class="multiplePlansModal-dropdown-placeholder plan">{{ selectedPlan }}</div>
            <img
              class="multiplePlansModal-dropdown-placeholder up-arrow"
              v-if="shown"
              alt="close dropdown"
            />
            <img
              class="multiplePlansModal-dropdown-placeholder down-arrow"
              v-else
              alt="open dropdown"
            />
          </div>
          <div class="multiplePlansModal-dropdown-content" v-if="shown" :class="shown">
            <div
              v-for="otherPlan in otherPlans"
              class="multiplePlansModal-dropdown-content item"
              :key="otherPlan"
              @click="planClicked(otherPlan)"
            >
              {{ otherPlan }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import store from '@/store';

export default defineComponent({
  props: {
    plan: { type: String, default: 'No additional plans yet' },
  },
  components: { TeleportModal },
  emits: {
    'close-copy-modal': () => true,
    'open-plan-modal': () => true,
    'open-name-modal': () => true,
    'copy-plan': (selectedPlan: string) => typeof selectedPlan === 'string',
  },
  data() {
    return { isDisabled: false, shown: false, selectedPlan: store.state.currentPlan.name };
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-copy-modal');
    },
    closeDropdownIfOpen() {
      this.shown = !this.shown;
    },
    planClicked(plan: string) {
      if (this.plans.length !== 1) this.selectedPlan = plan;
    },
    backAddPlan() {
      this.$emit('open-plan-modal');
      this.$emit('close-copy-modal');
    },
    namePlan() {
      this.$emit('open-name-modal');
      this.$emit('copy-plan', this.selectedPlan);
      this.$emit('close-copy-modal');
    },
  },
  computed: {
    otherPlans() {
      const filtered = this.plans.filter(plan => plan !== this.selectedPlan);
      return filtered.length === 0 ? ['No additional plans yet'] : filtered;
    },
    plans() {
      return store.state.plans.map(plan => plan.name);
    },
  },
});
</script>

<style lang="scss">
@import '@/components/Modals/MultiplePlans/PlanModalDropdown.scss';
.selectPlan {
  height: 6rem;
  &-label {
    position: relative;
    top: 0.5rem;
  }
  &-dropdown {
    top: 0.5rem;
    position: relative;
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

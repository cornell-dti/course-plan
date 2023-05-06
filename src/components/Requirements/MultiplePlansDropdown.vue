<template>
  <div>
    <div class="multiplePlans-dropdown">
      <div class="multiplePlans-dropdown-placeholder wrapper" data-cyId="multiplePlans-dropdown">
        <button>
          <img
            :src="editPlan"
            class="multiplePlans-dropdown-placeholder editimg"
            alt="edit plans"
            @click="toggleEditPlan()"
          />
        </button>
        <div class="multiplePlans-dropdown-placeholder plan">{{ currPlan }}</div>
        <img
          class="multiplePlans-dropdown-placeholder up-arrow"
          v-if="shown"
          alt="close dropdown"
          @click="closeDropdownIfOpen()"
        />
        <img
          class="multiplePlans-dropdown-placeholder down-arrow"
          v-else
          alt="open dropdown"
          @click="closeDropdownIfOpen()"
        />
      </div>
      <div
        class="multiplePlans-dropdown-content"
        v-if="shown"
        data-cyId="multiplePlans-dropdown-content"
        :class="shown"
      >
        <div
          v-for="otherPlan in otherPlans"
          class="multiplePlans-dropdown-content item"
          :key="otherPlan"
          @click="planClicked(otherPlan)"
        >
          {{ otherPlan }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import editPlan from '@/assets/images/editplan.svg';
import store from '@/store';

export default defineComponent({
  props: {
    plan: { type: String, default: 'No additional plans yet' },
  },
  emits: {
    'open-edit-modal': () => true,
  },
  data() {
    return {
      shown: false,
      editPlan,
    };
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
  methods: {
    closeDropdownIfOpen() {
      this.shown = !this.shown;
    },
    planClicked(plan: string) {
      if (this.plans.length !== 1) this.currPlan = plan;
    },
    toggleEditPlan() {
      this.$emit('open-edit-modal');
    },
  },
});
</script>

<style lang="scss">
@import '@/components/Requirements/MultiplePlansDropdown.scss';
</style>

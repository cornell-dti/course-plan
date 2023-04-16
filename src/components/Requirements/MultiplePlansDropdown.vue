<template>
  <div>
    <div class="multiplePlans-dropdown">
      <div
        class="multiplePlans-dropdown-placeholder wrapper"
        @click="closeDropdownIfOpen()"
        data-cyId="multiplePlans-dropdown"
      >
        <img :src="editPlan" class="multiplePlans-dropdown-placeholder editimg" alt="edit plans" />
        <div class="multiplePlans-dropdown-placeholder plan">{{ currPlan }}</div>
        <img
          class="multiplePlans-dropdown-placeholder up-arrow"
          v-if="shown"
          alt="close dropdown"
        />
        <img class="multiplePlans-dropdown-placeholder down-arrow" v-else alt="open dropdown" />
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
  data() {
    return {
      plans: store.state.plans.map(plan => plan.name),
      shown: false,
      currPlan: 'PLAN 1',
      editPlan,
    };
  },
  computed: {
    otherPlans() {
      const filtered = this.plans.filter(plan => plan !== this.currPlan);
      return filtered.length === 0 ? ['No additional plans yet'] : filtered;
    },
  },
  methods: {
    closeDropdownIfOpen() {
      this.shown = !this.shown;
    },
    planClicked(plan: string) {
      if (this.plans.length !== 1) this.currPlan = plan;
    },
  },
});
</script>

<style lang="scss">
@import '@/components/Requirements/MultiplePlansDropdown.scss';
</style>

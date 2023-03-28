<template>
  <div>
    <div class="multiplePlans-dropdown">
      <div
        class="multiplePlans-dropdown-placeholder wrapper"
        @click="closeDropdownIfOpen()"
        data-cyId="multiplePlans-dropdown"
      >
        <img :src="editPlan" class="multiplePlans-dropdown-placeholder editimg" />
        <div class="multiplePlans-dropdown-placeholder plan">{{ currPlan }}</div>
        <img class="multiplePlans-dropdown-placeholder up-arrow" v-if="shown" />
        <img class="multiplePlans-dropdown-placeholder down-arrow" v-else />
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

export default defineComponent({
  props: {
    plan: { type: String, default: 'No additional plans yet' },
  },
  data() {
    return {
      plans: ['PLAN 1', 'PLAN 2'],
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
@import '@/assets/scss/_variables.scss';
.multiplePlans-dropdown {
  display: flex;
  flex-direction: column;

  &-placeholder {
    height: 100%;
    font-size: 16px;
    font-weight: bold;
    line-height: 16px;
    margin-left: 0.25rem;
    display: flex;
    align-items: center;

    color: $lightPlaceholderGray;

    background: transparent;

    &.wrapper {
      width: 90%;
      height: 2.5rem;
      border-radius: 2px;
      border: 1px solid $lightPlaceholderGray;
      cursor: pointer;
    }

    &.plan {
      padding-left: 0.5rem;
      width: 100%;
    }

    &.down-arrow {
      position: relative;
      right: 7%;
      width: 6.24px;
      height: 6.24px;
      border-left: 6.24px solid transparent;
      border-right: 6.24px solid transparent;
      border-top: 6.24px solid $lightPlaceholderGray;
    }

    &.up-arrow {
      position: relative;
      right: 7%;
      width: 6.24px;
      height: 6.24px;
      border-left: 6.24px solid transparent;
      border-right: 6.24px solid transparent;
      border-top: 6.24px solid $lightPlaceholderGray;
      transform: rotate(180deg);
    }

    &.editimg {
      padding-left: 10px;
      height: 15px;
    }
  }

  &-content {
    margin-left: 0.11rem;
    z-index: 100;
    max-height: 8rem;
    border-radius: 2px;
    &.item {
      width: 91%;
      border: 1px solid $lightPlaceholderGray;
      z-index: 150;
      background-color: white;
      height: 2.5rem;
      font-size: 16px;
      line-height: 16px;
      display: flex;
      align-items: center;
      color: $lightPlaceholderGray;
      padding-left: 10px;
    }
  }
}
</style>

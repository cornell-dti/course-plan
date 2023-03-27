<template>
  <div>
    <div class="multiplePlans-dropdown">
      <div
        class="multiplePlans-dropdown-placeholder wrapper"
        @click="closeDropdownIfOpen()"
        data-cyid="multiplePlans-wrapper"
        :class="{ plansHidden: shown }"
      >
        <img :src="editplan" class="multiplePlans-dropdown-placeholder editimg" />
        <div class="multiplePlans-dropdown-placeholder plan">{{ currplan }}</div>
        <div class="multiplePlans-dropdown-placeholder down-arrow" v-if="!shown"></div>
        <div class="multiplePlans-dropdown-placeholder up-arrow" v-if="shown"></div>
      </div>
      <div class="multiplePlans-dropdown-content" v-if="shown">
        <div
          v-for="plan in filterPlans"
          class="multiplePlans-dropdown-content item"
          :key="plan"
          @click="planClicked(plan)"
        >
          {{ plan }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import editplan from '@/assets/images/editplan.svg';

export default defineComponent({
  props: {
    plan: { type: String, default: 'No additional plans yet' },
  },
  data() {
    return {
      plans: ['PLAN 1', 'PLAN 2'],
      shown: false,
      currplan: 'PLAN 1',
      editplan,
    };
  },
  computed: {
    filterPlans() {
      const filtered = this.$data.plans.filter(plan => plan !== this.$data.currplan);
      return filtered.length === 0 ? ['No additional plans yet'] : filtered;
    },
  },
  methods: {
    closeDropdownIfOpen() {
      this.shown = !this.shown;
    },
    planClicked(plan: string) {
      if (this.plans.length !== 1) this.currplan = plan;
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

    color: #636363;

    background: transparent;

    &.wrapper {
      width: 90%;
      height: 2.5rem;
      border-radius: 2px;
      border: 1px solid #636363;
      cursor: pointer;
    }

    &.plan {
      padding-left: 8px;
      width: 70%;
    }

    &.down-arrow {
      width: 6.24px;
      height: 6.24px;
      border-left: 6.24px solid transparent;
      border-right: 6.24px solid transparent;
      border-top: 6.24px solid #636363;
    }

    &.up-arrow {
      width: 6.24px;
      height: 6.24px;
      border-left: 6.24px solid transparent;
      border-right: 6.24px solid transparent;
      border-top: 6.24px solid #636363;
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
      border: 1px solid #636363;
      z-index: 150;
      background-color: #ffffff;
      height: 2.5rem;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 16px;
      display: flex;
      align-items: center;
      color: #858585;
      padding-left: 10px;
    }
  }
}
</style>

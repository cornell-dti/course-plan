<template>
  <teleport-modal content-class="content-plan">
    <div class="textInput">
      <label class="textInput-label">{{ label }}</label>
      <div class="textInput-wrapper">
        <input
          class="textInput-userinput"
          maxlength="15"
          v-model="planName"
          :placeholder="placeholderPlan"
          @input="rightPlanClicked"
          @keydown.delete="rightPlanClicked"
        />
      </div>
      <slot />
    </div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import store from '@/store';

export default defineComponent({
  props: {
    label: { type: String, default: '' },
    placeholderPlan: { type: String, default: '' },
  },
  components: { TeleportModal },
  emits: {
    'plan-name': (planName: string) => typeof planName === 'string',
    'warn-state': (warn: boolean) => typeof warn === 'boolean',
  },
  methods: {
    rightPlanClicked(): void {
      this.$emit('plan-name', this.planName);
      this.$emit('warn-state', this.ifWarn);
    },
  },
  data() {
    return { isDisabled: false, shown: false, planName: '' };
  },
  computed: {
    ifWarn() {
      return store.state.plans.some(plan => plan.name === this.planName) || !this.planName;
    },
  },
});
</script>

<style lang="scss">
@import '@/components/Modals/MultiplePlans/PlanModalDropdown.scss';

.textInput {
  &-label {
    font-weight: bold;
    top: 0.5rem;
    position: relative;
  }
  &-wrapper {
    height: 4.2rem;
  }
  &-userinput {
    border: 1px solid $darkPlaceholderGray;
    top: 0.5rem;
    position: relative;
    width: 500px;
    height: 2rem;
    padding-left: 0.5rem;
    &::placeholder {
      color: $darkPlaceholderGray;
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

<template>
  <teleport-modal content-class="content-plan">
    <div class="textInput">
      <label class="textInput-label">{{ label }}</label>
      <div class="textInput-wrapper">
        <input
          class="textInput-userinput"
          maxlength="charLimit"
          :value="planName"
          @input="rightPlanClicked"
        />
      </div>
      <slot />
    </div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';

export default defineComponent({
  props: {
    charLimit: { type: Number, default: 100 },
    label: { type: String, default: '' },
    planName: { type: String, default: 'Plan Name' },
  },
  components: { TeleportModal },
  emits: ['update:planName'],
  methods: {
    rightPlanClicked(): void {
      this.$emit('update:planName');
    },
  },
  data() {
    return { isDisabled: false, shown: false };
  },
});
</script>

<style lang="scss">
@import '@/components/Modals/PlanModalDropdown.scss';

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
    width: 100%;
    height: 2rem;
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

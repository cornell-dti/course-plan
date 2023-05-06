<template>
  <teleport-modal
    title="Copy Plan?"
    content-class="content-plan"
    left-button-text="Create Blank"
    right-button-text="Make a Copy"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="copyPlan"
    :isPlanModal="true"
  >
    Would you like to copy an existing plan or create a blank one?
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';

export default defineComponent({
  components: { TeleportModal },
  emits: {
    'close-plan-modal': () => true,
    'open-copy-modal': () => true,
  },
  data() {
    return { isDisabled: false, isCopyPlanOpen: false };
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-plan-modal');
    },
    copyPlan() {
      this.$emit('open-copy-modal');
      this.$emit('close-plan-modal');
    },
  },
});
</script>

<style lang="scss">
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

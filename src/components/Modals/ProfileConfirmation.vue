<template>
  <teleport-modal
    title="Save Changes"
    leftButtonText="Cancel"
    rightButtonText="OK"
    @modal-closed="closeConfirmationModal"
    @left-button-clicked="closeConfirmationModal"
    @right-button-clicked="submitAndClose"
  >
    <span>Are you sure you want to add these changes to the Profile page?</span>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
export default defineComponent({
  components: { TeleportModal },
  emits: { 'close-modal': () => true, 'submit-onboarding': () => false },
  methods: {
    closeConfirmationModal() {
      alert('please fucking work');
      this.$emit('close-modal');
    },
    submitAndClose() {
      this.closeConfirmationModal();
      this.$emit('submit-onboarding');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
</style>

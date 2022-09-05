<template>
  <teleport-modal
    title="Warning: Possibly Unsaved Changes"
    leftButtonText="Go Back"
    rightButtonText="Continue"
    content-class="content-clear"
    @modal-closed="returnToProfilePage"
    @left-button-clicked="returnToProfilePage"
    @right-button-clicked="confirmLeaveProfilePage"
  >
    <span
      >There may be unsaved changes in your profile! Please make sure your changes are saved before
      leaving!</span
    >
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';

export default defineComponent({
  components: { TeleportModal },
  emits: { 'confirm-leave': () => true, 'cancel-leave': () => true },
  methods: {
    returnToProfilePage() {
      this.$emit('cancel-leave');
    },
    confirmLeaveProfilePage() {
      this.$emit('confirm-leave');
    },
  },
});
</script>

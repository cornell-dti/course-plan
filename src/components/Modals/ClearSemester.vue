<template>
  <teleport-modal
    title="Clear Semester"
    content-class="content-clear"
    left-button-text="Cancel"
    right-button-text="Clear"
    :rightButtonIsDisabled="false"
    :rightButtonImage="icon"
    rightButtonAlt="clear semester erase icon"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="clearSemester"
  >
    <div class="clear-semester-modal-body">
      <p class="modal-message">
        Are you sure you want to clear the courses in this semester? This action cannot be undone.
      </p>
    </div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import eraseIcon from '@/assets/images/erase-white.svg';

export default defineComponent({
  components: { TeleportModal },
  emits: {
    'close-clear-sem': () => true,
    'clear-semester': () => true,
  },
  computed: {
    icon() {
      return eraseIcon;
    },
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-clear-sem');
    },
    clearSemester() {
      this.$emit('clear-semester');
      this.closeCurrentModal();
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.content-clear {
  width: 24rem;
  text-align: center;
}

.clear-semester-modal-body {
  padding: 0 1rem;
  display: flex;
  justify-content: center;
}

.modal-message {
  white-space: nowrap; // Prevent line wrapping
  overflow: hidden; // Hide overflow if it's too long
  text-overflow: ellipsis; // Add "..." if it overflows
  font-size: 1rem;
  color: #333;
  margin: 0 auto;
  text-align: center;
  max-width: 100%; // Or set a fixed width if needed
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-clear {
    width: 100%;
  }
}
</style>

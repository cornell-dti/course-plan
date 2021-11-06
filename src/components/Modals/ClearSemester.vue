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
    <div class="clearSemesterModal-body">
      <div class="clearSemesterModal-body-text">{{ text }}</div>
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
    text() {
      return 'Are you sure you want to clear the courses in this semester?';
    },
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
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-clear {
    width: 100%;
  }
}
</style>

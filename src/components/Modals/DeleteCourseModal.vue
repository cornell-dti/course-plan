<template>
  <teleport-modal
    title="Delete Course"
    content-class="content-reset"
    left-button-text="No"
    right-button-text="Yes"
    @left-button-clicked="closeClicked"
    @right-button-clicked="deleteClicked"
    @modal-closed="closeCurrentModal"
    :rightButtonIsDisabled="false"
  >
    <div v-if="isTransferCredit" class="text-width">
      Are you sure you want to remove "{{ reqName }}" for this requirement? This will delete the
      selected transfer credit.
      <br />
      Transfer credits can be re-added in your Profile.
    </div>
    <div v-else class="text-width">
      Are you sure you want to remove "{{ reqName }}" for this requirement? This will delete the
      selected course from your schedule.
    </div>
  </teleport-modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';

export default defineComponent({
  components: { TeleportModal },
  props: {
    reqName: { type: String, required: true },
    isTransferCredit: { type: Boolean, required: true },
  },
  emits: {
    'close-delete-course-modal': (value: boolean) => typeof value === 'boolean',
  },
  methods: {
    closeCurrentModal(): void {
      this.$emit('close-delete-course-modal', false);
    },
    deleteClicked(): void {
      this.closeCurrentModal();
      this.$emit('close-delete-course-modal', true);
    },
    closeClicked(): void {
      this.closeCurrentModal();
      this.$emit('close-delete-course-modal', false);
    },
  },
});
</script>
<style lang="scss">
@import '@/assets/scss/_variables.scss';

.content-reset {
  width: 30.5em;
  align-items: initial;
  button {
    width: 48px;
  }
}

.text-width {
  width: 28em;
  line-height: 17px;
  color: $lightPlaceholderGray;
}

.modal {
  &--block {
    display: block;
  }
  &--flex {
    display: flex;
  }
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-reset {
    width: 100%;
  }
  .text-width {
    width: 100%;
  }
}
</style>

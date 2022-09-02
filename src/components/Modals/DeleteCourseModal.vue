<template>
  <teleport-modal
    title="Remove Course"
    content-class="content-reset"
    left-button-text="No"
    right-button-text="Yes"
    @left-button-clicked="closeClicked"
    @right-button-clicked="deleteClicked"
    @modal-closed="closeCurrentModal"
    :rightButtonIsDisabled="false"
  >
    <div v-if="isTransferCredit" class="text-width">
      Are you sure you want to remove <b>reqName</b> from the
      <b>{{ reqDesc }} Requirement?</b> This will delete the selected transfer credit.
      <br />
      Transfer credits can be re-added in your Profile.
    </div>
    <div v-else class="text-width">
      <!-- {{ editMode ? automaticallyFulfilledRequirements.join(', ') : chosenRequirementText }} -->
      Are you sure you want to remove <b>{{ reqName }}</b> from the
      <b>{{ reqDesc }} Requirement?</b>
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
    reqDesc: { type: String, required: true },
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
.bold-remove-text {
  font-weight: bold
}

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
  b {
    font-size: 1rem;
    color: #4f4f4f;
    font-weight: 900;
  }
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

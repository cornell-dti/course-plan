<template>
  <div class="reset-modal" :class="{ 'modal--block': value }">
    <flexible-modal
      title="Reset Requirement"
      :class="[{ 'modal--block': value }, 'modal-width']"
      content-class="content-confirmation"
      left-button-text="No"
      right-button-text="Yes"
      @left-button-clicked="closeClicked"
      @right-button-clicked="resetClicked"
      @modal-closed="closeCurrentModal"
      :rightButtonIsDisabled="false"
    >
      <div v-if="isTestReq" class="text-width">
        Are you sure you want to reset the "{{ reqName }}" requirement? This will delete the
        selected course from your schedule, allowing you to add a different course to satisfy this
        requirement.
      </div>
      <div v-else class="text-width">
        Are you sure you want to reset "{{ reqName }}" for this requirement? This will delete the
        selected transfer credit from your schedule, allowing you to add a different course to
        satisfy this requirement.
        <br />
        Transfer credits can be re-added in your Profile.
      </div>
    </flexible-modal>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import FlexibleModal from './FlexibleModal.vue';

export default Vue.extend({
  components: { FlexibleModal },
  props: {
    reqName: { type: String, required: true },
    isTestReq: { type: Boolean, required: true },
    value: { type: Boolean, required: true },
  },
  methods: {
    closeCurrentModal(): void {
      this.$emit('input', false);
    },
    resetClicked(): void {
      this.closeCurrentModal();
      this.$emit('close-reset-modal', true);
    },
    closeClicked(): void {
      this.closeCurrentModal();
      this.$emit('close-reset-modal', false);
    },
  },
});
</script>
<style scoped lang="scss">
.content-confirmation {
  width: 15.5rem;
}
.reset-modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.modal-width {
  transform: translateX(calc(50vw - 50%));
  width: 30em;
}

.text-width {
  width: 25em;
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

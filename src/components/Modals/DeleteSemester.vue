<template>
  <teleport-modal
    title="Delete Semester"
    content-class="content-delete"
    left-button-text="Cancel"
    right-button-text="Delete"
    :rightButtonIsDisabled="false"
    :rightButtonImage="icon"
    rightButtonAlt="delete semester trashcan icon"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="deleteSemester"
    :modelValue="modelValue"
  >
    <div class="deleteSemesterModal-body">
      <div class="deleteSemesterModal-body-text">{{ text }}</div>
    </div>
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import trashIcon from '@/assets/images/trash-white.svg';

export default defineComponent({
  components: { TeleportModal },
  props: {
    deleteSemType: { type: String, required: true },
    deleteSemYear: { type: Number, required: true },
    modelValue: { type: Boolean, required: true },
  },
  emits: {
    'delete-semester': (type: string, year: number) =>
      typeof type === 'string' && typeof year === 'number',
    'update:modelValue': (value: boolean) => typeof value === 'boolean',
  },
  computed: {
    text() {
      return 'Are you sure you want to delete this semester?';
    },
    icon() {
      return trashIcon;
    },
  },
  methods: {
    closeCurrentModal() {
      this.$emit('update:modelValue', false);
    },
    deleteSemester() {
      this.$emit('delete-semester', this.deleteSemType, this.deleteSemYear);
      this.closeCurrentModal();
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.content-delete {
  width: 24rem;
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-delete {
    width: 100%;
  }
}
</style>

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
    deleteSemSeason: { type: String, required: true },
    deleteSemYear: { type: Number, required: true },
  },
  emits: {
    'close-delete-sem': () => true,
    'delete-semester': (season: string, year: number) =>
      typeof season === 'string' && typeof year === 'number',
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
      this.$emit('close-delete-sem');
    },
    deleteSemester() {
      this.$emit('delete-semester', this.deleteSemSeason, this.deleteSemYear);
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

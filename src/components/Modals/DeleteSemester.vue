<template>
  <!-- TODO trash icon on button -->
  <flexible-modal
    title="Delete Semester"
    class="deleteSemesterModal"
    content-class="content-delete"
    left-button-text="CANCEL"
    right-button-text="DELETE"
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
  </flexible-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import FlexibleModal from '@/components/Modals/FlexibleModal.vue';
import trashIcon from '@/assets/images/trash-white.svg';

export default Vue.extend({
  components: { FlexibleModal },
  props: {
    deleteSemType: { type: String, required: true },
    deleteSemYear: { type: Number, required: true },
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
      this.$emit('close-delete-modal');
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

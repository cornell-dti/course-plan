<template>
  <teleport-modal
    title="New Semester"
    content-class="content-semester"
    left-button-text="Cancel"
    right-button-text="Add"
    :rightButtonIsDisabled="isDisabled"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="addSemester"
  >
    <select-semester
      :currentSemesters="semesters"
      :isEdit="false"
      :isCourseModelSelectingSemester="false"
      @duplicateSemester="disableButton"
      @updateSemProps="updateSemProps"
    />
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SelectSemester from '@/components/Modals/SelectSemester.vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import store from '@/store';

export default defineComponent({
  components: { TeleportModal, SelectSemester },
  emits: {
    'close-sem-modal': () => true,
    'add-semester': (season: string, year: number) =>
      typeof season === 'string' && typeof year === 'number',
  },
  data() {
    return { isDisabled: false, season: '', year: 0 };
  },
  computed: {
    semesters(): readonly FirestoreSemester[] {
      return store.getters.getCurrentPlanSemesters;
    },
  },
  methods: {
    disableButton(disabled: boolean) {
      this.isDisabled = disabled;
    },
    closeCurrentModal() {
      this.$emit('close-sem-modal');
    },
    addSemester() {
      if (!this.isDisabled) {
        this.$emit('add-semester', this.season, this.year);
        this.closeCurrentModal();
      }
    },
    updateSemProps(season: string, year: number) {
      this.season = season;
      this.year = year;
    },
  },
});
</script>

<style lang="scss">
.content-semester {
  width: 15.5rem;
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

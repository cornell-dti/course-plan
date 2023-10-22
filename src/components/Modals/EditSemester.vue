<template>
  <teleport-modal
    title="Edit Semester"
    content-class="content-semester"
    left-button-text="Cancel"
    right-button-text="Edit"
    :rightButtonIsDisabled="isDisabled"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="editSemester"
  >
    <select-semester
      :currentSemesters="semesters"
      :isEdit="true"
      :year="deleteSemYear"
      :season="deleteSemSeason"
      @duplicateSemester="disableButton"
      @updateSemProps="updateSemProps"
    />
  </teleport-modal>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import SelectSemester from '@/components/Modals/SelectSemester.vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import store from '@/store';

export default defineComponent({
  components: { TeleportModal, SelectSemester },
  props: {
    deleteSemSeason: { type: String as PropType<FirestoreSemesterSeason>, required: true },
    deleteSemYear: { type: Number, required: true },
  },
  emits: {
    'close-edit-sem': () => true,
    'edit-semester': (season: string, year: number) =>
      typeof season === 'string' && typeof year === 'number',
  },
  data() {
    return {
      isDisabled: false,
      season: '',
      year: '',
    };
  },
  computed: {
    semesters(): readonly FirestoreSemester[] {
      return store.getters.getCurrentPlanSemesters;
    },
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-edit-sem');
    },
    editSemester() {
      if (!this.isDisabled) {
        this.$emit('edit-semester', this.season, Number(this.year));
        this.closeCurrentModal();
      }
    },
    disableButton(bool: boolean) {
      this.isDisabled = bool;
    },
    updateSemProps(season: string, year: number) {
      this.season = season;
      this.year = String(year);
    },
  },
});
</script>

<style lang="scss"></style>

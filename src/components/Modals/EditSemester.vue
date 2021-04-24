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
    :modelValue="modelValue"
  >
    <select-semester
      :currentSemesters="semesters"
      :isEdit="true"
      :year="deleteSemYear"
      :type="deleteSemType"
      @duplicateSemester="disableButton"
      @updateSemProps="updateSemProps"
      ref="modalBodyComponent"
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
    deleteSemType: { type: String as PropType<FirestoreSemesterType>, required: true },
    deleteSemYear: { type: Number, required: true },
    modelValue: { type: Boolean, required: true },
  },
  emits: {
    'edit-semester': (season: string, year: number) =>
      typeof season === 'string' && typeof year === 'number',
    'update:modelValue': (value: boolean) => typeof value === 'boolean',
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
      return store.state.semesters;
    },
  },
  methods: {
    closeCurrentModal() {
      this.$emit('update:modelValue', false);
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

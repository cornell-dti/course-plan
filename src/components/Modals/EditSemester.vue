<template>
  <flexible-modal
    title="Edit Semester"
    content-class="content-semester"
    left-button-text="Cancel"
    right-button-text="Edit"
    :rightButtonIsDisabled="isDisabled"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="editSemester"
  >
    <new-semester
      :currentSemesters="semesters"
      :isEdit="true"
      :year="deleteSemYear"
      :type="deleteSemType"
      @duplicateSemester="disableButton"
      @updateSemProps="updateSemProps"
      ref="modalBodyComponent"
    />
  </flexible-modal>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import NewSemester from '@/components/Modals/NewSemester.vue';
import FlexibleModal from '@/components/Modals/FlexibleModal.vue';
import store from '@/store';

export default defineComponent({
  components: { FlexibleModal, NewSemester },
  props: {
    deleteSemType: { type: String as PropType<FirestoreSemesterType>, required: true },
    deleteSemYear: { type: Number, required: true },
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
      this.$emit('close-edit-modal');
      // @ts-expect-error: TS cannot understand $ref's component.
      this.$refs.modalBodyComponent.resetDropdowns();
    },
    editSemester() {
      if (!this.isDisabled) {
        this.$emit('edit-semester', this.season, this.year);
        this.closeCurrentModal();
      }
    },
    disableButton(bool: boolean) {
      this.isDisabled = bool;
    },
    updateSemProps(season: string, year: string) {
      this.season = season;
      this.year = year;
    },
  },
});
</script>

<style lang="scss"></style>

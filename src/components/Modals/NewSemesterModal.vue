<template>
  <flexible-modal
    title="New Semester"
    content-class="content-semester"
    left-button-text="Cancel"
    right-button-text="Add"
    :rightButtonIsDisabled="isDisabled"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="addSemester"
  >
    <new-semester
      :currentSemesters="semesters"
      :isEdit="false"
      :isSemesterAdd="true"
      :isCourseModelSelectingSemester="false"
      @duplicateSemester="disableButton"
      @updateSemProps="updateSemProps"
      ref="modalBodyComponent"
    />
  </flexible-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import NewSemester from '@/components/Modals/NewSemester.vue';
import FlexibleModal from '@/components/Modals/FlexibleModal.vue';
import store from '@/store';

export default Vue.extend({
  components: { FlexibleModal, NewSemester },
  data() {
    return { isDisabled: false, season: '', year: 0 };
  },
  computed: {
    semesters(): readonly FirestoreSemester[] {
      return store.state.semesters;
    },
  },
  methods: {
    disableButton(disabled: boolean) {
      this.isDisabled = disabled;
    },
    closeCurrentModal() {
      this.$emit('close-semester-modal');
      // @ts-expect-error: TS cannot understand $ref's component.
      this.$refs.modalBodyComponent.resetDropdowns();
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

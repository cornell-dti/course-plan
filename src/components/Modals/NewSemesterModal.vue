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
    v-model="modelValue"
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
  </teleport-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NewSemester from '@/components/Modals/NewSemester.vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import store from '@/store';

export default defineComponent({
  components: { TeleportModal, NewSemester },
  props: {
    modelValue: { type: Boolean, required: true },
  },
  emits: {
    'close-semester-modal': () => true,
    'add-semester': (season: string, year: number) =>
      typeof season === 'string' && typeof year === 'number',
    'update:modelValue': (value: boolean) => typeof value === 'boolean',
  },
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
      this.$emit('update:modelValue', false);

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

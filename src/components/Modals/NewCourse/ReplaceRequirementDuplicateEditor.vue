<template>
  <div>
    <div>
      <div class="newCourse-title">Selected Semester</div>
      <div class="newCourse-semester-edit">
        <select-semester-duplicate
          :isCourseModelSelectingSemester="true"
          :semestersTaken="semestersTaken"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { GTagEvent } from '@/gtag';
import SelectSemesterDuplicate from '@/components/Modals/SelectSemesterDuplicate.vue';
import { RequirementWithID } from '@/components/Modals/NewCourse/SelectedRequirementEditor.vue';

/**
 * Modal to resolve duplicates of the same course
 */
export default defineComponent({
  components: { SelectSemesterDuplicate },
  props: {
    editMode: { type: Boolean, required: true },
    selectedRequirementID: { type: String, required: true },
    semestersTaken: { type: Array as PropType<readonly FirestoreSemester[]>, required: true },
    automaticallyFulfilledRequirements: {
      type: Array as PropType<readonly string[]>,
      required: true,
    },
    // self check requirements
    potentialRequirements: {
      type: Array as PropType<readonly RequirementWithID[]>,
      required: true,
    },
    // all the other ones that don't allow double counting
    relatedRequirements: {
      type: Array as PropType<readonly RequirementWithID[]>,
      required: true,
    },
  },
  emits: {
    'on-selected-change': (id: string) => typeof id === 'string',
    'edit-mode': () => true,
  },
  computed: {
    chosenRequirementText(): string {
      if (this.selectedRequirementID === '') {
        return this.automaticallyFulfilledRequirements.join(', ');
      }
      const chosenRequirementNames = [...this.relatedRequirements, ...this.potentialRequirements]
        .filter(it => it.id === this.selectedRequirementID)
        .map(it => it.name);
      return [...this.automaticallyFulfilledRequirements, ...chosenRequirementNames].join(', ');
    },
    // nonAutoRequirements = relatedRequirements + potentialRequirements
    // All the requirements that are not automatically associated with the course
    nonAutoRequirements(): { readonly id: string; readonly name: string }[] {
      return this.relatedRequirements.concat(this.potentialRequirements);
    },
    nonAutoRequirementsTextArray(): { readonly name: string; readonly selected: boolean }[] {
      return this.nonAutoRequirements.map(it => ({
        name: it.name,
        selected: it.name === this.selectedRequirementName,
      }));
    },
    selectedRequirementName(): string {
      if (this.selectedRequirementID === '') return '';
      const requirements = [...this.relatedRequirements, ...this.potentialRequirements].filter(
        it => it.id === this.selectedRequirementID
      );
      return requirements[0].name;
    },
  },
  methods: {
    toggleSelectRequirement(id: string) {
      this.$emit('on-selected-change', id);
    },
    toggleEditMode() {
      GTagEvent(this.$gtag, 'add-modal-edit-requirements');
      this.$emit('edit-mode');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.newCourse {
  &-semester {
    &-edit {
      width: 83%;
    }
  }
  &-title {
    font-size: 0.9rem;
    line-height: 1rem;
    color: $lightPlaceholderGray;
    margin-bottom: 0.3rem;
  }
}
</style>

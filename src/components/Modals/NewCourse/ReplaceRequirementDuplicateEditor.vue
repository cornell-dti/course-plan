<template>
  <div>
    <div>
      <div class="newCourse-title">Selected Semester</div>
      <div class="newCourse-semester-edit">
        <select-semester
          :season="season"
          :year="year"
          :isCourseModelSelectingSemester="true"
          @updateSemProps="updateSemProps"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { GTagEvent } from '@/gtag';
import SelectSemester from '@/components/Modals/SelectSemester.vue';

export type RequirementWithID = { readonly id: string; readonly name: string };

export default defineComponent({
  components: { SelectSemester },
  data() {
    return {
      courseSelectorKey: 0,
      season: '' as FirestoreSemesterSeason,
      year: 0,
    };
  },
  props: {
    editMode: { type: Boolean, required: true },
    selectedRequirementID: { type: String, required: true },
    automaticallyFulfilledRequirements: {
      type: Array as PropType<readonly string[]>,
      required: true,
    },
    // self check requirements
    potentialRequirements: {
      type: Array as PropType<readonly { readonly id: string; readonly name: string }[]>,
      required: true,
    },
    // all the other ones that don't allow double counting
    relatedRequirements: {
      type: Array as PropType<readonly { readonly id: string; readonly name: string }[]>,
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
    updateSemProps(season: string, year: number) {
      this.season = season as FirestoreSemesterSeason;
      this.year = year;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.newCourse {
  &-name {
    position: relative;
    border-radius: 11px;
    font-size: 14px;
    line-height: 14px;
    color: $darkGray;
  }
  &-title {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    margin-bottom: 6px;
  }
  &-requirements {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: $emGreen;
    &-container {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
    }
    &-edit {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
  &-link {
    padding: 0;
    background-color: $white;
    border: none;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: $yuxuanBlue;
    cursor: pointer;
    &:hover {
      text-decoration-line: underline;
      color: $yuxuanBlue;
    }
  }
}
.warning {
  color: $warning;
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 8px;
  &-icon {
    float: left;
    margin: 0.125rem 0.25rem 0 0;
    width: 14px;
    height: 14px;
  }
}
</style>

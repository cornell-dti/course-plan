<template>
  <div>
    <div v-if="relatedRequirements.length > 0">
      <div class="newCourse-title">This class fulfills the following requirement(s):</div>
      <div v-if="!editMode" class="newCourse-requirements-container">
        <div class="newCourse-requirements">
          {{ selectedRequirementsCommaSeparatedList }}
        </div>
      </div>
      <div v-else class="newCourse-requirements-edit">
        <edit-single-requirement
          v-for="relatedRequirement in relatedRequirements"
          :key="relatedRequirement.id"
          :name="relatedRequirement.name"
          :selected="selectedRequirementIDs.includes(relatedRequirement.id)"
          :isClickable="true"
          @on-select="selected => toggleSelectRequirement(relatedRequirement.id, selected)"
        />
      </div>
    </div>
    <div v-if="potentialRequirements.length > 0">
      <div class="newCourse-title">
        This class could potentially fulfill the following requirement(s):
      </div>
      <div v-if="!editMode" class="newCourse-requirements-container">
        <div class="newCourse-name">
          {{ notSelectedRequirementsCommaSeparatedList }}
        </div>
      </div>
      <div v-else class="newCourse-requirements-edit">
        <edit-single-requirement
          v-for="potentialRequirement in potentialRequirements"
          :key="potentialRequirement.id"
          :name="potentialRequirement.name"
          :selected="selectedRequirementIDs.includes(potentialRequirement.id)"
          :isClickable="true"
          @on-select="selected => toggleSelectRequirement(potentialRequirement.id, selected)"
        />
        <requirement-radio-select-button
          v-for="(choices, index) in radioPotentialRequirements"
          :key="index"
          :chosenID="getChosenIDForRadioButton(choices)"
          :choices="choices"
          @on-select="selectRequirementFromRadioButtons"
        />
      </div>
    </div>
    <div v-if="!editMode" class="newCourse-link" @click="toggleEditMode()">
      {{ editRequirementsText }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import EditSingleRequirement from '@/components/Modals/NewCourse/EditSingleRequirement.vue';
import RequirementRadioSelectButton from '@/components/Modals/NewCourse/RequirementRadioSelectButton.vue';

export type RequirementWithID = { readonly id: string; readonly name: string };

export default Vue.extend({
  components: { EditSingleRequirement, RequirementRadioSelectButton },
  props: {
    editMode: { type: Boolean, required: true },
    selectedRequirementIDs: { type: Array as PropType<readonly string[]>, required: true },
    relatedRequirements: {
      type: Array as PropType<readonly { readonly id: string; readonly name: string }[]>,
      required: true,
    },
    potentialRequirements: {
      type: Array as PropType<readonly { readonly id: string; readonly name: string }[]>,
      required: true,
    },
    radioPotentialRequirements: {
      type: Array as PropType<
        readonly (readonly { readonly id: string; readonly name: string }[])[]
      >,
      required: true,
    },
  },
  computed: {
    selectedRequirementsCommaSeparatedList(): string {
      return [...this.relatedRequirements, ...this.potentialRequirements]
        .filter(({ id }) => this.selectedRequirementIDs.includes(id))
        .map(it => it.name)
        .join(', ');
    },
    notSelectedRequirementsCommaSeparatedList(): string {
      return [...this.relatedRequirements, ...this.potentialRequirements]
        .filter(({ id }) => !this.selectedRequirementIDs.includes(id))
        .map(it => it.name)
        .join(', ');
    },
    editRequirementsText(): string {
      return this.potentialRequirements.length !== 0
        ? 'Add these Requirements'
        : 'Edit Requirements';
    },
  },
  methods: {
    toggleSelectRequirement(id: string, selected: boolean) {
      if (selected) {
        this.$emit('on-selected-change', [...this.selectedRequirementIDs, id]);
      } else {
        this.$emit(
          'on-selected-change',
          this.selectedRequirementIDs.filter(it => it !== id)
        );
      }
    },
    getChosenIDForRadioButton(choices: readonly RequirementWithID[]): string {
      const choice = choices.find(it => this.selectedRequirementIDs.includes(it.id));
      return choice != null ? choice.id : '';
    },
    selectRequirementFromRadioButtons(id: string, choices: readonly RequirementWithID[]) {
      const idsToRemove = new Set(choices.map(it => it.id));
      this.$emit('on-selected-change', [
        ...this.selectedRequirementIDs.filter(selected => !idsToRemove.has(selected)),
        id,
      ]);
    },
    toggleEditMode() {
      this.$emit('edit-mode');
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
    font-weight: 600;
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
      margin-bottom: 13px;
    }
    &-edit {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
  &-link {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    text-decoration-line: underline;
    color: $yuxuanBlue;
    cursor: pointer;
  }
}
</style>

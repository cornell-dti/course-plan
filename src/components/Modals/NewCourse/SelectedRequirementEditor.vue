<template>
  <div>
    <div v-if="requirementsThatAllowDoubleCounting.length > 0">
      <div class="newCourse-title">
        This class automatically fulfills the following requirement(s):
      </div>
      <div class="newCourse-requirements-container">
        <div class="newCourse-requirements">
          {{ requirementsThatAllowDoubleCounting.join(', ') }}
        </div>
      </div>
    </div>
    <div v-if="relatedRequirements.length > 0">
      <div class="newCourse-title">This class can fulfill the following requirement(s):</div>
      <div v-if="!editMode" class="newCourse-requirements-container">
        <div class="newCourse-requirements">
          {{ relatedRequirements.map(it => it.name).join(', ') }}
        </div>
      </div>
      <div v-else class="newCourse-requirements-edit">
        <edit-single-requirement
          v-for="relatedRequirement in relatedRequirements"
          :key="relatedRequirement.id"
          :name="relatedRequirement.name"
          :selected="selectedRequirementID === relatedRequirement.id"
          :isClickable="true"
          @on-select="() => toggleSelectRequirement(relatedRequirement.id)"
        />
      </div>
    </div>
    <div v-if="potentialRequirements.length > 0">
      <div class="newCourse-title">
        This class could potentially fulfill the following requirement(s):
      </div>
      <div v-if="!editMode" class="newCourse-requirements-container">
        <div class="newCourse-name">
          {{ potentialRequirements.map(it => it.name).join(', ') }}
        </div>
      </div>
      <div v-else class="newCourse-requirements-edit">
        <edit-single-requirement
          v-for="potentialRequirement in potentialRequirements"
          :key="potentialRequirement.id"
          :name="potentialRequirement.name"
          :selected="selectedRequirementID === potentialRequirement.id"
          :isClickable="true"
          @on-select="() => toggleSelectRequirement(potentialRequirement.id)"
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

export type RequirementWithID = { readonly id: string; readonly name: string };

export default Vue.extend({
  components: { EditSingleRequirement },
  props: {
    editMode: { type: Boolean, required: true },
    selectedRequirementID: { type: String, required: true },
    requirementsThatAllowDoubleCounting: {
      type: Array as PropType<readonly string[]>,
      required: true,
    },
    relatedRequirements: {
      type: Array as PropType<readonly { readonly id: string; readonly name: string }[]>,
      required: true,
    },
    potentialRequirements: {
      type: Array as PropType<readonly { readonly id: string; readonly name: string }[]>,
      required: true,
    },
  },
  computed: {
    chosenRequirementText(): string {
      const chosenRequirementNames = [...this.relatedRequirements, ...this.potentialRequirements]
        .filter(it => it.id === this.selectedRequirementID)
        .map(it => it.name);
      return [...this.requirementsThatAllowDoubleCounting, ...chosenRequirementNames].join(', ');
    },
    editRequirementsText(): string {
      return this.potentialRequirements.length !== 0
        ? 'Add these Requirements'
        : 'Edit Requirements';
    },
  },
  methods: {
    toggleSelectRequirement(id: string) {
      this.$emit('on-selected-change', id);
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

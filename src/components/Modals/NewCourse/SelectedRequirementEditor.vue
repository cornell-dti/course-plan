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
    <div v-else class="newCourse-requirements-container newCourse-requirements">
      This class does not automatically fulfill any requirements.
    </div>
    <div v-if="nonAutoRequirements.length > 0">
      <div class="newCourse-title">This class can fulfill the following requirement(s):</div>
      <div v-if="!editMode">
        <div class="newCourse-requirements-container">
          <!-- eslint-disable-next-line vue/no-v-html  -->
          <div class="newCourse-title" v-html="nonAutoRequirementsText"></div>
        </div>
      </div>
      <div v-else>
        <div v-if="potentialRequirements.length > 0" class="warning">
          <img class="warning-icon" src="@/assets/images/warning.svg" alt="warning-icon" />
          We cannot accurately check the requirements marked with the warning icon, so double check
          before selecting.
        </div>
        <requirements-dropdown
          :relatedRequirements="relatedRequirements"
          :potentialRequirements="potentialRequirements"
          :selectedID="selectedRequirementID"
          @on-selected-change="toggleSelectRequirement"
        />
      </div>
    </div>
    <div v-if="!editMode" class="newCourse-link" @click="toggleEditMode()">Edit Requirements</div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import RequirementsDropdown from '@/components/Modals/NewCourse/RequirementsDropdown.vue';

export type RequirementWithID = { readonly id: string; readonly name: string };

export default Vue.extend({
  components: { RequirementsDropdown },
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
      if (this.selectedRequirementID === '') return '';
      const chosenRequirementNames = [...this.relatedRequirements, ...this.potentialRequirements]
        .filter(it => it.id === this.selectedRequirementID)
        .map(it => it.name);
      return [...this.requirementsThatAllowDoubleCounting, ...chosenRequirementNames].join(', ');
    },
    nonAutoRequirements(): { readonly id: string; readonly name: string }[] {
      return this.relatedRequirements.concat(this.potentialRequirements);
    },
    nonAutoRequirementsText(): string {
      if (this.selectedRequirementID === '') {
        return this.nonAutoRequirements.map(it => it.name).join(', ');
      }
      return this.nonAutoRequirements
        .map(it => it.name)
        .join(', ')
        .replace(
          this.selectedCourseName,
          `<strong class="newCourse-name">${this.selectedCourseName}</strong>`
        );
    },
    selectedCourseName(): string {
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
      margin-bottom: 12px;
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
    margin-top: 8px;
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

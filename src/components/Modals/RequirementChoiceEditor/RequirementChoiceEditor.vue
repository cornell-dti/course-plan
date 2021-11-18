<template>
  <div>
    <div v-if="requirementsSelection.requirementsThatAllowDoubleCounting.length > 0">
      <div>This class automatically fulfills the following requirement(s):</div>
      <ul>
        <li
          v-for="requirement in requirementsSelection.requirementsThatAllowDoubleCounting"
          :key="requirement"
        >
          {{ requirement }}
        </li>
      </ul>
    </div>
    <div>
      <div>Choose at most one requirement to fulfill:</div>
      <form>
        <div v-for="requirement in requirementsSelection.relatedRequirements" :key="requirement.id">
          <input
            class="requirement-choice-editor-checkbox"
            type="checkbox"
            :id="`requirement-choice-editor-choice-${requirement.id}`"
            :checked="requirement.selected"
            @change="toggle(requirement.id, 'optOut')"
          />
          <label
            :for="`requirement-choice-editor-choice-${requirement.id}`"
            class="requirement-choice-editor-label"
          >
            {{ requirement.name }}
          </label>
        </div>
        <div
          v-for="requirement in requirementsSelection.selfCheckRequirements"
          :key="requirement.id"
        >
          <input
            type="checkbox"
            class="requirement-choice-editor-checkbox"
            :id="`requirement-choice-editor-choice-${requirement.id}`"
            :checked="requirement.selected"
            @change="toggle(requirement.id, 'acknowledgedCheckerWarningOptIn')"
          />
          <label
            :for="`requirement-choice-editor-choice-${requirement.id}`"
            class="requirement-choice-editor-label"
          >
            <img
              class="requirement-choice-editor-warning-icon"
              src="@/assets/images/warning.svg"
              alt="warning icon"
            />
            {{ requirement.name }}
          </label>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

import store from '@/store';
import { getAllEligibleRequirements } from '@/requirements/requirement-frontend-utils';
import { toggleRequirementChoice } from '@/global-firestore-data';

type RequirementWithSelectionState = {
  readonly id: string;
  readonly name: string;
  readonly selected: boolean;
};
type RequirementsSelection = {
  readonly requirementsThatAllowDoubleCounting: readonly string[];
  readonly relatedRequirements: readonly RequirementWithSelectionState[];
  readonly selfCheckRequirements: readonly RequirementWithSelectionState[];
};

export default defineComponent({
  props: { course: { type: Object as PropType<FirestoreSemesterCourse>, required: true } },
  computed: {
    requirementsSelection(): RequirementsSelection {
      const choice = store.state.overriddenFulfillmentChoices[this.course.uniqueID] || {
        optOut: [],
        acknowledgedCheckerWarningOptIn: [],
        arbitraryOptIn: {},
      };
      const optOut = new Set(choice.optOut);
      const acknowledgedOptIn = new Set(choice.acknowledgedCheckerWarningOptIn);
      const {
        requirementsThatAllowDoubleCounting,
        relatedRequirements,
        selfCheckRequirements,
      } = getAllEligibleRequirements(
        this.course.crseId,
        store.state.groupedRequirementFulfillmentReport,
        store.state.toggleableRequirementChoices
      );
      return {
        requirementsThatAllowDoubleCounting: requirementsThatAllowDoubleCounting.map(it => it.name),
        relatedRequirements: relatedRequirements.map(it => ({
          id: it.id,
          name: it.name,
          selected: !optOut.has(it.id),
        })),
        selfCheckRequirements: selfCheckRequirements.map(it => ({
          id: it.id,
          name: it.name,
          selected: acknowledgedOptIn.has(it.id),
        })),
      };
    },
  },
  methods: {
    toggle(id: string, type: keyof FirestoreCourseOptInOptOutChoices): void {
      toggleRequirementChoice(this.course.uniqueID, id, type);
    },
  },
});
</script>

<style lang="scss" scoped>
.requirement-choice-editor-warning-icon {
  margin: 0 0 0.125rem 0;
  width: 14px;
  height: 14px;
}
form input.requirement-choice-editor-checkbox {
  display: inline;
  width: auto;
}
form label.requirement-choice-editor-label {
  margin-left: 0.5rem;
  display: inline;
}
</style>

<template>
  <button
    @click="$emit('on-toggle')"
    class="dropdown row slightly-lower-opacity-on-hover"
    aria-haspopup="true"
    data-toggle="dropdown"
    data-cyId="requirements-displayToggle"
  >
    <div class="row depth-req">
      <div class="btn">
        <drop-down-arrow
          :isFlipped="displayDescription"
          :fillColor="isCompleted ? '#979797CC' : '#979797'"
          :isSubReq="true"
        />
        <div class="requirement-name-container">
          <p class="requirement-name-text">
            <span>{{ requirementFulfillment.requirement.name }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="col requirement-progress text-right">
      {{ requirementFulfillmentProgress }}
    </div>
  </button>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import DropDownArrow from '@/components/DropDownArrow.vue';
import { fulfillmentProgressString } from '@/requirements/requirement-frontend-utils';
import featureFlagCheckers from '@/feature-flags';

export default defineComponent({
  components: { DropDownArrow },
  props: {
    requirementFulfillment: { type: Object as PropType<RequirementFulfillment>, required: true },
    isCompleted: { type: Boolean, required: true },
    displayDescription: { type: Boolean, required: true },
  },
  emits: ['on-toggle'],
  computed: {
    requirementFulfillmentProgress(): string {
      const { requirement, fulfillment } = this.requirementFulfillment;
      if (requirement.fulfilledBy === 'self-check') return 'self check';
      if (fulfillment.additionalRequirements == null) {
        return fulfillmentProgressString(fulfillment);
      }
      const additionalRequirementsList = Object.values(fulfillment.additionalRequirements);

      // Compute progress string x/y requirements fulfilled.
      // We also need to include the main requirement into consideration.

      let totalFulfilledRequirements =
        fulfillment.safeMinCountFulfilled >= fulfillment.minCountRequired ? 1 : 0;
      let dangerouslyFulfilledCount =
        fulfillment.dangerousMinCountFulfilled >= fulfillment.minCountRequired ? 1 : 0;

      const totalRequirementsCount = 1 + additionalRequirementsList.length;
      for (let i = 0; i < additionalRequirementsList.length; i += 1) {
        const additionalRequirementProgress = additionalRequirementsList[i];
        if (
          additionalRequirementProgress.dangerousMinCountFulfilled >=
          additionalRequirementProgress.minCountRequired
        ) {
          dangerouslyFulfilledCount += 1;
        }

        if (
          additionalRequirementProgress.safeMinCountFulfilled >=
          additionalRequirementProgress.minCountRequired
        ) {
          totalFulfilledRequirements += 1;
        }
      }

      // count anything that fulfills requirement, including dangerous fulfillments
      return featureFlagCheckers.isRequirementConflictsEnabled()
        ? `${dangerouslyFulfilledCount}/${totalRequirementsCount} requirements`
        : `${totalFulfilledRequirements}/${totalRequirementsCount} requirements`;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.dropdown {
  background: none;
  width: 100%;
  border: none;
  justify-content: space-between;
  padding: 0;
  align-items: center;
  min-height: 2.25rem;
}

.btn {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &-2 {
    padding-top: 0px;
    margin: 0px;
  }
}
.btn:focus,
.btn:active {
  outline: none !important;
  box-shadow: none;
}

.row {
  margin: 0;
}
.row > div {
  padding: 0;
}

.depth-req {
  justify-content: flex-start;
  align-items: center;
  div:first-child {
    margin: 0px;
  }
}

.text-right {
  color: $lightPlaceholderGray;
}

.requirement-name-container {
  text-align: left;
  margin-left: 11px;
  max-width: 11rem;

  .requirement-name-text {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 14px;
    color: $lightPlaceholderGray;
    margin: 0;
  }
}

.requirement-progress {
  font-size: 14px;
  line-height: 14px;
  margin-top: auto;
  margin-bottom: auto;
}
</style>

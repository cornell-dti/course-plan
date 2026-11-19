<template>
  <button
    @click="$emit('on-toggle')"
    class="dropdown"
    :class="{ 'dropdown--open': displayDescription, 'dropdown--completed': isCompleted }"
    :aria-expanded="displayDescription"
    data-cyId="requirements-displayToggle"
  >
    <svg
      class="dropdown-chevron"
      :class="{ 'dropdown-chevron--closed': !displayDescription }"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.33"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
    <span class="requirement-name-text">{{ requirementFulfillment.requirement.name }}</span>
    <span class="requirement-progress">{{ requirementFulfillmentProgress }}</span>
  </button>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { fulfillmentProgressString } from '@/requirements/requirement-frontend-utils';
import featureFlagCheckers from '@/feature-flags';

export default defineComponent({
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
@import '@/assets/scss/_tokens.scss';

// V2 requirement row: chevron, name, progress on the right
.dropdown {
  @include cp-reset-button;
  @include cp-font;
  width: calc(100% + 16px);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 -8px;
  padding: 10px 8px;
  border-radius: $cp-r-sm;
  text-align: left;
  transition: background-color 100ms;

  &:hover {
    background: $cp-hover;
  }

  &:active {
    background: $cp-press;
  }

  &-chevron {
    flex-shrink: 0;
    color: $cp-muted;
    transition: transform 200ms;

    &--closed {
      transform: rotate(-90deg);
    }
  }
}

.requirement-name-text {
  @include cp-text(13px, 18px);
  flex: 1;
  min-width: 0;
  color: $cp-ink;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .dropdown--open & {
    font-weight: 600;
    white-space: normal;
  }

  .dropdown--completed & {
    color: $cp-muted;
  }
}

.requirement-progress {
  @include cp-text(12px, 16px);
  color: $cp-muted;
  white-space: nowrap;

  .dropdown--completed & {
    color: $cp-success;
  }
}
</style>

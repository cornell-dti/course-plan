<template>
  <div v-if="nestedRequirements">
    <div class="nested-requirement-choices">
      <label class="single-choice" :for="`compound-requirement--id-${requirement.id}--default`">
        <input
          :id="`compound-requirement--id-${requirement.id}--default`"
          type="radio"
          :checked="choice === ''"
          @change="() => $emit('update-choice', '')"
          value="name"
        />
        {{ requirement.description }}
      </label>
      <label
        v-for="name in nestedRequirements"
        :key="name"
        class="single-choice"
        :for="`compound-requirement--id-${requirement.id}--choice-${name}`"
      >
        <input
          :id="`compound-requirement--id-${requirement.id}--choice-${name}`"
          type="radio"
          :checked="choice === name"
          @change="() => $emit('update-choice', name)"
          value="name"
        />
        {{ name }}
      </label>
    </div>
    <div class="progress-string">{{ progressString }}</div>
  </div>
  <div v-else>
    {{ requirement.description }}
    <a class="learn-more" :href="requirement.source" target="_blank">Learn More</a>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { fulfillmentProgressString } from '@/requirements/requirement-frontend-utils';

/** Show compound requirement for toggle or description */
export default defineComponent({
  props: {
    requirementFulfillment: { type: Object as PropType<RequirementFulfillment>, required: true },
    /** User choice of the nested requirement to display. */
    choice: { type: String, required: true },
    /** Color of the link. */
    color: { type: String, required: true },
  },
  emits: {
    'update-choice': (choice: string) => typeof choice === 'string',
  },
  computed: {
    requirement(): RequirementWithIDSourceType {
      return this.requirementFulfillment.requirement;
    },
    nestedRequirements(): readonly string[] | null {
      if (this.requirementFulfillment.fulfillment.additionalRequirements) {
        return Object.keys(this.requirementFulfillment.fulfillment.additionalRequirements);
      }
      return null;
    },
    progressString(): string {
      const currentVisibleNestedRequirementStatistics = (this.requirementFulfillment.fulfillment
        .additionalRequirements || {})[this.choice];
      if (currentVisibleNestedRequirementStatistics != null) {
        return fulfillmentProgressString(currentVisibleNestedRequirementStatistics);
      }
      return fulfillmentProgressString(this.requirementFulfillment.fulfillment);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_tokens.scss';

.learn-more {
  @include cp-text(13px, 18px, 600);
  color: $cp-link;
  &:hover {
    color: $cp-link-strong;
    text-decoration: underline;
  }
}

// compound requirement: radio list of the ways to satisfy it
.nested-requirement-choices {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 8px 0;

  .single-choice {
    @include cp-text(13px, 18px);
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 0;
    padding: 8px 12px;
    border: 1px solid $cp-line-strong;
    border-radius: $cp-r-md;
    background: #fff;
    cursor: pointer;

    &:hover {
      background: $cp-hover;
    }

    &:has(input:checked) {
      border-color: $cp-link;
      background: $cp-soft;
      color: $cp-link-strong;
    }

    input {
      margin-top: 3px;
      accent-color: $cp-brand;
    }
  }
}

// "What counts"-style summary box
.progress-string {
  @include cp-text(12px, 16px, 600);
  background: $cp-subtle;
  border: 1px solid $cp-line;
  border-radius: $cp-r-md;
  padding: 12px 16px;
}
</style>

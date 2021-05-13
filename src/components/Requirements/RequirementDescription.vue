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
    <a :style="{ color: `#${color}` }" :href="requirement.source" target="_blank">
      <strong>Learn More</strong></a
    >
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

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
      if (this.requirementFulfillment.additionalRequirements) {
        return Object.keys(this.requirementFulfillment.additionalRequirements);
      }
      return null;
    },
    progressString(): string {
      const currentVisibleNestedRequirementStatistics = (this.requirementFulfillment
        .additionalRequirements || {})[this.choice];
      if (currentVisibleNestedRequirementStatistics != null) {
        const {
          minCountFulfilled,
          minCountRequired,
          fulfilledBy,
        } = currentVisibleNestedRequirementStatistics;
        return `${minCountFulfilled}/${minCountRequired} ${fulfilledBy}`;
      }
      const { minCountFulfilled, minCountRequired, fulfilledBy } = this.requirementFulfillment;
      return `${minCountFulfilled}/${minCountRequired} ${fulfilledBy}`;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.nested-requirement-choices {
  margin: 0.5rem 0 0.5rem 1rem;
  padding: 0 0.5rem;
  border-left: 1px solid $inactiveGray;

  .single-choice {
    display: block;
  }
}

.progress-string {
  background-color: $yuxuanBlueTransparent;
  border-radius: 0.25rem;
  padding: 0.5rem;
  text-align: center;
}
</style>

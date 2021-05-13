<template>
  <div>
    <requirement-description
      :requirementFulfillment="requirementFulfillment"
      :choice="modelValue"
      :color="color"
      @update-choice="choice => $emit('update:modelValue', choice)"
    />
    <div
      v-if="requirementFulfillment.requirement.checkerWarning"
      class="requirement-checker-warning"
    >
      <img
        class="requirement-checker-warning-icon"
        src="@/assets/images/warning.svg"
        alt="warning icon"
      />
      {{ requirementFulfillment.requirement.checkerWarning }}
    </div>
    <div
      v-if="requirementFulfillment.requirement.fulfilledBy === 'self-check'"
      class="requirement-checker-warning"
    >
      <img
        class="requirement-checker-warning-icon"
        src="@/assets/images/warning.svg"
        alt="warning icon"
      />
      This requirement is not included in the progress bar because we do not check if it is
      completed.
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import RequirementDescription from '@/components/Requirements/RequirementDescription.vue';

export default defineComponent({
  components: { RequirementDescription },
  props: {
    requirementFulfillment: { type: Object as PropType<RequirementFulfillment>, required: true },
    /** User choice of the nested requirement to display. */
    modelValue: { type: String, required: true },
    /** Color of the link. */
    color: { type: String, required: true },
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.requirement-checker-warning {
  color: $warning;
  margin-top: 0.25rem;

  &-icon {
    float: left;
    margin: 0.125rem 0.25rem 0 0;
    width: 14px;
    height: 14px;
  }
}
</style>

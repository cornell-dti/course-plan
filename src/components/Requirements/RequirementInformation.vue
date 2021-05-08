<template>
  <div>
    <div>
      {{ requirement.description }}
      <a :style="{ color: `#${color}` }" :href="requirement.source" target="_blank">
        <strong>Learn More</strong></a
      >
    </div>
    <div v-if="requirement.checkerWarning" class="requirement-checker-warning">
      <img
        class="requirement-checker-warning-icon"
        src="@/assets/images/warning.svg"
        alt="warning icon"
      />
      {{ requirement.checkerWarning }}
    </div>
    <div v-if="requirement.fulfilledBy === 'self-check'" class="requirement-checker-warning">
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

export default defineComponent({
  props: {
    requirement: { type: Object as PropType<RequirementWithIDSourceType>, required: true },
    color: { type: String, required: true },
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

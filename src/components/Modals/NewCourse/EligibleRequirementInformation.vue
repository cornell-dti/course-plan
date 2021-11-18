<template>
  <div>
    <div v-if="autoRequirements.length > 0">
      <div class="eligble-requirement-title">
        This class automatically fulfills the following requirement(s):
      </div>
      <div class="eligble-requirements-container">
        <div class="requirements-text">{{ autoRequirements.join(', ') }}</div>
      </div>
    </div>
    <div v-else class="eligble-requirements-container requirements-text">
      This class does not automatically fulfill any requirements.
    </div>
    <div v-if="nonAutoRequirements.length > 0">
      <div>
        <div class="eligble-requirement-title">
          This class could potentially fulfill the following requirement(s):
        </div>
        <div class="eligble-requirement-title">
          <strong class="eligble-requirement-name">{{ nonAutoRequirements.join(', ') }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

export type RequirementWithID = { readonly id: string; readonly name: string };

export default defineComponent({
  props: {
    autoRequirements: { type: Array as PropType<readonly string[]>, required: true },
    nonAutoRequirements: { type: Array as PropType<readonly string[]>, required: true },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.eligble-requirement-title {
  font-size: 14px;
  line-height: 17px;
  color: $lightPlaceholderGray;
  margin-bottom: 6px;
}
.eligble-requirement-name {
  position: relative;
  border-radius: 11px;
  font-size: 14px;
  line-height: 14px;
  color: $darkGray;
}
.eligble-requirements-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}
.requirements-text {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
  color: $emGreen;
}
</style>

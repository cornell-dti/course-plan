<template>
  <div>
    <div class="conflictEditor-reqs">
      <div class="conflictEditor-req" v-for="[reqName, bool] in checkedReqs" :key="reqName">
        <input type="checkbox" :id="reqName" :checked="bool" @change="checkOrUncheckReq(reqName)" />
        <label v-if="!isReqSelectable(reqName)" :for="reqName" class="conflictEditor-label">{{
          getDisplayName(reqName)
        }}</label>
        <label v-else :for="reqName" class="conflictEditor-label">
          <img class="warning-icon" src="@/assets/images/warning.svg" alt="warning icon" />
          {{ getDisplayName(reqName) }}</label
        >
        <span
          class="conflictEditor-pill"
          :style="{ color: getPillColor(reqName), 'border-color': getPillColor(reqName) }"
          >{{ getSourceName(reqName) }}</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { toggleRequirementChoice } from '@/global-firestore-data';
import store from '@/store';
import { getReqColor } from '@/utilities';

export default defineComponent({
  props: {
    selectedCourse: { type: Object as PropType<FirestoreSemesterCourse>, required: true },
    checkedReqs: { type: Object as PropType<Map<string, boolean>>, required: true },
    conflictNumber: { type: Number, required: true },
    selectableRequirements: {
      type: Object as PropType<readonly RequirementWithIDSourceType[]>,
      required: true,
    },
  },
  emits: {
    'conflict-changed': (reqName: string, conflictNum: number) =>
      typeof reqName === 'string' && typeof conflictNum === 'number',
  },
  methods: {
    checkOrUncheckReq(reqName: string) {
      this.$emit('conflict-changed', reqName, this.conflictNumber);

      // edit the requirements assigned to the course when editor changed
      if (this.isReqSelectable(reqName)) {
        toggleRequirementChoice(
          this.selectedCourse.uniqueID,
          store.state.userRequirementsMap[reqName].id,
          'acknowledgedCheckerWarningOptIn'
        );
      } else {
        toggleRequirementChoice(
          this.selectedCourse.uniqueID,
          store.state.userRequirementsMap[reqName].id,
          'optOut'
        );
      }
    },
    // req is self check if present in selectableRequirements list
    isReqSelectable(reqName: string) {
      return this.selectableRequirements.filter(req => req.id === reqName).length > 0;
    },
    getDisplayName(reqId: string) {
      return store.state.userRequirementsMap[reqId].name;
    },
    getSourceName(reqId: string) {
      return store.state.userRequirementsMap[reqId].sourceType.toLowerCase();
    },
    getPillColor(reqId: string) {
      const color = getReqColor(
        store.state.userRequirementsMap[reqId].sourceType,
        store.state.onboardingData
      );
      return `#${color}`;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.conflictEditor {
  &-label {
    margin-left: 0.75rem;
  }

  &-reqs {
    display: flex;
    flex-direction: column;
  }

  &-req {
    display: flex;
    align-items: center;
  }

  &-label {
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
  }

  &-pill {
    margin-left: 0.3rem;
    padding: 0 0.3rem;
    color: $sangBlue;
    border: 1px solid $sangBlue;
    border-radius: 10px;
    font-size: 12px;
    line-height: 14px;
  }
}

.warning-icon {
  margin-right: 0.125rem;
  margin-bottom: 0.25rem;
  width: 14px;
  height: 14px;
}
</style>

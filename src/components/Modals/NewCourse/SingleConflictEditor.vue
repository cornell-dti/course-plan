<template>
  <div>
    <div class="conflictEditor-reqs">
      <div
        class="conflictEditor-req"
        v-for="([reqName, bool], index) in checkedReqs"
        :key="reqName"
      >
        <input
          type="checkbox"
          :id="reqName"
          :checked="bool"
          @change="checkOrUncheckReq(reqName, index)"
        />
        <label v-if="!isReqSelfCheck(index)" :for="reqName" class="conflictEditor-label">{{
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
    numSelfChecks: { type: Number, required: true },
  },
  computed: {
    // Type-safe accessor for selectedCourse prop
    typedCourse(): FirestoreSemesterCourse {
      return this.selectedCourse as FirestoreSemesterCourse;
    },
  },
  emits: {
    'conflict-changed': (reqName: string, conflictNum: number) =>
      typeof reqName === 'string' && typeof conflictNum === 'number',
  },
  methods: {
    checkOrUncheckReq(reqName: string, index: string) {
      this.$emit('conflict-changed', reqName, this.conflictNumber);

      // edit the requirements assigned to the course when editor changed
      if (this.isReqSelfCheck(index)) {
        toggleRequirementChoice(
          this.typedCourse.uniqueID,
          store.state.userRequirementsMap[reqName].id,
          'acknowledgedCheckerWarningOptIn'
        );
      } else {
        toggleRequirementChoice(
          this.typedCourse.uniqueID,
          store.state.userRequirementsMap[reqName].id,
          'optOut'
        );
      }
    },
    // req is self check if index has numSelfChecks or fewer reqs until it reaches the end of the list
    isReqSelfCheck(index: string) {
      return parseInt(index, 10) >= this.checkedReqs.size - this.numSelfChecks;
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

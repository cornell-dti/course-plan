<template>
  <div>
    <div class="conflictEditor-reqs">
      <div class="conflictEditor-req" v-for="[reqName, bool] in checkedReqs" :key="reqName">
        <input type="checkbox" :id="reqName" :checked="bool" @change="checkOrUncheckReq(reqName)" />
        <label :for="reqName" class="conflictEditor-label">{{ reqName }}</label>
      </div>
      <!-- TODO add back selectable reqs -->
      <!-- <div class="conflictEditor-req">
        <input type="checkbox" value="selectableReq1" v-model="checkedReqs" />
        <label for="selectableReq1" class="conflictEditor-label">
          <img class="warning-icon" src="@/assets/images/warning.svg" alt="warning icon" />
          Selectable Req #1</label
        >
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  props: {
    checkedReqs: { type: Object as PropType<Map<string, boolean>>, required: true },
    conflictNumber: { type: Number, required: true },
  },
  emits: {
    'conflict-changed': (reqName: string, conflictNum: number) =>
      typeof reqName === 'string' && typeof conflictNum === 'number',
  },
  methods: {
    checkOrUncheckReq(reqName: string) {
      this.$emit('conflict-changed', reqName, this.conflictNumber);
    },
  },
});
</script>

<style scoped lang="scss">
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
}

.warning-icon {
  margin-right: 0.125rem;
  margin-bottom: 0.25rem;
  width: 14px;
  height: 14px;
}
</style>

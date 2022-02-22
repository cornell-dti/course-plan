<template>
  <div>
    <!-- TODO @willespencer programatically generate conflicts -->
    <div class="conflictEditor-reqs">
      <div class="conflictEditor-req">
        <input type="checkbox" value="req1" v-model="checkedReqs" />
        <label for="req1" class="conflictEditor-label">Requirement #1</label>
      </div>
      <div class="conflictEditor-req">
        <input type="checkbox" value="req2" v-model="checkedReqs" />
        <label for="req2" class="conflictEditor-label">Requirement #2</label>
      </div>
      <div class="conflictEditor-req">
        <input type="checkbox" value="selectableReq1" v-model="checkedReqs" />
        <label for="selectableReq1" class="conflictEditor-label">
          <img class="warning-icon" src="@/assets/images/warning.svg" alt="warning icon" />
          Selectable Req #1</label
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    conflictNumber: { type: Number, required: true },
  },
  data() {
    return {
      checkedReqs: ['req1', 'req2', 'selectableReq1'],
    };
  },
  emits: {
    'conflict-changed': (selectedReqs: string[], conflictNum: number) =>
      Array.isArray(selectedReqs) && typeof conflictNum === 'number',
  },
  watch: {
    checkedReqs(newVal, oldVal) {
      if (oldVal) {
        this.$emit('conflict-changed', newVal, this.conflictNumber);
      }
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

<template>
  <div>
    <!-- TODO @willespencer programatically generate conflicts -->
    <div class="conflictEditor-reqs">
      <div class="conflictEditor-req">
        <input type="checkbox" value="req" v-model="picked" />
        <label for="req" class="conflictEditor-label">Requirement #1</label>
      </div>
      <div class="conflictEditor-req">
        <input type="checkbox" value="selectableReq" v-model="picked" />
        <label for="selectableReq" class="conflictEditor-label">
          <img class="warning-icon" src="@/assets/images/warning.svg" alt="warning icon" />
          Selectable Req #1</label
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
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

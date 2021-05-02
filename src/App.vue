<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { addOverridenRequirementAPIB } from './global-firestore-data';

export default defineComponent({
  mounted() {
    addOverridenRequirementAPIB(
      'test',
      true,
      'reqName',
      'slotName',
      'uniqueID'
    );
  },
});
</script>

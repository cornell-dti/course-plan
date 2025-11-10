<template>
  <div class="bottombartitle" :style="{ background: `#${color}` }">
    <div class="bottombar-square-title">{{ code }} - {{ name }}</div>
    <img
      v-if="!isExpanded"
      class="bottombartitle-arrow"
      src="@/assets/images/uparrow-white.svg"
      alt="collapse bottom bar"
    />
    <img
      v-if="isExpanded"
      class="bottombartitle-arrow"
      src="@/assets/images/downarrow-white.svg"
      alt="expand bottom bar"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    color: { type: String, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    isExpanded: { type: Boolean, required: true },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.bottombartitle {
  padding-left: 0.5rem;
  line-height: 40px;
  background-color: #25a2aa;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  filter: brightness(100%);

  &:hover {
    filter: brightness(95%);
    transition: all 0.2s ease;
  }

  .bottombar-square-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.bottombartitle-arrow {
  position: absolute;
  right: 2%;
  top: 40%;
}
</style>

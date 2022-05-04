<template>
  <div class="card" :style="cssVars" :class="{ 'card--collapsed': isCollapsed }">
    <div class="card-top">
      <div class="card-minspacer">
        <img v-if="!isCollapsed" src="@/assets/images/minimize.svg" alt="minimize card" />
        <img v-else src="@/assets/images/expand.svg" alt="expand card" />
      </div>
      <div class="card-name">{{ name }}</div>
      <button class="card-minimize" @click="collapse">
        <img v-if="!isCollapsed" src="@/assets/images/minimize.svg" alt="minimize card" />
        <img v-else src="@/assets/images/expand.svg" alt="expand card" />
      </button>
    </div>
    <div v-if="isCollapsed"></div>
    <hr class="card-divider" v-if="!isCollapsed" />
    <div class="card-content" v-if="!isCollapsed">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    desiredWidth: { type: Number, required: false, default: 574 },
    desiredHeight: { type: Number, required: false, default: 275 },
  },

  data() {
    return {
      isCollapsed: false,
    };
  },
  mounted() {
    const savedMinimize = localStorage.getItem(JSON.stringify(this.name));
    this.isCollapsed = savedMinimize ? JSON.parse(savedMinimize) : false;
  },
  methods: {
    collapse() {
      this.isCollapsed = !this.isCollapsed;
      localStorage.setItem(JSON.stringify(this.name), JSON.stringify(this.isCollapsed));
    },
  },
  computed: {
    cssVars() {
      return {
        '--w': `${this.desiredWidth}px`,
        '--h': `${this.desiredHeight}px`,
      };
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.card {
  width: var(--w);
  height: var(--h);
  box-sizing: border-box;
  box-shadow: 0 0 10px 4px $boxShadowGray;
  position: relative;
  border-radius: 10px;
  border-width: 0;
  align-items: center;
  background-color: $white;
  margin: 0 80px 40px 5px;

  &--collapsed {
    height: 50px;
    margin-bottom: calc(var(--h) - 50px + 40px);
  }

  &-top {
    :first-child {
      margin-right: auto;
    }

    :last-child {
      margin-left: auto;
    }

    display: flex;
    width: 100%;
    height: 50px;
    min-height: 50px;
    justify-content: center;
    align-items: center;
  }

  &-divider {
    width: calc(100% - 64px);
    align-self: center;
    margin: 0;
  }

  &-content {
    margin: 14px 32px 14px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% - 64px);
    height: 100%;
  }

  &-name {
    display: flex;
    font-size: 16px;
    color: #192a3e;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-minimize {
    margin-right: 32px;
    margin-left: 32px;
    padding: 0;
  }

  &-minspacer {
    @extend .card-minimize;
    visibility: hidden;
  }
}
</style>

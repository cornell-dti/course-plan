<template>
  <div class="card" :class="{ 'card--collapsed': isCollapsed }">
    <div class="card-top">
      <button class="card-minspacer">
        <img v-if="!isCollapsed" src="@/assets/images/minimize.svg" alt="minimize card" />
        <img v-else src="@/assets/images/expand.svg" alt="expand card" />
      </button>
      <div class="card-name">{{ name }}</div>
      <button class="card-minimize" @click="collapse">
        <img v-if="!isCollapsed" src="@/assets/images/minimize.svg" alt="minimize card" />
        <img v-else src="@/assets/images/expand.svg" alt="expand card" />
      </button>
    </div>
    <!--    <span>-&#45;&#45;THIS IS THE CENTER-&#45;&#45;</span>-->
    <div v-if="isCollapsed"></div>
    <hr class="card-divider" v-if="!isCollapsed" />
    <div class="card-content" v-if="!isCollapsed">
      <slot></slot>
      <!-- this is for the content -->
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    desiredWidth: { type: Number, required: false, default: 260 },
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
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.card {
  width: 574px;
  box-sizing: border-box;
  box-shadow: 0 0 10px 4px $boxShadowGray;
  position: relative;
  border-radius: 10px;
  height: 260px;
  border-width: 0; //TODO: figure out why border-width is default > 0
  align-items: center;
  background-color: $white;

  &--collapsed {
    height: 50px;
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
    justify-content: center;
    align-items: center;
  }

  &-divider {
    width: calc(100% - 64px);
    align-self: center;
    margin: 0;
  }

  &-content {
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
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

  //&-buttons {
  //  //display: flex;
  //  //justify-content: space-around;
  //  //margin: 0rem;
  //}
}
</style>

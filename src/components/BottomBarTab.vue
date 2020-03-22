<template>
  <div class="bottombartab" :style="{ background: `#${color}` }" :class="{ inactive: !isFirstTab}" @click="bottomBarTabToggle(courseObj)">
    <div class="bottombartab-wrapper" @click="toggleFromTab">
      <img v-if="isFirstTab && !isExpanded" class="bottombartab-arrow" src="@/assets/images/uparrow-white.svg"/>
      <img v-if="isFirstTab && isExpanded" class="bottombartab-arrow" src="@/assets/images/downarrow-white.svg"/>
      <div class="bottombartab-name">{{subject}} {{number}}</div>
    </div>
    <img class="bottombartab-delete" src="@/assets/images/x-white.svg" @click="deleteBottomTab(subject, number)"/>
  </div>
</template>

<script>

export default {
  props: {
    subject: String,
    number: String,
    color: String,
    id: Number,
    courseObj: Object,
    isFirstTab: Boolean,
    isExpanded: Boolean
  },

  methods: {
    bottomBarTabToggle(courseObj) {
      this.$emit('bottomBarTabToggle', courseObj);
    },

    deleteBottomTab(subject, number) {
      this.$emit('deleteBottomTab', subject, number);
    },

    toggleFromTab() {
      if ((!this.isFirstTab && !this.isExpanded) || this.isFirstTab) {
        this.$emit('toggleFromTab');
      }
    }

  }
};
</script>

<style scoped lang="scss">
  .bottombartab {
    position: relative;
    width: 11.5rem;
    height: 1.75rem;
    background-color: #25A2AA;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    display: flex;
    align-items: center;

    display: flex;
    justify-content: space-between;
    padding-left: 8px;
    padding-right: 8px;

    cursor: pointer;

    &:hover {
      opacity: 1.0;
    }

    &-wrapper {
      display: flex;
      flex-direction: row;
      width: 75%;
    }

    &-arrow {
      width: 14px;
      height: 50%;
      margin-right: 4%;
    }

    &-name {
      color: white;
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
    }

    &-delete {
      width: 10px;
      height: 50%;
      cursor:pointer;
    }
  }

  .inactive {
    mix-blend-mode: multiply;
    opacity: 0.8;
  }

</style>

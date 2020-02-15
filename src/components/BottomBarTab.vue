<template>
  <div class="bottombartab" :style="{ background: `#${color}` }" @click="bottomBarTabToggle(courseObj)">
    <!-- <img class="bottombartab-arrow" /> -->
    <div class="bottombartab-name">{{subject}} {{number}}</div>
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
    courseObj: Object
  },

  methods: {
    bottomBarTabToggle(courseObj) {
      this.$emit('bottomBarTabToggle', courseObj);
    },

    deleteBottomTab(subject, number) {
      this.$emit('deleteBottomTab', subject, number);
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

</style>

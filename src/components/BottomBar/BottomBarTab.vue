<template>
  <div
    class="bottombartab"
    :style="{ background: `#${color}` }"
    :class="{ inactive: !isBottomCourseFocus }"
    @click="bottomBarTabToggle(courseObj)"
  >
    <div class="bottombartab-wrapper">
      <div class="bottombartab-name">{{ courseObj.code }}</div>
    </div>
    <img
      class="bottombartab-delete"
      src="@/assets/images/x-white.svg"
      @click.stop="deleteBottomTab(courseObj)"
      alt="x"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    color: { type: String, required: true },
    courseObj: { type: Object as PropType<AppBottomBarCourse>, required: true },
    tabIndex: { type: Number, required: true },
    bottomCourseFocus: { type: Number, required: true },
    isExpanded: { type: Boolean, required: true },
  },

  methods: {
    bottomBarTabToggle(courseObj: AppBottomBarCourse) {
      this.$emit('bottomBarTabToggle', courseObj);
      this.toggleFromTab();
    },

    deleteBottomTab(courseObj: AppBottomBarCourse) {
      this.$emit('deleteBottomTab', courseObj);
    },

    toggleFromTab() {
      if (this.tabIndex === this.bottomCourseFocus || !this.isExpanded) {
        this.$emit('toggleFromTab');
      }
    },
  },

  computed: {
    isBottomCourseFocus() {
      return this.tabIndex === this.bottomCourseFocus;
    },
  },
});
</script>

<style scoped lang="scss">
.bottombartab {
  position: relative;
  width: 11.5rem;
  height: 1.75rem;
  background-color: #25a2aa;
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
    opacity: 1;
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
    margin-top: 5%;
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
    cursor: pointer;
  }
}

.inactive {
  mix-blend-mode: multiply;
  opacity: 0.8;
}

@media only screen and (max-width: 976px) {
  .bottombartab {
    width: 10.5rem;
  }
}

@media only screen and (max-width: 440px) {
  .bottombartab {
    width: 100%;
    height: 100%;

    &-arrow {
      margin-top: auto;
      margin-bottom: auto;
      margin-right: 10%;
      width: 1.56rem;
      height: 50%;
    }
  }
}
</style>

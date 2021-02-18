<!-- Add Course 1 text like other things, Dropdown like SubRequirement.vue, + Add course to schedule option -->
<template>
  <div class="incompleteselfcheck">
    <div class="dropdown-select-wrapper">
      <div
        class="dropdown-select dropdown-input"
        v-click-outside="closeMenuIfOpen"
      >
        <div
          class="dropdown-placeholder dropdown-wrapper"
          @click="showDropdown = !showDropdown"
        >
          <span>Select Course</span>
        </div>
        <div
          class="dropdown-placeholder dropdown-arrow"
        ></div>
      </div>
      <div
        class="dropdown-content"
        v-if="showDropdown"
      >
        <div
          v-for="optionName in testCourseList"
          :key="optionName"
          class="dropdown-content-item"
          @click="addCourse(optionName)"
        >
          <span>{{ optionName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { clickOutside } from '@/utilities';


type Data = {
  showDropdown: boolean;
  testCourseList: Array<string>;
};

export default Vue.extend({
  props: {
  },
  data(): Data {
    return {
      showDropdown: false,
      testCourseList: ["CS 3152", "INFO 3300"]
    };
  },
  computed: {
  },
  directives: {
    'click-outside': clickOutside,
  },
  methods: {
    closeMenuIfOpen() {
      this.showDropdown = false;
    },
    addCourse(option: string) {
      this.showDropdown = false;
      // TODO: open add modal for this course
    },
  }
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.dropdown {
  &-select {
    display: flex;
    flex-direction: row;
    background: $white;
    border: 0.5px solid $inactiveGray;
    box-sizing: border-box;
    border-radius: 2px;
    width: 100%;
    font-size: 14px;
    line-height: 17px;
    color: $darkPlaceholderGray;
    position: relative;
    
    &:not(:first-child) {
      margin-top: 0.5rem;
    }
  }
  &-placeholder {
    height: 100%;
    font-size: 14px;
    line-height: 17px;
    margin-left: 0.25rem;
    display: flex;
    align-items: center;
    color: $darkPlaceholderGray;
    background: transparent;
    cursor: pointer;
  }
  &-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }
  &-arrow {
    border-left: 6.24px solid transparent;
    border-right: 6.24px solid transparent;
    border-top: 6.24px solid $inactiveGray;
    background: transparent;
    margin-right: 8.7px;
    margin-left: 5px;
    margin-top: 5px;
    margin-bottom: auto;
  }
  &-content {
    z-index: 2;
    position: absolute;
    width: 88%;
    background: $white;
    box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
    border-radius: 7px;
    margin-top: 3px;
    &-item {
      height: 2.25rem;
      font-size: 14px;
      line-height: 17px;
      display: flex;
      align-items: center;
      color: $lightPlaceholderGray;
      padding-left: 10px;
      cursor: pointer;

      &:first-child {
        border-radius: 7px 7px 0px 0px;
      }

      &:last-child {
        border-radius: 0px 0px 7px 7px;
      }
    }
  }
  &-content div:hover {
    background: rgba(50, 160, 242, 0.15);
    width: 100%;
  }
}
</style>

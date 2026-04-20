<template>
  <button
    class="bottombartab full-opacity-on-hover"
    :style="{
      background: `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padEnd(6, '0')}`,
    }"
    @click="$emit('on-change-focus')"
  >
    <div class="bottombartab-wrapper">
      <div class="bottombartab-name">{{ courseObj.code }}</div>
    </div>
    <button @click.stop="$emit('on-delete')">
      <img
        class="bottombartab-delete"
        src="@/assets/images/x-white.svg"
        alt="x to delete bottom bar tab"
      />
    </button>
  </button>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  props: {
    color: { type: String, required: true },
    courseObj: { type: Object as PropType<AppBottomBarCourse>, required: true },
    tabIndex: { type: Number, required: true },
    bottomCourseFocus: { type: Number, required: true },
    isExpanded: { type: Boolean, required: true },
  },
  emits: ['on-change-focus', 'on-delete'],
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.bottombartab {
  position: relative;
  width: 11.5rem;
  height: 1.75rem;
  background-color: $yuxuanBlue;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  display: flex;
  align-items: center;

  display: flex;
  justify-content: space-between;
  padding-left: 8px;
  padding-right: 8px;

  &:hover {
    filter: brightness(95%);
    transition: all 0.2s ease;
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
    color: $white;
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

@media only screen and (max-width: $large-breakpoint) {
  .bottombartab {
    width: 10.5rem;
  }
}

@media only screen and (max-width: $small-breakpoint) {
  .bottombartab {
    width: 9rem;

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

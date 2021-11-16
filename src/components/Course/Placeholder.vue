<template>
  <div :class="{ 'placeholder--min': compact }" class="placeholder">
    <div class="placeholder-color">
      <img src="@/assets/images/dots/sixDots.svg" alt="" />
    </div>
    <div class="placeholder-content" @click="openModal()">
      <div class="placeholder-name" :class="{ 'placeholder-name--min': compact }">
        {{ placeholderObj.name }}
      </div>
      <!-- TODO make sure caution works -->
      <!-- <course-caution :course="courseObj" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
// import CourseCaution from '@/components/Course/CourseCaution.vue';

export default defineComponent({
  // components: { CourseCaution },
  props: {
    placeholderObj: { type: Object as PropType<FirestoreSemesterPlaceholder>, required: true },
    compact: { type: Boolean, required: true },
    semesterIndex: { type: Number, required: false, default: 0 },
  },
  // data() {},
  methods: {
    openModal() {
      // TODO: open modal to assign course to placeholder
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.placeholder {
  box-sizing: border-box;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  position: relative;
  height: 5.625rem;

  &--min {
    height: 2.125rem;
  }

  &-color {
    background-color: $darkPlaceholderGray;
    width: $colored-grabber-width;
    border-radius: 0.42rem 0 0 0.42rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-content {
    border-style: dashed;
    border-color: $borderGray;
    border-width: 2px 2px 2px 0;
    border-radius: 0 0.5rem 0.5rem 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover,
    &:active,
    &.focus {
      border-color: $yuxuanBlue;
      background: rgba(0, 0, 0, 0.03);
      color: $yuxuanBlue;
      cursor: pointer;
    }
  }

  &-name {
    font-size: 16px;
    font-weight: bold;
    color: $lightPlaceholderGray;

    &--min {
      font-size: 14px;
    }
  }
}
</style>

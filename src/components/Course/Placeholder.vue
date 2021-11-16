<template>
  <div :class="{ 'placeholder--min': compact }" class="placeholder">
    <div class="placeholder-color">
      <img src="@/assets/images/dots/sixDots.svg" alt="" />
    </div>
    <div class="placeholder-content" @click="openModal()">
      <div class="placeholder-name">Placeholder Name</div>
      <!-- TODO make sure caution works -->
      <!-- <course-caution :course="courseObj" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CourseCaution from '@/components/Course/CourseCaution.vue';
import { clickOutside } from '@/utilities';

export default defineComponent({
  components: { CourseCaution },
  props: {
    // courseObj: { type: Object as PropType<FirestoreSemesterCourse>, required: true },
    compact: { type: Boolean, required: true },
    semesterIndex: { type: Number, required: false, default: 0 },
  },
  // data() {},
  methods: {
    openModal() {
      // TODO: in follow-up PR, open modal to assign course to placeholder
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
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:active:hover {
    touch-action: none;
    cursor: grabbing;
  }

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
    width: 100%;
  }
}
</style>

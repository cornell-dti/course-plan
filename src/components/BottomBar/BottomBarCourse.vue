<template>
  <div class="bottombarcourse-wrapper">
    <div class="bottombarcourse-bar-info">
      <bottom-bar-course-info :courseObj="courseObj" />
    </div>
    <div class="bottombarcourse-bar-details">
      <bottom-bar-course-review :courseObj="courseObj" />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import BottomBarCourseInfo from '@/components/BottomBar/BottomBarCourseInfo.vue';
import BottomBarCourseReview from '@/components/BottomBar/BottomBarCourseReview.vue';

export default defineComponent({
  components: { BottomBarCourseInfo, BottomBarCourseReview },
  props: {
    courseObj: { type: Object as PropType<AppBottomBarCourse>, required: true },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.bottombarcourse {
  &-wrapper {
    height: 100%;
    overflow: scroll;
  }

  &-bar {
    &-info {
      float: left;
      width: 40%;
      height: 100%;
      background: $offWhite;
      overflow: scroll;
    }

    &-details {
      float: right;
      width: 60%;
      height: 100%;
      background: $white;
      overflow: scroll;
    }
  }
}

@media only screen and (max-width: $large-breakpoint) {
  .bottombarcourse {
    &-wrapper {
      display: flex;
      flex-direction: column;
    }

    &-bar {
      &-info,
      &-details {
        width: 100%;
        height: auto;
        float: none;
        display: flex;
        overflow: none;
        flex-shrink: 0;
      }
    }
  }
}
</style>

<template>
  <div class="bottombarcourse">
    <div class="bottombarcourse-wrapper">
      <div class="bottombarcourse-bar-info-overflow" v-if="!isSmallerWidth">
        <bottom-bar-course-info :courseObj="courseObj" />
      </div>
      <div class="bottombarcourse-bar-details-overflow" v-if="!isSmallerWidth">
        <bottom-bar-course-review :courseObj="courseObj" />
      </div>
      <div class="bottombarcourse-bar-details-noOverflow" v-if="isSmallerWidth">
        <bottom-bar-course-review :courseObj="courseObj" />
      </div>
      <div class="bottombarcourse-bar-info-noOverflow" v-if="isSmallerWidth">
        <bottom-bar-course-info :courseObj="courseObj" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BottomBarCourseInfo from '@/components/BottomBar/BottomBarCourseInfo.vue';
import BottomBarCourseReview from '@/components/BottomBar/BottomBarCourseReview.vue';

export default Vue.extend({
  components: { BottomBarCourseInfo, BottomBarCourseReview },
  data() {
    return {
      isSmallerWidth: window.innerWidth <= 976,
    };
  },
  props: {
    courseObj: { type: Object as PropType<AppBottomBarCourse>, required: true },
  },
  created() {
    window.addEventListener('resize', this.isSmallerWidthEventHandler);
  },
  destroyed() {
    window.removeEventListener('resize', this.isSmallerWidthEventHandler);
  },

  methods: {
    isSmallerWidthEventHandler() {
      this.isSmallerWidth = window.innerWidth <= 976;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.bottombarcourse {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: $white;

  left: 29.5rem;
  width: calc(100vw - 29.5rem);

  &-tabs {
    height: 0px;
  }

  &-bar {
    width: 100%;

    &-info {
      &-overflow {
        float: left;
        height: 16.25rem;
        width: 40%;
        background: $offWhite;
        overflow: auto;
      }
    }

    &-details {
      &-overflow {
        float: right;
        height: 16.25rem;
        width: 60%;
        background: $white;
        overflow: auto;
      }
    }
  }
}

@media only screen and (max-width: $large-breakpoint) {
  .bottombarcourse {
    left: 25.5rem;
    width: calc(100vw - 25.5rem);

    &-wrapper {
      display: flex;
      flex-direction: column;
      height: 16.25rem;
      overflow: auto;
      padding: 0.5rem;
    }

    &-bar {
      &-info {
        &-noOverflow {
          width: 100%;
          height: auto;
          float: none;
          overflow: none;
          display: flex;
          background: $offWhite;
          flex-shrink: 0;
          .info {
            width: 100%;
          }
        }
      }
      &-details {
        &-noOverflow {
          width: 100%;
          height: auto;
          float: none;
          display: flex;
          background: $white;
          overflow: none;
          flex-shrink: 0;
        }
      }
    }
  }
}

@media only screen and (max-width: $medium-breakpoint) {
  .bottombarcourse {
    left: 0rem;
    width: 100%;
  }
}

@media only screen and (max-width: $small-breakpoint) {
  .bottombarcourse {
    &-wrapper {
      height: 9.25rem;
    }
  }
}
</style>

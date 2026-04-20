<template>
  <div class="details">
    <div class="details-ratings-link-wrapper">
      <a :href="CURLink" class="details-ratings-link" target="_blank" @click="clickCUReviewsLink()"
        >Learn more on CUReviews</a
      >
    </div>
    <div class="details-ratings-wrapper">
      <div class="details-ratings">
        <p class="details-ratings-title">
          <span class="details-ratings-title-strong">Overall: </span>
          <span class="details-ratings-strong" data-cyId="CUReviews-overall">{{
            CUROverallRating
          }}</span>
        </p>
        <div class="progress rating">
          <div
            class="progress-bar"
            role="progressbar"
            :style="{
              width: `${(courseObj.overallRating / 5) * 100}%`,
              background: reviewsColor(courseObj.overallRating),
            }"
            aria-label="Overall Rating"
            :aria-valuenow="(courseObj.overallRating / 5) * 100"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
      <div class="details-ratings">
        <p class="details-ratings-title">
          <span class="details-ratings-title-strong">Difficulty: </span>
          <span class="details-ratings-strong" data-cyId="CUReviews-difficulty">
            {{ CURDifficulty }}</span
          >
        </p>
        <div class="progress rating">
          <div
            class="progress-bar"
            role="progressbar"
            :style="{
              width: `${(courseObj.difficulty / 5) * 100}%`,
              background: reviewsColor(courseObj.difficulty, true),
            }"
            aria-label="Difficulty Rating"
            :aria-valuenow="(courseObj.difficulty / 5) * 100"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
      <div class="details-ratings">
        <p class="details-ratings-title">
          <span class="details-ratings-title-strong">Workload: </span>
          <span class="details-ratings-strong" data-cyId="CUReviews-workload">{{
            CURWorkload
          }}</span>
        </p>
        <div class="progress rating">
          <div
            class="progress-bar"
            role="progressbar"
            :style="{
              width: `${(courseObj.workload / 5) * 100}%`,
              background: reviewsColor(courseObj.workload, true),
            }"
            aria-label="Workload Rating"
            :aria-valuenow="(courseObj.workload / 5) * 100"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>
    <div class="details-head">Prerequisites</div>
    <p class="info-fact">{{ coursePrereqs }}</p>
    <div class="details-head" v-if="courseObj.description.length > 0">Description</div>
    <p class="info-fact">{{ courseObj.description }}</p>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { reviewColors } from '@/assets/constants/colors';
import { GTagEvent } from '@/gtag';

const noneIfEmpty = (str: string): string => (str && str.length !== 0 ? str : 'None');

export default defineComponent({
  props: {
    courseObj: { type: Object as PropType<AppBottomBarCourse>, required: true },
  },

  methods: {
    joinIfExists(arr: readonly string[]) {
      return arr ? arr.join(',') : '';
    },

    reviewsColor(review: number, flip = false) {
      const colors = Object.values(reviewColors);
      let index;
      if (review < 2) {
        index = 0;
      } else if (review >= 2 && review < 4) {
        index = 1;
      } else {
        index = 2;
      }

      return flip ? colors[colors.length - 1 - index] : colors[index];
    },

    clickCUReviewsLink(): void {
      GTagEvent(this.$gtag, 'bottom-bar-CU-reviews-link');
    },
  },

  computed: {
    coursePrereqs(): string {
      return noneIfEmpty(this.courseObj.prereqs);
    },
    CURLink(): string {
      const [subject, number] = this.courseObj.code.split(' ');
      return `https://www.cureviews.org/course/${subject}/${number}`;
    },
    CUROverallRating(): string | number {
      if (!this.courseObj.overallRating) return 'N/A';
      return Math.round(this.courseObj.overallRating * 10) / 10;
    },
    CURDifficulty(): string | number {
      if (!this.courseObj.difficulty) return 'N/A';
      return Math.round(this.courseObj.difficulty * 10) / 10;
    },
    CURWorkload(): string | number {
      if (!this.courseObj.workload) return 'N/A';
      return Math.round(this.courseObj.workload * 10) / 10;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.details {
  padding: 20px;
  width: 100%;

  &-head {
    margin-top: 10px;
    font-weight: 500;
    font-size: 12px;
    color: $darkGray2;
    margin-bottom: 0rem;
  }

  &-ratings {
    margin-right: 3%;
    width: 30%;
    float: left;
    margin-bottom: 1rem;

    &-title {
      font-size: 16px;
      line-height: 16px;
      color: $primaryGray;

      &-strong {
        font-weight: 500;
      }
    }

    &-strong {
      font-weight: 2000;
    }

    &-link {
      font-size: 14px;
      text-decoration-line: underline;
      color: $yuxuanBlue;
      &-wrapper {
        display: flex;
        flex-direction: row-reverse;
        width: 100%;
        margin-top: -1rem;
        margin-bottom: 1rem;
        margin-left: 1rem;
        padding-top: 0.5rem;
        padding-right: 0.5rem;
      }
    }
  }
}

.progress-bar {
  transition: width 0s ease;
}

.rating {
  width: 100%;
  border-radius: 100px;
}

.info {
  &-fact {
    color: $primaryGray;
  }
}

@media only screen and (max-width: $medium-breakpoint) {
  .details {
    &-ratings {
      width: 60%;
      &-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
    }
  }
}
</style>

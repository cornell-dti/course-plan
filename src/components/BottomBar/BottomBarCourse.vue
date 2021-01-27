<template>
  <div class="bottombarcourse">
    <div class="bottombarcourse-wrapper">
      <div class="bottombarcourse-bar-info-overflow" v-if="!isSmallerWidth">
        <div class="info">
          <div class="info-section-wrapper">
            <div>
              <div class="section">
                <h1 class="info-head">Credits</h1>
                <p class="info-fact">{{ courseObj.credits }}</p>
              </div>
              <div class="section">
                <h1 class="info-head">Offered</h1>
                <p class="info-fact">{{ courseObj.semesters }}</p>
              </div>
            </div>
            <div>
              <div class="section">
                <h1 class="info-head">Instructors</h1>
                <p class="info-fact">{{ courseObj.instructors }}</p>
              </div>
              <div class="section">
                <h1 class="info-head">Enrollment Information</h1>
                <p class="info-fact">{{ courseObj.enrollmentInfo }}</p>
              </div>
            </div>
            <div>
              <div class="section">
                <h1 class="info-head">Distribution Category</h1>
                <p
                  class="info-fact"
                  v-for="distributionCategory in courseObj.distributionCategories"
                  :key="distributionCategory"
                >
                  {{ distributionCategory }}
                </p>
              </div>
              <div class="section">
                <h1 class="info-head">{{ courseObj.latestSem }} Lecture Information</h1>
                <p
                  class="info-fact"
                  v-for="latestLecInfo in courseObj.latestLecInfo"
                  :key="latestLecInfo"
                >
                  {{ latestLecInfo }}
                </p>
              </div>
            </div>
          </div>
          <div class="info-link">
            <a
              :href="`https://classes.cornell.edu/browse/roster/${courseObj.latestSem}/class/${courseObj.subject}/${courseObj.number}`"
              class="info-link-blue"
              target="_blank"
            >
              View Course Information on Roster
              <span class="info-link-blue-img"
                ><img src="@/assets/images/link-blue.svg" alt="link arrow"
              /></span>
            </a>
          </div>
        </div>
      </div>
      <div class="bottombarcourse-bar-details-overflow" v-if="!isSmallerWidth">
        <div class="details">
          <div class="details-ratings-link-wrapper">
            <a
              :href="`https://www.cureviews.org/course/${courseObj.subject}/${courseObj.number}`"
              class="details-ratings-link"
              target="_blank"
              >See All Reviews</a
            >
          </div>
          <div class="details-ratings-wrapper">
            <div class="details-ratings">
              <p class="details-ratings-title">
                <span class="details-ratings-title-strong">Overall: </span>
                <span class="details-ratings-strong">{{ CUROverallRating }}</span>
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
                <span class="details-ratings-title-strong">Difficulty:</span
                ><span class="details-ratings-strong"> {{ CURDifficulty }}</span>
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
                <span class="details-ratings-strong">{{ CURWorkload }}</span>
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
          <p class="info-fact">{{ courseObj.prerequisites }}</p>
          <div class="details-head">Description</div>
          <p class="info-fact">{{ courseObj.description }}</p>
        </div>
      </div>
      <div class="bottombarcourse-bar-details-noOverflow" v-if="isSmallerWidth">
        <div class="details">
          <div class="details-ratings-link-wrapper">
            <a
              :href="`https://www.cureviews.org/course/${courseObj.subject}/${courseObj.number}`"
              class="details-ratings-link"
              target="_blank"
              >See All Reviews</a
            >
          </div>
          <div class="details-ratings-wrapper">
            <div class="details-ratings">
              <p class="details-ratings-title">
                <span class="details-ratings-title-strong">Overall: </span>
                <span class="details-ratings-strong">{{ CUROverallRating }}</span>
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
                <span class="details-ratings-title-strong">Difficulty: </span
                ><span class="details-ratings-strong"> {{ CURDifficulty }}</span>
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
                <span class="details-ratings-strong">{{ CURWorkload }}</span>
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
          <p class="info-fact">{{ courseObj.prerequisites }}</p>
          <div class="details-head">Description</div>
          <p class="info-fact">{{ courseObj.description }}</p>
        </div>
      </div>
      <div class="bottombarcourse-bar-info-noOverflow" v-if="isSmallerWidth">
        <div class="info">
          <div class="info-section-wrapper">
            <div>
              <div class="section">
                <h1 class="info-head">Credits</h1>
                <p class="info-fact">{{ courseObj.credits }}</p>
              </div>
              <div class="section">
                <h1 class="info-head">Offered</h1>
                <p class="info-fact">{{ courseObj.semesters }}</p>
              </div>
            </div>
            <div>
              <div class="section">
                <h1 class="info-head">Instructors</h1>
                <p class="info-fact">{{ courseObj.instructors }}</p>
              </div>
              <div class="section">
                <h1 class="info-head">Enrollment Information</h1>
                <p class="info-fact">{{ courseObj.enrollmentInfo }}</p>
              </div>
            </div>
            <div>
              <div class="section">
                <h1 class="info-head">Distribution Category</h1>
                <p
                  class="info-fact"
                  v-for="distributionCategory in courseObj.distributionCategories"
                  :key="distributionCategory"
                >
                  {{ distributionCategory }}
                </p>
              </div>
              <div class="section">
                <h1 class="info-head">{{ courseObj.latestSem }} Lecture Information</h1>
                <p
                  class="info-fact"
                  v-for="latestLecInfo in courseObj.latestLecInfo"
                  :key="latestLecInfo"
                >
                  {{ latestLecInfo }}
                </p>
              </div>
            </div>
          </div>
          <div class="info-link">
            <a
              :href="`https://classes.cornell.edu/browse/roster/${courseObj.latestSem}/class/${courseObj.subject}/${courseObj.number}`"
              class="info-link-blue"
              target="_blank"
            >
              View Course Information on Roster
              <span class="info-link-blue-img"
                ><img src="@/assets/images/link-blue.svg" alt="link arrow"
              /></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { reviewColors } from '@/assets/constants/colors';
import { AppBottomBarCourse } from '@/user-data';

export default Vue.extend({
  data() {
    return {
      isSmallerWidth: window.innerWidth <= 976,
    };
  },
  props: {
    courseObj: Object as PropType<AppBottomBarCourse>,
    id: Number,
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
  },

  computed: {
    CUROverallRating() {
      if (this.courseObj.overallRating === 0) return '';
      if (!this.courseObj.overallRating) return 'N/A';
      return Math.round(this.courseObj.overallRating * 10) / 10;
    },

    CURDifficulty() {
      if (this.courseObj.difficulty === 0) return '';
      if (!this.courseObj.difficulty) return 'N/A';
      return Math.round(this.courseObj.difficulty * 10) / 10;
    },

    CURWorkload() {
      if (this.courseObj.workload === 0) return '';
      if (!this.courseObj.workload) return 'N/A';
      return Math.round(this.courseObj.workload * 10) / 10;
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

.info {
  margin: 20px;
  display: flex;
  flex-direction: column;
  height: 90%;
  justify-content: space-between;
  margin-bottom: 0rem;

  &-head {
    margin-top: 5px;
    font-weight: 500;
    font-size: 12px;
    color: $darkGray2;
    margin-bottom: 0rem;
  }

  &-fact {
    padding-right: 10px;
    font-size: 16px;
    color: $primaryGray;
    margin-bottom: 0rem;
  }

  &-link {
    font-size: 16px;
    line-height: 16px;
    text-decoration-line: underline;
    margin-top: inherit;

    &-blue {
      color: $yuxuanBlue;
      // TODO: update picture
      font-weight: 500;

      &-img {
        margin-left: 0.2rem;
      }
    }
  }
}

.section {
  margin-bottom: 8px;
  float: left;
  width: 50%;
  height: inherit;
}

.details {
  margin: 20px;

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

.hide {
  height: 0;
}

@media only screen and (max-width: 976px) {
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

@media only screen and (max-width: 878px) {
  .bottombarcourse {
    left: 0rem;
    width: 100%;
  }
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

@media only screen and (max-width: 440px) {
  .bottombarcourse {
    &-wrapper {
      height: 9.25rem;
    }
  }
}
</style>

<template>
    <div class="bottombarcourse" :class="{ hide: !courseObj.isPreview }">
      <!-- have course square with just course subject and course code -->
      <div class="bottombarcourse-tabs">
        <!-- Add tabs -->
      </div>

      <!-- <div class="bottombar-title" :style="{ background: `#${color}` }" @click="toggle">
        <span class="bottombar-square-title">{{ name }}</span>
      </div> -->

      <!-- v-if: isPreview. have course bar -->
      <div>
        <!-- <div :class="{ hide: !isExpanded }" class="bottombar-bar-info"> -->
        <div class="bottombarcourse-bar-info">
          <div class="info">
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
              <p class="info-fact">{{ courseObj.distributionCategories }}</p>
            </div>
            <div class="section">
              <h1 class="info-head">{{ courseObj.latestSem }} Lecture Info</h1>
              <p class="info-fact">{{ courseObj.latestLecInfo }}</p>
            </div>
          </div>
          <div class="info-link">
            <a :href="`https://classes.cornell.edu/browse/roster/${ courseObj.latestSem }/class/${ courseObj.subject }/${ courseObj.number }`" class="info-link-blue" target="_blank">View Course Information on Roster</a>
          </div>
          </div>
        </div>
        <!-- <div :class="{ hide: !isExpanded }" class="bottombar-bar-details"> -->
        <div class="bottombarcourse-bar-details">
          <div class="details">
            <div class="details-head">Class Ratings</div>
            <div class="details-ratings">
              <p class="details-ratings-title"><span class="details-ratings-title-strong">Overall Rating: </span> {{ CUROverallRating }}</p>
              <div class="progress rating">
                <div class="progress-bar" role="progressbar" :style="{ width: `${(courseObj.overallRating/5)*100}%`, background: reviewsColor(courseObj.overallRating) }" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <div class="details-ratings">
              <p class="details-ratings-title"><span class="details-ratings-title-strong">Difficulty:</span> {{ CURDifficulty }}</p>
              <div class="progress rating">
                <div class="progress-bar" role="progressbar" :style="{ width: `${(courseObj.difficulty/5)*100}%`, background: reviewsColor(courseObj.difficulty, true) }" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <div class="details-ratings">
              <p class="details-ratings-title"><span class="details-ratings-title-strong">Workload:</span> {{ CURWorkload }}</p>
              <div class="progress rating">
                <div class="progress-bar" role="progressbar" :style="{ width: `${(courseObj.workload/5)*100}%`, background: reviewsColor(courseObj.workload, true) }" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <a :href="`https://www.cureviews.org/course/${ courseObj.subject }/${ courseObj.number }`" class="details-ratings-link" target="_blank">View All Reviews</a>
            <div class="details-head">Prerequisites</div>
            <p>{{ courseObj.prerequisites }}</p>
            <div class="details-head">Description</div>
            <p>{{ courseObj.description }}</p>
          </div>
        </div>
      </div>

      <!-- v-if: isExpanded have course expanded view -->
    </div>
</template>

<script>
export default {
  props: {
    courseObj: Object,
    // subject: String,
    // number: String,
    // name: String,
    // credits: Number,
    // semesters: String,
    // color: String,
    // requirementsMap: Map,
    id: Number
    // instructors: String,
    // distributionCategories: String,
    // enrollmentInfo: String,
    // latestSem: String,
    // latestLecInfo: String,
    // overallRating: Number,
    // difficulty: Number,
    // workload: Number,
    // prerequisites: String,
    // description: String,
    // isPreview: Boolean,
    // isExpanded: Boolean
  },

  methods: {
    toggle() {
      this.$emit('toggle', this.isExpanded);
    },

    joinIfExists(arr) {
      return (arr) ? arr.join(',') : '';
    },

    reviewsColor(review, flip = false) {
      const colors = ['#d9534f', '#f0ad4e', '#5cb85c'];
      let index;

      if (review < 2) {
        index = 0;
      } else if (review >= 2 && review < 4) {
        index = 1;
      } else {
        index = 2;
      }

      return (flip) ? colors[colors.length - 1 - index] : colors[index];
    }
  },

  computed: {
    CUROverallRating() {
      if (this.courseObj.overallRating === 0) return '';
      if (!this.courseObj.overallRating) return 'No Reviews';
      return this.courseObj.overallRating;
    },

    CURDifficulty() {
      if (this.courseObj.difficulty === 0) return '';
      if (!this.courseObj.difficulty) return 'No Reviews';
      return this.courseObj.difficulty;
    },

    CURWorkload() {
      if (this.courseObj.workload === 0) return '';
      if (!this.courseObj.workload) return 'No Reviews';
      return this.courseObj.workload;
    }
  }
};
</script>

<style scoped lang="scss">
  .bottombarcourse {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #FFF;

    &-tabs {
      height: 0px;
    }

    // &-title {
    //   padding-left: 24px;
    //   height: 40px;
    //   line-height: 40px;
    //   background: #25A2AA;
    //   color: #FFF;
    //   font-size: 16px;
    //   cursor: pointer;
    //   filter: brightness(100%);

    //   &:hover {
    //     filter: brightness(95%);
    //     transition: all 0.2s ease;
    //   }
    // }

    &-bar {
      width: 100%;

      &-info {
        float: left;
        height: 261px;
        width: 35%;
        background: #F8F8F8;
        overflow: scroll;
      }

      &-details {
        float: right;
        height: 261px;
        width: 65%;
        background: #FFF;
        overflow: scroll;
      }
    }

  }

  .info {
    margin: 20px;

    &-head {
      margin-top: 5px;
      font-weight: 500;
      font-size: 12px;
      color: #9D9D9D;
    }

    &-fact {
      padding-right: 10px;
      font-size: 16px;
      color: #3D3D3D;
    }

    &-link {
      font-size: 16px;
      line-height: 16px;
      text-decoration-line: underline;

      &-blue {
        color: #4181FF;
        font-weight: 500;
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
      color: #9D9D9D;
    }

    &-ratings {
      margin-right: 3%;
      width: 30%;
      float: left;

      &-title {
        font-size: 16px;
        line-height: 16px;
        color: #3D3D3D;

        &-strong {
          font-weight: 500;
        }
      }

      &-link {
        font-size: 12px;
        text-decoration-line: underline;
        color: #4181FF;
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
</style>

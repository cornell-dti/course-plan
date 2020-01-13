<template>
    <div class="bottombar" :class="{ hide: !isPreview }">
      <!-- have course square with just course subject and course code -->
      <div class="bottombar-tabs">
        <!-- Add tabs -->
      </div>

      <div class="bottombar-title" :style="{ background: `#${color}` }" @click="toggle">
        <span class="bottombar-square-title">{{ name }}</span>
      </div>

      <!-- v-if: isPreview. have course bar -->
      <div>
        <div :class="{ hide: !isExpanded }" class="bottombar-bar-info">
          <div class="info">
          <div>
            <div class="section">
              <h1 class="info-head">Credits</h1>
              <p class="info-fact">{{ credits }}</p>
            </div>
            <div class="section">
              <h1 class="info-head">Offered</h1>
              <p class="info-fact">{{ semesters }}</p>
            </div>
          </div>
          <div>
            <div class="section">
              <h1 class="info-head">Instructors</h1>
              <p class="info-fact">{{ instructors }}</p>
            </div>
            <div class="section">
              <h1 class="info-head">Enrollment Information</h1>
              <p class="info-fact">{{ enrollmentInfo }}</p>
            </div>
          </div>
          <div>
            <div class="section">
              <h1 class="info-head">Distribution Category</h1>
              <p class="info-fact">{{ distributionCategories }}</p>
            </div>
            <div class="section">
              <h1 class="info-head">{{ latestSem }} Lecture Info</h1>
              <p class="info-fact">{{ latestLecInfo }}</p>
            </div>
          </div>
          <div class="info-link">
            <a :href="`https://classes.cornell.edu/browse/roster/${ latestSem }/class/${ subject }/${ number }`" class="info-link-blue" target="_blank">View Course Information on Roster</a>
          </div>
          </div>
        </div>
        <div :class="{ hide: !isExpanded }" class="bottombar-bar-details">
          <div class="details">
            <div class="details-head">Class Ratings</div>
            <div class="details-ratings">
              <h1 class="details-ratings-title">Overall Rating: <strong>{{ overallRating }}</strong></h1>
              <div class="progress rating">
                <div class="progress-bar bg-danger" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <div class="details-ratings">
              <h1 class="details-ratings-title">Difficulty: <strong>{{ difficulty }}</strong></h1>
              <div class="progress rating">
                <div class="progress-bar bg-warning" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <div class="details-ratings">
              <h1 class="details-ratings-title">Workload: <strong>{{ workload }}</strong></h1>
              <div class="progress rating">
                <div class="progress-bar bg-success" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <a :href="`https://www.cureviews.org/course/${ subject }/${ number }`" class="details-ratings-link" target="_blank">See all reviews</a>
            <div class="details-head">Prerequisites</div>
            <p>{{ prerequisites }}</p>
            <div class="details-head">Description</div>
            <p>{{ description }}</p>
          </div>
        </div>
      </div>

      <!-- v-if: isExpanded have course expanded view -->
    </div>
</template>

<script>
export default {
  props: {
    subject: String,
    number: String,
    name: String,
    credits: Number,
    semesters: Array,
    color: String,
    // requirementsMap: Map,
    id: Number,
    instructors: Array, // array of strings
    distributionCategories: Array, // array of strings
    enrollmentInfo: Array,
    latestSem: String,
    latestLecInfo: Array,
    overallRating: Number,
    difficulty: Number,
    workload: Number,
    prerequisites: String,
    description: String,
    isPreview: Boolean,
    isExpanded: Boolean
  },

  methods: {
    toggle() {
      this.$emit('toggle', this.isExpanded);
    },

    joinIfExists(arr) {
      return (arr) ? arr.join(',') : '';
    }
  }
};
</script>

<style scoped lang="scss">

  .bottombar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #FFF;

    &-tabs {
      height: 0px;
    }

    &-title {
      padding-left: 24px;
      height: 40px;
      line-height: 40px;
      background: #25A2AA;
      color: #FFF;
      font-size: 16px;
      cursor: pointer;
    }

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
      font-weight: 600;
      font-size: 16px;
      line-height: 16px;
      text-decoration-line: underline;

      &-blue {
        color: #4181FF;
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
      }

      &-link {
        font-size: 12px;
        text-decoration-line: underline;
        color: #4181FF;
      }
    }
  }

  .rating {
    width: 100%;
    border-radius: 100px;
  }

  .hide {
    height: 0;
  }
</style>

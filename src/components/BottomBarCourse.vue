<template>
    <div class="bottombar">
      <!-- have course square with just course subject and course code -->
      <div class="bottombar-tabs">
        <!-- Add tabs -->
      </div>
      
      <div class="bottombar-title">
        <span class="bottombar-square-title">{{ name }}</span>
      </div>

      <!-- v-if: isPreview. have course bar -->
      <div class="bottombar-bar">
        <div class="bottombar-bar-info">
          <div class="line">
            <div class="section left">
              <h1 class="info-head">Credits</h1>
              <p class="info-fact">{{ credits }}</p>
            </div>
            <div class="section right">
              <h1 class="info-head">Offered</h1>
              <p class="info-fact">{{ credits }}</p>
            </div>
          </div>
        </div>
        <div class="bottombar-bar-details">
        </div>
      </div>

      <!-- v-if: isExpanded have course expanded view -->
    </div>
</template>

<script>
export default {
  props: {
    subject: String,
    code: Number,
    name: String,
    credits: Number,
    semesters: Array,
    color: String,
    // requirementsMap: Map,
    id: Number,
    instructors: Array, // array of strings
    distribution_categories: Array, // array of strings
    enrollment_info: Array,
    sp17_lec_info: Array,
    overall_rating: Number,
    difficulty: Number,
    workload: Number,
    prerequisites: Array,
    description: String,
    isExpanded: Boolean,
    isPreview: Boolean
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
    }

    &-bar {
      height: 30vh;
      width: 100%;

      &-info {
        float: left;
        padding: 21px;
        height: 100%;
        width: 35%;
        background: #F8F8F8;
      }

      &-details {
        float: right;
        height: 100%;
        width: 65%;
        background: #FFF;
      }
    }

  }

  .info {

    &-head {
      height: 15px;
      font-size: 12px;
      color: #9D9D9D;
    }

    &-fact {
      height: 12px;
      font-size: 16px;
      color: #3D3D3D;
    }
  }

  .line {
    // height: 30px;
  }

  .left {
    float: left;
  }

  .right {
    float: right;
  }
</style>

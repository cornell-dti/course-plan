<template>
    <div class="bottombar">
      <!-- have course square with just course subject and course code -->
      <div class="bottombar-title">
        <span class="bottombar-square-title">{{subject}} {{code}}</span>
        <img class="bottombar-square-exit" src="../assets/images/x.png"/>
      </div>

      <!-- v-if: isPreview. have course bar -->
      <div class="bottombar-bar">
        <span class="bottombar-bar-title">{{name}}</span>
        <div class="bottombar-bar-planSelect">
          <div class="bottombar-bar-planSelect-label">
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
    background-color: white;
  }
</style>

<template>
    <div class="bottombarcourse">
      <!-- have course square with just course subject and course code -->
      <div class="bottombarcourse-square">
        <span class="bottombarcourse-square-title">{{subject}} {{code}}</span>
        <img class="bottombarcourse-square-exit" src="../assets/images/x.png"/>
      </div>

      <!-- v-if: isPreview. have course bar -->
      <div class="bottombarcourse-bar">
        <span class="bottombarcourse-bar-title">{{name}}</span>
        <div class="bottombarcourse-bar-planSelect">
          <div class="bottombarcourse-bar-planSelect-label">
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

</style>

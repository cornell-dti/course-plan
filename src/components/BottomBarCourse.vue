<template>
    <div class="bottombarcourse">
        
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
        instructors: Array, //array of strings
        distribution_categories: Array, //array of strings
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
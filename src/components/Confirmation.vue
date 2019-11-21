// One prop for text
// Otherwise - the same for courses and semesters
// Can leave as display: none like the 2 modals in Semester.vue until necessary? Or can itself be created from the addCourse() method - unsure what the right move is right now

<template>
  <div class="confirmation">
    <div class="confirmation-text">{{text}}</div>
  </div>
</template>

<script>
import Vue from 'vue';

// TODO: gray out initial dropdown options
export default {
    props: {
        text: String
    }

};
</script>
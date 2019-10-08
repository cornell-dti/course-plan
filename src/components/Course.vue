<template>
  <div class = "course">
    <div class = "course-code">{{subject}} {{ code }}</div>
    <div class = "course-name">{{ name }}</div>
    <div class = "course-buttons">
      <a class = "course-button" :href = "review">
        <img class="course-image" src = "@/assets/cornell-logo.webp">
      </a>
      <a class = "course-button" :href = "roster">
        <img class="course-image" src = "@/assets/dti-logo.png">
      </a>
    </div>
  </div>
</template>

<script>
import { Component, Vue} from "vue-property-decorator";

export default {
  props: {
    subject: String,
    code: Number, 
    name: String,
  },
  computed: {
    review() {
      return `https://www.cureviews.org/course/${this.subject}/${this.code}`;
    }, 
    // TODO: change semester from FA18
    roster() {
      return `https://classes.cornell.edu/browse/roster/FA18/class/${this.subject}/${this.code}`;
    }
  }
};
</script>


<style scoped lang="scss">
.course
{
  height: 8.5rem;
  width: 10rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  border: 1px black solid;
  background-color: white;
  padding: .5rem;

  &-code {
    font-weight: bold;
  }

  &-name {
    margin-top: .5rem;
  }

  &-image {
    width: 30px;
  }

  &-buttons {
    display: flex;
    justify-content: space-around;
    margin: .5rem;
  }
}
</style>

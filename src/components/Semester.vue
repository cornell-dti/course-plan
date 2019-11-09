<template>
  <div class="semester" v-bind:class="{ 'semester--min': !exists, 'semester--compact': compact }">
    <div v-if="exists" class="semester-content">
      <div class="semester-top" v-bind:class="{ 'semester-top--compact': compact }">
        <div class="semester-left" v-bind:class="{ 'semester-left--compact': compact }">
          <span class="semester-name">{{ name }}</span>
          <img class="semester-icon" src="../assets/images/pencil.svg"/>
        </div>
        <div class="semester-right" v-bind:class="{ 'semester-right--compact': compact }">
          <span class="semester-credits">{{ creditString  }}</span>
        </div>
      </div>
      <div class="semester-courses">
        <div class="draggable-semester-courses" v-dragula="courses" bag="first-bag">
          <div v-for="course in courses" v-bind:key="course.id" class="semester-courseWrapper">
            <course v-bind="course" class="semester-course" />
          </div>
        </div>
          <div class="semester-courseWrapper semester-addWrapper" v-bind:class="{ 'semester-addWrapper--compact': compact }">
            <button class="semester-button semester-addButton" v-on:click="printArrayLength">{{ buttonString }}</button>
          </div>
      </div>
    </div>
    <div v-if="!exists" class="semester-empty">
      <button class="semester-button semester-semesterButton" v-bind:class="{ 'semester-semesterButton--compact': compact }">{{ semesterString }}</button>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Course from '@/components/Course';

Vue.component('course', Course);

export default {
  // TODO: fonts! (Proxima Nova)
  // TODO: recolor pencil and all other svg icons to that gray
  props: {
    name: String,
    courses: Array,
    exists: Boolean,
    compact: Boolean
  },
  computed: {
    // TODO: calculate credits from all classes
    creditString() {
      let credits = 0;
      this.courses.forEach(course => {
        credits += course.credits;
      });
      return `${credits.toString()} cr.`;
    },
    buttonString() {
      return '+ COURSE';
    },
    semesterString() {
      return '+ SEMESTER';
    }
  },
  methods: {
    printArrayLength() {
      console.log(this.courses.length);
    }
  }
};
</script>


<style scoped lang="scss">
.semester
{
  padding: .875rem 1.125rem;
  border: 2px solid #D8D8D8;
  border-radius: 11px;
  width: fit-content;

  &--min {
    border: 2px dashed #D8D8D8;
    padding: 1.5rem 6rem;
  }

  &--compact {
    padding: .875rem 1.125rem;
  }

  &-empty {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &-top {
    display: flex;
    justify-content: space-between;
    color: #858585;

    &--compact {
      flex-direction: column;
    }
  }

  &-left {
    display: flex;

    &--compact {
      justify-content: space-between;
    }
  }

  &-right {
    &--compact {
      margin-top: .25rem;
    }
  }

  &-name {
    font-size: 18px;
    line-height: 22px;
    margin-right: .5rem;
    font-weight: bold;
  }

  &-icon {
    width: 14px;
  }

  &-credits {
    font-size: 14px;
    line-height: 17px;
  }

  &-courseWrapper {
    margin: .5rem 0 .5rem 0;
  }

  &-course {
    touch-action: none;
  }

  &-addWrapper {
    width: 21.25rem;
    height: 4.625rem;
    border-radius: .5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #D8D8D8;

    &--compact {
      width: 10.5rem;
      border: 0;
      height: unset;
    }
  }

  &-button {
    border-radius: 7px;
    width: 11.5rem;
    height: 2rem;
    font-size: 14px;
    line-height: 17px;
    color: white;
    box-shadow: -4px -4px 10px #EEEEEE, 4px 4px 10px rgba(0, 0, 0, 0.25);
    background-color: transparent;
    border: 1px #5B676D solid;
    color: #858585;
  }

  &-semesterButton {
    &--compact {
      width: 10.5rem;
    }
  }

  .draggable-semester-courses{
    padding-top: 5px;
    padding-bottom: 5px;
  }

  //Styling for drag and drop components and movement
    .gu-mirror {
    position: fixed !important;
    margin: 0 !important;
    z-index: 9999 !important;
    opacity: 0.8;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";
    filter: alpha(opacity=80);
  }
  .gu-hide {
    display: none !important;
  }
  .gu-unselectable {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
  }
  .gu-transit {
    opacity: 0.2;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
    filter: alpha(opacity=20);
  }
}

</style>

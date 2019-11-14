<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-top">
        <span class="modal-title">{{ title }}</span>
        <img class="modal-exit" src="../../assets/images/x.png" v-on:click="closeCourseModal"/>
      </div>
      <component class="modal-body" v-bind:is="body"></component>
      <div class="modal-buttonWrapper">
        <button class="modal-button" v-on:click="closeCourseModal">{{ cancel }}</button>
        <button class="modal-button modal-button--add">{{ add }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import courses from '../../assets/courses/courses.json'
import NewCourse from '@/components/Modals/NewCourse';
import NewCustomCourse from '@/components/Modals/NewCustomCourse';
import NewSemester from '@/components/Modals/NewSemester';

Vue.component('newCourse', NewCourse);
Vue.component('newCustomCourse', NewCustomCourse);
Vue.component('newSemester', NewSemester);

export default {
  props: {
    course: Boolean,
    custom: Boolean
  },
  computed: {
    title() {
      let start = "New ";
      if(!this.course) {
        return start + "Semester"
      } else if(!this.custom) {
        return start + "Course";
      } else {
        return start + "Custom Course";
      }
    },
    add() {
      return "ADD";
    },
    cancel() {
      return "CANCEL";
    },
    body() {
      if(!this.course) {
        return "newSemester";
      } else if(!this.custom) {
        return "newCourse";
      } else {
        return "newCustomCourse";
      }
    }
  },
  methods: {
    closeCourseModal: function (event) {
      let modal = document.getElementsByClassName("semester-modal")[0];
      modal.style.display = "none";
    }
  }
}
</script>

<style lang="scss">
// TODO: font family
.modal {
  padding: 1rem;

  &-content {
    background: #FFFFFF;
    border-radius: 9px;
    width: 27.75rem;
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
  }

  &-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: .5rem;
  }

  &-exit {
    width: 10.5px;
    height: 10.5px;
  }

  &-title {
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: #3D3D3D;
  }

  &-buttonWrapper {
    display: flex;
    justify-content: flex-end;
  }

  &-button {
    width: 4.75rem;
    height: 2rem;
    color: #5B676D;
    border-radius: 3px;
    border: 1px solid #3D3D3D;
    background-color: #FFFFFF;

    &--add {
      color: #ffffff;
      background-color: #508197;
      margin-left: .5rem;
      border: none;
    }
  }
}

</style>
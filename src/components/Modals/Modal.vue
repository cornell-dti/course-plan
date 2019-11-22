<template>
  <div class="modal">
    <div class="modal-content" :id="contentId">
      <div class="modal-top">
        <span class="modal-title">{{ title }}</span>
        <img class="modal-exit" src="../../assets/images/x.png" v-on:click="closeCurrentModal"/>
      </div>
      <component class="modal-body" v-bind:is="body"></component>
      <div class="modal-buttonWrapper">
        <button class="modal-button" v-on:click="closeCurrentModal">{{ cancel }}</button>
        <button class="modal-button modal-button--add" v-on:click="addItem">{{ add }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import courses from '@/assets/courses/courses.json';
import NewCourse from '@/components/Modals/NewCourse';
import NewCustomCourse from '@/components/Modals/NewCustomCourse';
import NewSemester from '@/components/Modals/NewSemester';

Vue.component('newCourse', NewCourse);
Vue.component('newCustomCourse', NewCustomCourse);
Vue.component('newSemester', NewSemester);

const firebaseConfig = require('@/firebaseConfig.js');
const coursesCollection = firebaseConfig.coursesCollection;

export default {
  props: {
    type: String
  },
  computed: {
    contentId() {
      return `content-${this.type}`;
    },
    title() {
      const start = 'New ';
      if (this.type == 'semester') {
        return `${start}Semester`;
      } if (this.type == 'course') {
        return `${start}Course`;
      }
      return `${start}Custom Course`;
    },
    add() {
      return 'ADD';
    },
    cancel() {
      return 'CANCEL';
    },
    body() {
      if (this.type == 'semester') {
        return 'newSemester';
      } if (this.type == 'course') {
        return 'newCourse';
      }
      return 'newCustomCourse';
    }
  },
  methods: {
    closeCurrentModal(event) {
      const modal = document.getElementById(`${this.type}Modal`);
      modal.style.display = 'none';
    },
    addItem() {
      if(this.type == 'course') {
        this.addCourse();
      } else if (this.type == 'semester') {
        // TODO: add semester
      } else {
        // TODO: add custom course
      }
    },
    addCourse() {
      const dropdown = document.getElementsByClassName("newCourse-dropdown")[0];
      const title = dropdown.value;

      // TODO: can I make the valid assumption that the course code is up to the colon in the title?
      const key = title.substring(0, title.indexOf(":"));
      const sem = courses[key].sem;

      const firebaseTitle = key.replace(/\s/g, '') + '-' + sem;
      let docRef = coursesCollection.doc(firebaseTitle);

      const _this = this;

      // TODO: error handling if course not found or some firebase error
      docRef.get().then(function(doc) {
        if (doc.exists) {
          _this.$parent.addCourse(doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
    }
  }
};
</script>

<style lang="scss">
// TODO: font family
.modal {
  padding: 1rem;

  &-content {
    background: #FFFFFF;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
  }

  &-body {
    padding: 0;
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
    margin-top: 1rem;
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

#content-course {
  width: 27.75rem;
}

#content-semester {
  width: 15.5rem;
}

</style>

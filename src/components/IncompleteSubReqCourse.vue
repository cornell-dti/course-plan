<template>
  <div class="incompletesubreqcourse">
    <div class="draggable-requirements-wrapper"
      v-if="display && subReq.displayDescription && crseInfoObjects.length > 0"
    >
      <div class="draggable-requirements-heading">
        <div class="draggable-requirements-heading-label">{{ addCourseLabel }}</div>
        <div class="draggable-requirements-heading-seeAll">{{ seeAll }}</div>
      </div>
        <div
          class="draggable-requirements-courses"
          v-dragula="courseObjects"
          bag="first-bag"
        >
          <div v-for="course in courseObjects" :key="course.uniqueID" class="requirements-courseWrapper">
            <course
              v-bind="course"
              :courseObj="course"
              :id="course.subject + course.number"
              :uniqueID="course.uniqueID"
              :compact="course.compact"
              :active="false"
              class="requirements-course"
            />
          </div>
        </div>
      <div class="separator"></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import firebase from 'firebase/app';
// eslint-disable-next-line import/extensions
import Course from '@/components/Course.vue';

Vue.component('course', Course);

require('firebase/functions');

const functions = firebase.functions();

const FetchCourses = firebase.functions().httpsCallable('FetchCourses');

export default {
  mounted() {
    this.$el.addEventListener('touchmove', this.dragListener, { passive: false });
    const service = Vue.$dragula.$service;
    service.eventBus.$on('drag', () => {
      this.scrollable = true;
    });
    service.eventBus.$on('drop', e => {
      this.scrollable = true;
      // this.reqCourseDropHandler();
    });

  },
  data() {
    return {
      courseObjects: [],
      scrollable: false,
      display: false
    };
  },
  beforeDestroy() {
    this.$el.removeEventListener('touchmove', this.dragListener);
  },
  props: {
    subReq: Object,
    subReqCourseId: Number,
    crseInfoObjects: Array,
    subReqCourseObjectsNotTakenArray: Array,
    dataReady: Boolean
  },
  watch: {
    dataReady: {
      immediate: true,
      handler(dataReady) {
        if (dataReady) {
          this.getFirstFourCourseObjects();
          this.display = true;
        }
      }
    }
  },
  computed: {
    addCourseLabel() {
      return `Add Course ${this.subReqCourseId + 1}`;
    },
    seeAll() {
      return 'See all >';
    }
  },
  methods: {
    dragListener(event) {
      if (!this.$data.scrollable) event.preventDefault();
    },
    getFirstFourCourseObjects() {
      console.log('subReqCourseObjectsNotTakenArray', this.subReqCourseObjectsNotTakenArray);
      let firstFourObjects = [];
      for (let i = 0; firstFourObjects.length < 4 && i < this.crseInfoObjects.length; i += 1){
        const crseInfoObject = this.crseInfoObjects[i];
        console.log('crseInfoObject', crseInfoObject);
        const filteredCourses = this.subReqCourseObjectsNotTakenArray.filter(course => crseInfoObject.crseIds.includes(course.crseId));
        console.log(filteredCourses);
        const remainingCourses = Math.min(4 - firstFourObjects.length, filteredCourses.length);
        firstFourObjects = firstFourObjects.concat(filteredCourses.slice(0, remainingCourses));
      }
      this.courseObjects = firstFourObjects;
      console.log('generated first four course objects: ', this.courseObjects);
    }
  }
};
</script>

<style scoped lang="scss">
.separator {
  height: 1px;
  width: 100%;
  background-color: #d7d7d7;
}

.draggable-requirements {
  &-wrapper {
    margin-top: 2%;
    margin-bottom: 2%;
  }
  &-heading {
    display: flex;
    justify-content: space-between;
    &-label{
      font-size: 14px;
      line-height: 17px;
      color: #9E9E9E;
    }
    &-seeAll{
      font-size: 12px;
      line-height: 15px;
      color: #32A0F2;
      padding: 1%;
      cursor: pointer;
    }
  }

  &-courses{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: -1%;
    margin-bottom: 2%;
    width: 100%;
  }

}

.requirements {
  &-courseWrapper {
    padding: 1%;
  }
  &-course {
    touch-action: none;
    cursor: grab;
  }
  &-course:active:hover {
    touch-action: none;
    cursor: grabbing;
  }
}
</style>

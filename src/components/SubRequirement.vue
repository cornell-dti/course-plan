<template>
  <div class="subrequirement">
    <div class="row depth-req">
      <div class="col-1" @click="toggleDescription(reqIndex, isCompleted, subReqIndex)">
        <button class="btn">
          <img
            v-if="subReq.displayDescription"
            class="arrow arrow-up"
            :src="getSrc()"
            alt="dropup"
          />
          <img
            v-else
            class="arrow arrow-down"
            :src="getSrc()"
            alt="dropdown"
          />
        </button>
      </div>
      <div class="col-7" @click="toggleDescription(reqIndex, isCompleted, subReqIndex)">
        <p v-bind:class="[{'sup-req': !this.isCompleted}, 'pointer', this.isCompleted ? 'completed-ptext' : 'incomplete-ptext']">{{subReq.requirement.name}}</p>
      </div>
      <div class="col">
        <p v-if="!this.isCompleted" class="sup-req-progress text-right incomplete-ptext">{{
          (subReq.requirement.fulfilledBy !== 'self-check')
          ? `${subReq.totalCountFulfilled || subReq.minCountFulfilled}/${subReq.requirement.totalCount
          || subReq.requirement.minCount} ${subReq.requirement.fulfilledBy}`
          : 'self check' }}</p>
        <p v-if="this.isCompleted" class="text-right completed-ptext">{{subReq.minCountFulfilled}}/{{subReq.requirement.minCount}} {{ subReq.requirement.fulfilledBy }}</p>
      </div>
    </div>
    <div v-if="subReq.displayDescription" :class="[{'completed-ptext': this.isCompleted}, 'description']">
      {{ subReq.requirement.description }} <a class="more"
      :style="{ 'color': `#${color}` }"
      :href="subReq.requirement.source" target="_blank">
      <strong>Learn More</strong></a>
    </div>
    <div v-if="!this.isCompleted" class="separator"></div>
    <div
    v-for="(subReqCourseCodes, id) in subReqCoursesNotTakenArray"
    :key="subReqCourseCodes.id">
      <incompletesubreqcourse
        :subReq="subReq"
        :subReqCourseId="id"
        :courseCodes="subReqCourseCodes"
        :dataReady="dataReady"
        @isDataReady="isDataReady"
      />
    </div>
  </div>
</template>


<script>
import Vue from 'vue';
import firebase from 'firebase/app';
import CompletedSubReqCourse from '@/components/CompletedSubReqCourse';
import IncompleteSubReqCourse from '@/components/IncompleteSubReqCourse';
import IncompleteSelfCheckSubReqCourse from '@/components/IncompleteSelfCheckSubReqCourse';

Vue.component('completedsubreqcourse', CompletedSubReqCourse);
Vue.component('incompletesubreqcourse', IncompleteSubReqCourse);
Vue.component('incompleteselfchecksubreqcourse', IncompleteSelfCheckSubReqCourse);

require('firebase/functions');

const functions = firebase.functions();

// Arrows for dropup and dropdown
const dropupIncompleteSrc = require('@/assets/images/dropup.svg');
const dropupCompletedSrc = require('@/assets/images/dropup-lightgray.svg');
const dropdownIncompleteSrc = require('@/assets/images/dropdown.svg');
const dropdownCompletedSrc = require('@/assets/images/dropdown-lightgray.svg');


export default {
  mounted() {
    if (!this.isUniversitySubReq) { // TODO: Change after removing University Reqs
      const mostRecentRosters = this.rostersFromLastTwoYears;
      let filteredSubReqRosters;
      // Iterate over each course slot for the subReq
      this.subReq.requirement.courses.forEach(subReqCourseRosterObject => {
        // Filter subreq roster object keys with the mostRecentRosters
        filteredSubReqRosters = Object.keys(subReqCourseRosterObject).filter(subReqRoster => mostRecentRosters.indexOf(subReqRoster) !== -1);

        const courseCodesSet = new Set([]); // Maintain a set to remove dupes
        filteredSubReqRosters.forEach(subReqRoster => {
          // For each roster, create the course code and add to courseCodesSet
          for (const [courseSubject, courseNumberArray] of Object.entries(subReqCourseRosterObject[subReqRoster])) {
            const courseCodes = courseNumberArray.map(courseNumber => `${courseSubject} ${courseNumber}`);
            courseCodes.forEach(code => courseCodesSet.add(code));
          }
        });
        const courseCodesList = Array.from(courseCodesSet); // Change into list
        // Push courseCodesList onto subReqCoursesNotTakenArray for the subReqCourse slot
        this.subReqCoursesNotTakenArray.push(courseCodesList);
      });
    }
  },
  data() {
    return {
      subReqCoursesNotTakenArray: [],
      // subReqCoursesNotTakenArray = [
      //   [
      //     'CS 1110',
      //     'INFO 1300'
      //   ],
      //   [
      //     'INFO 1200',
      //     'MATH 1710'
      //   ]
      // ]
      dataReady: false, // true if dataReady for all subReqCourses. false otherwise
      dataReadyCounter: 0 // tracks dataReady status of all subReqCourses
    };
  },
  props: {
    subReq: Object,
    subReqIndex: Number, // Subrequirement index
    reqIndex: Number, // Requirement index
    color: String,
    isCompleted: Boolean,
    isUniversitySubReq: Boolean, // TODO: Change after removing University Reqs
    rostersFromLastTwoYears: Array
  },
  methods: {
    getSrc() {
      let src = dropdownCompletedSrc;
      if (this.subReq.displayDescription && !this.isCompleted) {
        src = dropupIncompleteSrc;
      } else if (this.subReq.displayDescription && this.isCompleted) {
        src = dropupCompletedSrc;
      } else if (!this.subReq.displayDescription && !this.isCompleted) {
        src = dropdownIncompleteSrc;
      }
      return src;
    },
    toggleDescription(reqIndex, isCompleted, subReqIndex) {
      const type = isCompleted ? 'completed' : 'ongoing';
      this.$emit('toggleDescription', reqIndex, type, subReqIndex);
    },
    isDataReady() {
      this.dataReadyCounter += 1;
      if (this.dataReadyCounter === this.subReqCoursesNotTakenArray.length) {
        this.dataReady = true;
      }
    }
  }
};

</script>


<style scoped lang="scss">
@import "@/assets/scss/_variables.scss";

.btn {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &-2{
    padding-top: 0px;
    margin:0px
  }
}
.btn:focus,.btn:active {
   outline: none !important;
   box-shadow: none;
}
.row {
  margin: 0;
}
.row > div {
  padding: 0;
}

.depth-req {
  margin: 0.5rem 0 0.1rem 0;
  min-height: 14px;
}
.sub-req-div {
  padding-left: 30px;
  margin: 0px;
}
.description {
  margin: 0 0 0.5rem 1.8rem;
  color: #353535;
  font-size: 14px;
}
.pointer {
  cursor: pointer;
}
button.active {
  color: $sangBlue;
  border-bottom: solid 10px $sangBlue;
  padding-bottom: 2px;
  margin: 5px;
}
.arrow {
  height: 14px;
  width: 14px;
  fill: $emGreen;
  color:$emGreen;
  margin-top: -2px;
    &-up {
     margin-top: 4px;
   }
}
button.view {
  margin: 0.7rem 0 2rem 0;
  min-height: 40px;
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  color: white;
  text-transform: uppercase;
}
.completed {
   margin-top: 1rem;
   &-ptext {
     color: #757575;
     font-size: 12px;
     opacity: 0.8;
     font-weight: normal;
   }
 }
.incomplete {
  &-ptext {
    font-size: 14px;
  }
}
.text {
   &-right {
     color: #757575;
   }
 }
.sup-req {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  color: #757575;
  &-progress {
    font-size: 14px;
    line-height: 14px;
  }
}
.separator {
  height: 1px;
  width: 100%;
  background-color: #d7d7d7;
}

</style>

<template>
  <div class="requirements">
    <h1 class="title">School Requirements</h1>

    <!-- loop through reqs array of req objects -->
<<<<<<< HEAD
    <div class="req" v-for="(req, index) in reqs" v-bind:key="req.id">
=======
    <div class="reqs" v-for="(req, index) in reqs" :key="req.id">
>>>>>>> 50fb24b7a0c641b512a50463b3feb34f4709118a
      <div class="row top">
        <p class="name col p-0">{{ req.name }}</p>
        <div class="col-1 text-right p-0">
          <button @click="modalShow = !modalShow" class="btn">
            <!-- svg for settings icon -->
            <img class="settings" src="../assets/images/gear.svg" alt = "settings"/>
          </button>
        </div>
        <b-modal v-model="modalShow">Hello From Modal!</b-modal>
      </div>

      <!--Majors tabular view -->
      <div class="tab" v-if="req.type === 'MAJOR'">
        <div class="row">
          <div class="col-12 middle" v-for="type in actives" v-bind:key= "type.id">

            <button v-bind:class="{ active: actives[0]}" @click="getReqs()" class="btn">
              <div class= "div-tab">
                <p v-bind:class="{ active: actives[0] }" class="major">Computer Science</p>
                <p v-bind:class="{ active: actives[0] }" class="major-college">(Arts and Science)</p>
              </div>
            </button>
          </div>

        </div>
      </div>
      <!-- progress bar settings -->
      <div class="progress">
        <div
          class="progress-bar"
<<<<<<< HEAD
          v-bind:style="{ 'background-color': req.color, width: `${(req.progress/req.total)*100}%`}"
=======
          :style="{
            'background-color': req.color,
            width: `${(req.progress / req.total) * 100}%`
          }"
>>>>>>> 50fb24b7a0c641b512a50463b3feb34f4709118a
          role="progressbar"
        ></div>
      </div>

      <p class="progress-text">
        <strong>{{ req.progress }}/{{ req.total }}</strong>
        Total {{ req.count }} Inputted on Schedule
      </p>
<<<<<<< HEAD

      <!--View more college requirements -->
      <div class="row top">
        <div class="col-1 text-left p-0" >
          <button v-bind:style="{ 'color': req.color }" class="btn" v-on:click="turnDetails(index, true)" style="color:#1AA9A5;">
            <!-- svg for dropdown icon -->
            <img
              class="setting"
              style="fill: #1AA9A5; color:#1AA9A5 "
              src="../assets/images/dropdown-blue.svg"
              alt="dropdown"
            />
          </button>
        </div>
         <div class="col text-center p-0 ">
          <p class=" req-name" v-bind:style="{ 'color': req.color }" >VIEW ALL {{ req.type }} REQUIREMENTS</p>
        </div>
      </div>

      <!--Show more of completed requirements -->
      <div v-if="req.displayDetails">
        <div class="row  top">
          <p class="sub-title col p-0">In-Depth College Requirement</p>

        </div>
        <div
          v-for="(subReq, id) in req.ongoing"
          v-bind:key="subReq.id"
          class="semesterView-wrapper"
        >
          <div class="separator" v-if="index < reqs.length - 1 || req.displayDetails"></div>
          <div class="row top ">
            <div class="col-1 middle text-left p-0">
              <button class="btn btn-2" v-on:click="turnSubDetails(index, id, true)">
                <!-- svg for dropdown icon -->
                <img
                  class="setting"
                  style="fill: #1AA9A5; color:#1AA9A5 "
                  src="../assets/images/dropdown.svg"
                  alt="dropdown"
                />
=======
      <!-- display button (off when req.displayDetails is false) -->
      <button
        class="view btn"
        v-if="!req.displayDetails"
        :style="{ 'background-color': req.color }"
        @click="turnDetails(index, true)"
      >
        View All {{ req.type }} Requirements
      </button>
      <!-- when displayDetails is true -->
      <div class="detail" v-if="req.displayDetails">
        <div class="ongoing">
          <div class="row detail-bar">
            <p class="col detail-text p-0">In-Depth {{ req.type }} Requirements</p>
            <div class="text-right p-0">
              <button class="btn" @click="turnDetails(index, false)">
                <!-- picture of close (x) icon -->
                <img class="cancel" src="../assets/images/x.png" alt="X" />
>>>>>>> 50fb24b7a0c641b512a50463b3feb34f4709118a
              </button>
            </div>
            <div class="col middle  p-0">
              <p class="sup-req">{{subReq.name}}</p>
            </div>
            <div class="col  middle p-0">
              <p class="sup-req text-right p-0">( {{subReq.progress}} / {{subReq.total}} Credits)</p>
            </div>
          </div>
<<<<<<< HEAD

          <div class="sub-req-div" v-if="subReq.display">
            <div >
              <p>Additional Courses</p>
              <ul class="striped-list">
                <li
                  v-for="subSubReq in subReq.additonalCourses"
                  v-bind:key="subSubReq.id"

                >
                  <div class="row top-small">
                    <div class="col">
                      <p class="sup-req tex-left">{{subSubReq}}</p>
                    </div>
                    <div class="col">
                      <p class="sup-req text-right p-0">( {{2}} / {{2}} Courses)</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <p>Classes to Fullfill Requirements</p>
            <div class="row fuffill" bag="first-bag" >
              <div class="draggable-semester-courses" v-dragula="courses" bag="first-bag">
                <course
                  v-bind="courses"
                  v-bind:id="courses.subject"
                  v-bind:compact="compact"
                  class="semester-course"
                />
              </div>
=======
          <!-- loop through uncompleted reqs in req.ongoing array -->
          <div class="list" v-for="value in req.ongoing" :key="value.id">
            <div class="separator"></div>
            <div class="row req">
              <p class="col float-left p-0 req-name">{{ value.name }}</p>
              <p class="col float-right text-right p-0 req-progress">
                ({{ value.progress }}/{{ value.total }} {{ value.count }})
              </p>
>>>>>>> 50fb24b7a0c641b512a50463b3feb34f4709118a
            </div>
          </div>
        </div>
<<<<<<< HEAD

        <div class="row top">
          <p class="sub-title col p-0">Completed Requirements</p>
          <div class="col-1 text-right p-0">
            <button class="btn" v-bind:style="{ 'color': req.color }">
              <!-- Toggle to display completed reqs -->
              <p
                class="toggle"
                v-if="req.displayCompleted"
                v-on:click="turnCompleted(index, false)"
              >HIDE</p>
              <p class="toggle" v-else v-on:click="turnCompleted(index, true)">SHOW</p>
            </button>
          </div>
        </div>
        <div v-if="req.displayCompleted">
          <div v-for="subReq in req.completed" v-bind:key="subReq.id" class="semesterView-wrapper">
            <div class="separator" v-if="index < reqs.length - 1 || req.displayDetails"></div>
            <div class="row top">
              <div class="col-1 middle text-left p-0">
                <button class="btn btn-2" v-on:click="turnSubDetails(index, id, true)">
                  <!-- svg for dropdown icon -->
                  <img
                    class="setting"
                    style="fill: #1AA9A5; color:#1AA9A5 "
                    src="../assets/images/dropdown.svg"
                    alt="dropdown"
                  />
                </button>
=======
        <!-- Display completed section if there are completed reqs -->
        <div class="completed" v-if="req.completed.length > 0">
          <div class="row detail-bar">
            <p class="col detail-text p-0">Completed {{ req.type }} Requirements</p>
            <button class="btn" :style="{ color: req.color }">
              <!-- Toggle to display completed reqs -->
              <p class="toggle" v-if="req.displayCompleted" @click="turnCompleted(index, false)">
                HIDE
              </p>
              <p class="toggle" v-else @click="turnCompleted(index, true)">SHOW</p>
            </button>
          </div>
          <div v-if="req.displayCompleted">
            <!-- loop through completed reqs in req.completed array -->
            <div class="list" v-for="value in req.completed" :key="value.id">
              <div class="separator"></div>
              <div class="row req">
                <p class="col float-left p-0 req-name">{{ value.name }}</p>
                <p class="col float-right text-right p-0 req-progress">
                  ({{ value.progress }}/{{ value.total }} {{ value.count }})
                </p>
>>>>>>> 50fb24b7a0c641b512a50463b3feb34f4709118a
              </div>
              <p class="col sup-req middle ">{{subReq.name}}</p>
              <p
                class="col sup-req middle text-right p-0"
              >( {{subReq.progress}} / {{subReq.total}} Credits)</p>
            </div>
          </div>
        </div>
      </div>
      <div class="separator" v-if="index < reqs.length - 1 || req.displayDetails"></div>

      <!-- Add separator if not last req or not displaying details -->
      <div class="separator" v-if="index < reqs.length - 1 || req.displayDetails"></div>
    </div>
  </div>
</template>

<script>
import { Vue } from 'vue-property-decorator';
import VueCollapse from 'vue2-collapse';
import Course from '@/components/Course';
import Modal from '@/components/Modals/Modal';
import Semester from '@/components/Semester';
import * as methods from '../requirements/methods.js';

const fs = require('fs');
const request = require('request');
const fb = require('../firebaseConfig.js');


Vue.component('course', Course);
Vue.component('modal', Modal);
Vue.component('semester', Semester);
Vue.use(VueCollapse);

export default {
  props: {
    semesters: Array,
    compact: Boolean

  },
  mounted() {},
  data() {
    const randomId = Math.floor(Math.random() * Math.floor(100));
    return {

      actives: [false],
      modalShow: false,
      reqs: [
        {
          show: false,
          name: 'COLLEGE REQUIREMENTS',
          type: 'COLLEGE',
          count: 'Credits',
          progress: 46,
          total: 120,
          color: '#2BBCC6',
          displayDetails: false,
          ongoing: [
            {
              name: 'CALS Credits',
              count: 'Credits',
              progress: 12,
              total: 55,
              additonalCourses: ['PE Courses', 'Swimming Requirement'],
              satisfiableCourses: ['ice skating', 'bowling'],
              display: false
            },
            {
              name: 'PE Credits',
              count: 'Credits',
              progress: 1,
              total: 2,
              additonalCourses: ['PE Courses', 'Swimming Requirement'],
              satisfiableCourses: ['ice skating', 'bowling'],
              display: false
            }
          ],
          displayCompleted: true,
          completed: [
            {
              name: 'Quantitative Literacy',
              count: 'Credits',
              progress: 2,
              total: 2,
              display: false
            },
            {
              name: 'Chemistry/Physics',
              count: 'Credits',
              progress: 1,
              total: 2,
              display: false
            }
          ]
        },
        {
          show: true,
          name: 'MAJOR REQUIREMENTS',
          type: 'MAJOR',
          count: 'Courses',
          progress: 4,
          total: 8,
          color: '#2BBCC6',
          displayDetails: false,
          ongoing: [
            {
              name: 'CALS Credits',
              count: 'Credits',
              progress: 12,
              total: 55,
              display: false
            },
            {
              name: 'PE ',
              count: 'Credits',
              progress: 1,
              total: 2,
              display: false
            }
          ],
          displayCompleted: true,
          completed: [
            {
              name: 'Quantitative Literacy',
              count: 'Credits',
              progress: 2,
              total: 2,
              display: false
            },
            {
              name: 'Chemistry/Physics',
              count: 'Credits',
              progress: 2,
              total: 2,
              display: false
            }
          ]
        },

        {
          show: false,
          name: 'MINOR REQUIREMENTS',
          type: 'MINOR',
          count: 'Courses',
          progress: 4,
          total: 8,
          color: '#2BBCC6',
          displayDetails: false,
          ongoing: [
            {
              name: 'CALS Credits',
              count: 'Credits',
              progress: 12,
              total: 55,
              display: false
            },
            {
              name: 'PE ',
              count: 'Credits',
              progress: 1,
              total: 2,
              display: false
            }
          ],
          displayCompleted: true,
          completed: [
            {
              name: 'Quantitative Literacy',
              count: 'Credits',
              progress: 2,
              total: 2,
              display: false
            },
            {
              name: 'Chemistry/Physics',
              count: 'Credits',
              progress: 1,
              total: 2,
              display: false
            }
          ]
        }
      ],
      courses: {
        id: randomId,
        subject: 'PHIL',
        code: 1100,
        name: 'Introduction to Philosophy',
        credits: 3,
        semesters: ['Fall', 'Spring'],
        color: '2BBCC6',
        check: true,
        requirementsMap: null
      }
    };
  },

  methods: {
    getReqs() {
      methods.getRequirements(['CS 1110', 'CHIN 2202', 'CS 1112', 'CS 2110', 'CS 3410', 'CS 3110', 'INFO 2300', 'PE 1110'], 'AS', 'CS').then(res => {
        console.log(res);
      });
    },
    turnDetails(index, bool) {
      this.reqs[index].displayDetails = !this.reqs[index].displayDetails;
    },
    turnSubDetails(index, id, bool) {
      this.reqs[index].ongoing[id].display = !this.reqs[index].ongoing[id]
        .display;
    },

    turnCompleted(index, bool) {
      this.reqs[index].displayCompleted = bool;
    },
    isActive(index) {
      return this.actives[index];
    },

    activate(index, bool) {
      this.actives[0] = !this.actives[0];
      this.actives[1] = !this.actives[1];
    }

  }
};
</script>

<style scoped lang="scss">

.text-center {
    text-align: center;
    display: flex;
    justify-content: center;
}

.btn {
  padding: 10px;
  margin: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
  &-2{
    padding-top: 0px;
    margin:0px
  }
}


.requirements {
  height: 100vh;
  min-width: 25rem;
  padding: 1.625rem 1.5rem 1.625rem 1.5rem;
  background-color: white;
}
.sub-req-div{
  padding-left: 30px;
  margin :0px;

}

p.sub-req{
  padding-left: 30px;
  margin: 0px
}

h1.title {
  margin: 0 0 0 0;
  font-style: normal;
  font-weight: 550;
  font-size: 22px;
  line-height: 29px;
  color: #000000;
}

.top {
  margin: 1.5rem 0 1rem 0;
  &-small{
    margin: 0px;
  }
}

.middle{
  display: flex;
  align-items: center;
  justify-content: center;
}

.name {
  margin-top: auto;
  margin-bottom: auto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;

  color: #000000;
}

.major {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #000000;

  &-college {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;
    /* identical to box height */

    color: #000000;
  }
}
.tab-div{
  padding:1px;
}
button.active {
  color: #508197;
  border-bottom: solid 10px #508197;
  padding-bottom: 2px;
  margin: 5px;
}
p.active {
  color: #508197;
  font-weight: bold;
}

.settings {
  height: 14px;
  width: 14px;
}

.progress-text {
  margin: 0.3125rem 0 0 0;
  font-size: 12px;
  line-height: 12px;
}

ul.striped-list > li {
  padding: 2px;

  border-bottom-style: rgba(196, 196, 196, 0.4);
  border-block-color: rgba(196, 196, 196, 0.4);
  color: #757575;
}
.fuffill{
  padding: 20px;
  padding-left: 0px;
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

.detail-bar {
  margin: 1.625rem 0 0.8125rem 0;
  width: 100%;
}

.x {
  padding-left: 0px;
  padding-right: 15px;
  max-width: 25px;
}

.detail-text {
  margin-top: auto;
  margin-bottom: auto;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
}

.seeMore {
  width: 44px;
  height: 15px;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 14px;
  /* identical to box height */

  color: #2bbcc6;
}

.cancel {
  height: 10px;
  width: 10px;
}
.dropdown {
  height: 5px;
  width: 5px;
}

.button-dropdown {
  background-color: transparent;
  color: transparent;
  outline-style: transparent;
}

.toggle {
  margin-top: auto;
  margin-bottom: auto;
  font-weight: bold;
  font-size: 12px;
  line-height: 12px;
}

.req {
  margin-top: auto;
  margin-bottom: auto;
  font-style: normal;
  font-weight: normal;

  font-size: 16px;
  line-height: 19px;

  &-name {
    font-size: 14px;
    align-content: bottom;
    line-height: 17px;
    margin: 0px;
    align-self: center;
  }

  &-progress {
    font-weight: bold;
    font-size: 12px;
    line-height: 12px;
  }
}
.sup-req {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  color: #757575;
}

.semester-req {
  border: none;
  max-width: 350px;
}

.separator {

  height: 1px;
  width: 100%;
  background-color: #d7d7d7;
}
</style>

<template>
  <div class="requirements">
    <h1 class="title">School Requirements</h1>

    <!-- loop through reqs array of req objects -->
    <div class="reqs" v-for="(req, index) in reqs" v-bind:key="req.id">
      <div class="row top">
        <p class="name col p-0">{{ req.name }}</p>
        <div class="col-1 text-right p-0">
          <button class="btn">
            <!-- svg for settings icon -->
            <img class="settings" src="../assets/images/gear.svg" />
          </button>
        </div>
      </div>
      <!-- progress bar settings -->
      <div class="progress">
        <div
          class="progress-bar"
          v-bind:style="{ 'background-color': req.color, width: `${(req.progress/req.total)*100}%`}"
          role="progressbar"
        ></div>
      </div>
      <p class="progress-text">
        <strong>{{ req.progress }}/{{ req.total }}</strong>
        Total {{ req.count }} Inputted on Schedule
      </p>
      <!-- display button (off when req.displayDetails is false) -->
      <button
        class="view btn"
        v-if="!req.displayDetails"
        v-bind:style="{ 'background-color': req.color }"
        v-on:click="turnDetails(index, true)"
      >View All {{ req.type }} Requirements</button>
      <!-- when displayDetails is true -->
      <div class="detail" v-if="req.displayDetails">
        <div class="ongoing">
          <div class="row detail-bar">
            <p class="col detail-text p-0">In-Depth {{ req.type }} Requirements</p>

            <div class="text-right p-0">
              <button class="btn" v-on:click="turnDetails(index, false)">
                <!-- picture of close (x) icon -->
                <img class="cancel" src="../assets/images/x.png" alt="X" />
              </button>
            </div>
          </div>

          <!-- loop through uncompleted reqs in req.ongoing array -->
          <div class="list" v-for="value in req.ongoing" v-bind:key="value.id">
            <div class="separator"></div>

            <div class="row detail-bar">
              <div class="col x">
                <button class="btn" v-b-toggle.collapse1>
                  <img class="drowndown" src="../assets/images/dropdown.svg" alt="dropdown" />
                </button>
              </div>
              <p class="col p-0 text-center req-name">{{ value.name }}</p>
              <p
                class="col float-right text-center p-0 req-progress"
              >({{ value.progress }}/{{ value.total }} {{ value.count }})</p>
            </div>

            <b-collapse id="collapse1">
              <b-card>
                <p class="req-progress">Additional Requirements</p>
                <ul>
                  <li class="detail-text">PE Courses</li>
                  <li class="detail-text">Swimming Requirement</li>
                </ul>
                <div class="row detail-bar">
                  <p class="col detail-text p-0">Classes to fullfill Requirements</p>
                  <div class="text-right p-0">
                    <button class="btn" v-bind:style="{ 'color': req.color }">
                      <!-- Toggle to display completed reqs -->
                      <p
                        class="toggle"
                        v-if="req.displayCompleted"
                        v-on:click="turnCompleted(index, false)"
                      >SEE ALL</p>
                      <p class="toggle" v-else v-on:click="turnCompleted(index, true)">SHOW</p>
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div v-for="sem in semesters" v-bind:key="sem.id" class="semesterView-wrapper">
                    <semester class="semester-req" v-bind="sem" :exists="true" />
                  </div>
                </div>
              </b-card>
            </b-collapse>
          </div>

          <div class="separator"></div>
        </div>
        <!-- Display completed section if there are completed reqs -->
        <div class="completed" v-if="req.completed.length > 0">
          <div class="row detail-bar">
            <p class="col detail-text p-0">Completed {{ req.type }} Requirements</p>
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
          <div v-if="req.displayCompleted">
            <!-- loop through completed reqs in req.completed array -->
            <div class="list" v-for="value in req.completed" v-bind:key="value.id">
              <div class="separator"></div>
              <div class="row req">
                <p class="col float-left p-0 req-name">{{ value.name }}</p>
                <p
                  class="col float-right text-right p-0 req-progress"
                >({{ value.progress }}/{{ value.total }} {{ value.count }})</p>
                <div
                  class="Courselist"
                  v-for="otherCourse in req.additonalCourses"
                  v-bind:key="otherCourse.id"
                >
                  <course v-bind="course" v-bind:id="otherCourse" class="semester-course" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Add separator if not last req or not displaying details -->
      <div class="separator" v-if="index < reqs.length - 1 || req.displayDetails"></div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Course from '@/components/Course';
import Modal from '@/components/Modals/Modal';
import Semester from '@/components/Semester';
import VueCollapse from 'vue2-collapse';

const clone = require('clone');
Vue.component('course', Course);
Vue.component('modal', Modal);
Vue.component('semester', Semester);
Vue.use(VueCollapse);

export default {
  props: {
    semesters: Array
  },
  mounted() {},
  data() {
    return {
      reqs: [
        {
          name: 'College Requirements',
          type: 'College',
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
              satisfiableCourses: ['ice skating', 'bowling']
            },
            {
              name: 'PE Credits',
              count: 'Credits',
              progress: 1,
              total: 2,
              additonalCourses: ['PE Courses', 'Swimming Requirement'],
              satisfiableCourses: ['ice skating', 'bowling']
            }
          ],
          displayCompleted: true,
          completed: [
            {
              name: 'Quantitative Literacy',
              count: 'Credits',
              progress: 2,
              total: 2
            },
            {
              name: 'Chemistry/Physics',
              count: 'Credits',
              progress: 1,
              total: 2
            }
          ]
        },
        {
          name: 'Major Requirements',
          type: 'Major',
          count: 'Courses',
          progress: 4,
          total: 8,
          color: '#4D53DC',
          displayDetails: false,
          ongoing: [
            {
              name: 'CALS Credits',
              count: 'Credits',
              progress: 12,
              total: 55
            },
            {
              name: 'PE ',
              count: 'Credits',
              progress: 1,
              total: 2
            }
          ],
          displayCompleted: true,
          completed: [
            {
              name: 'Quantitative Literacy',
              count: 'Credits',
              progress: 2,
              total: 2
            },
            {
              name: 'Chemistry/Physics',
              count: 'Credits',
              progress: 1,
              total: 2
            }
          ]
        }
      ]
    };
  },

  methods: {
    turnDetails(index, bool) {
      this.reqs[index].displayDetails = bool;
    },

    turnCompleted(index, bool) {
      this.reqs[index].displayCompleted = bool;
    }
  }
};
</script>

<style scoped lang="scss">
.btn {
  padding: 0;
}

.requirements {
  width: 400px;
  padding: 1.625rem 1.5rem 1.625rem 1.5rem;
  background-color: white;
}

h1.title {
  margin: 0 0 0 0;
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
}

.top {
  margin: 1.5rem 0 1rem 0;
}

.name {
  margin-top: auto;
  margin-bottom: auto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;
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
  margin: 0.5rem 0 0 0;
  color: #757575;

  &-name {
    font-size: 14px;
    line-height: 14px;
  }

  &-progress {
    font-weight: bold;
    font-size: 12px;
    line-height: 12px;
  }
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

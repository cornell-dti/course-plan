<template v-if="semesters">
  <div class="requirements">
    <div class="fixed" :class="{ bottomPreview: isBottomPreview && !isBottomBar, bottomBar: isBottomBar }">
    <h1 class="title">School Requirements</h1>

    <!-- loop through reqs array of req objects -->
    <div class="req" v-for="(req, index) in reqs" :key="req.id">
      <div class="row top">
        <p class="name col p-0">{{ req.name }} <span class="specific" v-if="req.specific">({{ req.specific }})</span></p>
      </div>

      <!-- progress bar settings -->
      <div class="progress">
        <div
          class="progress-bar"
          v-bind:style="{ 'background-color': `#${req.color}`, width: `${(req.fulfilled/req.required)*100}%`}"
          role="progressbar"
        ></div>
      </div>

      <p class="progress-text">
        <strong>{{ req.fulfilled }}/{{ req.required }}</strong>
        Total {{ req.type }} Inputted on Schedule
      </p>

      <!--View more college requirements -->
      <div class="row top">
        <div class="col-1 p-0" >
          <button v-bind:style="{ 'color': `#${req.color}` }" class="btn" @click="toggleDetails(index)" style="color:#1AA9A5;">
            <!-- svg for dropdown icon -->
            <img
              class="arrow"
              src="@/assets/images/dropdown-blue.svg"
              alt="dropdown"
            />
          </button>
        </div>
         <div class="col p-0 ">
          <button class="btn req-name" v-bind:style="{ 'color': `#${req.color}` }" @click="toggleDetails(index)">{{ (req.displayDetails) ? "HIDE" : "VIEW" }} ALL {{ req.group }} REQUIREMENTS</button>
        </div>
      </div>

      <!--Show more of completed requirements -->
      <div v-if="req.displayDetails">
        <p class="sub-title">On-Going Requirements</p>
        <div class="separator"></div>
        <div
          v-for="(subReq, id) in req.ongoing"
          v-bind:key="subReq.id">
          <div class="row depth-req">
            <div class="col-1">
              <button class="btn" v-on:click="turnSubDetails(index, id, true)">
                <!-- svg for dropdown icon -->
                <img
                  class="arrow"
                  src="@/assets/images/dropdown.svg"
                  alt="dropdown"
                />
              </button>
            </div>
            <div class="col-7">
              <p class="sup-req">{{subReq.name}}</p>
            </div>
            <div class="col">
              <p class="sup-req-progress text-right">( {{ (subReq.fulfilled !== null && subReq.fulfilled !== undefined) ? `${subReq.fulfilled}/${subReq.required} ${subReq.type}` : 'Self-Check' }}  )</p>
            </div>
          </div>
          <div class="separator"></div>
        </div>

        <div v-if="req.completed.length > 0" class="row completed">
          <p class="col sub-title">Completed Requirements</p>
          <div class="col-1 text-right">
            <button class="btn float-right" v-bind:style="{ 'color': `#${req.color}` }">
              <!-- Toggle to display completed reqs -->
              <p
                class="toggle"
                v-if="req.displayCompleted"
                v-on:click="turnCompleted(index, false)">HIDE</p>
              <p class="toggle" v-else v-on:click="turnCompleted(index, true)">SHOW</p>
            </button>
          </div>
        </div>

        <div v-if="req.displayCompleted">
          <div v-for="subReq in req.completed" v-bind:key="subReq.id">
            <div class="separator" v-if="index < reqs.length - 1 || req.displayDetails"></div>
            <div class="row depth-req">
              <div class="col-1">
                <button class="btn" v-on:click="turnSubDetails(index, id, true)">
                  <!-- svg for dropdown icon -->
                  <img
                    class="arrow"
                    src="@/assets/images/dropdown.svg"
                    alt="dropdown"
                  />
                </button>
              </div>
              <div class="col-7">
                <p class="sup-req">{{subReq.name}}</p>
              </div>
              <div class="col">
                <p class="sup-req-progress text-right">( {{subReq.fulfilled}}/{{subReq.required}} {{ subReq.type }} )</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add separator if additional completed requirements -->
      <div class="separator" v-if="req.completed.length > 0"></div>
    </div>
  </div>
  </div>
</template>

<script>
import { Vue } from 'vue-property-decorator';
import VueCollapse from 'vue2-collapse';
import Course from '@/components/Course';
import Modal from '@/components/Modals/Modal';

import reqsData from '../requirements/reqs.json';
// import * as fs from 'fs'
const fb = require('../firebaseConfig.js');

Vue.component('course', Course);
Vue.component('modal', Modal);
Vue.use(VueCollapse);

export default {
  props: {
    semesters: Array,
    user: Object,
    compact: Boolean,
    isBottomPreview: Boolean,
    isBottomBar: Boolean
  },
  mounted() {
    // Get array of courses from semesters data

    const courses = this.getCourseCodesArray();

    this.getReqs(courses, this.user.college, this.user.major).then(groups => {
      // Turn result into data readable by requirements menu

      groups.forEach(group => {
        const singleMenuRequirement = {
          ongoing: [],
          completed: [],
          name: `${group.groupName.toUpperCase()} REQUIREMENT`,
          group: group.groupName.toUpperCase(),
          specific: (group.specific) ? group.specific : null,
          color: '105351',
          displayDetails: false,
          displayCompleted: false
        };

        group.reqs.forEach(req => {
          // Account for progress type
          if (req.type) req.type = req.type.charAt(0).toUpperCase() + req.type.substring(1);

          // Create progress bar with requirement with progressBar = true
          if (req.progressBar) {
            singleMenuRequirement.type = req.type;
            singleMenuRequirement.fulfilled = req.fulfilled;
            singleMenuRequirement.required = req.required;
          }

          // Default display value of false for all requirement lists
          req.display = false;

          if (!req.fulfilled || req.fulfilled < req.required) {
            singleMenuRequirement.ongoing.push(req);
          } else {
            singleMenuRequirement.completed.push(req);
          }
        });

        // Make number of requirements items progress bar in absense of identified progress metric
        if (!singleMenuRequirement.type) {
          singleMenuRequirement.type = 'Requirements';
          singleMenuRequirement.fulfilled = singleMenuRequirement.completed.length;
          singleMenuRequirement.required = singleMenuRequirement.ongoing.length + singleMenuRequirement.completed.length;
        }

        this.reqs.push(singleMenuRequirement);
      });
    });
  },

  data() {
    return {
      reqsData,
      actives: [false],
      modalShow: false,
      reqs: [
        // Data structure for menu
        // {
        //   name: 'UNIVERSITY REQUIREMENT',
        //   group: 'UNIVERSITY',
        //   type: 'Credits',
        //   specific: 'AS',
        //   fulfilled: 46,
        //   required: 120,
        //   color: '105351',
        //   displayDetails: false,
        //   displayCompleted: true,
        //   ongoing: [
        //     {
        //       name: 'CALS Credits',
        //       type: 'Credits',
        //       fulfilled: 12,
        //       required: 55,
        //       display: false
        //     },
        //     {
        //       name: 'PE Credits',
        //       type: 'Credits',
        //       fulfilled: 1,
        //       required: 2,
        //       display: false
        //     }
        //   ],
        //   completed: [
        //     {
        //       name: 'Quantitative Literacy',
        //       type: 'Credits',
        //       fulfilled: 2,
        //       required: 2,
        //       display: false
        //     }
        //   ]
        // }
      ]
    };
  },

  methods: {
    toggleDetails(index) {
      this.reqs[index].displayDetails = !this.reqs[index].displayDetails;
    },

    turnSubDetails(index, id, bool) {
      this.reqs[index].ongoing[id].display = bool;
    },

    turnCompleted(index, bool) {
      this.reqs[index].displayCompleted = bool;
    },

    getCourseCodesArray() {
      const courses = [];
      this.semesters.forEach(semester => {
        semester.courses.forEach(course => {
          courses.push(`${course.subject} ${course.number}`);
        });
      });

      return courses;
    },

    async getReqs(coursesTaken, college, major) {
      // TODO: make it so that it takes in classes corresponding with years/semesters for most accurate information
      const coursesTakenWithInfo = {};
      const courseData = await Promise.all(
        coursesTaken.map(courseTaken => getCourseInfo(courseTaken))
      );

      for (let i = 0; i < coursesTaken.length; i += 1) { coursesTakenWithInfo[coursesTaken[i]] = courseData[i]; }

      // prepare final output JSONs
      const finalRequirementJSONs = [];

      // PART 1: check university requirements
      if (!reqsData.university) throw new Error('University requirements not found.');
      const universityReqs = reqsData.university;
      finalRequirementJSONs.push({
        groupName: 'University',
        specific: null,
        reqs: await iterateThroughRequirements(coursesTakenWithInfo, universityReqs.requirements, 'university')
      });

      // PART 2: check college requirements
      if (!(college in reqsData.college)) throw new Error('College not found.');
      const collegeReqs = reqsData.college[college];
      finalRequirementJSONs.push({
        groupName: 'College',
        specific: college,
        reqs: await iterateThroughRequirements(coursesTakenWithInfo, collegeReqs.requirements, 'college')
      });

      // PART 3: check major reqs
      if (!(major in reqsData.major)) throw new Error('Major not found.');
      const majorReqs = reqsData.major[major];
      finalRequirementJSONs.push({
        groupName: 'Major',
        specific: major,
        reqs: await iterateThroughRequirements(coursesTakenWithInfo, majorReqs.requirements, 'major')
      });

      return finalRequirementJSONs;


      /**
       * Loops through requirement data and compare all courses on (to identify whether they satisfy the requirement)
       * @param {*} allCoursesTakenWithInfo : object of courses taken with API information (CS 2110: {info})
       * @param {*} allRequirements : requirements in requirements format from reqs.json (college, major, or university requirements)
       * @param {*} requirementType : type of requirement being checked (college, major, or university)
       */
      async function iterateThroughRequirements(allCoursesTakenWithInfo, allRequirements, requirementType) {
        // array of requirement status information to be returned
        const requirementJSONs = [];

        // helper to recursively call when an object has subpaths
        function callRecursiveSubpaths(coursesTakenWithInfoInner, requirements, rType, parentName = null) {
          for (const requirement of requirements) {
            // TODO: For different groups of students (e.g. transfers, FYSAs, etc...)
            // if(!isTransfer && requirement.applies === "transfers") continue;
            // temporarily skip these until we can implement them later

            // Recursively call function if there are subpaths
            if (requirement.multiplePaths) {
              const requirementName = requirement.name;
              requirementJSONs.push({ name: requirementName, paths: [], isComplete: false });

              callRecursiveSubpaths(coursesTakenWithInfo, requirement.paths, requirementName);
              continue;
            }

            let totalRequirementCredits = 0;
            let totalRequirementCount = 0;
            const coursesThatFulilledRequirement = [];
            // check each course to see if it fulfilled that requirement

            const codes = Object.keys(coursesTakenWithInfo);

            // If not in path, push new object to requirementsJSONs
            for (const code of codes) {
              const courseInfo = coursesTakenWithInfo[code];

              const indexIsFulfilled = checkIfCourseFulfilled(courseInfo, requirement.search, requirement.includes);

              if (indexIsFulfilled) {
                // depending on what it is fulfilled by, either increase the count or credits you took
                switch (requirement.fulfilledBy) {
                  case 'courses':
                    totalRequirementCount += 1;
                    break;
                  case 'credits':
                    totalRequirementCredits += courseInfo.enrollGroups[0].unitsMaximum;
                    break;
                  case 'self-check':
                    continue;
                  default:
                    throw new Error('Fulfillment type unknown.');
                }

                // add the course to the list of courses used to fulfill that one requirement
                coursesThatFulilledRequirement.push(code);
              }
            }

            const generatedResults = createRequirementJSON(requirement, totalRequirementCredits, totalRequirementCount, coursesThatFulilledRequirement);

            // If at end path (no parent path)
            if (!parentName) requirementJSONs.push(generatedResults);
            // If in path, append to path of parent
            else {
              const parent = requirementJSONs.find(key => key.name === parentName);
              parent.paths.push(generatedResults);
              parent.isComplete = parent.isComplete || generatedResults.isComplete;
            }
          }
        }

        callRecursiveSubpaths(allCoursesTakenWithInfo, allRequirements, requirementType);

        return requirementJSONs;
      }

      /**
       * Creates results in object format from information
       * @param {*} requirement : the requirement information as object
       * @param {*} totalRequirementCredits : total credits of courses that satisfied requirement
       * @param {*} totalRequirementCount : total number of courses that satisfied requirement
       * @param {*} coursesThatFulilledRequirement : courses that satisfied requirement
       */
      function createRequirementJSON(requirement, totalRequirementCredits, totalRequirementCount, coursesThatFulilledRequirement) {
        const requirementFulfillmentData = {
          name: requirement.name,
          type: requirement.fulfilledBy,
          courses: coursesThatFulilledRequirement,
          required: requirement.minCount
        };
        let fulfilled;
        switch (requirement.fulfilledBy) {
          case 'courses':
            fulfilled = totalRequirementCount;
            break;
          case 'credits':
            fulfilled = totalRequirementCredits;
            break;
          case 'self-check':
            fulfilled = null;
            break;
          default:
            throw new Error('Fulfillment type unknown.');
        }

        requirementFulfillmentData.fulfilled = fulfilled;

        if (requirement.progressBar) requirementFulfillmentData.progressBar = true;
        return requirementFulfillmentData;
      }

      /**
       * Given a course code (i.e. INFO 1300), it will split it up into the subject and number, returned as a dictionary
       * (i.e. INFO 1300 => {"subject" : INFO, "courseNumber" : 1300})
       *
       * @return the number of credits the course is worth
       */
      function parseCourseCode(courseCode) {
        const regex = /([a-zA-Z]+) ([0-9][0-9][0-9][0-9]$)?/g;
        const matches = regex.exec(courseCode);
        if (matches === null) throw new Error('Invalid course code');
        return { subject: matches[1].toUpperCase(), courseNumber: matches[2] };
      }

      /**
       * Given a course code and a roster, get all course info from Cornell API
       * @param {*} courseCode : code name of the course to search (CS 2110)
       * @param {*} semester : the roster name to search from (FA19)
       */
      function getCourseInfo(courseCode) {
        const courseCodeObj = parseCourseCode(courseCode);
        const subject = courseCodeObj.subject.toUpperCase();
        const number = courseCodeObj.courseNumber;

        return new Promise((resolve, reject) => {
          // Using Firebase
          const coursesCollection = fb.db.collection('courses');
          const courseRef = coursesCollection.doc(subject + number);

          courseRef.get()
            .then(doc => {
              if (!doc.exists) reject(new Error('No document exists'));
              else resolve(doc.data());
            })
            .catch(() => {
              reject(new Error('An error occured.'));
            });
        });
      }

      /**
       * Check if a code matches the course name (CS 2110 and CS 2*** returns true, AEM 3110 and AEM 32** returns false)
       * @param {*} courseName : name of the course (as a code)
       * @param {*} code : code to check courseName (can contain * to denote any value)
       */
      function ifCodeMatch(courseName, code) {
        for (let i = 0; i < courseName.length; i += 1) {
          if (code[i] !== '*' && courseName[i] !== code[i]) return false;
        }

        return true;
      }

      /**
       * Check if the course fullfills the given requirement. Returns true if fulfills requirement. False otherswise
       * @param {*} courseInfo : information of the course from API data
       * @param {*} search : the scope of search for the requirement (e.g all-eligible, code, catalogDistr)
       * @param {*} includes : the query for the search (e.g (MQR-AS), CS 2***)
       */
      function checkIfCourseFulfilled(courseInfo, search, includes) {
        if (search === 'all' || search === 'all-eligible' || search === 'self-check') return true;
        for (const [i, include] of includes.entries()) {
          for (const option of include) {
            if (search === 'code') {
              if (ifCodeMatch(`${courseInfo.subject} ${courseInfo.catalogNbr}`, option)) {
                // Important: removes array option list from requirements
                if (includes.length > 1) includes.splice(i, 1);
                return true;
              }
            } else if (courseInfo[search].includes(option)) return true;
          }
        }

        return false;
      }
    }
  }
};
</script>

<style scoped lang="scss">

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

.requirements, .fixed {
  height: 100vh;
  width: 25rem;
  padding: 1.625rem 1.5rem 1.625rem 1.5rem;
  background-color: white;
}

.fixed {
  position: fixed;
  top: 0;
  left: 4.5rem;
  overflow-y: scroll;
  overflow-x: hidden;
}

.depth-req {
  margin: 0.5rem 0 0.1rem 0;
  min-height: 14px;
}

.sub-req-div {
  padding-left: 30px;
  margin: 0px;
}

h1.title {
  font-style: normal;
  font-weight: 550;
  font-size: 22px;
  line-height: 29px;
  color: #000000;
}

.progress {
  border-radius: 1rem;
  height: 10px;
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
  line-height: 16px;

  color: #000000;
}

.specific {
  color: #757575;
}

.sub-title {
  padding: 0;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
}

.completed {
  margin-top: 1rem;
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

.settings, .arrow {
  height: 14px;
  width: 14px;
}

.arrow {
  fill: #1AA9A5;
  color:#1AA9A5;
  margin-top: -4px;
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
    margin-left: 0.5rem;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
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
  line-height: 14px;

  color: #757575;

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

.bottomBar {
  padding-bottom: 300px;
}

.bottomPreview {
  padding-bottom: 40px;
}
</style>

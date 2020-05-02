<template v-if="semesters">
  <div class="requirements">
    <div class="fixed">
    <div class="requirements-regularView" v-if="!this.isSeeAll">
      <h1 class="title">School Requirements</h1>
      <!-- loop through reqs array of req objects -->
      <div class="req" v-for="(req, index) in reqs" :key="req.id">

        <!-- TODO change for multiple colleges -->
        <div v-if="index<=2 || index == 2 + majors.length" class="row top">
          <p class="name col p-0">{{ req.name }}</p>
        </div>
          <!-- TODO change for multiple colleges -->
          <div v-if="index==2" class="major">
            <div
              :style="{'border-bottom': major.display ? `2px solid #${reqGroupColorMap[req.group][0]}` : ''}"
              @click="activate(id)"
              class="major-title"
              v-for="(major, id) in majors"
              :key="major.id"
            >
              <p :style="{'font-weight': major.display ? '500' : '', 'color' : major.display ? `#${reqGroupColorMap[req.group][0]}` : ''}"  class="major-title-top">{{major.majorFN}}</p>
              <p :style="{'color': major.display ? `#${reqGroupColorMap[req.group][0]}` : ''}" class="major-title-bottom">({{user.collegeFN}})</p>
            </div>
          </div>
          <div v-if="index==2+majors.length" class="minor">
            <div
              :style="{'border-bottom': major.display ? `2px solid #${reqGroupColorMap[req.group][0]}` : ''}"
              @click="activate(id)" class="major-title"
              v-for="(minor, id) in minors"
              :key="minor.id"
            >
              <p :style="{'font-weight': major.display ? '500' : '', 'color' : major.display ? `#${reqGroupColorMap[req.group][0]}` : ''}"  class="minor-title-top">{{minor.minorFN}}</p>
              <p :style="{'color': major.display ? `#${reqGroupColorMap[req.group][0]}` : ''}" class="minor-title-bottom">({{user.collegeFN}})</p> <!-- Change for multiple colleges -->
            </div>
          </div>

          <!-- progress bar settings -->
          <div v-if="showMajorOrMinorRequirements(index, req.group)" >
            <div class="progress">
              <div
                class="progress-bar"
                :style="{ 'background-color': `#${reqGroupColorMap[req.group][0]}`, width: `${(req.fulfilled/req.required)*100}%`}"
                role="progressbar"
              ></div>
            </div>

            <p class="progress-text">
              <span class="progress-text-credits">{{ req.fulfilled }}/{{ req.required }}</span>
              <span class="progress-text-text"> Total {{ req.type }} Inputted on Schedule</span>
            </p>

            <!--View more college requirements -->
            <div class="row top">
              <div class="col-1 p-0" >
                <button :style="{ 'color': `#${reqGroupColorMap[req.group][0]}` }" class="btn" @click="toggleDetails(index)">
                  <!-- svg for dropdown icon -->
                  <img
                    v-if="req.displayDetails"
                    class="arrow arrow-up"
                    :src="require(`@/assets/images/dropup-${reqGroupColorMap[req.group][1]}.svg`)"
                    alt="dropup"
                  />
                  <img
                    v-else
                    class="arrow arrow-down"
                    :src="require(`@/assets/images/dropdown-${reqGroupColorMap[req.group][1]}.svg`)"
                    alt="dropdown"
                  />
                </button>
              </div>
              <div class="col p-0 ">
                  <button
                      class="btn req-name"
                      :style="{ 'color': `#${reqGroupColorMap[req.group][0]}` }"
                      @click="toggleDetails(index)">
                      {{ (req.displayDetails) ? "Hide" : "View" }} All {{ req.group.charAt(0) + req.group.substring(1).toLowerCase() }} Requirements
                  </button>
              </div>
            </div>

            <!--Show more of completed requirements -->
            <div v-if="req.displayDetails">
              <p class="sub-title">In-Depth College Requirements</p>
              <div class="separator"></div>
              <div
                v-for="(subReq, id) in req.ongoing"
                :key="subReq.id">
                <div class="row depth-req">
                  <div class="col-1" @click="toggleDescription(index, 'ongoing', id)">
                    <button class="btn">
                      <!-- svg for dropdown icon -->
                      <img
                        v-if="subReq.displayDescription"
                    class="arrow arrow-up"
                    src="@/assets/images/dropup.svg"
                    alt="dropup"
                      />
                      <img
                        v-else
                        class="arrow arrow-down"
                        src="@/assets/images/dropdown.svg"
                        alt="dropdown"
                      />
                    </button>
                  </div>
                  <div class="col-7" @click="toggleDescription(index, 'ongoing', id)">
                    <p class="sup-req pointer incomplete-ptext">{{subReq.requirement.name}}</p>
                  </div>
                  <div class="col">
                    <p class="sup-req-progress text-right incomplete-ptext">{{
                    (subReq.requirement.fulfilledBy !== 'self-check')
                    ? `${subReq.totalCountFulfilled || subReq.minCountFulfilled}/${subReq.requirement.totalCount
                      || subReq.requirement.minCount} ${subReq.requirement.fulfilledBy}`
                    : 'self check' }}</p>
                  </div>
                </div>
                <div v-if="subReq.displayDescription" class="description">
                  {{ subReq.requirement.description }} <a class="more"
                  :style="{ 'color': `#${reqGroupColorMap[req.group][0]}` }"
                  :href="subReq.requirement.source" target="_blank">
                  <strong>Learn More</strong></a>
                </div>
                <div class="separator"></div>
                <div class="draggable-requirements-wrapper" v-if="subReq.displayDescription">
                  <div
                    class="draggable-requirements-seeAll-wrapper"
                    v-if="subReqsCourseMapList[req.group] !== undefined && subReqsCourseMapList[req.group][subReq.requirement.name] !== undefined"
                  >
                    <div class="draggable-requirements-seeAll-button" v-on:click="showSeeAll(req.group, req.specific, subReq.requirement.name)">{{ seeAll }}</div>
                  </div>
                    <div
                      v-if="subReqsCourseMapList[req.group] !== undefined && subReqsCourseMapList[req.group][subReq.requirement.name] !== undefined"
                      class="draggable-requirements-courses"
                      v-dragula="subReqsCourseMapList[req.group][subReq.requirement.name]"
                      bag="first-bag">
                      <div v-for="course in subReqsCourseMapList[req.group][subReq.requirement.name]" :key="course.uniqueID" class="requirements-courseWrapper">
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

              <div v-if="req.completed.length > 0" class="row completed">
                <p class="col sub-title specific">Filled Requirements</p>
                <div class="col-1 text-right">
                  <button class="btn float-right" :style="{ 'color': `#${reqGroupColorMap[req.group][0]}` }">
                    <!-- Toggle to display completed reqs -->
                    <p
                      class="toggle"
                      v-if="req.displayCompleted"
                      v-on:click="turnCompleted(index, false)">HIDE</p>
                    <p class="toggle" v-else v-on:click="turnCompleted(index, true)">SHOW</p>
                  </button>
                </div>
              </div>

            <!-- Completed requirements -->
              <div v-if="req.displayCompleted">
                <div v-for="(subReq, id) in req.completed" :key="subReq.id">
                  <div class="separator" v-if="index < reqs.length - 1 || req.displayDetails"></div>
                  <div class="row depth-req">
                    <div class="col-1" @click="toggleDescription(index, 'completed', id)">
                      <button class="btn">
                        <!-- svg for dropdown icon -->
                      <img
                        v-if="subReq.displayDescription"
                    class="arrow arrow-up completed-arrow"
                    src="@/assets/images/dropup-lightgray.svg"
                    alt="dropup"
                      />
                      <img
                        v-else
                    class="arrow arrow-down completed-arrow"
                    src="@/assets/images/dropdown-lightgray.svg"
                    alt="dropdown"
                      />
                      </button>
                    </div>
                    <div class="col-7" @click="toggleDescription(index, 'completed', id)">
                      <p class="pointer completed-ptext">{{subReq.requirement.name}}</p>
                    </div>
                    <div class="col">
                      <p class="text-right completed-ptext">{{subReq.minCountFulfilled}}/{{subReq.requirement.minCount}} {{ subReq.requirement.fulfilledBy }}</p>
                    </div>
                  </div>
                  <div v-if="subReq.displayDescription" class="description completed-ptext">
                    {{ subReq.requirement.description }}
                    <a class="more" :style="{ 'color': `#${reqGroupColorMap[req.group][0]}` }" :href="subReq.requirement.source" target="_blank"><strong>Learn More</strong></a>
                  </div>
                </div>
              </div>
            </div>

          <!-- Add separator if additional completed requirements -->
          <div class="separator" v-if="req.completed.length > 0"></div>
          </div>
        </div>
      </div>
      <div class="requirements-seeAllView" v-if="this.isSeeAll">
        <!-- loop through reqs array of req objects -->
        <div
          class="req"
          v-for="reqGroup in Object.keys(subReqsCourseMapList)"
          :key="reqGroup.id"
        >
          <div
            v-for="subReqName in Object.keys(subReqsCourseMapList[reqGroup])"
            :key="subReqName.id"
          >
            <div class="row top">
              <div class="col-1 p-0" >
                <button :style="{ 'color': `#${reqGroupColorMap[reqGroup][0]}` }" class="btn" v-on:click="backToRequirements()">
                  <img
                    class="arrow arrow-left"
                    :src="require(`@/assets/images/dropleft-${reqGroupColorMap[reqGroup][1]}.svg`)"
                    alt="dropleft"
                  />
                </button>
              </div>
              <div class="col p-0 ">
                  <button
                      class="btn requirements-seeAllView-backButton"
                      :style="{ 'color': `#${reqGroupColorMap[reqGroup][0]}` }"
                      v-on:click="backToRequirements()">
                      Back to All Requirements
                  </button>
              </div>
            </div>
            <h1 class="title">All {{subReqName}} Courses</h1>
            <div class="draggable-requirements-wrapper">
                <div
                  v-if="subReqsCourseMapList[reqGroup] !== undefined && subReqsCourseMapList[reqGroup][subReqName] !== undefined"
                  class="draggable-requirements-courses"
                  v-dragula="subReqsCourseMapList[reqGroup][subReqName]"
                  bag="first-bag">
                  <div v-for="course in subReqsCourseMapList[reqGroup][subReqName]" :key="course.uniqueID" class="requirements-courseWrapper">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
// @ts-ignore
import VueCollapse from 'vue2-collapse';
// Disable import extension check because TS module resolution depends on it.
// eslint-disable-next-line import/extensions
import Course from '@/components/Course.vue';
// eslint-disable-next-line import/extensions
import Modal from '@/components/Modals/Modal.vue';
import { BaseRequirement as Requirement, CourseTaken, SingleMenuRequirement } from '@/requirements/types';
import { computeRequirements, computeRequirementMap } from '@/requirements/reqs-functions';
import decoratedRequirementsJSON from '@/requirements/decorated-requirements.json';

Vue.component('course', Course);
Vue.component('modal', Modal);
Vue.use(VueCollapse);
type major = {
  display: boolean;
  major: string;
  majorFN: string;
}
type minor = {
  display: boolean;
  minor: string;
  minorFN: string;
}
type Data = {
  actives: boolean[];
  modalShow: boolean;
  reqs: SingleMenuRequirement[];
  majors: major[];
  minors: minor[];
  requirementsMap: {};
  reqGroupColorMap: {};
  subReqsCourseMapList: {};
  scrollable: boolean;
  isSeeAll: boolean;

}
export default Vue.extend({
  props: {
    semesters: Array,
    user: Object,
    compact: Boolean
  },
  computed: {
    seeAll() {
      return 'See all >';
    }
  },
  mounted() {
    this.$el.addEventListener('touchmove', this.dragListener, { passive: false });

    this.getDisplays();
    const groups = computeRequirements(this.getCourseCodesArray(), this.user.college, this.user.major, this.user.minor);
    // Send satisfied credits data back to dashboard to build alerts
    this.$emit('requirementsMap', computeRequirementMap(groups));
    // Turn result into data readable by requirements menu
    const singleMenuRequirements = groups.map(group => {
      const singleMenuRequirement: SingleMenuRequirement = {
        ongoing: [],
        completed: [],
        name: `${group.groupName.charAt(0) + group.groupName.substring(1).toLowerCase()} Requirements`,
        group: group.groupName.toUpperCase(),
        specific: (group.specific) ? group.specific : null,
        color: '105351',
        displayDetails: false,
        displayCompleted: false
      };
      group.reqs.forEach(req => {
        // Create progress bar with requirement with progressBar = true
        if (req.requirement.progressBar) {
          singleMenuRequirement.type = this.getRequirementTypeDisplayName(req.requirement.fulfilledBy);
          singleMenuRequirement.fulfilled = req.totalCountFulfilled || req.minCountFulfilled;
          singleMenuRequirement.required = req.requirement.totalCount || req.requirement.minCount;
        }
        // Default display value of false for all requirement lists
        const displayableRequirementFulfillment = { ...req, displayDescription: false };
        if (!req.minCountFulfilled || req.minCountFulfilled < (req.requirement.minCount || 0)) {
          singleMenuRequirement.ongoing.push(displayableRequirementFulfillment);
        } else {
          singleMenuRequirement.completed.push(displayableRequirementFulfillment);
        }
      });
      // Make number of requirements items progress bar in absense of identified progress metric
      if (!singleMenuRequirement.type) {
        singleMenuRequirement.type = 'Requirements';
        singleMenuRequirement.fulfilled = singleMenuRequirement.completed.length;
        singleMenuRequirement.required = singleMenuRequirement.ongoing.length + singleMenuRequirement.completed.length;
      }
      console.log('in singleMenuReq');
      if (singleMenuRequirement.group !== 'UNIVERSITY') {
        this.subReqsCourseMapList[singleMenuRequirement.group] = {};

        // isSeeAll param is false because only show first 4
        this.addRequirementsCourse(singleMenuRequirement.group, singleMenuRequirement.specific, this.isSeeAll);
      }

      return singleMenuRequirement;
    });
    this.reqs.push(...singleMenuRequirements);
  },
  data() : Data {
    return {
      // currentEditID: 0,
      // isEditing: false,
      // display: [],
      actives: [false],
      modalShow: false,
      majors: [],
      minors: [],

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
        //       description: 'All students need to to take 55 credits',
        //       displayDescription: false
        //     },
        //     {
        //       name: 'PE Credits',
        //       type: 'Credits',
        //       fulfilled: 1,
        //       required: 2,
        //       description: 'All students must take 2 PE courses in freshman year',
        //       displayDescription: false
        //     }
        //   ],
        //   completed: [
        //     {
        //       name: 'Quantitative Literacy',
        //       type: 'Credits',
        //       fulfilled: 2,
        //       required: 2,
        //       description: 'Quantitiative literacy required for all CALS students',
        //       displayDescription: false
        //     }
        //   ]
        // }
      ],
      requirementsMap: {
        // CS 1110: 'MQR-AS'
      },
      // reqGroupColorMap maps reqGroup to an array [<hex color for progress bar>, <color for arrow image>]
      reqGroupColorMap: {
        UNIVERSITY: ['508197', 'grayblue'],
        COLLEGE: ['1AA9A5', 'blue'],
        MAJOR: ['105351', 'green'],
        MINOR: ['92C3E6', 'lightblue']
      },
      // subReqCourseMap maps from the group name to the subreq to a Course[]
      // Each item has key <group name>: <subreq name>: list of courses that fulfill the subreq
      subReqsCourseMapList: {},
      scrollable: false,
      isSeeAll: false
    };
  },
  beforeDestroy() {
    this.$el.removeEventListener('touchmove', this.dragListener);
  },
  methods: {
    dragListener(event) {
      if (!this.$data.scrollable) event.preventDefault();
    },
    getRequirementTypeDisplayName(type: string): string {
      return type.charAt(0).toUpperCase() + type.substring(1);
    },
    toggleDetails(index: number): void {
      this.reqs[index].displayDetails = !this.reqs[index].displayDetails;
    },
    toggleDescription(index: number, type: 'ongoing' | 'completed', id: number): void {
      if (type === 'ongoing') {
        const currentBool = this.reqs[index].ongoing[id].displayDescription;
        this.reqs[index].ongoing[id].displayDescription = !currentBool;
      } else if (type === 'completed') {
        const currentBool = this.reqs[index].completed[id].displayDescription;
        this.reqs[index].completed[id].displayDescription = !currentBool;
      }
    },
    turnCompleted(index: number, bool: boolean): void {
      this.reqs[index].displayCompleted = bool;
    },
    getCourseCodesArray(): readonly CourseTaken[] {
      const courses: CourseTaken[] = [];
      this.semesters.forEach(semester => {
        // @ts-ignore
        semester.courses.forEach(course => {
          courses.push({
            code: `${course.lastRoster}: ${course.subject} ${course.number}`,
            subject: course.subject,
            number: course.number,
            credits: course.credits,
            roster: course.lastRoster
          });
        });
      });
      return courses;
    },
    showMajorOrMinorRequirements(id: number, group: string) {
      let currentDisplay = 0;
      if (group === 'MAJOR') {
        this.majors.forEach((major, i:number) => {
          if (major.display) {
            currentDisplay = i + 2; // TODO CHANGE FOR MULTIPLE COLLEGES & UNIVERISTIES
          }
        });
        return (id < 2 || id === currentDisplay);
      }
      this.minors.forEach((minor, i:number) => {
        if (minor.display) {
          currentDisplay = i + 2 + this.majors.length; // TODO CHANGE FOR MULTIPLE COLLEGES & UNIVERISTIES
        }
      });
      return (id < 2 || id === currentDisplay);
    },
    activate(id: number) {
      this.majors.forEach((major, i: number) => {
        if (major.display) {
          major.display = false;
        }
      });
      this.majors[id].display = true;
    },
    getDisplays() {
      const majors = [];
      if (this.user.major != null) {
        for (let i = 0; i < this.user.major.length; i += 1) {
          const userMajor = { display: true, major: '', majorFN: '' };
          if (i === 0) {
            userMajor.display = true;
          } else {
            userMajor.display = false;
          }
          userMajor.major = this.user.major[i];
          userMajor.majorFN = this.user.majorFN[i];
          majors.push(userMajor);
        }
      }
      this.majors = majors;
      const minors = [];
      if (this.user.minor != null) {
        for (let i = 0; i < this.user.minor.length; i += 1) {
          const userMinor = { display: true, minor: '', minorFN: '' };
          if (i === 0) {
            userMinor.display = true;
          } else {
            userMinor.display = false;
          }
          userMinor.minor = this.user.minor[i];
          userMinor.minorFN = this.user.minorFN[i];
          minors.push(userMinor);
        }
      }
      this.minors = minors;
    },
    // Fetches course data and updates the subReqsCourseMapList with the course
    updateSubReqsCourseMapList(roster, subject, number, courseCode, group, subReqName, isSeeAll) {
      fetch(`https://classes.cornell.edu/api/2.0/search/classes.json?roster=${roster}&subject=${subject}&q=${courseCode}`)
        .then(res => res.json())
        .then(resultJSON => {
          if (resultJSON.data !== null) {
            // check catalogNbr of resultJSON class matches number of course to add
            resultJSON.data.classes.forEach(resultJSONclass => {
              if (resultJSONclass.catalogNbr === number) {
                const course = resultJSONclass;
                course.roster = roster;

                const newCourse = this.$parent.createCourse(course, true);
                newCourse.compact = !isSeeAll;
                // console.log(newCourse);
                if (this.subReqsCourseMapList[group] && this.subReqsCourseMapList[group][subReqName]) {
                  this.subReqsCourseMapList[group][subReqName].push(newCourse);
                } else {
                  this.subReqsCourseMapList[group][subReqName] = [newCourse];
                }
              }
            });
          }
        });
    },
    addRequirementsCourse(group, specific, seeAllSubReqName = null, isSeeAll) {
      // "university", "college", "major", or "minor"
      const groupName = group.toLowerCase();

      // console.log(decoratedRequirementsJSON[groupName][specific]);

      // List of requirements given the group and the specific (college/major/minor)
      const requirementsList = decoratedRequirementsJSON[groupName][specific].requirements;

      requirementsList.forEach(requirement => {
        const subReqName = requirement.name;

        if (requirement.fulfilledBy !== 'self-check') {
          // console.log(requirement);
          // Only list first four courses that fulfill the requirement
          if (!isSeeAll) {
            for (let i = 0; i < 4 && i < requirement.courses.length; i += 1) {
              // console.log(requirement.courses);
              const reqCourseObj = requirement.courses[i];
              // get roster keys for reqCourseObj, that is all rosters for a specific course
              const reqCourseObjRosters = Object.keys(reqCourseObj);

              if (reqCourseObjRosters.length !== 0) {
                // get last element of reqCourseObjRosters for most recent roster
                const roster = reqCourseObjRosters[reqCourseObjRosters.length - 1];
                // console.log(roster);

                // Get a list of the course codes for the 4 courses to add
                const courseCodesToAdd = [];
                const reqCourseRosterObjEntriesList = Object.entries(reqCourseObj[roster]);
                for (let j = 0; courseCodesToAdd.length < 4 && j < reqCourseRosterObjEntriesList.length; j += 1) {
                  const entry = reqCourseRosterObjEntriesList[j];
                  const subject = reqCourseRosterObjEntriesList[j][0];
                  const courseNumberList = reqCourseRosterObjEntriesList[j][1];
                  // Get as many as four courses
                  for (let k = 0; courseCodesToAdd.length < 4 && k < courseNumberList.length; k += 1) {
                    const number = courseNumberList[k];
                    const courseCode = `${subject} ${number}`;
                    courseCodesToAdd.push(courseCode);
                  }
                }
                courseCodesToAdd.forEach(courseCodeToAdd => {
                  const courseSubjectToAdd = courseCodeToAdd.split(' ')[0];
                  const courseNumberToAdd = courseCodeToAdd.split(' ')[1];
                  console.log(courseCodeToAdd);
                  this.updateSubReqsCourseMapList(roster, courseSubjectToAdd, courseNumberToAdd, courseCodeToAdd, group, subReqName, isSeeAll);
                });
              }
            }
          } else if (subReqName === seeAllSubReqName) { // add all courses for a specific subReq
            for (let i = 0; i < requirement.courses.length; i += 1) {
              // console.log(requirement.courses);
              const reqCourseObj = requirement.courses[i];
              // get roster keys for reqCourseObj, that is all rosters for a specific course
              const reqCourseObjRosters = Object.keys(reqCourseObj);

              if (reqCourseObjRosters.length !== 0) {
                // get last element of reqCourseObjRosters for most recent roster
                const roster = reqCourseObjRosters[reqCourseObjRosters.length - 1];
                // console.log(roster);

                const reqCourseRosterObjEntriesList = Object.entries(reqCourseObj[roster]);
                reqCourseRosterObjEntriesList.forEach(entry => {
                  const subject = entry[0];
                  const courseNumberList = entry[1];
                  courseNumberList.forEach(number => {
                    const courseCode = `${subject} ${number}`;
                    this.updateSubReqsCourseMapList(roster, subject, number, courseCode, group, subReqName, isSeeAll);
                  });
                });
              }
            }
          }
          console.log('subReqsCourseMapList');
          console.log(this.subReqsCourseMapList);
        }
      });
    },
    showSeeAll(group, specific, subReqName) {
      this.subReqsCourseMapList = {};
      this.subReqsCourseMapList[group] = {};
      this.addRequirementsCourse(group, specific, subReqName, true);
      this.isSeeAll = !this.isSeeAll;
    },
    backtoRequirements() {
      this.isSeeAll = !this.isSeeAll;
      this.subReqsCourseMapList = {};
    }
  }
});
</script>

<style scoped lang="scss">
input{
  width: 40px;
}
.major, .minor{
  display: flex;
  padding-bottom: 25px;
  &-title {
      width: 100%;
      display: flex;
      flex-direction: column;
      text-align: center;
      color: #757575;
      padding-bottom: 6px;
      &-top {
        text-align: center;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        margin: 0;
      }
      &-bottom {
        text-align: center;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 15px;
      }
    }
      &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
}
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
.description {
  margin: 0 0 0.5rem 1.8rem;
  color: #353535;
  font-size: 14px;
}
.pointer {
  cursor: pointer;
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
.middle {
  display: flex;
  align-items: center;
  justify-content: center;
}
.name {
  margin-top: auto;
  margin-bottom: auto;
  font-style: normal;
  font-weight: 600;
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
  color: #3C3C3C;
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
.settings, .arrow {
  height: 14px;
  width: 14px;
}
.arrow {
  fill: #1AA9A5;
  color:#1AA9A5;
  margin-top: -2px;
    &-up {
     margin-top: 4px;
   }
}
.progress-text {
  margin: 0.3125rem 0 0 0;
  font-size: 12px;
  line-height: 12px;
  color: #3C3C3C;

   &-credits {
     font-weight: bold;
   }
   &-text {
     font-weight: normal;
   }
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
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    align-self: center;
  }
  &-progress {
    font-size: 12px;
    line-height: 12px;
  }
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
.semester-req {
  border: none;
  max-width: 350px;
}
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
  &-seeAll {
    &-wrapper {
      display: flex;
      justify-content: flex-end;
    }
    &-button {
      font-size: 12px;
      line-height: 15px;
      color: #32A0F2;
      padding: 1%;
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

@media only screen and (max-width: 976px) {
  .requirements, .fixed {
    width: 21rem;
  }
}

@media only screen and (max-width: 878px) {
  .requirements {
    width: 100%;
    padding-left: 0.5rem;
  }

  .fixed {
    top: 4.5rem;
    left: 0rem;
    width: 100%;
    height: calc(100vh - 4.5rem);
  }
}
</style>

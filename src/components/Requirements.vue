<template v-if="semesters">
  <div class="requirements">
    <div id="req-tooltip" class="fixed"
      data-intro-group="req-tooltip"
      :data-intro="getRequirementsTooltipText()"
      data-disable-interaction = '1'
      data-step = '1'
      data-tooltipClass = 'tooltipCenter'
    >
    <h1 class="title">School Requirements</h1>
    <!-- loop through reqs array of req objects -->
    <div class="req" v-for="(req, index) in reqs" :key="index">
      <requirementview
        :reqs="reqs"
        :req="req"
        :reqIndex="index"
        :majors="majors"
        :minors="minors"
        :toggleableRequirementChoices="toggleableRequirementChoices"
        :displayedMajorIndex="displayedMajorIndex"
        :displayedMinorIndex="displayedMinorIndex"
        :user="user"
        :showMajorOrMinorRequirements="showMajorOrMinorRequirements(index, req.group)"
        :rostersFromLastTwoYears="rostersFromLastTwoYears"
        :numOfColleges="numOfColleges"
        @changeToggleableRequirementChoice="chooseToggleableRequirementOption"
        @activateMajor="activateMajor"
        @activateMinor="activateMinor"
      />
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from 'firebase/app';
import 'firebase/functions';
import { Vue } from 'vue-property-decorator';
import { PropType } from 'vue';
// @ts-ignore
import VueCollapse from 'vue2-collapse';
import introJs from 'intro.js';

import Course from '@/components/Course.vue';
import Modal from '@/components/Modals/Modal.vue';
import RequirementView from '@/components/RequirementView.vue';
import SubRequirement from '@/components/SubRequirement.vue';
import { BaseRequirement as Requirement, CourseTaken, SingleMenuRequirement } from '@/requirements/types';
import { RequirementMap, computeRequirements, computeRequirementMap } from '@/requirements/reqs-functions';
import { AppUser, AppMajor, AppMinor, AppSemester, FirestoreSemesterCourse } from '@/user-data';

const functions = firebase.functions();

Vue.component('course', Course);
Vue.component('modal', Modal);
Vue.component('requirementview', RequirementView);
Vue.use(VueCollapse);

type Data = {
  reqs: readonly SingleMenuRequirement[];
  // map from requirement ID to option chosen
  toggleableRequirementChoices: Readonly<Record<string, string>>;
  displayedMajorIndex: number,
  displayedMinorIndex: number,
  numOfColleges: number,
  rostersFromLastTwoYears: string[];
}
// emoji for clipboard
const clipboard = require('../assets/images/clipboard.svg');

// This section will be revisited when we try to make first-time tooltips
const tour = introJs().start();
tour.setOption('exitOnEsc', 'false');
tour.setOption('doneLabel', 'Finish');
tour.setOption('skipLabel', 'Skip This Tutorial');
tour.setOption('nextLabel', 'Next');
tour.setOption('exitOnOverlayClick', 'false');

export default Vue.extend({
  props: {
    semesters: Array as PropType<readonly AppSemester[]>,
    user: Object as PropType<AppUser>,
    compact: Boolean,
    startTour: Boolean
  },
  mounted() {
    this.recomputeRequirements();
    this.rostersFromLastTwoYears = this.getRostersFromLastTwoYears();
  },
  data() : Data {
    return {
      // currentEditID: 0,
      // isEditing: false,
      // display: [],
      displayedMajorIndex: 0,
      displayedMinorIndex: 0,
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
      toggleableRequirementChoices: {},
      numOfColleges: 1,
      rostersFromLastTwoYears: []
    };
  },
  watch: {
    startTour() {
      tour.start();
      tour.oncomplete(() => { this.$emit('showTourEndWindow'); });
    }
  },
  computed: {
    majors() {
      const majors: AppMajor[] = [];
      if (this.user.major != null) {
        for (let i = 0; i < this.user.major.length; i += 1) {
          majors.push({ major: this.user.major[i], majorFN: this.user.majorFN[i] });
        }
      }
      return majors;
    },
    minors() {
      const minors: AppMinor[] = [];
      if (this.user.minor != null) {
        for (let i = 0; i < this.user.minor.length; i += 1) {
          minors.push({ minor: this.user.minor[i], minorFN: this.user.minorFN[i] });
        }
      }
      return minors;
    },
  },
  methods: {
    recomputeRequirements(): void {
      const groups = computeRequirements(
        this.getCourseCodesArray(),
        this.toggleableRequirementChoices,
        this.user.college,
        this.user.major,
        this.user.minor,
      );
      // Send satisfied credits data back to dashboard to build alerts
      this.$emit('requirementsMap', computeRequirementMap(groups));
      // Turn result into data readable by requirements menu
      const singleMenuRequirements = groups.map(group => {
        const singleMenuRequirement: SingleMenuRequirement = {
          ongoing: [],
          completed: [],
          name: `${group.groupName.charAt(0) + group.groupName.substring(1).toLowerCase()} Requirements`,
          group: group.groupName.toUpperCase() as 'COLLEGE' | 'MAJOR' | 'MINOR',
          specific: group.specific,
        };
        group.reqs.forEach(req => {
          // Create progress bar with requirement with progressBar = true
          if (req.requirement.progressBar) {
            singleMenuRequirement.type = this.getRequirementTypeDisplayName(req.requirement.fulfilledBy);
            singleMenuRequirement.fulfilled = req.totalCountFulfilled || req.minCountFulfilled;
            singleMenuRequirement.required = (req.requirement.fulfilledBy !== 'self-check' && req.totalCountRequired) || req.minCountRequired;
          }
          // Default display value of false for all requirement lists
          const displayableRequirementFulfillment = { ...req, displayDescription: false };
          if (!req.minCountFulfilled || req.minCountFulfilled < req.minCountRequired) {
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
        return singleMenuRequirement;
      });
      this.reqs = singleMenuRequirements;
    },
    getRequirementTypeDisplayName(type: string): string {
      return type.charAt(0).toUpperCase() + type.substring(1);
    },
    showMajorOrMinorRequirements(id: number, group: string) {
      if (group === 'MAJOR') {
        return id === this.displayedMajorIndex + this.numOfColleges;
      }
      // TODO CHANGE FOR MULTIPLE COLLEGES & UNIVERISTIES
      return id < this.numOfColleges ||
        id === this.displayedMinorIndex + this.numOfColleges + this.majors.length;
    },
    chooseToggleableRequirementOption(requirementID: string, option: string): void {
      this.toggleableRequirementChoices = {
        ...this.toggleableRequirementChoices,
        [requirementID]: option,
      };
      this.recomputeRequirements();
    },
    getCourseCodesArray(): readonly CourseTaken[] {
      const courses: CourseTaken[] = [];
      this.semesters.forEach(semester => {
        semester.courses.forEach(course => {
          courses.push({
            code: `${course.lastRoster}: ${course.subject} ${course.number}`,
            subject: course.subject,
            courseId: course.crseId,
            number: course.number,
            credits: course.credits,
            roster: course.lastRoster
          });
        });
      });
      return courses;
    },
    activateMajor(id: number) {
      this.displayedMajorIndex = id;
    },
    activateMinor(id: number) {
      this.displayedMinorIndex = id;
    },
    createCourse(course: FirestoreSemesterCourse, isRequirementsCourse: boolean) {
      this.$emit('createCourse', course, isRequirementsCourse);
    },
    getRequirementsTooltipText() {
      return `<b>This is your Requirements Bar <img src="${clipboard}"class = "newSemester-emoji-text"></b><br>
          <div class = "introjs-bodytext">To ease your journey, we’ve collected a list of course
          requirements based on your college and major :)</div>`;
    },
    getCurrentType() {
      let currentType;
      const currentMonth = new Date().getMonth();
      if (currentMonth === 0) {
        currentType = 'WI';
      } else if (currentMonth <= 4) {
        currentType = 'SP';
      } else if (currentMonth <= 7) {
        currentType = 'SU';
      } else {
        currentType = 'FA';
      }
      return currentType;
    },
    getCurrentYearSuffix() {
      // If current year is 2020, get string '20'
      const currentYear = new Date().getFullYear();
      return currentYear.toString().substring(2);
    },
    getRostersFromLastTwoYears() {
      // If current roster is FA20, get all rosters thru FA18
      const currentType = this.getCurrentType();
      const currentYearSuffix = this.getCurrentYearSuffix();

      const currentRoster = currentType + currentYearSuffix;
      const numRosters = 9; // Number of most recent rosters we want
      const mostRecentRosters = [currentRoster];
      let roster = currentRoster;
      while (mostRecentRosters.length < numRosters) {
        // Go backwards until we hit 2 years and add to list of rosters
        let rosterType = roster.substring(0, 2);
        let rosterYear = roster.substring(2);
        if (rosterType === 'FA') {
          rosterType = 'SU';
        } else if (rosterType === 'SU') {
          rosterType = 'SP';
        } else if (rosterType === 'SP') {
          rosterType = 'WI';
        } else if (rosterType === 'WI') {
          rosterType = 'FA';
          rosterYear = (parseInt(rosterYear, 10) - 1).toString();
        }
        roster = rosterType + rosterYear;
        mostRecentRosters.push(roster);
      }
      return mostRecentRosters;
    }
  }
});
</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables.scss";
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
h1.title {
  font-style: normal;
  font-weight: 550;
  font-size: 22px;
  line-height: 29px;
  color: $black;
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

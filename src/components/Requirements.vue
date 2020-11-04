<template v-if="semesters">
  <div class="requirements">
    <div id="req-tooltip" class="fixed"
      data-intro-group="req-tooltip"
      :data-intro = getRequirementsTooltipText()
      data-disable-interaction = '1'
      data-step = '1'
      data-tooltipClass = 'tooltipCenter'
    >
    <h1 class="title">School Requirements</h1>
    <!-- loop through reqs array of req objects -->
    <div class="req" v-for="(req, index) in reqs" :key="req.id">
      <requirementview
        :reqs="reqs"
        :req="req"
        :reqIndex="index"
        :majors="majors"
        :minors="minors"
        :reqGroupColorMap="reqGroupColorMap"
        :user="user"
        :showMajorOrMinorRequirements="showMajorOrMinorRequirements(index, req.group)"
        @activateMajor="activateMajor"
        @activateMinor="activateMinor"
        @toggleDetails="toggleDetails"
        @toggleDescription="toggleDescription"
        @turnCompleted="turnCompleted"
      />
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from 'firebase/app';
import 'firebase/functions';
import { Vue } from 'vue-property-decorator';
// @ts-ignore
import VueCollapse from 'vue2-collapse';
// eslint-disable-next-line import/extensions
import introJs from 'intro.js';

// Disable import extension check because TS module resolution depends on it.
// eslint-disable-next-line import/extensions
import Course from '@/components/Course.vue';
// eslint-disable-next-line import/extensions
import Modal from '@/components/Modals/Modal.vue';
// eslint-disable-next-line import/extensions
import RequirementView from '@/components/RequirementView.vue';
// eslint-disable-next-line import/extensions
import SubRequirement from '@/components/SubRequirement.vue';
import { BaseRequirement as Requirement, CourseTaken, SingleMenuRequirement } from '@/requirements/types';
import { computeRequirements, computeRequirementMap } from '@/requirements/reqs-functions';

const functions = firebase.functions();

Vue.component('course', Course);
Vue.component('modal', Modal);
Vue.component('requirementview', RequirementView);
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
    semesters: Array,
    user: Object,
    compact: Boolean,
    startTour: Boolean
  },
  mounted() {
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
      }
    };
  },
  watch: {
    startTour() {
      tour.start();
      tour.oncomplete(() => { this.$emit('showTourEndWindow'); });
    }
  },
  methods: {
    getRequirementTypeDisplayName(type: string): string {
      return type.charAt(0).toUpperCase() + type.substring(1);
    },
    showMajorOrMinorRequirements(id: number, group: string) {
      let currentDisplay = 0;
      if (group === 'MAJOR') {
        this.majors.forEach((major, i: number) => {
          if (major.display) {
            currentDisplay = i + 2; // TODO CHANGE FOR MULTIPLE COLLEGES & UNIVERISTIES
          }
        });
        return (id < 2 || id === currentDisplay);
      }
      this.minors.forEach((minor, i: number) => {
        if (minor.display) {
          currentDisplay = i + 2 + this.majors.length; // TODO CHANGE FOR MULTIPLE COLLEGES & UNIVERISTIES
        }
      });
      return (id < 2 || id === currentDisplay);
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
      this.majors.forEach((major, i: number) => {
        if (major.display) {
          major.display = false;
        }
      });
      this.majors[id].display = true;
    },
    activateMinor(id: number) {
      this.minors.forEach((minor, i: number) => {
        if (minor.display) {
          minor.display = false;
        }
      });
      this.minors[id].display = true;
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
    getRequirementsTooltipText() {
      return `<b>This is your Requirements Bar <img src="${clipboard}"class = "newSemester-emoji-text"></b><br>
          <div class = "introjs-bodytext">To ease your journey, we’ve collected a list of course
          requirements based on your college and major :)</div>`;
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

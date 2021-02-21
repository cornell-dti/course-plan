<template v-if="semesters">
  <div class="requirements">
    <div
      class="fixed"
      data-intro-group="req-tooltip"
      :class="{ 'd-none': shouldShowAllCourses }"
      :data-intro="getRequirementsTooltipText()"
      data-disable-interaction="1"
      data-step="1"
      data-tooltipClass="tooltipCenter"
    >
      <!-- loop through reqs array of req objects -->
      <div class="req" v-for="(req, index) in groupedRequirementFulfillmentReports" :key="index">
        <requirement-view
          :req="req"
          :reqIndex="index"
          :toggleableRequirementChoices="toggleableRequirementChoices"
          :displayedMajorIndex="displayedMajorIndex"
          :displayedMinorIndex="displayedMinorIndex"
          :showMajorOrMinorRequirements="showMajorOrMinorRequirements(index, req.groupName)"
          :rostersFromLastTwoYears="rostersFromLastTwoYears"
          :numOfColleges="numOfColleges"
          :lastLoadedShowAllCourseId="lastLoadedShowAllCourseId"
          @changeToggleableRequirementChoice="chooseToggleableRequirementOption"
          @activateMajor="activateMajor"
          @activateMinor="activateMinor"
          @onShowAllCourses="onShowAllCourses"
          @deleteCourseFromSemesters="deleteCourseFromSemesters"
        />
      </div>
    </div>
    <div class="fixed see-all-padding-y" v-if="shouldShowAllCourses" @scroll="onScrollSeeAll">
      <div class="see-all-padding-x see-all-header pb-3">
        <span class="arrow-left">
          <drop-down-arrow :isPointingLeft="true" :fillColor="'#32A0F2'" />
        </span>
        <button class="btn back-button p-0" @click="backFromSeeAll">GO BACK TO REQUIREMENTS</button>
      </div>
      <div class="see-all-padding-x py-3">
        <h1 class="title">{{ showAllCourses.name }}</h1>
        <draggable :value="showAllCourses.courses" group="draggable-semester-courses">
          <div v-for="(courseData, index) in showAllCourses.courses" :key="index">
            <div class="mt-3">
              <course
                :courseObj="courseData"
                :compact="false"
                :active="false"
                :isReqCourse="true"
                class="requirements-course"
              />
            </div>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import Vue from 'vue';
import VueCollapse from 'vue2-collapse';
import introJs from 'intro.js';

import Course from '@/components/Course/Course.vue';
import RequirementView from '@/components/Requirements/RequirementView.vue';
import { SubReqCourseSlot } from '@/components/Requirements/SubRequirement.vue';
import DropDownArrow from '@/components/DropDownArrow.vue';
import { CrseInfo } from '@/requirements/types';
import { getRostersFromLastTwoYears } from '@/utilities';
// emoji for clipboard
import clipboard from '@/assets/images/clipboard.svg';
import store from '@/store';
import { chooseToggleableRequirementOption } from '@/global-firestore-data';
import { cornellCourseRosterCourseToFirebaseSemesterCourse } from '@/user-data-converter';
import { fetchCoursesFromFirebaseFunctions } from '@/firebaseConfig';

Vue.use(VueCollapse);

export type ShowAllCourses = {
  readonly name: string;
  readonly courses: FirestoreSemesterCourse[];
};

type Data = {
  displayedMajorIndex: number;
  displayedMinorIndex: number;
  numOfColleges: number;
  showAllCourses: ShowAllCourses;
  shouldShowAllCourses: boolean;
  showAllSubReqCourses: SubReqCourseSlot[];
  lastLoadedShowAllCourseId: number;
};

// This section will be revisited when we try to make first-time tooltips
const tour = introJs().start();
tour.setOption('exitOnEsc', 'false');
tour.setOption('doneLabel', 'Finish');
tour.setOption('skipLabel', 'Skip This Tutorial');
tour.setOption('nextLabel', 'Next');
tour.setOption('exitOnOverlayClick', 'false');

export default Vue.extend({
  components: { draggable, Course, DropDownArrow, RequirementView },
  props: {
    startTour: { type: Boolean, required: true },
  },
  data(): Data {
    return {
      displayedMajorIndex: 0,
      displayedMinorIndex: 0,
      numOfColleges: 1,
      showAllCourses: { name: '', courses: [] },
      shouldShowAllCourses: false,
      lastLoadedShowAllCourseId: 0,
      showAllSubReqCourses: [],
    };
  },
  watch: {
    startTour() {
      tour.start();
      tour.oncomplete(() => {
        this.$emit('showTourEndWindow');
      });
    },
  },
  computed: {
    semesters(): readonly FirestoreSemester[] {
      return store.state.semesters;
    },
    onboardingData(): AppOnboardingData {
      return store.state.onboardingData;
    },
    toggleableRequirementChoices(): AppToggleableRequirementChoices {
      return store.state.toggleableRequirementChoices;
    },
    groupedRequirementFulfillmentReports(): readonly GroupedRequirementFulfillmentReport[] {
      return store.state.groupedRequirementFulfillmentReport;
    },
    rostersFromLastTwoYears() {
      return getRostersFromLastTwoYears();
    },
  },
  methods: {
    showMajorOrMinorRequirements(id: number, group: string): boolean {
      if (group === 'Major') {
        return id === this.displayedMajorIndex + this.numOfColleges;
      }
      // TODO CHANGE FOR MULTIPLE COLLEGES & UNIVERISTIES
      return (
        id < this.numOfColleges ||
        id === this.displayedMinorIndex + this.numOfColleges + this.onboardingData.major.length
      );
    },
    chooseToggleableRequirementOption(requirementID: string, option: string): void {
      chooseToggleableRequirementOption({
        ...this.toggleableRequirementChoices,
        [requirementID]: option,
      });
    },
    activateMajor(id: number) {
      this.displayedMajorIndex = id;
    },
    activateMinor(id: number) {
      this.displayedMinorIndex = id;
    },
    getRequirementsTooltipText() {
      return `<b>This is your Requirements Bar <img src="${clipboard}"class = "newSemester-emoji-text"></b><br>
          <div class = "introjs-bodytext">To ease your journey, we’ve collected a list of course
          requirements based on your college and major :)</div>`;
    },
    getAllCrseInfoFromSemester(
      subReqCoursesArray: SubReqCourseSlot[]
    ): Promise<FirestoreSemesterCourse[]> {
      return new Promise((resolve, reject) => {
        let subReqCrseInfoObjectsToFetch: CrseInfo[] = [];
        // Used to identify index of lastLoadedSeeAll
        const subReqCourses = subReqCoursesArray;
        let coursesCount = 0;
        subReqCourses.forEach(subReqCourseSlot => {
          if (!subReqCourseSlot.isCompleted) {
            const crseInfoFromSemester: CrseInfo[] = [];
            subReqCourseSlot.courses.forEach((crseInfo: CrseInfo) => {
              const lastLoadedIndexOf = crseInfo.crseIds.indexOf(this.lastLoadedShowAllCourseId);
              if (lastLoadedIndexOf !== -1) {
                subReqCrseInfoObjectsToFetch = [];
                crseInfo.crseIds.splice(0, lastLoadedIndexOf + 1);
              }
              if (coursesCount + crseInfo.crseIds.length >= 24) {
                const remainingCount = 24 - coursesCount;
                return crseInfoFromSemester.push({
                  ...crseInfo,
                  crseIds: crseInfo.crseIds.slice(0, remainingCount),
                });
              }
              coursesCount += crseInfo.crseIds.length;
              return crseInfoFromSemester.push(crseInfo);
            });
            subReqCrseInfoObjectsToFetch.push(crseInfoFromSemester[0]);
          }
        });
        fetchCoursesFromFirebaseFunctions(subReqCrseInfoObjectsToFetch)
          .then(courses => resolve(courses.map(cornellCourseRosterCourseToFirebaseSemesterCourse)))
          .catch(error => reject(error));
      });
    },
    onShowAllCourses(showAllCourses: {
      requirementName: string;
      subReqCoursesArray: SubReqCourseSlot[];
    }) {
      this.shouldShowAllCourses = true;
      this.showAllSubReqCourses = showAllCourses.subReqCoursesArray;
      this.getAllCrseInfoFromSemester(showAllCourses.subReqCoursesArray).then(fetchedCourses => {
        const lastCourse = fetchedCourses[fetchedCourses.length - 1];
        this.lastLoadedShowAllCourseId = lastCourse.crseId;
        this.showAllCourses = {
          name: showAllCourses.requirementName,
          courses: fetchedCourses,
        };
      });
    },
    onScrollSeeAll(event: Event) {
      const { target } = event;
      const { scrollTop, clientHeight, scrollHeight } = target as HTMLDivElement;
      if (scrollTop + clientHeight >= scrollHeight) {
        this.getAllCrseInfoFromSemester(this.showAllSubReqCourses).then(fetchedCourses => {
          this.showAllCourses = {
            ...this.showAllCourses,
            courses: [...this.showAllCourses.courses, ...fetchedCourses],
          };
        });
      }
    },
    backFromSeeAll() {
      this.shouldShowAllCourses = false;
      this.showAllCourses = { name: '', courses: [] };
      this.showAllSubReqCourses = [];
    },
    deleteCourseFromSemesters(uniqueId: number) {
      this.$emit('deleteCourseFromSemesters', uniqueId);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.separator {
  height: 1px;
  width: 100%;
  background-color: $inactiveGray;
}
.requirements,
.fixed {
  height: 100vh;
  width: 25rem;
  background-color: $white;
}
.fixed {
  position: fixed;
  top: 0;
  left: 4.5rem;
  overflow-y: scroll;
  overflow-x: hidden;
}
.fixed,
.see-all-padding {
  padding: 1.625rem 1.5rem;
}
.see-all-padding-y {
  padding: 1.625rem 0;
}
.see-all-padding-x {
  padding: 0 1.625rem;
}
.see-all-header {
  box-shadow: 0 4px 8px -8px gray;
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

.back-button {
  color: $yuxuanBlue;
  font-size: 0.9rem;
}

.arrow-left {
  transform: rotate(90deg);
}

@media only screen and (max-width: $large-breakpoint) {
  .requirements,
  .fixed {
    width: 21rem;
  }
}

@media only screen and (max-width: $medium-breakpoint) {
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

<template v-if="semesters">
  <aside class="requirements">
    <div
      class="requirements-wrapper"
      data-intro-group="req-tooltip"
      :data-intro="getRequirementsTooltipText()"
      data-disable-interaction="1"
      data-step="1"
      data-tooltipClass="tooltipCenter"
    >
      <!-- loop through reqs array of req objects -->
      <div
        :class="{
          'd-none': shouldShowAllCourses,
          fixed: !(isSafari && modalIsOpen),
        }"
        data-intro-group="req-tooltip"
        :data-intro="getCoursesTooltipText()"
        data-disable-interaction="1"
        data-step="2"
        data-tooltipClass="tooltipCenter"
      >
        <div class="req" v-for="(req, index) in groupedRequirementFulfillmentReports" :key="index">
          <requirement-view
            :req="req"
            :reqIndex="index"
            :toggleableRequirementChoices="toggleableRequirementChoices"
            :displayedMajorIndex="displayedMajorIndex"
            :displayedMinorIndex="displayedMinorIndex"
            :showMajorOrMinorRequirements="showMajorOrMinorRequirements(index, req.groupName)"
            :numOfColleges="numOfColleges"
            :tourStep="tourStep"
            @changeToggleableRequirementChoice="chooseToggleableRequirementOption"
            @activateMajor="activateMajor"
            @activateMinor="activateMinor"
            @onShowAllCourses="onShowAllCourses"
            @modal-open="modalToggled"
          />
        </div>
      </div>
    </div>
    <div class="fixed see-all-padding-y" v-if="shouldShowAllCourses">
      <div class="see-all-padding-x see-all-header pb-3">
        <span class="arrow-left">
          <drop-down-arrow :isPointingLeft="true" :fillColor="'#32A0F2'" />
        </span>
        <button class="btn back-button p-0" @click="backFromSeeAll">GO BACK TO REQUIREMENTS</button>
      </div>
      <div class="see-all-padding-x py-3">
        <h1 class="title">{{ showAllCourses.name }}</h1>
        <div class="see-all-pages" v-if="numPages > 1">
          <span class="see-all-pageCount">{{ pageText }}</span>
          <div class="see-all-buttonWrapper">
            <button
              class="see-all-button"
              :class="{ 'see-all-button--disabled': !hasPrevPage }"
              :disabled="!hasPrevPage"
              @click="prevPage()"
            >
              <span class="see-all-button-text">Prev</span>
            </button>
            <button
              class="see-all-button"
              :class="{ 'see-all-button--disabled': !hasNextPage }"
              :disabled="!hasNextPage"
              @click="nextPage()"
            >
              <span class="see-all-button-text">Next</span>
            </button>
          </div>
        </div>
        <draggable
          :value="showAllCourses.shownCourses"
          :clone="cloneCourse"
          :group="{ name: 'draggable-semester-courses', put: false }"
        >
          <div v-for="(courseData, index) in showAllCourses.shownCourses" :key="index">
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
  </aside>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import Vue from 'vue';
import VueCollapse from 'vue2-collapse';
import introJs from 'intro.js';

import Course from '@/components/Course/Course.vue';
import RequirementView from '@/components/Requirements/RequirementView.vue';
import DropDownArrow from '@/components/DropDownArrow.vue';

import clipboard from '@/assets/images/clipboard.svg';
import warning from '@/assets/images/warning.svg';
import store from '@/store';
import { chooseToggleableRequirementOption, incrementUniqueID } from '@/global-firestore-data';

Vue.use(VueCollapse);

export type ShowAllCourses = {
  readonly name: string;
  shownCourses: FirestoreSemesterCourse[];
  readonly allCourses: FirestoreSemesterCourse[];
};

type Data = {
  displayedMajorIndex: number;
  displayedMinorIndex: number;
  numOfColleges: number;
  showAllCourses: ShowAllCourses;
  shouldShowAllCourses: boolean;
  showAllPage: number;
  tourStep: number;
  modalIsOpen: boolean;
};

// This section will be revisited when we try to make first-time tooltips
const tour = introJs().start();
tour.setOption('exitOnEsc', 'false');
tour.setOption('doneLabel', 'Next');
tour.setOption('nextLabel', 'Next');
tour.setOption('exitOnOverlayClick', 'false');

// show 24 courses per page of the see all menu
const maxSeeAllCoursesPerPage = 24;

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
      showAllCourses: { name: '', shownCourses: [], allCourses: [] },
      shouldShowAllCourses: false,
      showAllPage: 0,
      tourStep: 0,
      modalIsOpen: false,
    };
  },
  watch: {
    startTour() {
      tour.start();
      tour.oncomplete(() => {
        this.$emit('showTourEndWindow');
      });
      tour.onbeforechange(() => {
        if (tour.currentStep()) {
          this.tourStep = tour.currentStep() as number;
        }
      });
      tour.onexit(() => {
        // resets tourStep in case skipped at step = 1
        this.tourStep = 0;
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
    numPages(): number {
      return Math.ceil(this.showAllCourses.allCourses.length / maxSeeAllCoursesPerPage);
    },
    hasNextPage(): boolean {
      return this.showAllPage + 1 < this.numPages;
    },
    hasPrevPage(): boolean {
      return this.showAllPage > 0;
    },
    pageText(): string {
      return `Page ${this.showAllPage + 1}/${this.numPages}`;
    },
    isSafari(): boolean {
      const htmlElement = window.HTMLElement as unknown;
      type windowType = {
        safari: {
          pushNotification: boolean;
        };
      };
      const initWindow = window as unknown;
      const typedWindow = initWindow as windowType;
      return (
        /constructor/i.test(htmlElement as string) ||
        (function (p) {
          return p.toString() === '[object SafariRemoteNotification]';
        })(
          !typedWindow.safari ||
            (typeof typedWindow.safari !== 'undefined' && typedWindow.safari.pushNotification)
        )
      );
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
      return `<div class="introjs-tooltipTop"><div class="introjs-customTitle">Meet your Requirements Bar <img src="${clipboard}" class = "introjs-emoji newSemester-emoji-text" alt="clipboard icon"/>
          </div><div class="introjs-customProgress">1/4</div></div><div class = "introjs-bodytext">Based on your school and major/minor, we’ve compiled your requirements and
          required courses.<br><img src="${warning}" class = "newSemester-emoji-text" alt="warning icon"/> Some requirements
          aren’t fully tracked by us yet, so pay attention to the warnings.</div>`;
    },
    getCoursesTooltipText() {
      return `<div class="introjs-tooltipTop"><div class="introjs-customTitle">These are your Courses</div><div class="introjs-customProgress">2/4</div>
      </div><div class = "introjs-bodytext">Drag and drop courses into your schedule! Click on them to learn more information like their descriptions.</div>`;
    },
    onShowAllCourses(showAllCourses: {
      requirementName: string;
      subReqCoursesArray: FirestoreSemesterCourse[];
    }) {
      this.shouldShowAllCourses = true;

      this.showAllCourses = {
        name: showAllCourses.requirementName,
        shownCourses: this.findPotentialSeeAllCourses(showAllCourses.subReqCoursesArray),
        allCourses: showAllCourses.subReqCoursesArray,
      };
    },
    nextPage() {
      if (!this.hasNextPage) {
        return;
      }

      this.showAllPage += 1;
      this.showAllCourses.shownCourses = this.findPotentialSeeAllCourses(
        this.showAllCourses.allCourses
      );
    },
    prevPage() {
      if (!this.hasPrevPage) {
        return;
      }

      this.showAllPage -= 1;
      this.showAllCourses.shownCourses = this.findPotentialSeeAllCourses(
        this.showAllCourses.allCourses
      );
    },
    // return an array consisting of the courses to display on the see all menu, depending on the showAllPage and maxSeeAllCoursesPerPage
    findPotentialSeeAllCourses(courses: FirestoreSemesterCourse[]): FirestoreSemesterCourse[] {
      const allPotentialCourses = courses.slice(
        this.showAllPage * maxSeeAllCoursesPerPage,
        (this.showAllPage + 1) * maxSeeAllCoursesPerPage
      );
      return allPotentialCourses;
    },
    backFromSeeAll() {
      this.shouldShowAllCourses = false;
      this.showAllCourses = { name: '', shownCourses: [], allCourses: [] };
      this.showAllPage = 0;
    },
    cloneCourse(courseWithDummyUniqueID: FirestoreSemesterCourse): FirestoreSemesterCourse {
      return { ...courseWithDummyUniqueID, uniqueID: incrementUniqueID() };
    },
    modalToggled(isOpen: boolean) {
      this.$emit('modal-open', isOpen);
      this.modalIsOpen = isOpen;
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
.requirements-wrapper {
  width: 100%;
  height: 100%;
}
.requirements,
.fixed {
  z-index: 1;
  height: 100%;
  width: 25rem;
  background-color: $white;
}
.fixed {
  position: fixed;
  left: 4.5rem;
  top: 0;
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
.see-all-pages {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 21.375rem;
}
.see-all-pageCount {
  font-size: 16px;
  line-height: 19px;
  color: $primaryGray;
}
.see-all-buttonWrapper {
  display: flex;
}
.see-all-button {
  width: 4.75rem;
  height: 2rem;
  color: $sangBlue;
  border-radius: 3px;
  border: 1px solid $sangBlue;
  background-color: $white;
  display: flex;
  justify-content: center;
  margin-top: auto;
  margin-bottom: auto;

  &:first-child {
    margin-right: 1rem;
  }

  &-left {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  &-text {
    margin-top: auto;
    margin-bottom: auto;
  }

  &--disabled {
    opacity: 0.3;
    border: 1px solid $sangBlue;
    background-color: $disabledGray;
  }
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

.requirements-course {
  width: 21.375rem;
}

@media only screen and (max-width: $large-breakpoint) {
  .requirements,
  .fixed {
    width: 21rem;
  }
  .see-all-pages {
    width: 17rem;
  }

  .requirements-course {
    width: 17rem;
  }
}

@media only screen and (max-width: $medium-breakpoint) {
  .requirements {
    position: fixed;
    width: 100%;
    padding-left: 0.5rem;
    top: 4.5rem;
  }

  .fixed {
    top: 4.5rem;
    left: 0rem;
    width: 100%;
    height: calc(100vh - 4.5rem);
  }
}
</style>

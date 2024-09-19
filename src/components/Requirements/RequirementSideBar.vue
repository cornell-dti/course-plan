<template v-if="semesters">
  <div>
    <button
      v-if="isMinimized && showToggleRequirementsBtn"
      class="requirement-sidebar-btn-open"
      @click="toggleMinimized"
    >
      →
    </button>

    <aside v-if="isMobile ? isDisplayingMobile : !isMinimized" class="requirements">
      <div
        class="requirements-wrapper"
        data-intro-group="req-tooltip"
        :data-intro="getRequirementsTooltipText()"
        data-disable-interaction="1"
        data-step="1"
        data-tooltipClass="tooltipCenter tourStep1"
      >
        <!-- loop through reqs array of req objects -->
        <div>
          <div
            class="fixed"
            :class="{
              'd-none': shouldShowAllCourses,
            }"
            data-intro-group="req-tooltip"
            :data-intro="getCoursesTooltipText()"
            data-disable-interaction="1"
            data-step="2"
            data-tooltipClass="tooltipCenter tourStep2"
          >
            <div class="multiple-plans">
              <add-plan-modal
                v-if="isAddPlanOpen"
                @close-plan-modal="toggleAddPlan"
                @open-copy-modal="toggleCopyPlan"
                @add-plan="addPlan"
              />
              <copy-plan-modal
                v-if="isCopyPlanOpen"
                @open-plan-modal="toggleAddPlan"
                @close-copy-modal="toggleCopyPlan"
                @open-name-modal="toggleNamePlan"
                @copy-plan="copyPlan"
              />
              <name-plan-modal
                v-if="isNamePlanOpen"
                @open-copy-modal="toggleCopyPlan"
                @close-name-modal="toggleNamePlan"
                @add-plan="addPlan"
                :selectedPlanCopy="selectedPlanCopy"
              />
              <edit-plan-modal
                v-if="isEditPlanOpen"
                @close-edit-modal="toggleEditPlan"
                @close-name-modal="toggleNamePlan"
                @edit-plan="editPlan"
                @delete-plan="deletePlan"
              />
              <button class="add-plan-button" @click="toggleAddPlan()">+ Add Plan</button>
              <div class="multiple-plans-dropdown">
                <multiple-plans-dropdown @open-edit-modal="toggleEditPlan" />
              </div>
            </div>
            <div class="collection-header" v-if="isDisplayingCollection">
              <collections-side-bar />
            </div>
            <div v-if="!isDisplayingCollection">
              <button
                class="requirement-debugger-toggler"
                v-if="debuggerAllowed"
                @click="toggleDebugger()"
              >
                Open Requirement Debugger
              </button>
              <confirmation :text="confirmationText" v-if="isConfirmationOpen" />

              <teleport-modal
                content-class="requirement-debugger-modal-content"
                :isSimpleModal="true"
                v-if="displayDebugger"
              >
                <button class="requirement-debugger-toggler" @click="toggleDebugger()">
                  Close Requirement Debugger
                </button>
                <requirement-debugger />
              </teleport-modal>
              <div v-if="showToggleRequirementsBtn" class="requirement-sidebar-header">
                <button class="requirement-sidebar-btn-close" @click="toggleMinimized">←</button>
              </div>
              <div
                class="req"
                v-for="(req, index) in groupedRequirementFulfillmentReports"
                :key="index"
              >
                <requirement-group
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
                />
              </div>
            </div>
          </div>
        </div>
        <div class="fixed see-all-padding-y" v-if="shouldShowAllCourses">
          <div class="see-all-padding-x see-all-header pb-3">
            <span class="arrow-left">
              <drop-down-arrow :isPointingLeft="true" :fillColor="'#32A0F2'" />
            </span>
            <button class="btn back-button p-0" @click="backFromSeeAll">
              GO BACK TO REQUIREMENTS
            </button>
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
              :modelValue="showAllCourses.shownCourses"
              :clone="cloneCourse"
              item-key="code"
              :group="{ name: 'draggable-semester-courses', put: false }"
            >
              <template #item="{ element }">
                <div>
                  <div class="mt-3">
                    <course
                      :courseObj="element"
                      :compact="false"
                      :active="false"
                      :isReqCourse="true"
                      class="requirements-course"
                    />
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import { defineComponent } from 'vue';
import introJs from 'intro.js';
import featureFlagCheckers from '@/feature-flags';

import Course from '@/components/Course/Course.vue';
import Confirmation from '@/components/Modals/Confirmation.vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import RequirementDebugger from '@/components/Requirements/RequirementDebugger.vue';
import RequirementGroup from '@/components/Requirements/RequirementGroup.vue';
import DropDownArrow from '@/components/DropDownArrow.vue';
import MultiplePlansDropdown from './MultiplePlansDropdown.vue';
import CollectionsSideBar from '../Modals/CollectionsSideBar.vue';

import clipboard from '@/assets/images/clipboard.svg';
import warning from '@/assets/images/warning.svg';
import store from '@/store';
import {
  chooseToggleableRequirementOption,
  incrementUniqueID,
  editPlan,
  deletePlan,
  addPlan,
  updateSawNewFeature,
} from '@/global-firestore-data';
import AddPlanModal from '@/components/Modals/MultiplePlans/AddPlanModal.vue';
import CopyPlanModal from '../Modals/MultiplePlans/CopyPlanModal.vue';
import NamePlanModal from '../Modals/MultiplePlans/NamePlanModal.vue';
import EditPlanModal from '../Modals/MultiplePlans/EditPlanModal.vue';

export type ShowAllCourses = {
  readonly name: string;
  shownCourses: readonly FirestoreSemesterCourse[];
  readonly allCourses: readonly FirestoreSemesterCourse[];
};

type Data = {
  displayDebugger: boolean;
  displayedMajorIndex: number;
  displayedMinorIndex: number;
  numOfColleges: number;
  showAllCourses: ShowAllCourses;
  shouldShowAllCourses: boolean;
  showAllPage: number;
  tourStep: number;
  isAddPlanOpen: boolean;
  isCopyPlanOpen: boolean;
  isNamePlanOpen: boolean;
  isEditPlanOpen: boolean;
  isConfirmationOpen: boolean;
  selectedPlanCopy: string;
  confirmationText: string;
};

// This section will be revisited when we try to make first-time tooltips
const tour = introJs();
tour.setOptions({
  exitOnEsc: false,
  doneLabel: 'Next',
  nextLabel: 'Next',
  exitOnOverlayClick: false,
});

// show 24 courses per page of the see all menu
const maxSeeAllCoursesPerPage = 24;

export default defineComponent({
  components: {
    draggable,
    Course,
    Confirmation,
    DropDownArrow,
    RequirementDebugger,
    RequirementGroup,
    TeleportModal,
    MultiplePlansDropdown,
    AddPlanModal,
    CopyPlanModal,
    NamePlanModal,
    EditPlanModal,
    CollectionsSideBar,
  },
  props: {
    startTour: { type: Boolean, required: true },
    isDisplayingMobile: { type: Boolean, required: true },
    isMobile: { type: Boolean, required: true },
    isMinimized: { type: Boolean, required: true },
    startNewFeatureTour: { type: Boolean, required: true },
    isDisplayingCollection: { type: Boolean, required: true },
  },
  emits: ['showTourEndWindow', 'toggleMinimized'], // probably will remove emits with just using components
  data(): Data {
    return {
      displayDebugger: false,
      displayedMajorIndex: 0,
      displayedMinorIndex: 0,
      numOfColleges: 1,
      showAllCourses: { name: '', shownCourses: [], allCourses: [] },
      shouldShowAllCourses: false,
      showAllPage: 0,
      tourStep: 0,
      isAddPlanOpen: false,
      isCopyPlanOpen: false,
      isNamePlanOpen: false,
      isEditPlanOpen: false,
      isConfirmationOpen: false,
      selectedPlanCopy: '',
      confirmationText: '',
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
    startNewFeatureTour() {
      const newFeatureTour = introJs();
      newFeatureTour.setOptions({
        steps: [
          {
            element: '.multiple-plans',
            intro: `<div class="introjs-tooltipTop"><div class="introjs-customTitle">New Feature Alert</div></div>
          <div class = "introjs-bodytext">Create multiple plans for your 4 year plan to find the one best suited for you. Your journey, your way!</div>`,
          },
        ],
        doneLabel: 'Done',
      });
      // check firestore if the user has seen it already
      newFeatureTour.start();
      updateSawNewFeature(true);
    },
  },
  computed: {
    multiplePlansAllowed(): boolean {
      return featureFlagCheckers.isMultiplePlansEnabled();
    },
    debuggerAllowed(): boolean {
      return featureFlagCheckers.isRequirementDebuggerEnabled();
    },
    semesters(): readonly FirestoreSemester[] {
      return store.getters.getCurrentPlanSemesters;
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
    showToggleRequirementsBtn(): boolean {
      return !this.isMobile && featureFlagCheckers.isToggleRequirementsBarBtnEnabled();
    },
  },
  methods: {
    toggleAddPlan() {
      this.isAddPlanOpen = !this.isAddPlanOpen;
    },
    toggleCopyPlan() {
      this.isCopyPlanOpen = !this.isCopyPlanOpen;
    },
    toggleNamePlan() {
      this.isNamePlanOpen = !this.isNamePlanOpen;
    },
    toggleEditPlan() {
      this.isEditPlanOpen = !this.isEditPlanOpen;
    },
    toggleDebugger(): void {
      this.displayDebugger = !this.displayDebugger;
    },
    addPlan(name: string, copysem?: string) {
      if (copysem) {
        const { plans } = store.state;
        const copiedSems = plans.find(plan => plan.name === copysem)?.semesters;
        if (copiedSems !== undefined) {
          addPlan(name, [...copiedSems]);
        } else {
          addPlan(name, []);
        }
      } else {
        addPlan(name, []);
      }
      this.confirmationText = `${name} has been added!`;
      this.isConfirmationOpen = true;
      setTimeout(() => {
        this.isConfirmationOpen = false;
      }, 2000);
    },
    deletePlan(name: string) {
      deletePlan(name);
      this.confirmationText = `${name} has been deleted!`;
      this.isConfirmationOpen = true;
      setTimeout(() => {
        this.isConfirmationOpen = false;
      }, 2000);
    },
    editPlan(name: string, oldname: string) {
      const { plans } = store.state;
      const toEdit = plans.find(plan => plan.name === oldname);
      const updater = (plan: Plan): Plan => ({ name, semesters: plan.semesters });
      if (toEdit !== undefined) {
        editPlan(oldname, updater);
      }
      store.commit(
        'setCurrentPlan',
        store.state.plans.find(plan => plan.name === name)
      );
      store.commit('setOrderByNewest', store.state.orderByNewest);
      this.confirmationText = `${oldname} has been renamed to ${name}!`;
      this.isConfirmationOpen = true;
      setTimeout(() => {
        this.isConfirmationOpen = false;
      }, 2000);
    },
    copyPlan(selectedPlan: string) {
      this.selectedPlanCopy = selectedPlan;
    },

    // TODO CHANGE FOR MULTIPLE COLLEGES & GRAD PROGRAMS
    showMajorOrMinorRequirements(id: number, group: string): boolean {
      // colleges and programs should always be shown as there can only be 1
      if (group === 'College' || group === 'Grad') {
        return true;
      }
      // majors should be shown only if the id matches the index of the displayed major
      if (group === 'Major') {
        return id === this.displayedMajorIndex + this.numOfColleges;
      }
      // minors should be shown depending on index and number of college and majors selected
      return (
        id === this.displayedMinorIndex + this.numOfColleges + this.onboardingData.major.length
      );
    },
    chooseToggleableRequirementOption(requirementID: string, option: string): void {
      chooseToggleableRequirementOption(requirementID, option);
    },
    activateMajor(id: number) {
      this.displayedMajorIndex = id;
    },
    activateMinor(id: number) {
      this.displayedMinorIndex = id;
    },
    getRequirementsTooltipText() {
      return `<div class="introjs-tooltipTop"><div class="introjs-customTitle">Meet your Requirements Bar <img src="${clipboard}" class = "introjs-emoji introjs-emoji-text" alt="clipboard icon"/>
          </div><div class="introjs-customProgress">1/4</div></div><div class = "introjs-bodytext">Based on your school and major/minor, we’ve compiled your requirements and
          required courses.<br><img src="${warning}" class = "introjs-emoji-text" alt="warning icon"/> Some requirements
          aren’t fully tracked by us yet, so pay attention to the warnings.</div>`;
    },
    getCoursesTooltipText() {
      return `<div class="introjs-tooltipTop"><div class="introjs-customTitle">These are your Courses</div><div class="introjs-customProgress">2/4</div>
      </div><div class = "introjs-bodytext">Drag and drop courses into your schedule! Click on them to learn more information like their descriptions.</div>`;
    },
    onShowAllCourses(showAllCourses: {
      requirementName: string;
      subReqCoursesArray: readonly FirestoreSemesterCourse[];
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
    findPotentialSeeAllCourses(
      courses: readonly FirestoreSemesterCourse[]
    ): FirestoreSemesterCourse[] {
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
    toggleMinimized() {
      this.$emit('toggleMinimized');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.requirement-sidebar-header {
  display: flex;
  justify-content: flex-end;
}

@mixin requirement-sidebar-btn {
  color: #7b7d7e;
  background: white;
  font-size: 2rem;
  font-family: monospace;
  z-index: 1;

  &:hover {
    color: $yuxuanBlue;
    opacity: 1;
  }
}

.multiple-plans {
  height: 2.5rem;
}

.add-plan-button {
  float: right;
  background: $sangBlue;
  border-radius: 3px;
  min-height: 2.5rem;
  min-width: 6.5rem;
  color: $white;
  border: none;
  font-size: 16px;
}

// .collections-side-bar {
//   //  margin: 1.5rem 0 1rem 0;
// }

.requirement-sidebar-btn-open {
  @include requirement-sidebar-btn;
  position: fixed;
  top: 2rem;
  box-shadow: 2px 0px 10px 0px #dddddd;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.requirement-sidebar-btn-close {
  @include requirement-sidebar-btn;
  position: absolute;
  line-height: 2rem;
  top: auto;
  margin-top: 1rem;
}

.requirement-debugger-toggler {
  background: $medGray;
  color: white;
}
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
<style lang="scss">
.modal-content.requirement-debugger-modal-content {
  display: flex;
  align-items: center;
  background: white;
  padding: 2em;
  width: calc(100% - 10em);
  height: 100vh;
  overflow: scroll;
}
</style>

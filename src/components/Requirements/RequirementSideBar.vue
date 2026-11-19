<template v-if="semesters">
  <div>
    <button
      v-if="isMinimized && showToggleRequirementsBtn"
      class="requirement-sidebar-btn-open"
      @click="toggleMinimized"
      aria-label="Show requirements"
      title="Show requirements"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.33"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        style="transform: rotate(-90deg)"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
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
            <button
              class="requirement-debugger-toggler"
              v-if="debuggerAllowed"
              @click="toggleDebugger()"
            >
              Open Requirement Debugger
            </button>
            <confirmation :text="confirmationText" v-if="isConfirmationOpen" />
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
              <collections-side-bar
                @delete-course-from-collection="deleteCourseFromCollection"
                @open-edit-collection-modal="openEditCollectionModal"
              />
              <edit-collection-modal
                v-if="isEditCollectionOpen"
                @close-edit-modal="toggleEditCollection"
                @delete-collection="deleteCollection"
                @edit-collection="editCollection"
                :oldCollectionName="oldCollectionName"
              />
            </div>
            <div v-if="!isDisplayingCollection">
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
                <button
                  class="requirement-sidebar-btn-close"
                  @click="toggleMinimized"
                  aria-label="Hide requirements"
                  title="Hide requirements"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.33"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    style="transform: rotate(90deg)"
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </button>
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
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.33"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M10 4L6 8l4 4" />
              </svg>
            </span>
            <button class="btn back-button p-0" @click="backFromSeeAll">
              Back to requirements
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
                      :isSemesterCourseCard="true"
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
import MultiplePlansDropdown from './MultiplePlansDropdown.vue';
import CollectionsSideBar from '../Modals/CollectionsSideBar.vue';
import EditCollectionModal from '../Modals/EditCollectionModal.vue';

import clipboard from '@/assets/images/clipboard.svg';
import warning from '@/assets/images/warning.svg';
import store from '@/store';
import {
  chooseToggleableRequirementOption,
  incrementUniqueID,
  editPlan,
  deletePlan,
  addPlan,
  editCollection,
  editDefaultCollection,
  deleteCollection,
  deleteCourseFromCollection,
  deleteCourseFromAllCollections,
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
  isEditCollectionOpen: boolean;
  oldCollectionName: string;
  defaultCollectionName: string;
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
    RequirementDebugger,
    RequirementGroup,
    TeleportModal,
    MultiplePlansDropdown,
    AddPlanModal,
    CopyPlanModal,
    NamePlanModal,
    EditPlanModal,
    CollectionsSideBar,
    EditCollectionModal,
  },
  props: {
    startTour: { type: Boolean, required: true },
    isDisplayingMobile: { type: Boolean, required: true },
    isMobile: { type: Boolean, required: true },
    isMinimized: { type: Boolean, required: true },
    isDisplayingCollection: { type: Boolean, required: true },
    startMultiplePlansTour: { type: Boolean, required: true },
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
      isEditCollectionOpen: false,
      isConfirmationOpen: false,
      selectedPlanCopy: '',
      confirmationText: '',
      oldCollectionName: '',
      defaultCollectionName: 'All',
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
    startMultiplePlansTour() {
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
    toggleEditCollection() {
      this.isEditCollectionOpen = !this.isEditCollectionOpen;
      this.oldCollectionName = '';
    },
    toggleDebugger(): void {
      this.displayDebugger = !this.displayDebugger;
    },

    openEditCollectionModal(collection: string) {
      this.isEditCollectionOpen = true;
      this.oldCollectionName = collection;
    },
    deleteCourseFromCollection(collectionName: string, courseCode: string) {
      if (collectionName === this.defaultCollectionName) {
        deleteCourseFromAllCollections(courseCode);
      } else {
        deleteCourseFromCollection(collectionName, courseCode);
        editDefaultCollection();
      }
      this.confirmationText = `${courseCode} has been deleted from your collection!`;
      this.isConfirmationOpen = true;
      setTimeout(() => {
        this.isConfirmationOpen = false;
      }, 2000);
    },
    deleteCollection(collectionName: string) {
      deleteCollection(collectionName);
      editDefaultCollection();
      this.confirmationText = `${collectionName} has been deleted!`;
      this.isConfirmationOpen = true;
      setTimeout(() => {
        this.isConfirmationOpen = false;
      }, 2000);
    },
    editCollection(name: string, oldname: string) {
      const { savedCourses } = store.state;
      const toEdit = savedCourses.find(collection => collection.name === oldname);
      const updater = (collection: Collection): Collection => ({
        name,
        courses: collection.courses,
      });
      if (toEdit !== undefined) {
        editCollection(oldname, updater);
      }

      this.confirmationText = `${oldname} has been renamed to ${name}!`;
      this.isConfirmationOpen = true;
      setTimeout(() => {
        this.isConfirmationOpen = false;
      }, 2000);
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
@import '@/assets/scss/_tokens.scss';

// V2 requirements panel: white, 1px right border, 360px, DM Sans
.requirement-sidebar-header {
  display: flex;
  justify-content: flex-end;
  margin: -4px 0 4px;
}

@mixin requirement-sidebar-btn {
  @include cp-reset-button;
  width: 28px;
  height: 28px;
  border-radius: $cp-r-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $cp-muted;
  background: #fff;
  z-index: 1;

  &:hover {
    background: $cp-hover;
    color: $cp-ink;
  }

  &:active {
    background: $cp-press;
  }
}

.multiple-plans {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.multiple-plans-dropdown {
  flex: 1;
  min-width: 0;
}

.add-plan-button {
  @include cp-button-secondary;
  gap: 8px;
  padding-left: 12px;

  &::first-letter {
    color: $cp-muted;
  }
}

// collapsed: a slim tab on the left edge
.requirement-sidebar-btn-open {
  @include requirement-sidebar-btn;
  position: fixed;
  top: 16px;
  width: 32px;
  height: 40px;
  border: 1px solid $cp-line;
  border-left: none;
  border-radius: 0 $cp-r-lg $cp-r-lg 0;
  box-shadow: $cp-shadow-pop;
}

.requirement-sidebar-btn-close {
  @include requirement-sidebar-btn;
}

.requirement-debugger-toggler {
  @include cp-button-secondary(true);
  margin-bottom: 12px;
}

.requirements-wrapper {
  width: 100%;
  height: 100%;
}

.requirements,
.fixed {
  @include cp-font;
  z-index: 1;
  height: 100%;
  width: $cp-sidebar-width;
  background-color: #fff;
  color: $cp-ink;
}

.requirements {
  border-right: 1px solid $cp-line;
}

.fixed {
  position: fixed;
  top: 0;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid $cp-line;
}

.fixed,
.see-all-padding {
  padding: 16px;
}

.see-all-padding-y {
  padding: 16px 0;
}

.see-all-padding-x {
  padding: 0 16px;
}

.see-all-header {
  display: flex;
  align-items: center;
  gap: 4px;
  border-bottom: 1px solid $cp-line;
}

.see-all-pages {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.see-all-pageCount {
  @include cp-text(12px, 16px);
  color: $cp-muted;
}

.see-all-buttonWrapper {
  display: flex;
  gap: 8px;
}

.see-all-button {
  @include cp-button-secondary(true);

  &--disabled {
    background: #fff;
    border-color: $cp-disabled;
    color: $cp-disabled-ink;
  }
}

h1.title {
  @include cp-text(18px, 24px, 700);
  color: $cp-ink;
  margin: 0;
}

.req {
  @include cp-text(13px, 18px);
}

.back-button {
  @include cp-link(12px, 16px, 600);
}

.arrow-left {
  display: flex;
  color: $cp-link;
}

.requirements-course {
  width: 100%;
}

@media only screen and (max-width: $large-breakpoint) {
  .requirements,
  .fixed {
    width: 320px;
  }
}

@media only screen and (max-width: $medium-breakpoint) {
  .requirements {
    position: fixed;
    width: 100%;
    top: 4.5rem;
    border-right: none;
  }

  .fixed {
    top: 4.5rem;
    left: 0rem;
    width: 100%;
    height: calc(100vh - 4.5rem);
    border-right: none;
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

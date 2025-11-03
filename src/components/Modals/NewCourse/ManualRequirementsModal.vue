<template>
  <TeleportModal
    title="Distribution Requirements"
    content-class="content-manual-requirement"
    leftButtonText="Back"
    rightButtonText="Next"
    :rightButtonIsDisabled="false"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backToCourseModal"
    @right-button-clicked="saveRequirements"
  >
    <div class="requirements-form">
      <!-- Double Major Selection UI (only show if multiple majors) -->
      <div v-if="onboardingData.major.length > 1" class="major-selection">
        <div class="major-buttons">
          <button
            v-for="(major, id) in onboardingData.major"
            :key="id"
            :style="{
              'border-bottom':
                id === displayedMajorIndex
                  ? `2px solid #${getReqColor('Major', onboardingData)}`
                  : '',
            }"
            @click="activateMajor(id)"
            :class="[
              { 'full-opacity-on-hover': onboardingData.major.length === 1 },
              'major-title-button major-title',
            ]"
            :disabled="id === displayedMajorIndex"
          >
            <p
              :style="{
                'font-weight': id === displayedMajorIndex ? 500 : undefined,
                color: id === displayedMajorIndex ? `#${getReqColor('Major', onboardingData)}` : '',
              }"
              class="major-title-top"
            >
              {{ getMajorFullName(major) }}
            </p>
            <p
              :style="{
                color: id === displayedMajorIndex ? `#${getReqColor('Major', onboardingData)}` : '',
              }"
              class="major-title-bottom"
            >
              ({{ getCollegeFullName(onboardingData.college) }})
            </p>
          </button>
        </div>
      </div>
      <!-- College Requirements Section -->
      <div class="requirements-section">
        <div class="requirements-accordion" @click="toggleCollegeRequirements">
          <div class="requirements-accordion-header">
            <drop-down-arrow :isFlipped="showCollegeRequirements" :fillColor="chrisGreen" />
            <span class="titleCollege">View All College Requirements</span>
          </div>
        </div>
        <div class="separator-between-requirements"></div>
        <!-- College requirements expanded content -->
        <div v-if="showCollegeRequirements" class="expanded-content">
          <h3 class="section-heading">In-Depth College Requirements</h3>
          <div
            v-for="(req, index) in collegeRequirements"
            :key="`college-${index}`"
            class="requirement-item"
          >
            <!-- Dropdown Header -->
            <div
              class="requirements-accordion"
              :class="{ 'non-expandable': isGenericRequirement(req) }"
              @click="!isGenericRequirement(req) && toggleCollegeRequirement(index)"
            >
              <div class="requirements-accordion-header">
                <drop-down-arrow
                  v-if="!isGenericRequirement(req)"
                  :isFlipped="req.expanded"
                  :fillColor="dropdownGray"
                />
                <span class="requirement-name">{{ req.name }}</span>
                <span class="requirement-progress">{{ req.progress }}</span>
              </div>
              <!-- Checkboxes -->
              <div class="checkbox-container">
                <div class="squared-checkbox" :class="{ fulfilled: areAllCoursesFulfilled(req) }">
                  <input
                    type="checkbox"
                    :id="`college-req-${index}`"
                    v-model="req.selected"
                    :disabled="areAllCoursesFulfilled(req)"
                    @change="handleRequirementChange(req)"
                  />
                  <label :for="`college-req-${index}`"></label>
                </div>
              </div>
            </div>

            <!-- Expanded Content for a Requirement (only show for non-generic requirements) -->
            <div v-if="req.expanded && !isGenericRequirement(req)" class="expanded-content">
              <!-- Check if this is a generic requirement (like technical electives) -->
              <div v-if="isGenericRequirement(req)" class="generic-requirement">
                <p class="options-label">This requirement allows any qualifying course.</p>
                <p class="generic-info">
                  Select this requirement to fulfill it with your chosen course.
                </p>
              </div>
              <!-- Course Options for an Expanded Requirement (only show if NOT generic) -->
              <div v-else class="course-options">
                <p class="options-label">Please select one of the following.</p>
                <div
                  v-for="(slot, slotIndex) in requirementCourseOptions(req)"
                  :key="`slot-${index}-${slotIndex}`"
                  class="option-item"
                  :class="{ fulfilled: slot.fulfilled }"
                >
                  <span>{{ slot.name }}{{ slot.fulfilled ? ' (Already Fulfilled)' : '' }}</span>
                  <div class="checkbox-container">
                    <div class="squared-checkbox" :class="{ fulfilled: slot.fulfilled }">
                      <input
                        :id="`course-option-${index}-${slotIndex}`"
                        type="checkbox"
                        :value="slot.name"
                        v-model="slot.selected"
                        :disabled="slot.fulfilled"
                        @change="
                          handleRequirementCourseOptionChange(index, slot, collegeRequirements)
                        "
                      />
                      <label :for="`course-option-${index}-${slotIndex}`"></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Separator at bottom of college requirements expanded content -->
        <div v-if="showCollegeRequirements" class="expanded-content-separator"></div>
      </div>
      <!-- Major Requirements Section -->
      <div class="requirements-section">
        <div class="requirements-accordion" @click="toggleMajorRequirements">
          <div class="requirements-accordion-header">
            <drop-down-arrow :isFlipped="showMajorRequirements" :fillColor="emGreen" />
            <span class="titleMajor">View All Major Requirements</span>
          </div>
        </div>

        <!-- Major requirements expanded content -->
        <div v-if="showMajorRequirements" class="expanded-content">
          <h3 class="section-heading">In-Depth Major Requirements</h3>
          <div
            v-for="(req, index) in currentMajorRequirements"
            :key="`major-${index}`"
            class="requirement-item"
          >
            <!-- Dropdown Header -->
            <div
              class="requirements-accordion"
              :class="{ 'non-expandable': isGenericRequirement(req) }"
              @click="!isGenericRequirement(req) && toggleMajorRequirement(index)"
            >
              <div class="requirements-accordion-header">
                <drop-down-arrow
                  v-if="!isGenericRequirement(req)"
                  :isFlipped="req.expanded"
                  :fillColor="dropdownGray"
                />
                <span class="requirement-name">{{ req.name }}</span>
                <span class="requirement-progress">{{ req.progress }}</span>
              </div>
              <!-- Checkboxes -->
              <div class="checkbox-container">
                <div class="squared-checkbox" :class="{ fulfilled: areAllCoursesFulfilled(req) }">
                  <input
                    type="checkbox"
                    :id="`major-req-${index}`"
                    v-model="req.selected"
                    :disabled="areAllCoursesFulfilled(req)"
                    @change="handleRequirementChange(req)"
                  />
                  <label :for="`major-req-${index}`"></label>
                </div>
              </div>
            </div>

            <!-- Expanded Content for a Requirement (only show for non-generic requirements) -->
            <div v-if="req.expanded && !isGenericRequirement(req)" class="expanded-content">
              <!-- Check if this is a generic requirement (like technical electives) -->
              <div v-if="isGenericRequirement(req)" class="generic-requirement">
                <p class="options-label">This requirement allows any qualifying course.</p>
                <p class="generic-info">
                  Select this requirement to fulfill it with your chosen course.
                </p>
              </div>
              <!-- Course Options for an Expanded Requirement (only show if NOT generic) -->
              <div v-else class="course-options">
                <p class="options-label">Please select one of the following.</p>
                <div
                  v-for="(slot, slotIndex) in requirementCourseOptions(req)"
                  :key="`slot-${index}-${slotIndex}`"
                  class="option-item"
                  :class="{ fulfilled: slot.fulfilled }"
                >
                  <span>{{ slot.name }}{{ slot.fulfilled ? ' (Already Fulfilled)' : '' }}</span>
                  <div class="checkbox-container">
                    <div class="squared-checkbox" :class="{ fulfilled: slot.fulfilled }">
                      <input
                        :id="`course-option-${index}-${slotIndex}`"
                        type="checkbox"
                        :value="slot.name"
                        v-model="slot.selected"
                        :disabled="slot.fulfilled"
                        @change="
                          handleRequirementCourseOptionChange(index, slot, currentMajorRequirements)
                        "
                      />
                      <label :for="`course-option-${index}-${slotIndex}`"></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Separator at bottom of major requirements expanded content -->
        <div v-if="showMajorRequirements" class="expanded-content-separator"></div>
      </div>
    </div>
  </TeleportModal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import DropDownArrow from '@/components/DropDownArrow.vue';
import { getMatchedRequirementFulfillmentSpecification } from '@/requirements/requirement-frontend-utils';
import store from '@/store';
import { cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor } from '@/user-data-converter';
import { fullCoursesJson } from '@/assets/courses/typed-full-courses';
import { getCollegeFullName, getMajorFullName, getReqColor } from '@/utilities';

interface Requirement {
  name: string;
  progress: string;
  expanded: boolean;
  selected: boolean;
  completed: boolean;
  courses: CourseOption[];
  requirement: RequirementFulfillment;
}

// Type for the grouped requirement fulfillment report.
// Copied from RequirementFullfillmentSlots.vue
type CompletedSubReqCourseSlot = {
  readonly name: string;
  readonly isCompleted: true;
  readonly courses: readonly CourseTaken[];
};

// Type for the incomplete sub-requirement course slot.
// Copied from RequirementFulfillmentSlots.vue
type IncompleteSubReqCourseSlot = {
  readonly name: string;
  readonly isCompleted: false;
  readonly courses: readonly AppFirestoreSemesterCourseWithRequirementID[];
};

// Type for the sub-requirement course slot, which can be either completed or incomplete.
// Copied from RequirementFulfillmentSlots.vue
type SubReqCourseSlot = CompletedSubReqCourseSlot | IncompleteSubReqCourseSlot;

interface CourseOption {
  name: string;
  selected: boolean;
  fulfilled: boolean;
}

// A function copied from RequirementFulfillmentSlots.vue
const generateSubReqIncompleteCourses = (
  allTakenCourseIds: ReadonlySet<number>,
  eligibleCourseIds: readonly number[],
  requirementID: string
): readonly AppFirestoreSemesterCourseWithRequirementID[] => {
  const rosterCourses = eligibleCourseIds
    .filter(courseID => !allTakenCourseIds.has(courseID))
    .flatMap(courseID => fullCoursesJson[courseID] || []);
  const coursesWithDummyUniqueID = rosterCourses.map(rosterCourse =>
    cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor(
      rosterCourse,
      -1,
      store.state.subjectColors[rosterCourse.subject]
    )
  );
  return coursesWithDummyUniqueID.map(course => ({
    ...course,
    requirementID,
  }));
};

export default defineComponent({
  name: 'ManualRequirementsModal',
  components: { TeleportModal, DropDownArrow },
  props: {
    course: {
      type: Object as PropType<FirestoreSemesterBlankCourse>,
      required: true,
    },
  },
  emits: {
    'close-modal': () => true,
    'back-to-distribution-modal': () => true,
    'save-requirements': (
      course: FirestoreSemesterCourse,
      requirements: string[],
      choice: FirestoreCourseOptInOptOutChoices
    ) => typeof course === 'object' && Array.isArray(requirements) && typeof choice === 'object',
  },
  data() {
    return {
      dropdownGray: '#7b7d7e',
      chrisGreen: '#105351',
      emGreen: '#479B75',
      showCollegeRequirements: false,
      showMajorRequirements: false,
      majorRequirements: [] as Requirement[],
      collegeRequirements: [] as Requirement[],
      compoundRequirementChoice: '',
      requirementsLoaded: false, // Flag to check if requirements have been loaded
      displayedMajorIndex: 0, // Track which major is currently being displayed
    };
  },
  mounted() {
    if (!this.requirementsLoaded) {
      this.getAvailableMajorRequirements();
      this.getAvailableCollegeRequirements();
      this.requirementsLoaded = true;
    }
  },
  computed: {
    typedCourse(): FirestoreSemesterBlankCourse {
      return this.course as FirestoreSemesterBlankCourse;
    },
    groupedRequirementFulfillmentReports(): readonly GroupedRequirementFulfillmentReport[] {
      return store.state.groupedRequirementFulfillmentReport;
    },
    onboardingData(): AppOnboardingData {
      return store.state.onboardingData;
    },
    // Get requirements for the currently displayed major
    currentMajorRequirements(): Requirement[] {
      if (this.onboardingData.major.length <= 1) {
        return this.majorRequirements;
      }

      // Filter requirements for the specific major being displayed
      const currentMajor = this.onboardingData.major[this.displayedMajorIndex];
      return this.majorRequirements.filter(
        req => req.requirement.requirement.sourceSpecificName === currentMajor
      );
    },
  },
  methods: {
    // a debugging method to ensure requirementCourseSlots works
    onCompoundRequirementChoiceChange() {
      // Selected compound requirement choice
    },
    // Check if all courses in a requirement are already fulfilled
    areAllCoursesFulfilled(requirement: Requirement): boolean {
      return (
        requirement.courses.length > 0 && requirement.courses.every(course => course.fulfilled)
      );
    },
    // Check if this is a generic requirement (shows search bar instead of specific course options)
    isGenericRequirement(requirement: Requirement): boolean {
      if (!requirement.requirement || !requirement.requirement.requirement) {
        return false;
      }

      const req = requirement.requirement.requirement;

      // Generic requirement patterns:
      // 1. Fulfilled by credits (i.e: "Major-approved Elective(s)")
      if (requirement.requirement.fulfillment.fulfilledBy === 'credits') {
        return true;
      }

      // 2. Has a checker warning (like "CS Electives", "Technical Electives", etc.)
      if (req.checkerWarning) {
        return true;
      }

      // 3. Self-check requirements (like "Additional Science Course")
      if (requirement.requirement.fulfillment.fulfilledBy === 'self-check') {
        return true;
      }

      // 4. Legacy check: if courses array has generic "Course" name
      if (
        requirement.courses &&
        requirement.courses.length > 0 &&
        requirement.courses[0].name === 'Course'
      ) {
        return true;
      }

      return false;
    },
    closeCurrentModal() {
      this.$emit('close-modal');
    },
    backToCourseModal() {
      this.$emit('back-to-distribution-modal');
    },
    saveRequirements() {
      let selectedRequirements: string[] = [];
      let selectedCourseId: number | null = null;

      // Helper function to find a course ID from requirement slots
      const findCourseIdFromRequirement = (req: Requirement): number | null => {
        try {
          // For generic requirements, try to find a course that actually satisfies the checker
          if (this.isGenericRequirement(req)) {
            // Try to use the first available course ID from the full courses JSON as fallback
            const firstCourseId = Object.keys(fullCoursesJson)[0];
            return firstCourseId ? parseInt(firstCourseId, 10) : null;
          }

          // For specific course requirements, use the existing logic
          const slots = this.requirementCoursesSlots(req.requirement);

          // Look for incomplete slots that have courses available
          for (const slot of slots) {
            if (!slot.isCompleted && slot.courses && slot.courses.length > 0) {
              // Find the first course with a valid crseId
              const courseWithId = slot.courses.find(course => course.crseId && course.crseId > 0);
              if (courseWithId) {
                return courseWithId.crseId;
              }
            }
          }
        } catch (error) {
          // Error finding course ID from requirement
        }
        return null;
      };

      const collegeReqs = this.collegeRequirements
        .filter(req => req.selected && !req.completed) // Only include selected requirements that are not already completed
        .map(req => {
          // Try to get a course ID if we don't have one yet
          if (selectedCourseId === null) {
            selectedCourseId = findCourseIdFromRequirement(req);
          }

          // For generic requirements, just use the requirement name
          if (this.isGenericRequirement(req)) {
            return `${req.name} Requirements`;
          }

          const courseNames = req.courses
            .filter(course => course.selected)
            .map(course => course.name);
          return courseNames.length === 1
            ? `${req.name} Requirements (${courseNames[0]})` // If there's only one course that a user can pick then we include it in the description of the string
            : `${req.name} Requirements`;
        });

      // Add selected major requirements
      const majorReqs = this.currentMajorRequirements
        .filter(req => req.selected && !req.completed) // Only include selected requirements that are not already completed
        .map(req => {
          // Try to get a course ID if we don't have one yet
          if (selectedCourseId === null) {
            selectedCourseId = findCourseIdFromRequirement(req);
          }

          // For generic requirements, just use the requirement name
          if (this.isGenericRequirement(req)) {
            return `${req.name} Requirements`;
          }

          const courseNames = req.courses
            .filter(course => course.selected)
            .map(course => course.name);
          return courseNames.length === 1
            ? `${req.name} Requirements (${courseNames[0]})`
            : `${req.name} Requirements`;
        });

      // add selected college and major requirements
      selectedRequirements = [...collegeReqs, ...majorReqs];
      const randomCourseId = selectedCourseId || Math.floor(Math.random() * 100000) + 300000;
      // Get the requirement IDs that were selected to bypass checker validation
      const selectedRequirementIds = [
        ...this.collegeRequirements
          .filter(req => req.selected && !req.completed)
          .map(req => req.requirement.requirement.id),
        ...this.currentMajorRequirements
          .filter(req => req.selected && !req.completed)
          .map(req => req.requirement.requirement.id),
      ];

      const updatedCourse = {
        ...this.typedCourse,
        crseId: randomCourseId, // Use found course ID or generate random one
        requirements: selectedRequirements,
        requirementsFulfilled: selectedRequirements, // Similar to DistributionRequirementsModal
        semesters: this.typedCourse.semesters || [], // Ensure semesters array exists
        color: this.typedCourse.color || '32A0F2', // Ensure color exists
        uniqueID: this.typedCourse.uniqueID || -1, // Ensure uniqueID exists
      } as FirestoreSemesterBlankCourse;

      // Create arbitraryOptIn mapping for each selected requirement
      const arbitraryOptIn: { [requirementId: string]: string[] } = {};
      selectedRequirementIds.forEach(reqId => {
        // Get the requirement specification to find the correct slot names
        const allRequirements = [...this.currentMajorRequirements, ...this.collegeRequirements];
        const requirement = allRequirements.find(
          (req: Requirement) => req.requirement.requirement.id === reqId
        );
        if (requirement && requirement.requirement) {
          const spec = getMatchedRequirementFulfillmentSpecification(
            requirement.requirement.requirement,
            store.state.toggleableRequirementChoices
          );
          if (spec && spec.slotNames && spec.slotNames.length > 0) {
            // Use the first slot name for this requirement
            arbitraryOptIn[reqId] = [spec.slotNames[0]];
          } else {
            // Fallback to generic "Course" if no specific slot names
            arbitraryOptIn[reqId] = ['Course'];
          }
        } else {
          // Fallback if requirement not found
          arbitraryOptIn[reqId] = ['Course'];
        }
      });

      // Create choice structure to bypass checker validation for selected requirements
      const choice: FirestoreCourseOptInOptOutChoices = {
        optOut: [],
        acknowledgedCheckerWarningOptIn: selectedRequirementIds, // This bypasses checker validation
        arbitraryOptIn, // This actually makes the course fulfill the requirements
      };

      this.$emit('save-requirements', updatedCourse, selectedRequirements, choice);
    },

    // A copy of the function from RequirementSFulfillmentSlots.vue
    requirementCoursesSlots(requirementFulfillment: RequirementFulfillment): SubReqCourseSlot[] {
      try {
        if (!requirementFulfillment || !requirementFulfillment.requirement) {
          return [];
        }

        const requirementFulfillmentSpec = getMatchedRequirementFulfillmentSpecification(
          requirementFulfillment.requirement,
          { id: requirementFulfillment.requirement.id }
        );

        if (requirementFulfillmentSpec === null || !requirementFulfillmentSpec) {
          return [];
        }

        const appliedRequirementFulfillmentSpec =
          (requirementFulfillmentSpec.additionalRequirements || {})[
            this.compoundRequirementChoice
          ] || requirementFulfillmentSpec;

        const requirementFulfillmentEligibleCourses =
          appliedRequirementFulfillmentSpec.eligibleCourses;

        const matchedCourses = (
          (requirementFulfillment.fulfillment.additionalRequirements || {})[
            this.compoundRequirementChoice
          ] || requirementFulfillment.fulfillment
        ).dangerousCourses;

        const allTakenCourseIds: ReadonlySet<number> = new Set(
          matchedCourses.flat().map(course => course.courseId)
        );

        const slots: SubReqCourseSlot[] = [];

        if (appliedRequirementFulfillmentSpec.fulfilledBy === 'credits') {
          let slotID = 1;
          matchedCourses[0].forEach(completedCourse => {
            slots.push({ name: `Course ${slotID}`, isCompleted: true, courses: [completedCourse] });
            slotID += 1;
          });
          if (
            requirementFulfillment.fulfillment.safeMinCountFulfilled >=
              requirementFulfillment.fulfillment.minCountRequired ===
            false
          ) {
            slots.push({
              name: `Course ${slotID}`,
              isCompleted: false,
              courses: generateSubReqIncompleteCourses(
                allTakenCourseIds,
                requirementFulfillmentEligibleCourses[0],
                requirementFulfillment.requirement.id
              ),
            });
          }
        } else {
          matchedCourses.forEach((requirementFulfillmentCourseSlot, i) => {
            const slotMinCount = appliedRequirementFulfillmentSpec.perSlotMinCount[i];
            const slotName = appliedRequirementFulfillmentSpec.slotNames[i];
            let slotID = 1;
            for (let j = 0; j < slotMinCount; j += 1) {
              const name = slotMinCount === 1 ? slotName : `${slotName} ${slotID}`;
              slotID += 1;
              if (j < requirementFulfillmentCourseSlot.length) {
                slots.push({
                  name,
                  isCompleted: true,
                  courses: [requirementFulfillmentCourseSlot[j]],
                });
              } else {
                slots.push({
                  name,
                  isCompleted: false,
                  courses: generateSubReqIncompleteCourses(
                    allTakenCourseIds,
                    requirementFulfillmentEligibleCourses[i],
                    requirementFulfillment.requirement.id
                  ),
                });
              }
            }
          });
        }
        return slots;
      } catch (error) {
        return [];
      }
    },
    // A function to turn requirementCoursesSlots into a list of Course Optons
    requirementCourseOptions(requirementFulfillment: Requirement): CourseOption[] {
      return requirementFulfillment.courses;
    },
    getAvailableCoursesForRequirement(req: RequirementFulfillment): CourseOption[] {
      try {
        if (!req) return [];

        const slots = this.requirementCoursesSlots(req);
        const courseOptions: CourseOption[] = [];

        if (slots && Array.isArray(slots)) {
          slots.forEach(slot => {
            if (slot && slot.name) {
              courseOptions.push({
                name: slot.name,
                selected: slot.isCompleted, // Automatically select fulfilled slots
                fulfilled: slot.isCompleted, // Mark as fulfilled if already completed
              });
            }
          });
        }

        return courseOptions;
      } catch (error) {
        return [];
      }
    },
    getAvailableMajorRequirements() {
      try {
        // If there are multiple majors, only show requirements for the currently displayed major
        const currentMajor =
          this.onboardingData.major.length > 1
            ? this.onboardingData.major[this.displayedMajorIndex]
            : null;

        this.majorRequirements = this.groupedRequirementFulfillmentReports.reduce(
          (acc: Requirement[], req: GroupedRequirementFulfillmentReport) => {
            if (req && req.groupName === 'Major' && req.reqs && Array.isArray(req.reqs)) {
              req.reqs.forEach((subReq: RequirementFulfillment) => {
                if (subReq && subReq.requirement && subReq.fulfillment) {
                  // If we have multiple majors, filter by the current major
                  if (currentMajor && subReq.requirement.sourceSpecificName !== currentMajor) {
                    return; // Skip this requirement if it's not for the current major
                  }

                  const courseOptions = this.getAvailableCoursesForRequirement(subReq);
                  const isFulfilledByCourse = subReq.fulfillment.fulfilledBy === 'courses';
                  const courseOrCredit = isFulfilledByCourse ? 'courses' : 'credits';
                  const allCoursesFulfilled =
                    courseOptions.length > 0 && courseOptions.every(course => course.fulfilled);
                  acc.push({
                    name: subReq.requirement.name || 'Unknown Requirement',
                    progress: `${subReq.fulfillment.safeMinCountFulfilled || 0}/${
                      subReq.fulfillment.minCountRequired || 0
                    } ${courseOrCredit}`,
                    expanded: false,
                    selected: allCoursesFulfilled, // Auto-select if all courses are fulfilled
                    completed:
                      (subReq.fulfillment.safeMinCountFulfilled || 0) >=
                      (subReq.fulfillment.minCountRequired || 0),
                    courses: courseOptions,
                    requirement: subReq,
                  });
                }
              });
            }
            return acc;
          },
          [] as Requirement[]
        );
      } catch (error) {
        this.majorRequirements = [];
      }
    },
    getAvailableCollegeRequirements() {
      try {
        this.collegeRequirements = this.groupedRequirementFulfillmentReports.reduce(
          (acc: Requirement[], req: GroupedRequirementFulfillmentReport) => {
            if (req && req.groupName === 'College' && req.reqs && Array.isArray(req.reqs)) {
              req.reqs.forEach((subReq: RequirementFulfillment) => {
                if (subReq && subReq.requirement && subReq.fulfillment) {
                  const courseOptions = this.getAvailableCoursesForRequirement(subReq);
                  const isFulfilledByCourse = subReq.fulfillment.fulfilledBy === 'courses';
                  const courseOrCredit = isFulfilledByCourse ? 'courses' : 'credits';
                  const allCoursesFulfilled =
                    courseOptions.length > 0 && courseOptions.every(course => course.fulfilled);
                  acc.push({
                    name: subReq.requirement.name || 'Unknown Requirement',
                    progress: `${subReq.fulfillment.safeMinCountFulfilled || 0}/${
                      subReq.fulfillment.minCountRequired || 0
                    } ${courseOrCredit}`,
                    expanded: false,
                    selected: allCoursesFulfilled, // Auto-select if all courses are fulfilled
                    completed:
                      (subReq.fulfillment.safeMinCountFulfilled || 0) >=
                      (subReq.fulfillment.minCountRequired || 0),
                    courses: courseOptions,
                    requirement: subReq,
                  });
                }
              });
            }

            return acc;
          },
          [] as Requirement[]
        );
      } catch (error) {
        this.collegeRequirements = [];
      }
    },
    getSlotNames(subReq: RequirementFulfillment): readonly string[] | undefined {
      const requirement = subReq.requirement as RequirementFulfillmentInformation;

      if ('fulfilledBy' in requirement && requirement.fulfilledBy === 'courses') {
        const courseRequirement = requirement as RequirementFulfillmentInformationCourseBase<unknown>;
        return courseRequirement.slotNames;
      }
      // if slotNames cannot be found, return undefined. when called, we will just create empty string array []
      return undefined;
    },
    toggleCollegeRequirements() {
      this.showCollegeRequirements = !this.showCollegeRequirements;
      this.showMajorRequirements = false; // Close the other section
    },
    toggleMajorRequirements() {
      this.showMajorRequirements = !this.showMajorRequirements;
      this.showCollegeRequirements = false; // Close the other section
    },
    toggleCollegeRequirement(index: number) {
      this.collegeRequirements[index].expanded = !this.collegeRequirements[index].expanded;
    },
    toggleMajorRequirement(index: number) {
      this.currentMajorRequirements[index].expanded = !this.currentMajorRequirements[index]
        .expanded;
    },
    handleRequirementChange(requirement: Requirement) {
      if (requirement.selected) {
        // For generic requirements, don't expand and automatically select the single course option
        if (this.isGenericRequirement(requirement)) {
          requirement.expanded = false; // Keep it collapsed
          requirement.courses[0].selected = true;
        } else {
          requirement.expanded = true;
          const hasSelectedCourse = requirement.courses.some(course => course.selected);
          if (!hasSelectedCourse) {
            // If no course options are selected, select the first non-fulfilled one by default
            const firstNonFulfilled = requirement.courses.find(course => !course.fulfilled);
            if (firstNonFulfilled) {
              firstNonFulfilled.selected = true;
            }
          }
        }
      } else {
        // If deselected, ensure all non-fulfilled course options are also deselected
        requirement.courses.forEach(course => {
          if (!course.fulfilled) {
            course.selected = false;
          }
        });
        requirement.expanded = false;
      }
    },
    handleRequirementCourseOptionChange(
      requirementIndex: number,
      courseOption: CourseOption,
      requirements: Requirement[]
    ) {
      // Don't process change events for fulfilled courses
      if (courseOption.fulfilled) {
        return;
      }
      const requirement = requirements[requirementIndex];

      if (courseOption.selected) {
        // If a course option is selected, ensure the requirement is selected
        requirement.selected = true;
      } else {
        // Check if any course options are selected (including fulfilled ones)
        const hasSelectedCourse = requirement.courses.some(
          course => course.selected && !course.fulfilled
        );
        if (!hasSelectedCourse) {
          requirement.selected = false;
        }
      }
    },
    // Method to activate a specific major (similar to RequirementHeader.vue)
    activateMajor(majorIndex: number) {
      this.displayedMajorIndex = majorIndex;
      // Reload major requirements for the new major
      this.getAvailableMajorRequirements();
    },
    // Helper methods from RequirementHeader.vue
    getMajorFullName,
    getCollegeFullName,
    getReqColor,
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.requirements-form {
  display: flex;
  flex-direction: column;
  // padding: 16px 0;
  max-height: 60vh;
  overflow-y: auto;
  gap: 0.8rem;
}

.section-heading {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 16px 0;
}

.separator-between-requirements {
  margin-top: 16px;
  height: 2px;
  background-color: #e0e0e0;
}

.expanded-content-separator {
  height: 2px;
  background-color: #e0e0e0;
  margin-top: 16px;
  margin-bottom: 16px;
}

.requirements-accordion {
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;

  &.non-expandable {
    cursor: default;
  }
}

.requirements-accordion-header {
  display: flex;
  align-items: center;
  flex: 1;
}
.non-expandable .requirements-accordion-header {
  padding-left: 15px;
}

.titleCollege,
.titleMajor {
  font-size: 15px;
  font-weight: 500;
  margin-left: 10px;
}

.titleCollege {
  color: $chrisGreen;
}

.titleMajor {
  color: $emGreen;
}

.requirement-item {
  display: flex;
  flex-direction: column;
  // align-items: center;
  padding: 2px 0;
}

.requirement-name {
  flex: 1;
  font-size: 14px;
  color: #555;
  margin-left: 10px;
}

.requirement-progress {
  font-size: 14px;
  color: #777;
  margin-right: 16px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 30px;
}

/* Squared checkbox styling */
.squared-checkbox {
  position: relative;
  width: 16px;
  height: 16px;
  border-width: 4px;
}

.squared-checkbox input {
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  margin: 0;
  cursor: pointer;
}

.squared-checkbox label {
  position: absolute;
  left: 0;
  top: 0;
  width: 16px;
  height: 16px;
  background: #fff;
  border: 2px solid $emGreen;
  border-radius: 2px;
  cursor: pointer;
}

.squared-checkbox input:checked + label {
  background: $emGreen;
  border-color: $emGreen;
}

.squared-checkbox input:checked + label:after {
  content: '';
  position: absolute;
  top: 1.5px;
  left: 4px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.squared-checkbox.fulfilled {
  opacity: 0.7;

  input {
    cursor: not-allowed;
  }

  label {
    cursor: not-allowed;
    background: #f0f0f0;
    border: 2px solid #ccc;
  }

  input:checked + label {
    background: #ccc;
    border: 2px solid #ccc;
  }

  input:checked + label:after {
    border: solid #666;
    border-width: 0 2px 2px 0;
  }
}

.options-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 15px;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  margin-right: 9rem;
  padding-left: 0;

  span {
    font-size: 14px;
    color: #555;
    flex: 1;
  }

  .checkbox-container {
    padding-right: 20px;
    justify-content: flex-end;
  }

  &.fulfilled {
    opacity: 0.8;

    span {
      color: #888;
      font-style: italic;
    }
  }
}

.expanded-content {
  margin-top: 8px;
  padding-right: 2rem;
}

.content-manual-requirement {
  padding: 16px 24px;
  width: 30rem;
  max-width: 100%;
}

/* Major Selection Styles (inspired by RequirementHeader.vue) */
.major-selection {
  .major-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 0.4rem;
  }
}

.major-title {
  width: auto;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  text-align: center;
  color: $lightPlaceholderGray;
  padding-bottom: 6px;

  &-button {
    border: none;
    background: none;
    text-align: center;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 4px;
    transition: all 0.2s ease;

    p {
      flex-direction: column;
      margin: 0;
    }

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }

    &:disabled {
      cursor: default;
    }
  }

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
    margin: 0;
  }
}

.full-opacity-on-hover:hover {
  opacity: 1;
}
</style>

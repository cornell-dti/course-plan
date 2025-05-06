<template>
  <TeleportModal
    title="Distribution Requirements"
    content-class="content-course"
    leftButtonText="Back"
    rightButtonText="Next"
    :rightButtonIsDisabled="false"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backToCourseModal"
    @right-button-clicked="saveRequirements"
    :titleBold="true"
    class="requirements-modal"
  >
    <div class="requirements-form">
      <!-- College Requirements Section -->
      <div class="requirements-section">
        <div class="requirements-accordion" @click="toggleCollegeRequirements">
          <div class="requirements-accordion-header">
            <drop-down-arrow :isFlipped="showCollegeRequirements" :fillColor="emGreen" />
            <span class="title">College Requirements</span>
          </div>
        </div>

        <!-- College requirements expanded content -->
        <div v-if="showCollegeRequirements" class="expanded-content">
          <h3 class="section-heading">In-Depth College Requirements</h3>
          <div
            v-for="(req, index) in collegeRequirements"
            :key="`college-${index}`"
            class="requirement-item"
          >
            <!-- Dropdown Header -->
            <div class="requirements-accordion" @click="toggleCollegeRequirement(index)">
              <div class="requirements-accordion-header">
                <drop-down-arrow :isFlipped="req.expanded" :fillColor="emGreen" />
                <span class="requirement-name">{{ req.name }}</span>
                <span class="requirement-progress">{{ req.progress }}</span>
              </div>
              <!-- Checkboxes -->
              <div class="checkbox-container">
                <div class="squared-checkbox">
                  <input
                    type="checkbox"
                    :id="`college-req-${index}`"
                    v-model="req.selected"
                    @change="handleRequirementChange(req)"
                  />
                  <label :for="`college-req-${index}`"></label>
                </div>
              </div>
            </div>

            <!-- Expanded Content for a Requirement -->
            <div v-if="req.expanded" class="expanded-content">
              <!-- Course Options for an Expanded Requirement -->
              <div class="course-options">
                <p class="options-label">Please select one of the following.</p>
                <div
                  v-for="(slot, slotIndex) in requirementCourseOptions(req)"
                  :key="`slot-${index}-${slotIndex}`"
                  class="option-item"
                >
                  <span>{{ slot.name }}</span>
                  <div class="checkbox-container">
                    <div class="squared-checkbox">
                      <input
                        :id="`course-option-${index}-${slotIndex}`"
                        type="checkbox"
                        :value="slot.name"
                        v-model="slot.selected"
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
      </div>
      <div class="separator"></div>
      <!-- Major Requirements Section -->
      <div class="requirements-section">
        <div class="requirements-accordion" @click="toggleMajorRequirements">
          <div class="requirements-accordion-header">
            <drop-down-arrow :isFlipped="showMajorRequirements" :fillColor="emGreen" />
            <span class="title">Major Requirements</span>
          </div>
        </div>

        <!-- Major requirements expanded content -->
        <div v-if="showMajorRequirements" class="expanded-content">
          <h3 class="section-heading">In-Depth Major Requirements</h3>

          <div
            v-for="(req, index) in majorRequirements"
            :key="`major-${index}`"
            class="requirement-item"
          >
            <!-- Dropdown Header -->
            <div class="requirements-accordion" @click="toggleMajorRequirement(index)">
              <div class="requirements-accordion-header">
                <drop-down-arrow :isFlipped="req.expanded" :fillColor="emGreen" />
                <span class="requirement-name">{{ req.name }}</span>
                <span class="requirement-progress">{{ req.progress }}</span>
              </div>
              <!-- Checkboxes -->
              <div class="checkbox-container">
                <div class="squared-checkbox">
                  <input
                    type="checkbox"
                    :id="`major-req-${index}`"
                    v-model="req.selected"
                    @change="handleRequirementChange(req)"
                  />
                  <label :for="`major-req-${index}`"></label>
                </div>
              </div>
            </div>

            <!-- Expanded Content for a Requirement -->
            <div v-if="req.expanded" class="expanded-content">
              <!-- Course Options for an Expanded Requirement -->
              <div class="course-options">
                <p class="options-label">Please select one of the following.</p>
                <div
                  v-for="(slot, slotIndex) in requirementCourseOptions(req)"
                  :key="`slot-${index}-${slotIndex}`"
                  class="option-item"
                >
                  <span>{{ slot.name }}</span>
                  <div class="checkbox-container">
                    <div class="squared-checkbox">
                      <input
                        :id="`course-option-${index}-${slotIndex}`"
                        type="checkbox"
                        :value="slot.name"
                        v-model="slot.selected"
                        @change="
                          handleRequirementCourseOptionChange(index, slot, majorRequirements)
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
      </div>
    </div>
    <!-- That's alot of divs... -->
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

interface Requirement {
  name: string;
  progress: string;
  expanded: boolean;
  selected: boolean;
  completed: boolean;
  courses: CourseOption[]; // TODO delete when code is condensed
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
    'back-to-course-modal': () => true,
    'save-requirements': (course: FirestoreSemesterCourse, requirements: string[]) =>
      typeof course === 'object' && Array.isArray(requirements),
  },
  data() {
    return {
      emGreen: '#479B75',
      showCollegeRequirements: false,
      showMajorRequirements: false,
      majorRequirements: [] as Requirement[],
      collegeRequirements: [] as Requirement[],
      compoundRequirementChoice: '',
      requirementsLoaded: false, // Flag to check if requirements have been loaded
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
    groupedRequirementFulfillmentReports(): readonly GroupedRequirementFulfillmentReport[] {
      return store.state.groupedRequirementFulfillmentReport;
    },
  },
  methods: {
    // a debugging method to ensure requirementCourseSlots works
    onCompoundRequirementChoiceChange() {
      console.log('Selected compound requirement choice:', this.compoundRequirementChoice);
    },
    closeCurrentModal() {
      this.$emit('close-modal');
    },
    backToCourseModal() {
      this.$emit('back-to-course-modal');
    },
    saveRequirements() {
      let selectedRequirements: string[] = [];

      const collegeReqs = this.collegeRequirements
        .filter(req => req.selected)
        .map(req => {
          const courseNames = req.courses
            .filter(course => course.selected)
            .map(course => course.name);
          return courseNames.length === 1
            ? `${req.name} Requirements (${courseNames[0]})` // If there's only one course that a user can pick then we include it in the description of the string
            : `${req.name} Requirements`;
        });

      // Add selected major requirements
      const majorReqs = this.majorRequirements
        .filter(req => req.selected)
        .map(req => {
          const courseNames = req.courses
            .filter(course => course.selected)
            .map(course => course.name);
          return courseNames.length === 1
            ? `${req.name} Requirements (${courseNames[0]})`
            : `${req.name} Requirements`;
        });
      selectedRequirements = [...collegeReqs, ...majorReqs];

      const updatedCourse = {
        ...this.course,
        requirements: selectedRequirements,
      } as FirestoreSemesterBlankCourse;

      this.$emit('save-requirements', updatedCourse, selectedRequirements);
    },

    // A copy of the function from RequirementSFulfillmentSlots.vue
    requirementCoursesSlots(requirementFulfillment: RequirementFulfillment): SubReqCourseSlot[] {
      const requirementFulfillmentSpec = getMatchedRequirementFulfillmentSpecification(
        requirementFulfillment.requirement,
        { id: requirementFulfillment.requirement.id }
      );

      if (requirementFulfillmentSpec === null) return [];

      if (!requirementFulfillmentSpec) return [];

      const appliedRequirementFulfillmentSpec =
        (requirementFulfillmentSpec.additionalRequirements || {})[this.compoundRequirementChoice] ||
        requirementFulfillmentSpec;

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
    },
    // A function to turn requirementCoursesSlots into a list of Course Optons
    requirementCourseOptions(requirementFulfillment: Requirement): CourseOption[] {
      return requirementFulfillment.courses;
    },
    getAvailableCoursesForRequirement(req: RequirementFulfillment): CourseOption[] {
      const slots = this.requirementCoursesSlots(req);
      const courseOptions: CourseOption[] = [];
      slots.forEach(slot => {
        courseOptions.push({
          name: slot.name,
          selected: false, // NOTE: if you want completed
          // courses to be selected at default, then you can write
          // slot.isCompleted here instead
        });
      });
      return courseOptions;
    },
    getAvailableMajorRequirements() {
      this.majorRequirements = this.groupedRequirementFulfillmentReports.reduce(
        (acc: Requirement[], req: GroupedRequirementFulfillmentReport) => {
          if (req.groupName === 'Major') {
            req.reqs.forEach((subReq: RequirementFulfillment) => {
              const courseOptions = this.getAvailableCoursesForRequirement(subReq);
              const isFulfilledByCourse = subReq.fulfillment.fulfilledBy === 'courses';
              const courseOrCredit = isFulfilledByCourse ? 'courses' : 'credits';
              acc.push({
                name: subReq.requirement.name,
                progress: `${subReq.fulfillment.safeMinCountFulfilled}/${subReq.fulfillment.minCountRequired} ${courseOrCredit}`,
                expanded: false,
                selected: false,
                completed:
                  subReq.fulfillment.safeMinCountFulfilled >= subReq.fulfillment.minCountRequired,
                courses: courseOptions,
                requirement: subReq,
              });
            });
          }
          console.log('acc for major requirements', acc);

          return acc;
        },
        [] as Requirement[]
      );
    },
    getAvailableCollegeRequirements() {
      this.collegeRequirements = this.groupedRequirementFulfillmentReports.reduce(
        (acc: Requirement[], req: GroupedRequirementFulfillmentReport) => {
          if (req.groupName === 'College') {
            req.reqs.forEach((subReq: RequirementFulfillment) => {
              const courseOptions = this.getAvailableCoursesForRequirement(subReq);
              const isFulfilledByCourse = subReq.fulfillment.fulfilledBy === 'courses';
              const courseOrCredit = isFulfilledByCourse ? 'courses' : 'credits';
              acc.push({
                name: subReq.requirement.name,
                progress: `${subReq.fulfillment.safeMinCountFulfilled}/${subReq.fulfillment.minCountRequired} ${courseOrCredit}`,
                expanded: false,
                selected: false,
                completed:
                  subReq.fulfillment.safeMinCountFulfilled >= subReq.fulfillment.minCountRequired,
                courses: courseOptions,
                requirement: subReq,
              });
            });
          }
          console.log('acc for college requirements', acc);

          return acc;
        },
        [] as Requirement[]
      );
    },
    getSlotNames(subReq: RequirementFulfillment): readonly string[] | undefined {
      const requirement = subReq.requirement as RequirementFulfillmentInformation;

      if ('fulfilledBy' in requirement && requirement.fulfilledBy === 'courses') {
        const courseRequirement = requirement as RequirementFulfillmentInformationCourseBase<unknown>;
        console.log(
          'courseRequiremnt and slot names',
          courseRequirement,
          courseRequirement.slotNames
        );
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
      this.majorRequirements[index].expanded = !this.majorRequirements[index].expanded;
    },
    handleRequirementChange(requirement: Requirement) {
      if (requirement.selected) {
        requirement.expanded = true;
        const hasSelectedCourse = requirement.courses.some(course => course.selected);
        if (!hasSelectedCourse) {
          // If no course options are selected, select the first one by default
          requirement.courses[0].selected = true;
        }
      } else {
        // If deselected, ensure all course options are also deselected
        requirement.courses.forEach(course => {
          course.selected = false;
        });
        requirement.expanded = false;
      }
    },
    handleRequirementCourseOptionChange(
      requirementIndex: number,
      courseOption: CourseOption,
      requirements: Requirement[]
    ) {
      const requirement = requirements[requirementIndex];

      if (courseOption.selected) {
        // If a course option is selected, ensure the requirement is selected
        requirement.selected = true;
      } else {
        // If no course options are selected, deselect the requirement
        const hasSelectedCourse = requirement.courses.some(course => course.selected);
        if (!hasSelectedCourse) {
          requirement.selected = false;
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

.requirements-form {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
}

.requirements-section {
  margin-bottom: 16px;
}

.section-heading {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.separator {
  height: 1px;
  background-color: #e0e0e0;
  margin: 16px 0;
}

.requirements-accordion {
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
}

.requirements-accordion-header {
  display: flex;
  align-items: center;
  flex: 1;
  min-height: 38px;
}

.title {
  font-size: 15px;
  color: $emGreen;
  font-weight: 500;
  margin-left: 10px;
}

.requirement-item {
  display: flex;
  flex-direction: column;
  // align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
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
  border: 1px solid $emGreen;
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
  top: 1px;
  left: 5px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.course-options {
  padding: 10px 0 20px 0;
  margin-left: 30px;
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
  margin-bottom: 20px;
  padding-left: 0;

  span {
    font-size: 14px;
    color: #555;
  }

  .checkbox-container {
    padding-right: 20px;
    justify-content: flex-end;
  }
}

.expanded-content {
  margin-top: 8px;
}

:deep(.content-course) {
  padding: 16px 24px;
  width: 520px;
  max-width: 100%;
}

:deep(.modal-top) {
  padding-left: 4px;
  padding-right: 4px;
}

:deep(.modal-top h1) {
  font-size: 22px;
  font-weight: 600;
  margin-top: 4px;
  margin-bottom: 18px;
}
</style>

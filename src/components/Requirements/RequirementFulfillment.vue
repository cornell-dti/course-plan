<template>
  <div>
    <requirement-display-toggle
      :requirementFulfillment="requirementFulfillment"
      :isCompleted="isCompleted"
      :displayDescription="displayDescription"
      @on-toggle="toggleDescription()"
    />
    <div v-if="displayDescription" class="description">
      <requirement-information :requirement="requirementFulfillment.requirement" :color="color" />
      <div v-if="requirementFulfillment.requirement.fulfilledBy === 'toggleable'">
        <div class="toggleable-requirements-select-wrapper">
          <div
            class="toggleable-requirements-select toggleable-requirements-input"
            v-click-outside="closeMenuIfOpen"
          >
            <div
              class="toggleable-requirements-dropdown-placeholder toggleable-requirements-dropdown-wrapper"
              @click="showFulfillmentOptionsDropdown = !showFulfillmentOptionsDropdown"
            >
              <span>{{ selectedFulfillmentOption }}</span>
            </div>
            <div
              class="toggleable-requirements-dropdown-placeholder toggleable-requirements-dropdown-arrow"
            ></div>
          </div>
          <div
            class="toggleable-requirements-dropdown-content"
            v-if="showFulfillmentOptionsDropdown"
          >
            <div
              v-for="optionName in Object.keys(
                requirementFulfillment.requirement.fulfillmentOptions
              )"
              :key="optionName"
              class="toggleable-requirements-dropdown-content-item"
              @click="chooseFulfillmentOption(optionName)"
            >
              <span>{{ optionName }}</span>
            </div>
          </div>
          {{
            requirementFulfillment.requirement.fulfillmentOptions[selectedFulfillmentOption]
              .description
          }}
        </div>
      </div>
      <div
        v-if="
          displayDescription &&
          requirementFulfillment.requirement.fulfilledBy !== 'self-check' &&
          requirementFulfillment.requirement.checkerWarning == null
        "
        class="subreqcourse-wrapper"
      >
        <div v-for="(requirementFulfillmentCourseSlot, id) in requirementCoursesSlots" :key="id">
          <div
            v-if="requirementFulfillmentCourseSlot.isCompleted"
            class="completedsubreqcourse-wrapper"
          >
            <completed-sub-req-course
              :slotName="requirementFulfillmentCourseSlot.name"
              :courseTaken="requirementFulfillmentCourseSlot.courses[0]"
              @modal-open="modalToggled"
            />
          </div>
          <div
            v-if="!requirementFulfillmentCourseSlot.isCompleted"
            class="incompletesubreqcourse-wrapper"
          >
            <incomplete-sub-req-course
              :subReq="requirementFulfillment"
              :slotName="requirementFulfillmentCourseSlot.name"
              :courses="requirementFulfillmentCourseSlot.courses.slice(0, 4)"
              :displayDescription="displayDescription"
              :showSeeAllLabel="requirementFulfillmentCourseSlot.courses.length > 4"
              @onShowAllCourses="onShowAllCourses(id)"
            />
          </div>
        </div>
      </div>
      <div
        v-if="
          displayDescription &&
          (requirementFulfillment.requirement.fulfilledBy === 'self-check' ||
            requirementFulfillment.requirement.checkerWarning != null)
        "
        class="subreqcourse-wrapper"
      >
        <div v-for="(selfCheckCourse, id) in fulfilledSelfCheckCourses" :key="id">
          <completed-sub-req-course
            :slotName="`Course ${id + 1}`"
            :courseTaken="selfCheckCourse"
            @modal-open="modalToggled"
          />
        </div>
        <div v-if="!isCompleted">
          <incomplete-self-check
            :subReqId="requirementFulfillment.requirement.id"
            :subReqName="requirementFulfillment.requirement.name"
            :subReqFulfillment="requirementFulfillment.fulfilledBy"
            :subReqCourseId="requirementFulfillment.minCountFulfilled"
            @modal-open="modalToggled"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import CompletedSubReqCourse from '@/components/Requirements/CompletedSubReqCourse.vue';
import IncompleteSubReqCourse from '@/components/Requirements/IncompleteSubReqCourse.vue';
import IncompleteSelfCheck from '@/components/Requirements/IncompleteSelfCheck.vue';
import RequirementDisplayToggle from '@/components/Requirements/RequirementDisplayToggle.vue';
import RequirementInformation from '@/components/Requirements/RequirementInformation.vue';

import store from '@/store';
import { clickOutside } from '@/utilities';
import {
  convertFirestoreSemesterCourseToCourseTaken,
  getMatchedRequirementFulfillmentSpecification,
  courseIsAPIB,
} from '@/requirements/requirement-frontend-utils';
import { cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor } from '@/user-data-converter';
import { fullCoursesJson } from '@/assets/courses/typed-full-courses';

type CompletedSubReqCourseSlot = {
  readonly name: string;
  readonly isCompleted: true;
  readonly courses: readonly CourseTaken[];
};

type IncompleteSubReqCourseSlot = {
  readonly name: string;
  readonly isCompleted: false;
  readonly courses: readonly AppFirestoreSemesterCourseWithRequirementID[];
};

export type SubReqCourseSlot = CompletedSubReqCourseSlot | IncompleteSubReqCourseSlot;

type Data = {
  showFulfillmentOptionsDropdown: boolean;
  showDescription: boolean;
};

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
  components: {
    CompletedSubReqCourse,
    IncompleteSubReqCourse,
    IncompleteSelfCheck,
    RequirementDisplayToggle,
    RequirementInformation,
  },
  props: {
    requirementFulfillment: {
      type: Object as PropType<RequirementFulfillment>,
      required: true,
    },
    isCompleted: { type: Boolean, required: true },
    toggleableRequirementChoice: { type: String, default: null },
    color: { type: String, required: true },
    tourStep: { type: Number, required: true },
  },
  emits: {
    'modal-open': (open: boolean) => typeof open === 'boolean',
    changeToggleableRequirementChoice(id: string, option: string) {
      return typeof id === 'string' && typeof option === 'string';
    },
    onShowAllCourses(courses: {
      requirementName: string;
      subReqCoursesArray: readonly FirestoreSemesterCourse[];
    }) {
      return typeof courses === 'object';
    },
  },
  data(): Data {
    return {
      showFulfillmentOptionsDropdown: false,
      showDescription: false,
    };
  },
  computed: {
    displayDescription(): boolean {
      return this.showDescription || this.shouldShowWalkthrough;
    },
    // true if the walkthrough is on step 2 and this subreq represents the PE requirement
    shouldShowWalkthrough(): boolean {
      return (
        this.tourStep === 1 &&
        this.requirementFulfillment.requirement.id === 'College-UNI-Physical Education'
      );
    },
    selectedFulfillmentOption(): string {
      if (this.requirementFulfillment.requirement.fulfilledBy !== 'toggleable') {
        return '';
      }
      return (
        this.toggleableRequirementChoice ||
        Object.keys(this.requirementFulfillment.requirement.fulfillmentOptions)[0]
      );
    },
    /**
     * A list of "slots" for a requirement's fulfillment courses, completed or incomplete.
     * Note that it is different from the concept of slot in `perSlotMinCount`.
     * In `perSlotMinCount`, each slot can hold multiple courses, but here, each slot can only hold
     * one course at a time. If `perSlotMinCount`'s slot i has minCount x, then x corresponding slots
     * will be generated here.
     */
    requirementCoursesSlots(): SubReqCourseSlot[] {
      const requirementFulfillmentSpec = getMatchedRequirementFulfillmentSpecification(
        this.requirementFulfillment.requirement,
        {
          [this.requirementFulfillment.requirement.id]: this.toggleableRequirementChoice,
        }
      );
      if (requirementFulfillmentSpec === null) return [];
      const requirementFulfillmentEligibleCourses = requirementFulfillmentSpec.eligibleCourses;

      const allTakenCourseIds: ReadonlySet<number> = new Set(
        this.requirementFulfillment.courses.flat().map(course => course.courseId)
      );
      const slots: SubReqCourseSlot[] = [];

      if (requirementFulfillmentSpec.fulfilledBy === 'credits') {
        let slotID = 1;
        this.requirementFulfillment.courses[0].forEach(completedCourse => {
          slots.push({ name: `Course ${slotID}`, isCompleted: true, courses: [completedCourse] });
          slotID += 1;
        });
        if (!this.isCompleted) {
          slots.push({
            name: `Course ${slotID}`,
            isCompleted: false,
            courses: generateSubReqIncompleteCourses(
              allTakenCourseIds,
              requirementFulfillmentEligibleCourses[0],
              this.requirementFulfillment.requirement.id
            ),
          });
        }
      } else {
        this.requirementFulfillment.courses.forEach((requirementFulfillmentCourseSlot, i) => {
          const slotMinCount = requirementFulfillmentSpec.perSlotMinCount[i];
          const slotName = requirementFulfillmentSpec.slotNames[i];
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
                  this.requirementFulfillment.requirement.id
                ),
              });
            }
          }
        });
      }

      return slots;
    },
    fulfilledSelfCheckCourses(): readonly CourseTaken[] {
      // selectedCourses are courses that fulfill the requirement based on user-choice
      // they are taken from derivedSelectableRequirementData
      const selectedFirestoreCourses =
        store.state.derivedSelectableRequirementData.requirementToCoursesMap[
          this.requirementFulfillment.requirement.id
        ];
      const selectedCourses = selectedFirestoreCourses
        ? selectedFirestoreCourses.map((course: FirestoreSemesterCourse) =>
            this.convertCourse(course)
          )
        : [];

      // fulfillableCourses are the courses that can fulfill this requirement
      // this is necessary to compute because ap/ib data is not stored in selectable requirement choices collection
      let fulfillableCourses: CourseTaken[] = [];
      const requirementFulfillmentSpec = getMatchedRequirementFulfillmentSpecification(
        this.requirementFulfillment.requirement,
        {
          [this.requirementFulfillment.requirement.id]: this.toggleableRequirementChoice,
        }
      );
      if (requirementFulfillmentSpec !== null) {
        if (requirementFulfillmentSpec.fulfilledBy === 'credits') {
          this.requirementFulfillment.courses[0].forEach(completedCourse =>
            fulfillableCourses.push(completedCourse)
          );
        } else {
          this.requirementFulfillment.courses.forEach((requirementFulfillmentCourseSlot, i) => {
            const slotMinCount = requirementFulfillmentSpec.perSlotMinCount[i];
            for (let j = 0; j < slotMinCount; j += 1) {
              if (j < requirementFulfillmentCourseSlot.length) {
                fulfillableCourses.push(requirementFulfillmentCourseSlot[j]);
              }
            }
          });
        }
      }
      // fulfillableCourses are then filtered to be AP/IB/transfer courses only
      // regular courses that are not in selectedCourses should not be displayed
      // ...because that means the user selected another requirement for the course
      // regular courses that are in selectedCourses should also not be displayed
      // ...because that means it will be duplicated in fulfillableCourses
      fulfillableCourses = fulfillableCourses.filter(courseIsAPIB);

      return [...selectedCourses, ...fulfillableCourses];
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  methods: {
    onShowAllCourses(subReqIndex: number) {
      this.$emit('onShowAllCourses', {
        requirementName: this.requirementFulfillment.requirement.name,
        subReqCoursesArray: this.requirementCoursesSlots[subReqIndex]
          .courses as readonly FirestoreSemesterCourse[],
      });
    },
    toggleDescription() {
      this.showDescription = !this.showDescription;
    },
    closeMenuIfOpen() {
      this.showFulfillmentOptionsDropdown = false;
    },
    chooseFulfillmentOption(option: string) {
      this.showFulfillmentOptionsDropdown = false;
      this.$emit(
        'changeToggleableRequirementChoice',
        this.requirementFulfillment.requirement.id,
        option
      );
    },
    convertCourse(course: FirestoreSemesterCourse): CourseTaken {
      return convertFirestoreSemesterCourseToCourseTaken(course);
    },
    modalToggled(isOpen: boolean) {
      this.$emit('modal-open', isOpen);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.description {
  color: #4f4f4f;
  font-size: 14px;
}
.pointer {
  cursor: pointer;
}
button.active {
  color: $sangBlue;
  border-bottom: solid 10px $sangBlue;
  padding-bottom: 2px;
  margin: 5px;
}
button.view {
  margin: 0.7rem 0 2rem 0;
  min-height: 40px;
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  color: $white;
  text-transform: uppercase;
}

.separator {
  height: 1px;
  width: 100%;
  background-color: $inactiveGray;
}

.toggleable-requirements {
  &-select {
    display: flex;
    flex-direction: row;
    align-items: center;
    background: $white;
    border: 0.5px solid $inactiveGray;
    box-sizing: border-box;
    border-radius: 2px;
    width: 100%;
    font-size: 14px;
    line-height: 17px;
    color: $darkPlaceholderGray;
    position: relative;
    min-height: 1.625rem;
    margin: 0.75rem 0;

    &:not(:first-child) {
      margin-top: 0.5rem;
    }

    &--disabled {
      opacity: 0.3;
      pointer-events: none;
    }

    &-wrapper {
      position: relative;
      margin-bottom: 1rem;
    }
  }
  &-dropdown {
    &-placeholder {
      height: 100%;
      font-size: 14px;
      line-height: 17px;
      margin-left: 0.5rem;
      display: flex;
      align-items: center;
      color: $lightPlaceholderGray;
      background: transparent;
      cursor: pointer;
    }
    &-wrapper {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
    }
    &-innerPlaceholder {
      margin-top: 5px;
      margin-bottom: 5px;
      width: 100%;
    }
    &-arrow {
      border-left: 6.24px solid transparent;
      border-right: 6.24px solid transparent;
      border-top: 6.24px solid $inactiveGray;
      background: transparent;
      margin-right: 8.7px;
      margin-left: 5px;
      margin-top: auto;
      margin-bottom: auto;
    }
    &-content {
      z-index: 2;
      position: absolute;
      width: 100%;
      background: $white;
      box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
      border-radius: 7px;
      margin-top: 3px;
      &-item {
        height: 2.25rem;
        font-size: 14px;
        line-height: 17px;
        display: flex;
        align-items: center;
        color: $lightPlaceholderGray;
        padding-left: 10px;
        cursor: pointer;

        &:first-child {
          border-radius: 7px 7px 0px 0px;
        }

        &:last-child {
          border-radius: 0px 0px 7px 7px;
        }
      }
    }
  }
  &-dropdown-content div:hover {
    background: rgba(50, 160, 242, 0.15);
    width: 100%;
  }
}
.subreqcourse {
  &-wrapper {
    width: 100%;
  }
}
.left {
  justify-content: flex-start;
  align-items: center;
}
</style>

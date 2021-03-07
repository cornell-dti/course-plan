<template>
  <div class="subrequirement">
    <button
      @click="toggleDescription()"
      class="dropdown row"
      aria-haspopup="true"
      data-toggle="dropdown"
    >
      <div class="row depth-req">
        <div class="btn">
          <drop-down-arrow
            :isFlipped="displayDescription"
            :fillColor="getArrowColor()"
            :isSubReq="true"
          />
        </div>
        <div class="subreq-name">
          <p
            :class="[
              { 'sup-req': !isFulfilled },
              isFulfilled ? 'completed-ptext' : 'incomplete-ptext',
            ]"
          >
            <span>{{ subReq.requirement.name }}</span>
          </p>
        </div>
      </div>
      <div class="col">
        <p
          v-if="!isCompleted"
          class="sup-req-progress text-right incomplete-ptext"
        >
          {{ subReqProgress }}
        </p>
        <p v-if="isFulfilled" class="text-right completed-ptext">
          <span
            >{{ subReq.minCountFulfilled }}/{{ subReq.minCountRequired }}
            {{ subReq.fulfilledBy }}</span
          >
        </p>
      </div>
    </button>
    <div
      v-if="displayDescription"
      :class="[{ 'completed-ptext': isFulfilled }, 'description']"
    >
      <div>
        {{ subReq.requirement.description }}
        <a
          class="more"
          :style="{ color: `#${color}` }"
          :href="subReq.requirement.source"
          target="_blank"
        >
          <strong>Learn More</strong></a
        >
      </div>
      <div
        v-if="subReq.requirement.checkerWarning"
        class="requirement-checker-warning"
      >
        <img
          class="requirement-checker-warning-icon"
          src="@/assets/images/warning.svg"
          alt="warning-icon"
        />
        {{ subReq.requirement.checkerWarning }}
      </div>
      <div v-if="subReq.requirement.fulfilledBy === 'toggleable'">
        <div class="toggleable-requirements-select-wrapper">
          <div
            class="toggleable-requirements-select toggleable-requirements-input"
            v-click-outside="closeMenuIfOpen"
          >
            <div
              class="toggleable-requirements-dropdown-placeholder toggleable-requirements-dropdown-wrapper"
              @click="
                showFulfillmentOptionsDropdown = !showFulfillmentOptionsDropdown
              "
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
                subReq.requirement.fulfillmentOptions
              )"
              :key="optionName"
              class="toggleable-requirements-dropdown-content-item"
              @click="chooseFulfillmentOption(optionName)"
            >
              <span>{{ optionName }}</span>
            </div>
          </div>
          {{
            subReq.requirement.fulfillmentOptions[selectedFulfillmentOption]
              .description
          }}
        </div>
      </div>
      <div
        v-if="
          displayDescription &&
          subReq.requirement.fulfilledBy !== 'self-check' &&
          subReq.requirement.checkerWarning == null
        "
        class="subreqcourse-wrapper"
      >
        <div v-for="(subReqCourseSlot, id) in subReqCoursesSlots" :key="id">
          <div
            v-if="subReqCourseSlot.isCompleted"
            class="completedsubreqcourse-wrapper"
          >
            <completed-sub-req-course
              :subReqCourseId="id"
              :courseTaken="subReqCourseSlot.courses[0]"
              @deleteCourseFromSemesters="deleteCourseFromSemesters"
            />
          </div>
          <div
            v-if="!subReqCourseSlot.isCompleted"
            class="incompletesubreqcourse-wrapper"
          >
            <incomplete-sub-req-course
              :subReq="subReq"
              :subReqCourseId="id"
              :courses="subReqCourseSlot.courses.slice(0, 4)"
              :displayDescription="displayDescription"
              :showSeeAllLabel="subReqCourseSlot.courses.length > 4"
              @onShowAllCourses="onShowAllCourses"
            />
          </div>
        </div>
      </div>
      <div
        v-if="
          displayDescription &&
          (subReq.requirement.fulfilledBy === 'self-check' ||
            subReq.requirement.checkerWarning != null)
        "
        class="subreqcourse-wrapper"
      >
        <div
          v-for="(selfCheckCourse, id) in fulfilledSelfCheckCourses"
          :key="id"
        >
          <completed-sub-req-course
            :subReqCourseId="id"
            :courseTaken="convertCourse(selfCheckCourse)"
            @deleteCourseFromSemesters="deleteCourseFromSemesters"
          />
        </div>
        <!-- TODO: only show incomplete-self-check if all courses not added -->
        <incomplete-self-check
          :subReqId="subReq.requirement.id"
          @addCourse="addSelfCheckCourse"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import CompletedSubReqCourse from '@/components/Requirements/CompletedSubReqCourse.vue';
import IncompleteSubReqCourse from '@/components/Requirements/IncompleteSubReqCourse.vue';
import IncompleteSelfCheck from '@/components/Requirements/IncompleteSelfCheck.vue';
import DropDownArrow from '@/components/DropDownArrow.vue';

import store from '@/store';
import { clickOutside } from '@/utilities';
import {
  convertFirestoreSemesterCourseToCourseTaken,
  getMatchedRequirementFulfillmentSpecification,
} from '@/requirements/requirement-frontend-utils';
import { cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor } from '@/user-data-converter';
import fullCoursesJson from '@/assets/courses/typed-full-courses';
import {
  allocateSubjectColors,
  chooseSelectableRequirementOption,
} from '@/global-firestore-data';

type CompletedSubReqCourseSlot = {
  readonly isCompleted: true;
  readonly courses: readonly CourseTaken[];
};

type IncompleteSubReqCourseSlot = {
  readonly isCompleted: false;
  readonly courses: readonly FirestoreSemesterCourse[];
};

export type SubReqCourseSlot =
  | CompletedSubReqCourseSlot
  | IncompleteSubReqCourseSlot;

type Data = {
  showFulfillmentOptionsDropdown: boolean;
  displayDescription: boolean;
};

const generateSubReqIncompleteCourses = (
  allTakenCourseIds: ReadonlySet<number>,
  eligibleCourseIds: readonly number[]
): readonly FirestoreSemesterCourse[] => {
  const rosterCourses = eligibleCourseIds
    .filter(courseID => !allTakenCourseIds.has(courseID))
    .flatMap(courseID => fullCoursesJson[courseID] || []);
  const subjectColors = allocateSubjectColors(
    new Set(rosterCourses.map(it => it.subject))
  );
  return rosterCourses.map(rosterCourse =>
    cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor(
      rosterCourse,
      -1,
      subjectColors[rosterCourse.subject]
    )
  );
};

export default Vue.extend({
  components: {
    CompletedSubReqCourse,
    DropDownArrow,
    IncompleteSubReqCourse,
    IncompleteSelfCheck,
  },
  props: {
    subReq: {
      type: Object as PropType<RequirementFulfillment>,
      required: true,
    },
    isCompleted: { type: Boolean, required: true },
    toggleableRequirementChoice: { type: String, default: null },
    color: { type: String, required: true },
  },
  data(): Data {
    return {
      showFulfillmentOptionsDropdown: false,
      displayDescription: false,
    };
  },
  computed: {
    isFulfilled(): boolean {
      return false;
    },
    selectedFulfillmentOption(): string {
      if (this.subReq.requirement.fulfilledBy !== 'toggleable') {
        return '';
      }
      return (
        this.toggleableRequirementChoice ||
        Object.keys(this.subReq.requirement.fulfillmentOptions)[0]
      );
    },
    subReqCoursesSlots(): SubReqCourseSlot[] {
      const subReqSpec = getMatchedRequirementFulfillmentSpecification(
        this.subReq.requirement,
        {
          [this.subReq.requirement.id]: this.toggleableRequirementChoice,
        }
      );
      if (subReqSpec === null) return [];
      const subReqEligibleCourses = subReqSpec.eligibleCourses;

      const allTakenCourseIds = new Set(
        this.subReq.courses.flat().map(course => course.courseId)
      );
      const slots: SubReqCourseSlot[] = [];

      const coursesTaken = this.subReq.courses;

      coursesTaken.forEach((subReqCourseSlot, i) => {
        if (subReqCourseSlot.length > 0) {
          subReqCourseSlot.forEach(subReqCourse => {
            slots.push({ isCompleted: true, courses: [subReqCourse] });
          });
          // Create new IncompletedSubReqCourse slot if all credits or courses not met
          // but only one CompletedSubReqCourse slot exists
          if (coursesTaken.length === 1 && !this.isCompleted) {
            slots.push({
              isCompleted: false,
              courses: generateSubReqIncompleteCourses(
                allTakenCourseIds,
                subReqEligibleCourses[i]
              ),
            });
          }
        } else {
          slots.push({
            isCompleted: false,
            courses: generateSubReqIncompleteCourses(
              allTakenCourseIds,
              subReqEligibleCourses[i]
            ),
          });
        }
      });
      return slots;
    },
    subReqProgress(): string {
      return this.subReq.fulfilledBy !== 'self-check'
        ? `${this.subReq.minCountFulfilled}/${this.subReq.minCountRequired} ${this.subReq.fulfilledBy}`
        : 'self check';
    },
    fulfilledSelfCheckCourses(): FirestoreSemesterCourse[] {
      const reqId = this.subReq.requirement.id;
      return store.state.derivedSelectableRequirementData.requirementToCoursesMap[reqId];
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  methods: {
    getArrowColor() {
      return this.isCompleted ? '#979797CC' : '#979797';
    },
    onShowAllCourses(subReqIndex: number) {
      this.$emit('onShowAllCourses', {
        requirementName: this.subReq.requirement.name,
        subReqCoursesArray: this.subReqCoursesSlots[subReqIndex].courses,
      });
    },
    toggleDescription() {
      this.displayDescription = !this.displayDescription;
    },
    closeMenuIfOpen() {
      this.showFulfillmentOptionsDropdown = false;
    },
    chooseFulfillmentOption(option: string) {
      this.showFulfillmentOptionsDropdown = false;
      this.$emit(
        'changeToggleableRequirementChoice',
        this.subReq.requirement.id,
        option
      );
    },
    addSelfCheckCourse(course: FirestoreSemesterCourse, requirementID: string) {
      // TODO this.fulfilledSelfCheckCourses.push(course);
      if (requirementID) {
        chooseSelectableRequirementOption({
          ...store.state.selectableRequirementChoices,
          [course.uniqueID]: requirementID,
        });
      }
    },
    convertCourse(course: FirestoreSemesterCourse): CourseTaken {
      return convertFirestoreSemesterCourseToCourseTaken(course);
    },
    deleteCourseFromSemesters(uniqueId: number) {
      // TODO
      /*
      // find and remove self-check course on sidebar
      let indexToRemove = -1;
      if (this.subReq.requirement.fulfilledBy === 'self-check') {
        for (let i = 0; i < this.fulfilledSelfCheckCourses.length; i += 1) {
          if (this.fulfilledSelfCheckCourses[i].uniqueID === uniqueId) {
            indexToRemove = i;
          }
        }
      }
      if (indexToRemove !== -1) {
        this.fulfilledSelfCheckCourses.splice(indexToRemove, 1);
      }
      */
      this.$emit('deleteCourseFromSemesters', uniqueId);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.dropdown {
  background: none;
  width: 100%;
  border: none;
  justify-content: space-between;
  padding: 0;
  align-items: center;
}

.btn {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &-2 {
    padding-top: 0px;
    margin: 0px;
  }
}
.btn:focus,
.btn:active {
  outline: none !important;
  box-shadow: none;
}
.row {
  margin: 0;
}
.row > div {
  padding: 0;
}

.depth-req {
  margin: 0.5rem 0 0.1rem 0;
  min-height: 14px;
  justify-content: flex-start;
  align-items: center;
  div:first-child {
    margin: 0px;
  }
}
.sub-req-div {
  padding-left: 30px;
  margin: 0px;
}
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
.completed-ptext span {
  color: $lightPlaceholderGray;
  font-size: 12px;
  opacity: 0.8;
  font-weight: normal;
}
.incomplete {
  &-ptext {
    font-size: 14px;
  }
}
.text {
  &-right {
    color: $lightPlaceholderGray;
  }
}
.sup-req {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  color: $lightPlaceholderGray;
  &-progress {
    font-size: 14px;
    line-height: 14px;
  }
}
.separator {
  height: 1px;
  width: 100%;
  background-color: $inactiveGray;
}

.requirement-checker-warning {
  color: $warning;
  margin-top: 0.25rem;

  &-icon {
    float: left;
    margin: 0.125rem 0.25rem 0 0;
    width: 14px;
    height: 14px;
  }
}

.toggleable-requirements {
  &-select {
    display: flex;
    flex-direction: row;
    background: $white;
    border: 0.5px solid $inactiveGray;
    box-sizing: border-box;
    border-radius: 2px;
    width: 100%;
    font-size: 14px;
    line-height: 17px;
    color: $darkPlaceholderGray;
    position: relative;

    &:not(:first-child) {
      margin-top: 0.5rem;
    }

    &--disabled {
      opacity: 0.3;
      pointer-events: none;
    }

    &-wrapper {
      position: relative;
    }
  }
  &-dropdown {
    &-placeholder {
      height: 100%;
      font-size: 14px;
      line-height: 17px;
      margin-left: 0.25rem;
      display: flex;
      align-items: center;
      color: $darkPlaceholderGray;
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
      margin-top: 5px;
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
.subreq-name {
  text-align: left;
  margin-left: 11px;
}
</style>

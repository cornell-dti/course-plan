<template>
  <div class="subrequirement">
    <div class="row depth-req">
      <div class="col-1" @click="toggleDescription()">
        <button class="btn">
          <dropdownarrow :isFlipped="displayDescription" :fillColor="getArrowColor()" />
        </button>
      </div>
      <div class="col-7" @click="toggleDescription()">
        <p
          v-bind:class="[
            { 'sup-req': !this.isFulfilled },
            'pointer',
            this.isFulfilled ? 'completed-ptext' : 'incomplete-ptext',
          ]"
        >
          <span>{{ subReq.requirement.name }}</span>
        </p>
      </div>
      <div class="col">
        <p v-if="!this.isCompleted" class="sup-req-progress text-right incomplete-ptext">
          {{ subReqProgress }}
        </p>
        <p v-if="this.isFulfilled" class="text-right completed-ptext">
          <span
            >{{ subReq.minCountFulfilled }}/{{ subReq.minCountRequired }}
            {{ subReq.fulfilledBy }}</span
          >
        </p>
      </div>
      <div
        v-if="displayDescription"
        :class="[{ 'completed-ptext': this.isFulfilled }, 'description']"
      >
        {{ subReq.requirement.description }}
        <a
          class="more"
          :style="{ color: `#${color}` }"
          :href="subReq.requirement.source"
          target="_blank"
        >
          <strong>Learn More</strong></a
        >
        <div v-if="subReq.requirement.fulfilledBy === 'toggleable'">
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
                v-for="optionName in Object.keys(subReq.requirement.fulfillmentOptions)"
                :key="optionName"
                class="toggleable-requirements-dropdown-content-item"
                @click="chooseFulfillmentOption(optionName)"
              >
                <span>{{ optionName }}</span>
              </div>
            </div>
            {{ this.subReq.requirement.fulfillmentOptions[selectedFulfillmentOption].description }}
          </div>
        </div>
      </div>
      <div v-if="displayDescription" class="subreqcourse-wrapper">
        <div v-for="(subReqCourseSlot, id) in subReqCoursesArray" :key="id">
          <div v-if="subReqCourseSlot.isCompleted" class="completedsubreqcourse-wrapper">
            <completedsubreqcourse
              :subReq="subReq"
              :subReqCourseId="id"
              :crsesTaken="subReqCourseSlot.courses"
              :semesters="semesters"
              @deleteCourseFromSemesters="deleteCourseFromSemesters"
            />
          </div>
          <div v-if="!subReqCourseSlot.isCompleted" class="incompletesubreqcourse-wrapper">
            <incompletesubreqcourse
              :subReq="subReq"
              :subReqCourseId="id"
              :crseInfoObjects="subReqCourseSlot.courses"
              :subReqFetchedCourseObjectsNotTakenArray="subReqFetchedCourseObjectsNotTakenArray"
              :subReqCoursesArray="subReqCoursesArray"
              :dataReady="dataReady"
              :displayDescription="displayDescription"
              :lastLoadedShowAllCourseId="lastLoadedShowAllCourseId"
              @isDataReady="isDataReady"
              @onShowAllCourses="onShowAllCourses"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import firebase from 'firebase/app';
import CompletedSubReqCourse from '@/components/Requirements/CompletedSubReqCourse.vue';
import IncompleteSubReqCourse from '@/components/Requirements/IncompleteSubReqCourse.vue';
import DropDownArrow from '@/components/DropDownArrow.vue';

import {
  DisplayableRequirementFulfillment,
  EligibleCourses,
  CourseTaken,
  SubReqCourseSlot,
  CrseInfo,
} from '@/requirements/types';
import { clickOutside } from '@/utilities';

import { CornellCourseRosterCourse, AppCourse, AppSemester } from '@/user-data';

Vue.component('completedsubreqcourse', CompletedSubReqCourse);
Vue.component('incompletesubreqcourse', IncompleteSubReqCourse);
Vue.component('dropdownarrow', DropDownArrow);

require('firebase/functions');

const functions = firebase.functions();
const FetchCourses = firebase.functions().httpsCallable('FetchCourses');

type Data = {
  showFulfillmentOptionsDropdown: boolean;
  displayDescription: boolean;
  subReqFetchedCourseObjectsNotTakenArray: AppCourse[];
  dataReady: boolean;
};

export default Vue.extend({
  props: {
    subReq: Object as PropType<DisplayableRequirementFulfillment>,
    subReqIndex: Number, // Subrequirement index
    reqIndex: Number, // Requirement index
    isCompleted: Boolean,
    toggleableRequirementChoice: {
      type: String,
      required: false,
    },
    color: String,
    rostersFromLastTwoYears: Array as PropType<readonly String[]>,
    lastLoadedShowAllCourseId: Number,
    semesters: Array as PropType<readonly AppSemester[]>,
  },
  watch: {
    subReqCoursesArray: {
      immediate: true,
      deep: true,
      handler(updatedSubReqCoursesArray) {
        this.getSubReqCourseObjects();
      },
    },
  },
  data(): Data {
    return {
      showFulfillmentOptionsDropdown: false,
      displayDescription: false,
      subReqFetchedCourseObjectsNotTakenArray: [], // array of fetched course objects
      dataReady: false, // true if dataReady for all subReqCourses. false otherwise
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
    subReqCoursesArray(): SubReqCourseSlot[] {
      return this.generateSubReqCoursesArray();
    },
    subReqProgress(): string {
      return this.subReq.fulfilledBy !== 'self-check'
        ? `${this.subReq.totalCountFulfilled || this.subReq.minCountFulfilled}/${
            this.subReq.totalCountRequired || this.subReq.minCountRequired
          } ${this.subReq.fulfilledBy}`
        : 'self check';
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  methods: {
    getArrowColor() {
      return this.isCompleted ? '#979797CC' : '#979797';
    },
    onShowAllCourses(courses: AppCourse[]) {
      this.$emit('onShowAllCourses', courses);
    },
    toggleDescription() {
      this.displayDescription = !this.displayDescription;
      if (this.displayDescription && !this.isFulfilled) {
        this.getSubReqCourseObjects();
      }
    },
    isDataReady() {
      this.dataReady = true;
    },
    closeMenuIfOpen() {
      this.showFulfillmentOptionsDropdown = false;
    },
    chooseFulfillmentOption(option: string) {
      this.showFulfillmentOptionsDropdown = false;
      this.$emit('changeToggleableRequirementChoice', this.subReq.id, option);
    },
    getFulfillededByCourses() {
      switch (this.subReq.requirement.fulfilledBy) {
        case 'toggleable':
          return this.subReq.requirement.fulfillmentOptions[
            this.toggleableRequirementChoice || this.selectedFulfillmentOption
          ].courses;
        case 'self-check':
          return null;
        default:
          return this.subReq.requirement.courses;
      }
    },
    generateSubReqCoursesArray(): SubReqCourseSlot[] {
      const subReqCoursesArray: SubReqCourseSlot[] = [];
      const subReqCourses = this.getFulfillededByCourses();

      if (subReqCourses === null) return [];

      for (let i = 0; i < this.subReq.courses.length; i += 1) {
        const subReqCourseSlot = this.subReq.courses[i];
        if (subReqCourseSlot.length > 0) {
          subReqCourseSlot.forEach(subReqCourse => {
            subReqCoursesArray.push({ isCompleted: true, courses: [subReqCourse] });
          });
          // Create new IncompletedSubReqCourse slot if all credits or courses not met
          // but only one CompletedSubReqCourse slot exists
          if (this.subReq.courses.length === 1 && !this.isCompleted) {
            const crseInfoArray = this.generateSubReqIncompleteCrseInfoArray(subReqCourses, i);
            subReqCoursesArray.push({ isCompleted: false, courses: crseInfoArray });
          }
        } else {
          const crseInfoArray = this.generateSubReqIncompleteCrseInfoArray(subReqCourses, i);
          subReqCoursesArray.push({ isCompleted: false, courses: crseInfoArray });
        }
      }
      return subReqCoursesArray;
    },
    generateSubReqIncompleteCrseInfoArray(
      subReqCourses: readonly EligibleCourses[],
      subReqCourseIndex: number
    ): CrseInfo[] {
      const allTakenCourseIds = this.subReq.courses
        .reduce((acc, course) => acc.concat(course), [])
        .map(course => course.courseId);

      const mostRecentRosters = this.rostersFromLastTwoYears;
      const subReqCourseRosterObject: EligibleCourses = subReqCourses[subReqCourseIndex];
      // Filter subreq roster object keys with the mostRecentRosters
      const filteredSubReqRosters = Object.keys(subReqCourseRosterObject)
        .filter(subReqRoster => mostRecentRosters.indexOf(subReqRoster) !== -1)
        .reverse();

      const subReqIncompleteCrseInfoArray: CrseInfo[] = [];
      const seenCrseIds = new Set(); // So we don't have duplicates
      filteredSubReqRosters.forEach(subReqRoster => {
        const subReqCrseIds = subReqCourseRosterObject[subReqRoster].filter(
          (crseId: number) => !seenCrseIds.has(crseId)
        );

        if (subReqCrseIds.length > 0) {
          const filteredSubReqCrseIds = subReqCrseIds.filter(
            crseIds => this.isCompleted || !allTakenCourseIds.includes(crseIds)
          );
          const crseInfoObject = { roster: subReqRoster, crseIds: filteredSubReqCrseIds };
          subReqIncompleteCrseInfoArray.push(crseInfoObject);
          subReqCrseIds.forEach(subReqCrseId => seenCrseIds.add(subReqCrseId));
        }
      });
      return subReqIncompleteCrseInfoArray;
    },
    getMaxFirstFourCrseInfoObjects(): CrseInfo[] {
      const subReqCrseInfoObjectsToFetch: CrseInfo[] = [];
      this.subReqCoursesArray.forEach(subReqCourseArray => {
        if (!subReqCourseArray.isCompleted) {
          let numSeenCrseIds = 0;
          for (let i = 0; numSeenCrseIds < 4 && i < subReqCourseArray.courses.length; i += 1) {
            const subReqCrseInfo = subReqCourseArray.courses[i];
            const numRemainingCourses = Math.min(4 - numSeenCrseIds, subReqCrseInfo.crseIds.length);

            subReqCrseInfoObjectsToFetch.push({
              roster: subReqCrseInfo.roster,
              crseIds: subReqCrseInfo.crseIds.slice(0, numRemainingCourses),
            });
            numSeenCrseIds += numRemainingCourses;
          }
        }
      });
      return subReqCrseInfoObjectsToFetch;
    },
    getSubReqCourseObjects(): void {
      this.subReqFetchedCourseObjectsNotTakenArray = [];
      this.dataReady = false;
      const subReqCrseInfoObjectsToFetch = this.getMaxFirstFourCrseInfoObjects();
      let fetchedCourses;
      FetchCourses({
        crseInfo: subReqCrseInfoObjectsToFetch,
        allowSameCourseForDifferentRosters: false,
      })
        .then(result => {
          fetchedCourses = result.data.courses;
          fetchedCourses.forEach((course: CornellCourseRosterCourse) => {
            // @ts-ignore
            const createdCourse = this.$parent.$parent.$parent.createAppCourseFromCornellRosterCourse(
              course,
              true
            );
            createdCourse.compact = true;
            this.subReqFetchedCourseObjectsNotTakenArray.push(createdCourse);
          });
          this.isDataReady();
        })
        .catch(error => {
          console.log('FetchCourses() Error: ', error);
        });
    },
    deleteCourseFromSemesters(uniqueId: number) {
      this.$emit('deleteCourseFromSemesters', uniqueId);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

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
}
.sub-req-div {
  padding-left: 30px;
  margin: 0px;
}
.description {
  margin: 0 0 0.5rem 1.8rem;
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
      width: 80%;
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
</style>

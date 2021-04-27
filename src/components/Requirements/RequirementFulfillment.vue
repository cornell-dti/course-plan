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
        <toggleable-requirement-choice-dropdown
          :toggleableRequirement="requirementFulfillment.requirement"
          :toggleableRequirementChoice="toggleableRequirementChoice"
          @changeToggleableRequirementChoice="changeToggleableRequirementChoice"
        />
      </div>
      <requirement-fulfillment-slots
        v-if="
          requirementFulfillment.requirement.fulfilledBy !== 'self-check' &&
          requirementFulfillment.requirement.checkerWarning == null
        "
        :requirementFulfillment="requirementFulfillment"
        :isCompleted="isCompleted"
        :displayDescription="displayDescription"
        :toggleableRequirementChoice="toggleableRequirementChoice"
        @modal-open="modalToggled"
        @onShowAllCourses="onShowAllCourses"
      />
      <div
        v-if="
          requirementFulfillment.requirement.fulfilledBy === 'self-check' ||
          requirementFulfillment.requirement.checkerWarning != null
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
import IncompleteSelfCheck from '@/components/Requirements/IncompleteSelfCheck.vue';
import RequirementDisplayToggle from '@/components/Requirements/RequirementDisplayToggle.vue';
import RequirementFulfillmentSlots from '@/components/Requirements/RequirementFulfillmentSlots.vue';
import RequirementInformation from '@/components/Requirements/RequirementInformation.vue';
import ToggleableRequirementChoiceDropdown from '@/components/Requirements/ToggleableRequirementChoiceDropdown.vue';

import store from '@/store';
import {
  convertFirestoreSemesterCourseToCourseTaken,
  getMatchedRequirementFulfillmentSpecification,
  courseIsAPIB,
} from '@/requirements/requirement-frontend-utils';

export default defineComponent({
  components: {
    CompletedSubReqCourse,
    IncompleteSelfCheck,
    RequirementDisplayToggle,
    RequirementFulfillmentSlots,
    RequirementInformation,
    ToggleableRequirementChoiceDropdown,
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
  data() {
    return { showDescription: false };
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
  methods: {
    onShowAllCourses(courses: {
      requirementName: string;
      subReqCoursesArray: readonly FirestoreSemesterCourse[];
    }) {
      this.$emit('onShowAllCourses', courses);
    },
    toggleDescription() {
      this.showDescription = !this.showDescription;
    },
    changeToggleableRequirementChoice(id: string, option: string) {
      this.$emit('changeToggleableRequirementChoice', id, option);
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

.left {
  justify-content: flex-start;
  align-items: center;
}
</style>

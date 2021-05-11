<template>
  <div class="requirement-fulfillment-slots">
    <div v-for="(requirementFulfillmentCourseSlot, id) in requirementCoursesSlots" :key="id">
      <div v-if="requirementFulfillmentCourseSlot.isCompleted">
        <completed-sub-req-course
          :slotName="requirementFulfillmentCourseSlot.name"
          :courseTaken="requirementFulfillmentCourseSlot.courses[0]"
          @modal-open="modalToggled"
        />
      </div>
      <div v-if="!requirementFulfillmentCourseSlot.isCompleted">
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
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import CompletedSubReqCourse from '@/components/Requirements/CompletedSubReqCourse.vue';
import IncompleteSubReqCourse from '@/components/Requirements/IncompleteSubReqCourse.vue';

import store from '@/store';
import { getMatchedRequirementFulfillmentSpecification } from '@/requirements/requirement-frontend-utils';
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

type SubReqCourseSlot = CompletedSubReqCourseSlot | IncompleteSubReqCourseSlot;

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
  components: { CompletedSubReqCourse, IncompleteSubReqCourse },
  props: {
    requirementFulfillment: {
      type: Object as PropType<RequirementFulfillment>,
      required: true,
    },
    isCompleted: { type: Boolean, required: true },
    displayDescription: { type: Boolean, required: true },
    toggleableRequirementChoice: { type: String, default: null },
  },
  emits: {
    'modal-open': (open: boolean) => typeof open === 'boolean',
    onShowAllCourses(courses: {
      requirementName: string;
      subReqCoursesArray: readonly FirestoreSemesterCourse[];
    }) {
      return typeof courses === 'object';
    },
  },
  computed: {
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
  },
  methods: {
    onShowAllCourses(subReqIndex: number) {
      this.$emit('onShowAllCourses', {
        requirementName: this.requirementFulfillment.requirement.name,
        subReqCoursesArray: this.requirementCoursesSlots[subReqIndex]
          .courses as readonly FirestoreSemesterCourse[],
      });
    },
    modalToggled(isOpen: boolean) {
      this.$emit('modal-open', isOpen);
    },
  },
});
</script>

<style scoped lang="scss">
.requirement-fulfillment-slots {
  width: 100%;
}
</style>

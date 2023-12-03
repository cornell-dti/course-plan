<template>
  <div class="requirement-fulfillment-slots">
    <div v-for="(requirementFulfillmentCourseSlot, id) in requirementCoursesSlots" :key="id">
      <div v-if="requirementFulfillmentCourseSlot.isCompleted">
        <completed-sub-req-course
          :slotName="requirementFulfillmentCourseSlot.name"
          :courseTaken="requirementFulfillmentCourseSlot.courses[0]"
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
    compoundRequirementChoice: { type: String, required: true },
    isCompleted: { type: Boolean, required: true },
    displayDescription: { type: Boolean, required: true },
    toggleableRequirementChoice: { type: String, default: null },
    requirement: { type: Object as PropType<RequirementWithIDSourceType>, required: true },
  },
  emits: {
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
      /**
       * `appliedRequirementFulfillmentSpec` means the requirement we actually consider.
       * Since this component supports compound requirement, `appliedRequirementFulfillmentSpec`
       * corresponds to the nested requirement inside component requirement the user chooses
       * to display.
       */
      const appliedRequirementFulfillmentSpec =
        (requirementFulfillmentSpec.additionalRequirements || {})[this.compoundRequirementChoice] ||
        requirementFulfillmentSpec;
      const requirementFulfillmentEligibleCourses =
        appliedRequirementFulfillmentSpec.eligibleCourses;
      /**
       * Similar to `appliedRequirementFulfillmentSpec`, this is the courses that are matched to
       * the nested requirement inside compound requirement the user chooses to display.
       */
      const matchedCourses = (
        (this.requirementFulfillment.fulfillment.additionalRequirements || {})[
          this.compoundRequirementChoice
        ] || this.requirementFulfillment.fulfillment
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
                  this.requirementFulfillment.requirement.id
                ),
              });
            }
          }
        });
      }

      const completedReq: CompletedSubReqCourseSlot[] = [];
      const incompleteReq: IncompleteSubReqCourseSlot[] = [];
      slots.forEach(slot => {
        if (slot.isCompleted) {
          completedReq.push(slot);
        } else {
          incompleteReq.push(slot);
        }
      });

      const sortedIncompleteReq: IncompleteSubReqCourseSlot[] = [];
      const ranking = store.state.requirementRanking.get(this.requirement.id);
      if (ranking) {
        for (let k = 0; k < incompleteReq.length; k+=1) {
          const slot = incompleteReq[k];

          const courses = [...slot.courses];
          const sortedCourses = courses.sort((a, b) => {
            let aRank = 0;
            let bRank = 0;
            for (let i = 0; i < ranking.length; i+=1) {
              if (a.crseId === ranking[i]) {
                aRank = i;
              }
              if (b.crseId === ranking[i]) {
                bRank = i;
              }
            }
            // sorted by who has the higher rank
            return aRank - bRank;
          });
          sortedIncompleteReq.push({
            name: slot.name,
            isCompleted: false,
            courses: sortedCourses,
          });
        }
      } else {
        // ranking data not yet computed. Need to run '/script/gen-req-full-stats.ts'
      }

      return (completedReq as SubReqCourseSlot[]).concat(sortedIncompleteReq as SubReqCourseSlot[]);
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
  },
});
</script>

<style scoped lang="scss">
.requirement-fulfillment-slots {
  width: 100%;
}
</style>

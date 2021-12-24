<template>
  <div>
    <div v-for="(selfCheckCourse, id) in fulfilledSelfCheckCourses" :key="id">
      <completed-sub-req-course :slotName="`Course ${id + 1}`" :courseTaken="selfCheckCourse" />
    </div>
    <div v-if="!isCompleted">
      <incomplete-self-check
        :subReqId="requirementFulfillment.requirement.id"
        :subReqName="requirementFulfillment.requirement.name"
        :subReqFulfillment="requirementFulfillment.fulfillment.fulfilledBy"
        :subReqCourseId="requirementFulfillment.fulfillment.safeMinCountFulfilled"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import CompletedSubReqCourse from '@/components/Requirements/CompletedSubReqCourse.vue';
import IncompleteSelfCheck from '@/components/Requirements/IncompleteSelfCheck.vue';

import store from '@/store';
import {
  getMatchedRequirementFulfillmentSpecification,
  courseIsAPIB,
} from '@/requirements/requirement-frontend-utils';

export default defineComponent({
  components: { CompletedSubReqCourse, IncompleteSelfCheck },
  props: {
    requirementFulfillment: {
      type: Object as PropType<RequirementFulfillment>,
      required: true,
    },
    isCompleted: { type: Boolean, required: true },
    toggleableRequirementChoice: { type: String, default: null },
  },
  computed: {
    fulfilledSelfCheckCourses(): readonly CourseTaken[] {
      // selectedCourses are courses that fulfill the requirement based on user-choice
      // they are taken from requirement graph
      const selectedCourses = store.state.dangerousRequirementFulfillmentGraph.getConnectedCoursesFromRequirement(
        this.requirementFulfillment.requirement.id
      );

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
          this.requirementFulfillment.fulfillment.dangerousCourses[0].forEach(completedCourse =>
            fulfillableCourses.push(completedCourse)
          );
        } else {
          this.requirementFulfillment.fulfillment.dangerousCourses.forEach(
            (requirementFulfillmentCourseSlot, i) => {
              const slotMinCount = requirementFulfillmentSpec.perSlotMinCount[i];
              for (let j = 0; j < slotMinCount; j += 1) {
                if (j < requirementFulfillmentCourseSlot.length) {
                  fulfillableCourses.push(requirementFulfillmentCourseSlot[j]);
                }
              }
            }
          );
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
});
</script>

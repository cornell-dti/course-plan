<template>
  <div>
    <requirement-display-toggle
      :requirementFulfillment="requirementFulfillment"
      :isCompleted="isCompleted"
      :displayDescription="displayDescription"
      @on-toggle="toggleDescription()"
    />
    <div v-if="displayDescription" class="description">
      <requirement-information
        :requirementFulfillment="requirementFulfillment"
        v-model="compoundRequirementChoice"
        :color="color"
      />
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
        :compoundRequirementChoice="compoundRequirementChoice"
        :isCompleted="isCompleted"
        :displayDescription="displayDescription"
        :toggleableRequirementChoice="toggleableRequirementChoice"
        :requirement="requirementFulfillment.requirement"
        @onShowAllCourses="onShowAllCourses"
      />
      <requirement-self-check-slots
        v-if="
          requirementFulfillment.requirement.fulfilledBy === 'self-check' ||
          requirementFulfillment.requirement.checkerWarning != null
        "
        :requirementFulfillment="requirementFulfillment"
        :isCompleted="isCompleted"
        :toggleableRequirementChoice="toggleableRequirementChoice"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import RequirementDisplayToggle from '@/components/Requirements/RequirementDisplayToggle.vue';
import RequirementFulfillmentSlots from '@/components/Requirements/RequirementFulfillmentSlots.vue';
import RequirementInformation from '@/components/Requirements/RequirementInformation.vue';
import RequirementSelfCheckSlots from '@/components/Requirements/RequirementSelfCheckSlots.vue';
import ToggleableRequirementChoiceDropdown from '@/components/Requirements/ToggleableRequirementChoiceDropdown.vue';

import { convertFirestoreSemesterCourseToCourseTaken } from '@/requirements/requirement-frontend-utils';

export default defineComponent({
  components: {
    RequirementDisplayToggle,
    RequirementFulfillmentSlots,
    RequirementInformation,
    RequirementSelfCheckSlots,
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
    return { showDescription: false, compoundRequirementChoice: '' };
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
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.description {
  color: $onboardingGray;
  font-size: 14px;
}
</style>

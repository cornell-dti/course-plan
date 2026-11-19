<template>
  <div class="requirementview">
    <requirement-header
      :reqIndex="reqIndex"
      :displayDetails="displayDetails"
      :displayedMajorIndex="displayedMajorIndex"
      :displayedMinorIndex="displayedMinorIndex"
      :req="req"
      :onboardingData="onboardingData"
      :showMajorOrMinorRequirements="showMajorOrMinorRequirements"
      :numOfColleges="numOfColleges"
      @activateMajor="activateMajor"
      @activateMinor="activateMinor"
      @toggleDetails="toggleDetails"
    />
    <div v-if="showMajorOrMinorRequirements">
      <!--Show more of completed requirements -->
      <div v-if="displayDetails || tourStep === 1">
        <h2 class="ongoing">Ongoing Requirements</h2>
        <div class="separator"></div>
        <div
          v-for="(requirementFulfillment, id) in partitionedRequirementsProgress.ongoing"
          :key="id"
        >
          <requirement-fulfillment
            :requirementFulfillment="requirementFulfillment"
            :toggleableRequirementChoice="
              toggleableRequirementChoices[requirementFulfillment.requirement.id]
            "
            :color="getReqColor(req.groupName, onboardingData)"
            :isCompleted="false"
            :tourStep="tourStep"
            @changeToggleableRequirementChoice="changeToggleableRequirementChoice"
            @onShowAllCourses="onShowAllCourses"
          />
          <div class="separator"></div>
        </div>

        <!-- Toggle to display completed reqs -->
        <button
          v-if="partitionedRequirementsProgress.completed.length > 0"
          class="completed"
          :aria-expanded="displayCompleted"
          @click="turnCompleted(!displayCompleted)"
          data-cyId="requirements-showCompleted"
        >
          <svg
            class="completed-chevron"
            :class="{ 'completed-chevron--closed': !displayCompleted }"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.33"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
          <span class="completed-label"
            >Completed ({{ partitionedRequirementsProgress.completed.length }})</span
          >
        </button>

        <!-- Completed requirements -->
        <div v-if="displayCompleted">
          <div
            v-for="(requirementFulfillment, id) in partitionedRequirementsProgress.completed"
            :key="id"
          >
            <div class="separator" v-if="reqIndex < reqs.length - 1 || displayDetails"></div>
            <requirement-fulfillment
              :requirementFulfillment="requirementFulfillment"
              :toggleableRequirementChoice="
                toggleableRequirementChoices[requirementFulfillment.requirement.id]
              "
              :color="getReqColor(req.groupName, onboardingData)"
              :isCompleted="true"
              :tourStep="tourStep"
              @changeToggleableRequirementChoice="changeToggleableRequirementChoice"
              @onShowAllCourses="onShowAllCourses"
            />
          </div>
        </div>
      </div>

      <!-- Add separator if additional completed requirements -->
      <div class="separator"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { GTagEvent } from '@/gtag';
import RequirementHeader from '@/components/Requirements/RequirementHeader.vue';
import RequirementFulfillment from '@/components/Requirements/RequirementFulfillment.vue';
import { getReqColor } from '@/utilities';

import store from '@/store';

type PartitionedRequirementsProgress = {
  readonly ongoing: readonly RequirementFulfillment[];
  readonly completed: readonly RequirementFulfillment[];
};

export default defineComponent({
  components: { RequirementHeader, RequirementFulfillment },
  props: {
    req: { type: Object as PropType<GroupedRequirementFulfillmentReport>, required: true },
    reqIndex: { type: Number, required: true }, // Index of this req in reqs array
    toggleableRequirementChoices: {
      type: Object as PropType<Readonly<Record<string, string>>>,
      required: true,
    },
    displayedMajorIndex: { type: Number, required: true },
    displayedMinorIndex: { type: Number, required: true },
    showMajorOrMinorRequirements: { type: Boolean, required: true },
    numOfColleges: { type: Number, required: true },
    tourStep: { type: Number, required: true },
  },
  emits: {
    activateMajor: (id: number) => typeof id === 'number',
    activateMinor: (id: number) => typeof id === 'number',
    onShowAllCourses: (courses: {
      requirementName: string;
      subReqCoursesArray: readonly FirestoreSemesterCourse[];
    }) => typeof courses === 'object',
    changeToggleableRequirementChoice: (requirementID: string, option: string) =>
      typeof requirementID === 'string' && typeof option === 'string',
  },
  data() {
    return {
      displayDetails: false,
      displayCompleted: false,
    };
  },
  computed: {
    onboardingData(): AppOnboardingData {
      return store.state.onboardingData;
    },
    reqs(): readonly GroupedRequirementFulfillmentReport[] {
      return store.state.groupedRequirementFulfillmentReport;
    },
    partitionedRequirementsProgress(): PartitionedRequirementsProgress {
      const ongoing: RequirementFulfillment[] = [];
      const completed: RequirementFulfillment[] = [];
      this.req.reqs.forEach(req => {
        if (req.fulfillment.safeMinCountFulfilled < req.fulfillment.minCountRequired) {
          ongoing.push(req);
        } else if (
          req.fulfillment.additionalRequirements != null &&
          Object.values(req.fulfillment.additionalRequirements).some(
            it => it.safeMinCountFulfilled < it.minCountRequired
          )
        ) {
          ongoing.push(req);
        } else {
          completed.push(req);
        }
      });
      return { ongoing, completed };
    },
  },
  methods: {
    getReqColor,
    activateMajor(id: number) {
      this.$emit('activateMajor', id);
    },
    activateMinor(id: number) {
      this.$emit('activateMinor', id);
    },
    onShowAllCourses(courses: {
      requirementName: string;
      subReqCoursesArray: readonly FirestoreSemesterCourse[];
    }) {
      this.$emit('onShowAllCourses', courses);
    },
    changeToggleableRequirementChoice(requirementID: string, option: string) {
      this.$emit('changeToggleableRequirementChoice', requirementID, option);
    },
    toggleDetails() {
      this.displayDetails = !this.displayDetails;
    },
    turnCompleted(bool: boolean) {
      GTagEvent(this.$gtag, 'requirements-bar-filled-requirements-toggle');
      this.displayCompleted = bool;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_tokens.scss';

.requirementview {
  @include cp-font;
}

// small muted section label above the ongoing list
.ongoing {
  @include cp-text(12px, 16px, 500);
  color: $cp-muted;
  margin: 8px 0;
}

// "Completed (n)": the V2 expand row
.completed {
  @include cp-reset-button;
  width: calc(100% + 16px);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px -8px 0;
  padding: 8px;
  border-radius: $cp-r-sm;
  text-align: left;
  transition: background-color 100ms;

  &:hover {
    background: $cp-hover;
  }

  &:active {
    background: $cp-press;
  }

  &-label {
    @include cp-text(12px, 16px, 500);
    color: $cp-muted;
  }

  &-chevron {
    flex-shrink: 0;
    color: $cp-muted;
    transition: transform 200ms;

    &--closed {
      transform: rotate(-90deg);
    }
  }
}

.separator {
  height: 1px;
  width: 100%;
  background-color: $cp-line;
}
</style>

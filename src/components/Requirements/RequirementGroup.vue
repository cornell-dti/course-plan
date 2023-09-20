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
        <h2>Ongoing Requirements</h2>
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

        <div v-if="partitionedRequirementsProgress.completed.length > 0" class="row completed">
          <h2 class="col specific">Completed Requirements</h2>
          <div class="col-1 text-right">
            <button
              class="btn float-right"
              :style="{ color: `#${getReqColor(req.groupName, onboardingData)}` }"
            >
              <!-- Toggle to display completed reqs -->
              <p
                class="toggle"
                v-if="displayCompleted"
                @click="turnCompleted(false)"
                data-cyId="requirements-showCompleted"
              >
                HIDE
              </p>
              <p
                class="toggle"
                v-else
                @click="turnCompleted(true)"
                data-cyId="requirements-showCompleted"
              >
                SHOW
              </p>
            </button>
          </div>
        </div>

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
            it => it.safeMinCountFulfilled < it.minCountRequired,
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
.specific {
  padding-left: 0;
  color: $darkGray;
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
.toggle {
  margin-top: auto;
  margin-bottom: auto;
  font-weight: bold;
  font-size: 12px;
  line-height: 12px;
}
.completed {
  margin-top: 1rem;
  &-ptext {
    color: $lightPlaceholderGray;
    font-size: 12px;
    opacity: 0.8;
    font-weight: normal;
  }
}
.separator {
  height: 1px;
  width: 100%;
  background-color: $inactiveGray;
}
</style>

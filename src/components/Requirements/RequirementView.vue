<template>
  <div class="requirementview">
    <requirement-header
      :reqIndex="reqIndex"
      :displayDetails="displayDetails"
      :displayedMajorIndex="displayedMajorIndex"
      :displayedMinorIndex="displayedMinorIndex"
      :req="req"
      :reqGroupColorMap="reqGroupColorMap"
      :onboardingData="onboardingData"
      :showMajorOrMinorRequirements="showMajorOrMinorRequirements"
      :numOfColleges="numOfColleges"
      @activateMajor="activateMajor"
      @activateMinor="activateMinor"
      @toggleDetails="toggleDetails"
    />
    <div v-if="showMajorOrMinorRequirements">
      <!--Show more of completed requirements -->
      <div v-if="displayDetails">
        <p class="sub-title">In-Depth College Requirements</p>
        <div class="separator"></div>
        <div v-for="(subReq, id) in partitionedRequirementsProgress.ongoing" :key="id">
          <sub-requirement
            :subReq="subReq"
            :toggleableRequirementChoice="toggleableRequirementChoices[subReq.requirement.id]"
            :color="reqGroupColorMap[req.groupName][0]"
            :isCompleted="false"
            @changeToggleableRequirementChoice="changeToggleableRequirementChoice"
            @onShowAllCourses="onShowAllCourses"
            @deleteCourseFromSemesters="deleteCourseFromSemesters"
          />
          <div class="separator"></div>
        </div>

        <div v-if="partitionedRequirementsProgress.completed.length > 0" class="row completed">
          <p class="col sub-title specific">Filled Requirements</p>
          <div class="col-1 text-right">
            <button
              class="btn float-right"
              :style="{ color: `#${reqGroupColorMap[req.groupName][0]}` }"
            >
              <!-- Toggle to display completed reqs -->
              <p class="toggle" v-if="displayCompleted" @click="turnCompleted(false)">HIDE</p>
              <p class="toggle" v-else @click="turnCompleted(true)">SHOW</p>
            </button>
          </div>
        </div>

        <!-- Completed requirements -->
        <div v-if="displayCompleted">
          <div v-for="(subReq, id) in partitionedRequirementsProgress.completed" :key="id">
            <div class="separator" v-if="reqIndex < reqs.length - 1 || displayDetails"></div>
            <sub-requirement
              :subReq="subReq"
              :toggleableRequirementChoice="toggleableRequirementChoices[subReq.requirement.id]"
              :color="reqGroupColorMap[req.groupName][0]"
              :isCompleted="true"
              @changeToggleableRequirementChoice="changeToggleableRequirementChoice"
              @onShowAllCourses="onShowAllCourses"
              @deleteCourseFromSemesters="deleteCourseFromSemesters"
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
import Vue, { PropType } from 'vue';
import RequirementHeader from '@/components/Requirements/RequirementHeader.vue';
import SubRequirement from '@/components/Requirements/SubRequirement.vue';

import store from '@/store';

// reqGroupColorMap maps reqGroup to an array [<hex color for progress bar>, <color for arrow image>]
const reqGroupColorMap = {
  College: ['4D7D92', 'sangBlue'],
  Major: ['148481', 'emGreen'],
  Minor: ['105351', 'chrisGreen'],
};

type PartitionedRequirementsProgress = {
  readonly ongoing: readonly RequirementFulfillment[];
  readonly completed: readonly RequirementFulfillment[];
};

export default Vue.extend({
  components: { RequirementHeader, SubRequirement },
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
    reqGroupColorMap() {
      return reqGroupColorMap;
    },
    partitionedRequirementsProgress(): PartitionedRequirementsProgress {
      const ongoing: RequirementFulfillment[] = [];
      const completed: RequirementFulfillment[] = [];
      this.req.reqs.forEach(req => {
        if (req.minCountFulfilled < req.minCountRequired) {
          ongoing.push(req);
        } else {
          completed.push(req);
        }
      });
      return { ongoing, completed };
    },
  },
  methods: {
    activateMajor(id: number) {
      this.$emit('activateMajor', id);
    },
    activateMinor(id: number) {
      this.$emit('activateMinor', id);
    },
    onShowAllCourses(courses: FirestoreSemesterCourse[]) {
      this.$emit('onShowAllCourses', courses);
    },
    changeToggleableRequirementChoice(requirementID: string, option: string) {
      this.$emit('changeToggleableRequirementChoice', requirementID, option);
    },
    toggleDetails() {
      this.displayDetails = !this.displayDetails;
    },
    turnCompleted(bool: boolean) {
      this.displayCompleted = bool;
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
.specific {
  color: $lightPlaceholderGray;
}
.sub-title {
  padding: 0;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
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

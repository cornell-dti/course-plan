<template>
  <div class="requirementview">
    <requirementheader
      :reqIndex="reqIndex"
      :majors="majors"
      :minors="minors"
      :displayDetails="displayDetails"
      :displayedMajorIndex="displayedMajorIndex"
      :displayedMinorIndex="displayedMinorIndex"
      :req="req"
      :reqGroupColorMap="reqGroupColorMap"
      :user="user"
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
        <div
          v-for="(subReq, id) in req.ongoing"
          :key="id">
          <subrequirement
            :subReqIndex="id"
            :subReq="subReq"
            :reqIndex="reqIndex"
            :toggleableRequirementChoice="toggleableRequirementChoices[subReq.id]"
            :color="reqGroupColorMap[req.group][0]"
            :isCompleted="false"
            :rostersFromLastTwoYears="rostersFromLastTwoYears"
            @changeToggleableRequirementChoice="changeToggleableRequirementChoice"
          />
        </div>

        <div v-if="req.completed.length > 0" class="row completed">
          <p class="col sub-title specific">Filled Requirements</p>
          <div class="col-1 text-right">
            <button class="btn float-right" :style="{ 'color': `#${reqGroupColorMap[req.group][0]}` }">
              <!-- Toggle to display completed reqs -->
              <p class="toggle" v-if="displayCompleted" v-on:click="turnCompleted(false)">HIDE</p>
              <p class="toggle" v-else v-on:click="turnCompleted(true)">SHOW</p>
            </button>
          </div>
        </div>

      <!-- Completed requirements -->
        <div v-if="displayCompleted">
          <div v-for="(subReq, id) in req.completed" :key="id">
            <div class="separator" v-if="reqIndex < reqs.length - 1 || displayDetails"></div>
            <subrequirement
              :subReqIndex="id"
              :subReq="subReq"
              :reqIndex="reqIndex"
              :toggleableRequirementChoice="toggleableRequirementChoices[subReq.id]"
              :color="reqGroupColorMap[req.group][0]"
              :isCompleted="true"
              :rostersFromLastTwoYears="rostersFromLastTwoYears"
              @changeToggleableRequirementChoice="changeToggleableRequirementChoice"
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
import RequirementHeader from '@/components/RequirementHeader.vue';
import SubRequirement from '@/components/SubRequirement.vue';

import { SingleMenuRequirement } from '@/requirements/types';
import { AppUser, AppMajor, AppMinor, FirestoreSemesterCourse } from '@/user-data';

Vue.component('requirementheader', RequirementHeader);
Vue.component('subrequirement', SubRequirement);

// reqGroupColorMap maps reqGroup to an array [<hex color for progress bar>, <color for arrow image>]
const reqGroupColorMap = {
  COLLEGE: ['1AA9A5', 'blue'],
  MAJOR: ['105351', 'green'],
  MINOR: ['92C3E6', 'lightblue']
};

export default Vue.extend({
  props: {
    reqs: Array as PropType<readonly SingleMenuRequirement[]>,
    req: Object as PropType<SingleMenuRequirement>,
    reqIndex: Number, // Index of this req in reqs array
    majors: Array as PropType<readonly AppMajor[]>,
    minors: Array as PropType<readonly AppMinor[]>,
    toggleableRequirementChoices: Object as PropType<Readonly<Record<string, string>>>,
    displayedMajorIndex: Number,
    displayedMinorIndex: Number,
    user: Object as PropType<AppUser>,
    showMajorOrMinorRequirements: Boolean,
    numOfColleges: Number,
    rostersFromLastTwoYears: Array as PropType<readonly String[]>
  },
  data() {
    return {
      displayDetails: false,
      displayCompleted: false,
    };
  },
  computed: {
    reqGroupColorMap() {
      return reqGroupColorMap;
    }
  },
  methods: {
    activateMajor(id: number) {
      this.$emit('activateMajor', id);
    },
    activateMinor(id: number) {
      this.$emit('activateMinor', id);
    },
    changeToggleableRequirementChoice(requirementID: string, option: string) {
      this.$emit('changeToggleableRequirementChoice', requirementID, option);
    },
    toggleDetails() {
      this.displayDetails = !this.displayDetails;
    },
    turnCompleted(bool: boolean) {
      this.displayCompleted = bool;
    }
  }
});
</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables.scss";

.btn {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &-2{
    padding-top: 0px;
    margin:0px
  }
}
.btn:focus,.btn:active {
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
  color: #757575;
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
  color: white;
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
     color: #757575;
     font-size: 12px;
     opacity: 0.8;
     font-weight: normal;
   }
 }
.separator {
  height: 1px;
  width: 100%;
  background-color: #d7d7d7;
}
</style>

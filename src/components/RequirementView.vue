<template>
  <div class="requirementview">
    <requirementheader
      :reqIndex="reqIndex"
      :majors="majors"
      :minors="minors"
      :req="req"
      :reqGroupColorMap="reqGroupColorMap"
      :user="user"
      :showMajorOrMinorRequirements="showMajorOrMinorRequirements"
      @activateMajor="activateMajor"
      @activateMinor="activateMinor"
      @toggleDetails="toggleDetails"
    />
    <div v-if="showMajorOrMinorRequirements">
      <!--Show more of completed requirements -->
      <div v-if="req.displayDetails">
        <p class="sub-title">In-Depth College Requirements</p>
        <div class="separator"></div>
        <div
          v-for="(subReq, id) in req.ongoing"
          :key="subReq.id">
          <subrequirement
            :subReqIndex="id"
            :subReq="subReq"
            :reqIndex="reqIndex"
            :color="reqGroupColorMap[req.group][0]"
            :isCompleted="false"
            :isUniversitySubReq="req.group==='UNIVERSITY'"
            :rostersFromLastTwoYears="rostersFromLastTwoYears"
            @toggleDescription="toggleDescription"
          />
        </div>

        <div v-if="req.completed.length > 0" class="row completed">
          <p class="col sub-title specific">Filled Requirements</p>
          <div class="col-1 text-right">
            <button class="btn float-right" :style="{ 'color': `#${reqGroupColorMap[req.group][0]}` }">
              <!-- Toggle to display completed reqs -->
              <p
                class="toggle"
                v-if="req.displayCompleted"
                v-on:click="turnCompleted(reqIndex, false)">HIDE</p>
              <p class="toggle" v-else v-on:click="turnCompleted(reqIndex, true)">SHOW</p>
            </button>
          </div>
        </div>

      <!-- Completed requirements -->
        <div v-if="req.displayCompleted">
          <div v-for="(subReq, id) in req.completed" :key="subReq.id">
            <div class="separator" v-if="reqIndex < reqs.length - 1 || req.displayDetails"></div>
            <subrequirement
              :subReqIndex="id"
              :subReq="subReq"
              :reqIndex="reqIndex"
              :color="reqGroupColorMap[req.group][0]"
              :isCompleted="true"
              :isUniversitySubReq="req.group==='UNIVERSITY'"
              :rostersFromLastTwoYears="rostersFromLastTwoYears"
              @toggleDescription="toggleDescription"
            />
          </div>
        </div>
      </div>

    <!-- Add separator if additional completed requirements -->
    <div class="separator"></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import RequirementHeader from '@/components/RequirementHeader';
import SubRequirement from '@/components/SubRequirement';

Vue.component('requirementheader', RequirementHeader);
Vue.component('subrequirement', SubRequirement);

export default {
  props: {
    reqs: Array,
    req: Object,
    reqIndex: Number, // Index of this req in reqs array
    majors: Array,
    minors: Array,
    reqGroupColorMap: Object,
    user: Object,
    showMajorOrMinorRequirements: Boolean,
    rostersFromLastTwoYears: Array
  },
  methods: {
    activateMajor(id) {
      this.$emit('activateMajor', id);
    },
    activateMinor(id) {
      this.$emit('activateMinor', id);
    },
    toggleDetails(index) {
      console.log('toggleDetails from RequirementView');
      this.$emit('toggleDetails', index);
    },
    toggleDescription(index, type, id) {
      this.$emit('toggleDescription', index, type, id);
    },
    turnCompleted(index, bool) {
      this.$emit('turnCompleted', index, bool);
    }
  }
};
</script>

<style scoped lang="scss">
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
  color: #3C3C3C;
}
button.active {
  color: #508197;
  border-bottom: solid 10px #508197;
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

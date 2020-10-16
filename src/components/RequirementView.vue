<template>
  <div class="requirementview">
    <!-- TODO change for multiple colleges -->
    <div v-if="index<=2 || index == 2 + majors.length" class="row top">
      <p class="name col p-0">{{ req.name }}</p>
    </div>
      <!-- TODO change for multiple colleges -->
      <div v-if="index==2" class="major">
        <div :style="{'border-bottom': major.display ? `2px solid #${reqGroupColorMap[req.group][0]}` : ''}"
          @click="activateMajor(id)" class="major-title" v-for="(major, id) in majors" :key="major.id">
          <p :style="{'font-weight': major.display ? '500' : '', 'color' : major.display ? `#${reqGroupColorMap[req.group][0]}` : ''}"  class="major-title-top">{{major.majorFN}}</p>
          <p :style="{'color': major.display ? `#${reqGroupColorMap[req.group][0]}` : ''}" class="major-title-bottom">({{user.collegeFN}})</p>
        </div>
      </div>
      <div v-if="index==2+majors.length" class="minor">
        <div :style="{'border-bottom': minor.display ? `2px solid #${reqGroupColorMap[req.group][0]}` : ''}"
          @click="activateMinor(id)" class="major-title" v-for="(minor, id) in minors" :key="minor.id">
          <p :style="{'font-weight': minor.display ? '500' : '', 'color' : minor.display ? `#${reqGroupColorMap[req.group][0]}` : ''}"  class="minor-title-top">{{minor.minorFN}}</p>
          <!-- <p :style="{'color': minor.display ? `#${reqGroupColorMap[req.group][0]}` : ''}" class="minor-title-bottom">({{user.collegeFN}})</p> Change for multiple colleges -->
        </div>
      </div>

      <!-- progress bar settings -->
      <div v-if="showMajorOrMinorRequirements(index, req.group)" >
        <div class="progress">
          <div
            class="progress-bar"
            :style="{ 'background-color': `#${reqGroupColorMap[req.group][0]}`, width: `${(req.fulfilled/req.required)*100}%`}"
            role="progressbar"
          ></div>
        </div>

        <p class="progress-text">
          <span class="progress-text-credits">{{ req.fulfilled }}/{{ req.required }}</span>
          <span class="progress-text-text"> Total {{ req.type }} Inputted on Schedule</span>
        </p>

        <!--View more college requirements -->
        <div class="row top">
          <div class="col-1 p-0" >
            <button :style="{ 'color': `#${reqGroupColorMap[req.group][0]}` }" class="btn" @click="toggleDetails(index)">
              <!-- svg for dropdown icon -->
              <img
                v-if="req.displayDetails"
                class="arrow arrow-up"
                :src="require(`@/assets/images/dropup-${reqGroupColorMap[req.group][1]}.svg`)"
                alt="dropup"
              />
              <img
                v-else
                class="arrow arrow-down"
                :src="require(`@/assets/images/dropdown-${reqGroupColorMap[req.group][1]}.svg`)"
                alt="dropdown"
              />
            </button>
          </div>
          <div class="col p-0 ">
              <button
                  class="btn req-name"
                  :style="{ 'color': `#${reqGroupColorMap[req.group][0]}` }"
                  @click="toggleDetails(index)">
                  {{ (req.displayDetails) ? "Hide" : "View" }} All {{ req.group.charAt(0) + req.group.substring(1).toLowerCase() }} Requirements
              </button>
          </div>
        </div>

        <!--Show more of completed requirements -->
        <div v-if="req.displayDetails">
          <p class="sub-title">In-Depth College Requirements</p>
          <div class="separator"></div>
          <div
            v-for="(subReq, id) in req.ongoing"
            :key="subReq.id">
            <subrequirement
              :id="id"
              :subReq="subReq"
              :index="index"
              :color="reqGroupColorMap[req.group][0]"
              :isCompleted="false"
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
                  v-on:click="turnCompleted(index, false)">HIDE</p>
                <p class="toggle" v-else v-on:click="turnCompleted(index, true)">SHOW</p>
              </button>
            </div>
          </div>

        <!-- Completed requirements -->
          <div v-if="req.displayCompleted">
            <div v-for="(subReq, id) in req.completed" :key="subReq.id">
              <div class="separator" v-if="index < reqs.length - 1 || req.displayDetails"></div>
              <subrequirement
                :id="id"
                :subReq="subReq"
                :index="index"
                :color="reqGroupColorMap[req.group][0]"
                :isCompleted="true"
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
import SubRequirement from '@/components/SubRequirement';

Vue.component('subrequirement', SubRequirement);

export default {
  props: {
    reqs: Array,
    req: Object,
    index: Number,
    majors: Array,
    minors: Array,
    reqGroupColorMap: Object,
    user: Object
  },
  methods: {
    activateMajor(id) {
      this.$emit('activateMajor', id);
    },
    activateMinor(id) {
      this.$emit('activateMinor', id);
    },
    showMajorOrMinorRequirements(id, group) {
      let currentDisplay = 0;
      if (group === 'MAJOR') {
        this.majors.forEach((major, i) => {
          if (major.display) {
            currentDisplay = i + 2; // TODO CHANGE FOR MULTIPLE COLLEGES & UNIVERISTIES
          }
        });
        return (id < 2 || id === currentDisplay);
      }
      this.minors.forEach((minor, i) => {
        if (minor.display) {
          currentDisplay = i + 2 + this.majors.length; // TODO CHANGE FOR MULTIPLE COLLEGES & UNIVERISTIES
        }
      });
      return (id < 2 || id === currentDisplay);
    },
    toggleDetails(index) {
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
input{
  width: 40px;
}
.major, .minor{
  display: flex;
  padding-bottom: 25px;
  &-title {
      width: 100%;
      display: flex;
      flex-direction: column;
      text-align: center;
      color: #757575;
      padding-bottom: 6px;
      &-top {
        text-align: center;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        margin: 0;
      }
      &-bottom {
        text-align: center;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 15px;
      }
    }
      &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
}
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
.pointer {
  cursor: pointer;
}
.progress {
  border-radius: 1rem;
  height: 10px;
}
.top {
  margin: 1.5rem 0 1rem 0;
  &-small{
    margin: 0px;
  }
}
.middle {
  display: flex;
  align-items: center;
  justify-content: center;
}
.name {
  margin-top: auto;
  margin-bottom: auto;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  color: #000000;
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
.major {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
  &-college {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;
    color: #000000;
  }
}
.tab-div{
  padding:1px;
}
button.active {
  color: #508197;
  border-bottom: solid 10px #508197;
  padding-bottom: 2px;
  margin: 5px;
}
.arrow {
  height: 14px;
  width: 14px;
}
.arrow {
  fill: #1AA9A5;
  color:#1AA9A5;
  margin-top: -2px;
    &-up {
     margin-top: 4px;
   }
}
.progress-text {
  margin: 0.3125rem 0 0 0;
  font-size: 12px;
  line-height: 12px;
  color: #3C3C3C;

   &-credits {
     font-weight: bold;
   }
   &-text {
     font-weight: normal;
   }
}
ul.striped-list > li {
  padding: 2px;
  border-bottom-style: rgba(196, 196, 196, 0.4);
  border-block-color: rgba(196, 196, 196, 0.4);
  color: #757575;
}
.fuffill{
  padding: 20px;
  padding-left: 0px;
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
.detail-bar {
  margin: 1.625rem 0 0.8125rem 0;
  width: 100%;
}
.x {
  padding-left: 0px;
  padding-right: 15px;
  max-width: 25px;
}
.detail-text {
  margin-top: auto;
  margin-bottom: auto;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
}
.seeMore {
  width: 44px;
  height: 15px;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 14px;
  /* identical to box height */
  color: #2bbcc6;
}
.cancel {
  height: 10px;
  width: 10px;
}
.dropdown {
  height: 5px;
  width: 5px;
}
.button-dropdown {
  background-color: transparent;
  color: transparent;
  outline-style: transparent;
}
.toggle {
  margin-top: auto;
  margin-bottom: auto;
  font-weight: bold;
  font-size: 12px;
  line-height: 12px;
}
.req {
  margin-top: auto;
  margin-bottom: auto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  &-name {
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    align-self: center;
  }
  &-progress {
    font-size: 12px;
    line-height: 12px;
  }
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
.semester-req {
  border: none;
  max-width: 350px;
}
.separator {
  height: 1px;
  width: 100%;
  background-color: #d7d7d7;
}
</style>

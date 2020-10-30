<template>
  <div class="requirementheader">
    <!-- TODO change for multiple colleges -->
    <div v-if="reqIndex<=numOfColleges || reqIndex == numOfColleges + majors.length" class="row top">
      <p class="name col p-0">{{ req.name }}</p>
    </div>
      <!-- TODO change for multiple colleges -->
      <div v-if="reqIndex==numOfColleges" class="major">
        <div :style="{'border-bottom': major.display ? `2px solid #${reqGroupColorMap[req.group][0]}` : '' }"
          @click="activateMajor(id)" class="major-title" v-for="(major, id) in majors" :key="major.id" :class="{ pointer: multipleMajors }">
          <p :style="{'font-weight': major.display ? '500' : '', 'color' : major.display ? `#${reqGroupColorMap[req.group][0]}` : ''}"  class="major-title-top">{{major.majorFN}}</p>
          <p :style="{'color': major.display ? `#${reqGroupColorMap[req.group][0]}` : ''}" class="major-title-bottom">({{user.collegeFN}})</p>
        </div>
      </div>
      <div v-if="reqIndex==numOfColleges+majors.length" class="minor">
        <div :style="{'border-bottom': minor.display ? `2px solid #${reqGroupColorMap[req.group][0]}` : '' }"
          @click="activateMinor(id)" class="major-title" v-for="(minor, id) in minors" :key="minor.id"
          :class="{ pointer: multipleMinors }">
          <p :style="{'font-weight': minor.display ? '500' : '', 'color' : minor.display ? `#${reqGroupColorMap[req.group][0]}` : ''}"  class="minor-title-top">{{minor.minorFN}}</p>
          <!-- <p :style="{'color': minor.display ? `#${reqGroupColorMap[req.group][0]}` : ''}" class="minor-title-bottom">({{user.collegeFN}})</p> Change for multiple colleges -->
        </div>
      </div>

      <!-- progress bar settings -->
      <div v-if="showMajorOrMinorRequirements" >
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
            <button :style="{ 'color': `#${reqGroupColorMap[req.group][0]}` }" class="btn" @click="toggleDetails(reqIndex)">
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
                  @click="toggleDetails(reqIndex)">
                  {{ (req.displayDetails) ? "Hide" : "View" }} All {{ req.group.charAt(0) + req.group.substring(1).toLowerCase() }} Requirements
              </button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    reqIndex: Number,
    majors: Array,
    minors: Array,
    req: Object,
    reqGroupColorMap: Object,
    user: Object,
    showMajorOrMinorRequirements: Boolean,
    numOfColleges: Number
  },
  data() {
    return {
      multipleMajors: this.majors.length > 1,
      multipleMinors: this.minors.length > 1
    };
  },
  methods: {
    toggleDetails(index) {
      this.$emit('toggleDetails', index);
    },
    activateMajor(id) {
      this.$emit('activateMajor', id);
    },
    activateMinor(id) {
      this.$emit('activateMinor', id);
    }
  }
};
</script>

<style scoped lang="scss">
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
.name {
  margin-top: auto;
  margin-bottom: auto;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  color: #000000;
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
.dropdown {
  height: 5px;
  width: 5px;
}
.button-dropdown {
  background-color: transparent;
  color: transparent;
  outline-style: transparent;
}
.req {
  &-name {
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    align-self: center;
  }
.pointer {
  cursor: pointer;
}
}
</style>

<template>
  <div class="requirementheader">
    <!-- TODO change for multiple colleges -->
    <div
      v-if="reqIndex <= numOfColleges || reqIndex == numOfColleges + majors.length"
      class="row top"
    >
      <p class="name col p-0">{{ req.name }}</p>
    </div>
    <!-- TODO change for multiple colleges -->
    <div v-if="reqIndex == numOfColleges" class="major">
      <div
        :style="{
          'border-bottom':
            id === displayedMajorIndex ? `2px solid #${reqGroupColorMap[req.group][0]}` : '',
        }"
        @click="activateMajor(id)"
        class="major-title"
        v-for="(major, id) in majors"
        :key="id"
        :class="{ pointer: multipleMajors }"
      >
        <p
          :style="{
            'font-weight': id === displayedMajorIndex ? '500' : '',
            color: id === displayedMajorIndex ? `#${reqGroupColorMap[req.group][0]}` : '',
          }"
          class="major-title-top"
        >
          {{ major.majorFN }}
        </p>
        <p
          :style="{ color: id === displayedMajorIndex ? `#${reqGroupColorMap[req.group][0]}` : '' }"
          class="major-title-bottom"
        >
          ({{ user.collegeFN }})
        </p>
      </div>
    </div>
    <div v-if="reqIndex == numOfColleges + majors.length" class="minor">
      <div
        :style="{
          'border-bottom':
            id === displayedMinorIndex ? `2px solid #${reqGroupColorMap[req.group][0]}` : '',
        }"
        @click="activateMinor(id)"
        class="major-title"
        v-for="(minor, id) in minors"
        :key="id"
        :class="{ pointer: multipleMinors }"
      >
        <p
          :style="{
            'font-weight': id === displayedMinorIndex ? '500' : '',
            color: id === displayedMinorIndex ? `#${reqGroupColorMap[req.group][0]}` : '',
          }"
          class="minor-title-top"
        >
          {{ minor.minorFN }}
        </p>
        <!-- <p :style="{'color': minor.display ? `#${reqGroupColorMap[req.group][0]}` : ''}" class="minor-title-bottom">({{user.collegeFN}})</p> Change for multiple colleges -->
      </div>
    </div>

    <!-- progress bar settings -->
    <div v-if="showMajorOrMinorRequirements">
      <div class="progress">
        <div
          class="progress-bar"
          :style="{
            'background-color': `#${reqGroupColorMap[req.group][0]}`,
            width: progressWidth,
          }"
          role="progressbar"
          aria-label="Requirements Progress"
          :aria-valuenow="progressWidthValue"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      <p class="progress-text">
        <span class="progress-text-credits">{{ req.fulfilled }}/{{ req.required }}</span>
        <span class="progress-text-text"> Total {{ req.type }} Inputted on Schedule</span>
      </p>

      <!--View more college requirements -->
      <div class="row top">
        <div class="col-1 p-0">
          <button
            :style="{ color: `#${reqGroupColorMap[req.group][0]}` }"
            class="btn"
            @click="toggleDetails()"
          >
            <dropdownarrow
              :isFlipped="displayDetails"
              :fillColor="`#${reqGroupColorMap[req.group][0]}`"
            />
          </button>
        </div>
        <div class="col p-0">
          <button
            class="btn req-name"
            :style="{ color: `#${reqGroupColorMap[req.group][0]}` }"
            @click="toggleDetails()"
          >
            {{ displayDetails ? 'Hide' : 'View' }} All
            {{ req.group.charAt(0) + req.group.substring(1).toLowerCase() }} Requirements
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DropDownArrow from '@/components/DropDownArrow.vue';
import { SingleMenuRequirement } from '@/requirements/types';
import { AppUser, AppMajor, AppMinor } from '@/user-data';

Vue.component('dropdownarrow', DropDownArrow);

export default Vue.extend({
  props: {
    reqIndex: Number,
    majors: Array as PropType<readonly AppMajor[]>,
    minors: Array as PropType<readonly AppMinor[]>,
    displayDetails: Boolean,
    displayedMajorIndex: Number,
    displayedMinorIndex: Number,
    req: Object as PropType<SingleMenuRequirement>,
    reqGroupColorMap: Object as PropType<Readonly<Record<string, string[]>>>,
    user: Object as PropType<AppUser>,
    showMajorOrMinorRequirements: Boolean,
    numOfColleges: Number,
  },
  computed: {
    multipleMajors() {
      return this.majors.length > 1;
    },
    multipleMinors() {
      return this.minors.length > 1;
    },
    progressWidth() {
      if (this.req.fulfilled != null && this.req.required != null) {
        return `${(this.req.fulfilled / this.req.required) * 100}%`;
      }
      return undefined;
    },
    progressWidthValue() {
      if (this.req.fulfilled != null && this.req.required != null) {
        return ((this.req.fulfilled / this.req.required) * 100).toFixed(1);
      }
      return '0';
    },
  },
  methods: {
    toggleDetails() {
      this.$emit('toggleDetails');
    },
    activateMajor(id: number) {
      this.$emit('activateMajor', id);
    },
    activateMinor(id: number) {
      this.$emit('activateMinor', id);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.major,
.minor {
  display: flex;
  padding-bottom: 25px;
  &-title {
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    color: $lightPlaceholderGray;
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
.progress {
  border-radius: 1rem;
  height: 10px;
}
.top {
  margin: 1.5rem 0 1rem 0;
  &-small {
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
  color: $darkGray;
}
.major {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: $darkGray;
  &-college {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;
    color: $darkGray;
  }
}
button.active {
  color: $sangBlue;
  border-bottom: solid 10px $sangBlue;
  padding-bottom: 2px;
  margin: 5px;
}
.progress-text {
  margin: 0.3125rem 0 0 0;
  font-size: 12px;
  line-height: 12px;
  color: $darkGray;

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

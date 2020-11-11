<template>
  <div class="subrequirement">
  <div class="row depth-req">
    <div class="col-1" @click="toggleDescription(reqIndex, isCompleted, subReqIndex)">
      <button class="btn">
        <img
          v-if="subReq.displayDescription"
          class="arrow arrow-up"
          :src="getSrc()"
          alt="dropup"
        />
        <img
          v-else
          class="arrow arrow-down"
          :src="getSrc()"
          alt="dropdown"
        />
      </button>
    </div>
    <div class="col-7" @click="toggleDescription(reqIndex, isCompleted, subReqIndex)">
      <p v-bind:class="[{'sup-req': !this.isCompleted}, 'pointer', this.isCompleted ? 'completed-ptext' : 'incomplete-ptext']">{{subReq.requirement.name}}</p>
    </div>
    <div class="col">
      <p v-if="!this.isCompleted" class="sup-req-progress text-right incomplete-ptext">{{
        (subReq.fulfilledBy !== 'self-check')
        ? `${subReq.totalCountFulfilled || subReq.minCountFulfilled}/${subReq.totalCountRequired
        || subReq.minCountRequired} ${subReq.fulfilledBy}`
        : 'self check' }}</p>
      <p v-if="this.isCompleted" class="text-right completed-ptext">{{subReq.minCountFulfilled}}/{{subReq.minCountRequired}} {{ subReq.fulfilledBy }}</p>
    </div>
  </div>
  <div v-if="subReq.displayDescription" :class="[{'completed-ptext': this.isCompleted}, 'description']">
    {{ subReq.requirement.description }} <a class="more"
    :style="{ 'color': `#${color}` }"
    :href="subReq.requirement.source" target="_blank">
    <strong>Learn More</strong></a>
    <div v-if="subReq.requirement.fulfilledBy === 'toggleable'">
      <div class="toggleable-requirements-select-wrapper">
        <div
          class="toggleable-requirements-select toggleable-requirements-input"
          v-click-outside="closeMenuIfOpen"
        >
          <div
            class="toggleable-requirements-dropdown-placeholder toggleable-requirements-dropdown-wrapper"
            @click="showFulfillmentOptionsDropdown = !showFulfillmentOptionsDropdown"
          >
            <div
              class="toggleable-requirements-dropdown-placeholder toggleable-requirements-dropdown-innerPlaceholder"
            >
              {{ selectedFulfillmentOption }}
            </div>
            <div class="toggleable-requirements-dropdown-placeholder toggleable-requirements-dropdown-arrow"></div>
          </div>
          <div class="toggleable-requirements-dropdown-content" v-if="showFulfillmentOptionsDropdown">
            <div
              v-for="optionName in Object.keys(subReq.requirement.fulfillmentOptions)"
              :key="optionName"
              class="toggleable-requirements-dropdown-content-item"
              @click="chooseFulfillmentOption(optionName)"
            >
              {{optionName}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!this.isCompleted" class="separator"></div>
  </div>
</template>


<script lang="ts">
import Vue, { PropType } from 'vue';
import CompletedSubReqCourse from '@/components/CompletedSubReqCourse.vue';
import IncompleteSubReqCourse from '@/components/IncompleteSubReqCourse.vue';

import { DisplayableRequirementFulfillment } from '@/requirements/types';
import { clickOutside } from '@/utilities';

// Arrows for dropup and dropdown
import dropupIncompleteSrc from '@/assets/images/dropup.svg';
import dropupCompletedSrc from '@/assets/images/dropup-lightgray.svg';
import dropdownIncompleteSrc from '@/assets/images/dropdown.svg';
import dropdownCompletedSrc from '@/assets/images/dropdown-lightgray.svg';

Vue.component('completedsubreqcourse', CompletedSubReqCourse);
Vue.component('incompletesubreqcourse', IncompleteSubReqCourse);

export default Vue.extend({
  props: {
    subReq: Object as PropType<DisplayableRequirementFulfillment>,
    subReqIndex: Number, // Subrequirement index
    reqIndex: Number, // Requirement index
    color: String,
    isCompleted: Boolean
  },
  data() {
    return {
      showFulfillmentOptionsDropdown: false,
      selectedFulfillmentOption: this.subReq.requirement.fulfilledBy !== 'toggleable'
        ? ''
        : Object.keys(this.subReq.requirement.fulfillmentOptions)[0]
    }
  },
  directives: {
    'click-outside': clickOutside
  },
  methods: {
    getSrc() {
      let src = dropdownCompletedSrc;
      if (this.subReq.displayDescription && !this.isCompleted) {
        src = dropupIncompleteSrc;
      } else if (this.subReq.displayDescription && this.isCompleted) {
        src = dropupCompletedSrc;
      } else if (!this.subReq.displayDescription && !this.isCompleted) {
        src = dropdownIncompleteSrc;
      }
      return src;
    },
    toggleDescription(reqIndex: number, isCompleted: boolean, subReqIndex: number) {
      const type = isCompleted ? 'completed' : 'ongoing';
      this.$emit('toggleDescription', reqIndex, type, subReqIndex);
    },
    closeMenuIfOpen() {
      this.showFulfillmentOptionsDropdown = false;
    },
    chooseFulfillmentOption(option: string) {
      this.selectedFulfillmentOption = option;
      this.showFulfillmentOptionsDropdown = false;
    },
  },
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

.depth-req {
  margin: 0.5rem 0 0.1rem 0;
  min-height: 14px;
}
.sub-req-div {
  padding-left: 30px;
  margin: 0px;
}
.description {
  margin: 0 0 0.5rem 1.8rem;
  color: #353535;
  font-size: 14px;
}
.pointer {
  cursor: pointer;
}
button.active {
  color: $sangBlue;
  border-bottom: solid 10px $sangBlue;
  padding-bottom: 2px;
  margin: 5px;
}
.arrow {
  height: 14px;
  width: 14px;
  fill: $emGreen;
  color:$emGreen;
  margin-top: -2px;
    &-up {
     margin-top: 4px;
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
.completed {
   margin-top: 1rem;
   &-ptext {
     color: $lightPlaceholderGray;
     font-size: 12px;
     opacity: 0.8;
     font-weight: normal;
   }
 }
.incomplete {
  &-ptext {
    font-size: 14px;
  }
}
.text {
   &-right {
     color: $lightPlaceholderGray;
   }
 }
.sup-req {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  color: #757575;
  &-progress {
    font-size: 14px;
    line-height: 14px;
  }
}
.separator {
  height: 1px;
  width: 100%;
  background-color: #d7d7d7;
}

.toggleable-requirements {
  &-select {
    background: $white;
    border: .5px solid $inactiveGray;
    box-sizing: border-box;
    border-radius: 2px;
    width: 100%;
    font-size: 14px;
    line-height: 17px;
    color: $darkPlaceholderGray;
    position: relative;
    &:not(:first-child) {
      margin-top: .5rem;
    }
    &--disabled {
      opacity: 0.3;
      pointer-events: none;
    }
  }
  &-dropdown {
    &-placeholder {
      height: 100%;
      font-size: 14px;
      line-height: 17px;
      margin-left: .25rem;
      display: flex;
      align-items: center;
      color: $darkPlaceholderGray;
      background: transparent;
      cursor: pointer;
    }
    &-wrapper {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
    }
    &-innerPlaceholder {
      margin-top: 5px;
      margin-bottom: 5px;
      width: 100%;
    }
    &-arrow {
      border-left: 6.24px solid transparent;
      border-right: 6.24px solid transparent;
      border-top: 6.24px solid $inactiveGray;
      background: transparent;
      margin-right: 8.7px;
      margin-left: 5px;
    }
    &-content {
      z-index: 2;
      position: absolute;
      width: inherit;
      background: $white;
      box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
      border-radius: 7px;
      margin-top: 3px;
      &-item {
        height: 2.25rem;
        font-size: 14px;
        line-height: 17px;
        display: flex;
        align-items: center;
        color: $lightPlaceholderGray;
        padding-left: 10px;
        cursor: pointer;

        &:first-child {
          border-radius: 7px 7px 0px 0px;
        }

        &:last-child {
          border-radius: 0px 0px 7px 7px;
        }
      }
    }
  }
  &-dropdown-content div:hover {
    background: rgba(50, 160, 242, 0.15);
    width: 100%;
  }
}
</style>

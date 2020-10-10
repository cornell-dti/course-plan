<template>
  <div class="subrequirement">
  <div class="row depth-req">
    <div class="col-1" @click="toggleDescription(index, isCompleted, id)">
      <button class="btn">
        <!-- svg for dropdown icon -->
        <img
          v-if="subReq.displayDescription && !isCompleted"
          class="arrow arrow-up"
          src="@/assets/images/dropup.svg"
          alt="dropup"
        />
        <img
          v-if="subReq.displayDescription && isCompleted"
          class="arrow arrow-up"
          src="@/assets/images/dropup-lightgray.svg"
          alt="dropup"
        />
        <img
          v-if="!subReq.displayDescription && !isCompleted"
          class="arrow arrow-down"
          src="@/assets/images/dropdown.svg"
          alt="dropdown"
        />
        <img
          v-if="!subReq.displayDescription && isCompleted"
          class="arrow arrow-down"
          src="@/assets/images/dropdown-lightgray.svg"
          alt="dropdown"
        />
      </button>
    </div>
    <div class="col-7" @click="toggleDescription(index, isCompleted, id)">
      <p v-bind:class="[{'sup-req': !this.isCompleted}, 'pointer', this.isCompleted ? 'completed-ptext' : 'incomplete-ptext']">{{subReq.requirement.name}}</p>
    </div>
    <div class="col">
      <p v-if="!this.isCompleted" class="sup-req-progress text-right incomplete-ptext">{{
        (subReq.requirement.fulfilledBy !== 'self-check')
        ? `${subReq.totalCountFulfilled || subReq.minCountFulfilled}/${subReq.requirement.totalCount
        || subReq.requirement.minCount} ${subReq.requirement.fulfilledBy}`
        : 'self check' }}</p>
      <p v-if="this.isCompleted" class="text-right completed-ptext">{{subReq.minCountFulfilled}}/{{subReq.requirement.minCount}} {{ subReq.requirement.fulfilledBy }}</p>
    </div>
  </div>
  <div v-if="subReq.displayDescription" :class="[{'completed-ptext': this.isCompleted}, 'description']">
    {{ subReq.requirement.description }} <a class="more"
    :style="{ 'color': `#${color}` }"
    :href="subReq.requirement.source" target="_blank">
    <strong>Learn More</strong></a>
  </div>
  <div v-if="!this.isCompleted" class="separator"></div>
  </div>
</template>


<script>
import Vue from 'vue';
import CompletedSubReqCourse from '@/components/CompletedSubReqCourse';
import IncompleteSubReqCourse from '@/components/IncompleteSubReqCourse';

Vue.component('completedsubreqcourse', CompletedSubReqCourse);
Vue.component('incompletesubreqcourse', IncompleteSubReqCourse);

export default {
  props: {
    subReq: Object,
    id: Number, // Subrequirement id
    index: Number, // Requirement index
    color: String,
    isCompleted: Boolean
  },
  methods: {
    toggleDescription(index, isCompleted, id) {
      const type = isCompleted ? 'completed' : 'ongoing';
      this.$emit('toggleDescription', index, type, id);
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
  color: #508197;
  border-bottom: solid 10px #508197;
  padding-bottom: 2px;
  margin: 5px;
}
.settings, .arrow {
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
     color: #757575;
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
     color: #757575;
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

</style>

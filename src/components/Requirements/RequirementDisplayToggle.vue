<template>
  <button
    @click="$emit('on-toggle')"
    class="dropdown row slightly-lower-opacity-on-hover"
    aria-haspopup="true"
    data-toggle="dropdown"
    data-cyId="requirements-displayToggle"
  >
    <div class="row depth-req">
      <div class="btn">
        <drop-down-arrow
          :isFlipped="displayDescription"
          :fillColor="isCompleted ? '#979797CC' : '#979797'"
          :isSubReq="true"
        />
      </div>
      <div class="requirement-name-container">
        <p class="requirement-name-text">
          <span>{{ requirementFulfillment.requirement.name }}</span>
        </p>
      </div>
    </div>
    <div class="col requirement-progress text-right">
      {{ requirementFulfillmentProgress }}
    </div>
  </button>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import DropDownArrow from '@/components/DropDownArrow.vue';

export default defineComponent({
  components: { DropDownArrow },
  props: {
    requirementFulfillment: { type: Object as PropType<RequirementFulfillment>, required: true },
    isCompleted: { type: Boolean, required: true },
    displayDescription: { type: Boolean, required: true },
  },
  emits: ['on-toggle'],
  computed: {
    requirementFulfillmentProgress(): string {
      return this.requirementFulfillment.fulfilledBy !== 'self-check'
        ? `${this.requirementFulfillment.minCountFulfilled}/${this.requirementFulfillment.minCountRequired} ${this.requirementFulfillment.fulfilledBy}`
        : 'self check';
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.dropdown {
  background: none;
  width: 100%;
  border: none;
  justify-content: space-between;
  padding: 0;
  align-items: center;
  min-height: 2.25rem;
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

.depth-req {
  justify-content: flex-start;
  align-items: center;
  div:first-child {
    margin: 0px;
  }
}

.text-right {
  color: $lightPlaceholderGray;
}

.requirement-name-container {
  text-align: left;
  margin-left: 11px;
  max-width: 11rem;

  .requirement-name-text {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 14px;
    color: $lightPlaceholderGray;
    margin: 0;
  }
}

.requirement-progress {
  font-size: 14px;
  line-height: 14px;
  margin-top: auto;
  margin-bottom: auto;
}
</style>

<template>
  <TeleportModal
    title="Edit Requirement"
    content-class="content-course"
    :modelValue="modelValue"
    :leftButtonText="leftButtonText"
    :rightButtonText="rightButtonText"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="addItem"
  >
    <div class="newCourse-text">{{ courseName }} is being fulfilled by:</div>
    <requirements-dropdown
      :relatedRequirements="relatedRequirements"
      :potentialRequirements="potentialRequirements"
      :selectedID="selectedRequirementID"
      @on-selected-change="toggleSelectRequirement"
    />
    <div class="warning">
      <img class="warning-icon" src="@/assets/images/warning.svg" alt="warning icon" />
      We cannot accurately check the requirements marked with the warning icon, so double check
      before selecting.
    </div>
  </TeleportModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import RequirementsDropdown from '@/components/Modals/NewCourse/RequirementsDropdown.vue';

import store from '@/store';

export default defineComponent({
  components: { TeleportModal, RequirementsDropdown },
  props: {
    modelValue: { type: Boolean, required: true },
    courseName: { type: String, required: true },
    selectedReq: { type: String, required: true },
  },
  emits: {
    'update:modelValue': (val: boolean) => typeof val === 'boolean',
  },
  data() {
    return {};
  },
  computed: {
    leftButtonText(): string {
      return 'Cancel';
    },
    rightButtonText(): string {
      return 'Done';
    },
    selectableRequirementChoices(): AppSelectableRequirementChoices {
      return store.state.selectableRequirementChoices;
    },
  },
  methods: {
    closeCurrentModal() {
      this.$emit('update:modelValue', false);
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
.newCourse {
  &-text {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
  }
  &-dropdown {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    width: 100%;
    border-radius: 3px;
    padding: 0.5rem;
    border: 0.5px solid $inactiveGray;
    &::placeholder {
      color: $darkPlaceholderGray;
    }
  }
  &-name {
    position: relative;
    border-radius: 11px;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: $darkGray;
  }
  &-title {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    margin-bottom: 6px;
  }
}

.content-course {
  width: 27.75rem;
}

.warning {
  color: $warning;
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 8px;
  &-icon {
    float: left;
    margin: 0.125rem 0.25rem 0 0;
    width: 14px;
    height: 14px;
  }
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-course {
    width: 100%;
  }
}
</style>

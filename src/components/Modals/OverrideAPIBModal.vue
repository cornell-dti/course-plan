<template>
  <TeleportModal
    title="Override Requirement with Transfer Credit"
    content-class="content-course"
    leftButtonText="Cancel"
    rightButtonText="Override"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="overrideClicked"
  >
    <div class="overrideModal-text">Select AP/IB credit to override this requirement:</div>
    <requirements-dropdown
      :relatedRequirements="relatedExams"
      :selectedID="selectedExamID"
      @on-selected-change="onSelectedExamChange"
    />
  </TeleportModal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { addOverridenRequirementAPIB } from '@/global-firestore-data';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import RequirementsDropdown from '@/components/Modals/NewCourse/RequirementsDropdown.vue';

import store from '@/store';

export default defineComponent({
  components: { TeleportModal, RequirementsDropdown },
  props: {
    requirementFulfillment: {
      type: Object as PropType<RequirementFulfillment>,
      required: true,
    },
    slotName: { type: String, required: true },
  },
  emits: {
    'close-override-apib-modal': (val: boolean) => typeof val === 'boolean',
  },
  data() {
    return {
      selectedExamID: '',
    };
  },
  computed: {
    leftButtonText(): string {
      return 'Cancel';
    },
    rightButtonText(): string {
      return 'Override';
    },
    selectableRequirementChoices(): AppSelectableRequirementChoices {
      return store.state.selectableRequirementChoices;
    },
    derivedAPIBEquivalentCourseData(): DerivedAPIBEquivalentCourseData {
      return store.state.derivedAPIBEquivalentCourseData;
    },
    relatedExams(): { id: string; name: string }[] {
      if (this.requirementFulfillment.fulfilledBy !== 'credits') {
        return Object.entries(this.derivedAPIBEquivalentCourseData.examToUniqueIdsMap).map(
          (entry, index) => ({
            id: index.toString(),
            name: entry[0],
          })
        );
      }
      // if fulfilledBy === credits then only add exam with course equivalents
      return Object.entries(this.derivedAPIBEquivalentCourseData.examToUniqueIdsMap)
        .filter(exams => exams[1].size > 0)
        .map((entry, index) => ({
          id: index.toString(),
          name: entry[0],
        }));
    },
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-override-apib-modal', false);
    },
    overrideClicked() {
      if (this.selectedExamID !== '') {
        addOverridenRequirementAPIB(
          this.relatedExams[parseInt(this.selectedExamID, 10)].name,
          true,
          this.requirementFulfillment.requirement.id,
          this.slotName
        );
      }
      this.closeCurrentModal();
    },
    onSelectedExamChange(id: string) {
      this.selectedExamID = id;
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
.overrideModal {
  &-text {
    font-size: 14px;
    line-height: 17px;
    color: $lightPlaceholderGray;
    margin-bottom: 10px;
  }
}

.content-course {
  width: 27.75rem;
}

@media only screen and (max-width: $small-medium-breakpoint) {
  .content-course {
    width: 100%;
  }
}
</style>

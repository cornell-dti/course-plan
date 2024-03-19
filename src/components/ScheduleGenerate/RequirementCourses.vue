<template>
  <div class="requirement">
    <button
      class="requirement-dropdown"
      type="button"
      @click="showDropdown = !showDropdown"
      data-toggle="dropdown"
      aria-haspopup="true"
      :aria-expanded="showDropdown"
    >
      <div class="requirement-header">
        <drop-down-arrow :isFlipped="showDropdown" :fillColor="emGreen" />
        <p v-if="selectedRequirement === ''" class="requirement-header-text">New Requirement</p>
        <p v-else class="requirement-header-text">
          {{ selectedRequirement }}
        </p>
      </div>
    </button>
    <div v-if="showDropdown">
      <p class="requirement-header-subtext">Please select a major requirement.</p>
      <all-requirements-dropdown
        :available-choices="availableRequirements"
        :choice="selectedRequirement"
      />
      <new-course-modal @close-course-modal="closeCourseModal" v-if="isCourseModalOpen" />
      <div class="requirement-courses">
        <add-course-button :compact="false" :should-clear-padding="true" @click="openCourseModal" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Course from '@/components/Course/Course.vue';
import AddCourseButton from '@/components/AddCourseButton.vue';
import Placeholder from '@/components/Course/Placeholder.vue';
import NewCourseModal from '@/components/Modals/NewCourse/NewCourseModal.vue';
import { emGreen } from '@/assets/constants/scss-variables';
import DropDownArrow from '@/components/DropDownArrow.vue';
import AllRequirementsDropdown from '@/components/ScheduleGenerate/AllRequirementsDropdown.vue';

export default defineComponent({
  props: {
    availableRequirements: {
      type: Object as PropType<Readonly<Record<string, string>>>,
      required: true,
    },
  },
  data() {
    return {
      showDropdown: false,
      isCourseModalOpen: false,
      selectedRequirement: '',
      emGreen,
    };
  },
  components: {
    AddCourseButton,
    Course,
    Placeholder,
    NewCourseModal,
    DropDownArrow,
    AllRequirementsDropdown,
  },
  methods: {
    openCourseModal() {
      this.isCourseModalOpen = !this.isCourseModalOpen;
    },
    closeCourseModal() {
      this.isCourseModalOpen = false;
    },
    closeDropdownIfOpen() {
      this.showDropdown = false;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.requirement {
  border-top: 1px solid;
  border-color: $inactiveGray;
  margin-bottom: 0.5rem;
  &-dropdown {
    margin-top: 12px;
  }
  &-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 28px;
    &-text {
      color: $emGreen;
      margin-bottom: 0;
      margin-left: 12px;
      font-size: 16px;
      font-weight: 900;
    }
    &-subtext {
      color: $inactiveGray;
    }
  }
  &-courses {
    margin-top: 1rem;
    margin-bottom: 1.2rem;
  }
}
</style>

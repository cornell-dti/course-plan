<template>
  <div class="requirement">
    <div class="requirement-header">
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
      <button class="courseMenu-section full-opacity-on-hover" @click="deleteRequirement">
        <div class="courseMenu-left">
          <img src="@/assets/images/trash.svg" alt="delete req trashcan icon" />
        </div>
      </button>
    </div>
    <div v-if="showDropdown">
      <p class="requirement-header-subtext">Please select a major requirement.</p>
      <all-requirements-dropdown
        :available-choices="availableRequirements"
        :choice="selectedRequirement"
        @on-select="selectRequirement"
      />
      <new-course-modal @close-course-modal="closeCourseModal" v-if="isCourseModalOpen" />
      <div class="requirement-courses">
        <add-course-button
          v-if="selectedRequirement !== ''"
          :compact="false"
          :should-clear-padding="true"
          @click="openCourseModal"
        />
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
    selectedRequirement: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  emits: {
    'delete-available-requirement': (requirement: string) => typeof requirement === 'string',
    'select-requirement': (requirement: string, index: number) =>
      typeof requirement === 'string' && typeof index === 'number',
    'add-available-requirement': (requirement: string) => typeof requirement === 'string',
    'delete-requirement': () => true,
  },
  data() {
    return {
      showDropdown: true,
      isCourseModalOpen: false,
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
  computed: {
    requirementChoice(): string {
      return this.selectedRequirement;
    },
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
    selectRequirement(requirement: string) {
      if (this.selectedRequirement !== '') {
        this.$emit('add-available-requirement', this.selectedRequirement);
      }
      this.$emit('select-requirement', requirement, this.index);
      this.$emit('delete-available-requirement', requirement);
    },
    deleteRequirement() {
      this.$emit('delete-requirement');
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

  &-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 6px;
  }

  &-dropdown {
    padding-bottom: 3px;
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

<template>
  <TeleportModal
    title="Distribution Requirements"
    content-class="content-course"
    leftButtonText="Back"
    rightButtonText="Next"
    :rightButtonIsDisabled="false"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backToCourseModal"
    @right-button-clicked="saveRequirements"
    :titleBold="true"
    class="requirements-modal"
  >
    <div class="requirements-form">
      <!-- College Requirements Section -->
      <div class="requirements-section">
        <div class="requirements-accordion" @click="toggleCollegeRequirements">
          <div class="requirements-accordion-header">
            <drop-down-arrow :isFlipped="showCollegeRequirements" :fillColor="emGreen" />
            <span class="title">College Requirements</span>
          </div>
        </div>

        <!-- College requirements expanded content -->
        <div v-if="showCollegeRequirements" class="expanded-content">
          <div
            v-for="(req, index) in collegeRequirements"
            :key="`college-${index}`"
            class="requirement-item"
          >
            <div class="requirements-accordion" @click="toggleCollegeRequirement(index)">
              <div class="requirements-accordion-header">
                <drop-down-arrow :isFlipped="req.expanded" :fillColor="emGreen" />
                <span class="requirement-name">{{ req.name }}</span>
                <span class="requirement-progress">{{ req.progress }}</span>
              </div>
            </div>
            <div class="checkbox-container">
              <div class="squared-checkbox">
                <input type="checkbox" :id="`college-req-${index}`" v-model="req.selected" />
                <label :for="`college-req-${index}`"></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="separator"></div>

      <!-- Major Requirements Section -->
      <div class="requirements-section">
        <div class="requirements-accordion" @click="toggleMajorRequirements">
          <div class="requirements-accordion-header">
            <drop-down-arrow :isFlipped="showMajorRequirements" :fillColor="emGreen" />
            <span class="title">Major Requirements</span>
          </div>
        </div>

        <!-- Major requirements expanded content -->
        <div v-if="showMajorRequirements" class="expanded-content">
          <h3 class="section-heading">In-Depth College Requirements</h3>

          <div
            v-for="(req, index) in majorRequirements"
            :key="`major-${index}`"
            class="requirement-item"
          >
            <div class="requirements-accordion" @click="toggleMajorRequirement(index)">
              <div class="requirements-accordion-header">
                <drop-down-arrow :isFlipped="req.expanded" :fillColor="emGreen" />
                <span class="requirement-name">{{ req.name }}</span>
                <span class="requirement-progress">{{ req.progress }}</span>
              </div>
            </div>
            <div class="checkbox-container">
              <div class="squared-checkbox">
                <input type="checkbox" :id="`major-req-${index}`" v-model="req.selected" />
                <label :for="`major-req-${index}`"></label>
              </div>
            </div>
          </div>

          <!-- CS Core Course Options (if expanded) -->
          <div v-if="majorRequirements[1].expanded" class="course-options">
            <p class="options-label">Please select one of the following.</p>
            <div
              v-for="(option, index) in csCourseOptions"
              :key="`cs-option-${index}`"
              class="option-item"
            >
              <span>{{ option.name }}</span>
              <div class="checkbox-container">
                <div class="squared-checkbox">
                  <input
                    :id="`cs-option-${index}`"
                    type="checkbox"
                    v-model="option.selected"
                    @change="handleCsCourseOptionChange(index)"
                  />
                  <label :for="`cs-option-${index}`"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TeleportModal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import DropDownArrow from '@/components/DropDownArrow.vue';

interface Requirement {
  name: string;
  progress: string;
  expanded: boolean;
  selected: boolean;
}

interface CourseOption {
  name: string;
  selected: boolean;
}

export default defineComponent({
  name: 'ManualRequirementsModal',
  components: { TeleportModal, DropDownArrow },
  props: {
    course: {
      type: Object as PropType<FirestoreSemesterCourse>,
      required: true,
    },
  },
  emits: {
    'close-modal': () => true,
    'back-to-course-modal': () => true,
    'save-requirements': (course: FirestoreSemesterCourse, requirements: string[]) =>
      typeof course === 'object' && Array.isArray(requirements),
  },
  data() {
    return {
      emGreen: '#479B75',
      showCollegeRequirements: false,
      showMajorRequirements: false,
      collegeRequirements: [
        { name: 'Physical Education', progress: '0/2 courses', expanded: false, selected: false },
        { name: 'Mathematics', progress: '0/3 courses', expanded: false, selected: false },
        { name: 'Physics', progress: '0/2 courses', expanded: false, selected: false },
        { name: 'Chemistry', progress: '0/2 courses', expanded: false, selected: false },
        {
          name: 'First-Year Writing Seminars',
          progress: '0/2 courses',
          expanded: false,
          selected: false,
        },
        { name: 'Computing', progress: '0/1 courses', expanded: false, selected: false },
        {
          name: 'Introduction to Engineering',
          progress: '0/3 credits',
          expanded: false,
          selected: false,
        },
        {
          name: 'Engineering Distribution',
          progress: '0/2 courses',
          expanded: false,
          selected: false,
        },
        {
          name: 'Liberal Studies: 6 courses',
          progress: '0/4 requirements',
          expanded: false,
          selected: false,
        },
        {
          name: 'Advisor-Approved Electives',
          progress: '0/6 credits',
          expanded: false,
          selected: false,
        },
        {
          name: 'Engineering Communications',
          progress: '0/1 courses',
          expanded: false,
          selected: false,
        },
      ] as Requirement[],
      majorRequirements: [
        {
          name: 'Introductory Programming',
          progress: '1/2 courses',
          expanded: false,
          selected: false,
        },
        {
          name: 'Computer Science Core',
          progress: '0/5 courses',
          expanded: false,
          selected: false,
        },
        { name: 'Technical Electives', progress: '0/6 credits', expanded: false, selected: false },
        {
          name: 'Physical and Life Sciences',
          progress: '0/3 courses',
          expanded: false,
          selected: false,
        },
        {
          name: 'External Specialization',
          progress: '0/3 courses',
          expanded: false,
          selected: false,
        },
      ] as Requirement[],
      csCourseOptions: [
        { name: 'CS 2800 or CS 2802', selected: false },
        { name: 'CS 3110', selected: false },
        { name: 'CS 3410 or CS 3420', selected: false },
        { name: 'CS 3700 or CS 3780', selected: false },
        { name: 'CS 4410 or CS 4414', selected: false },
      ] as CourseOption[],
    };
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-modal');
    },
    backToCourseModal() {
      this.$emit('back-to-course-modal');
    },
    saveRequirements() {
      let selectedRequirements: string[] = [];

      // Add selected college requirements
      const collegeReqs = this.collegeRequirements
        .filter(req => req.selected)
        .map(req => `Engineering ${req.name} Requirements`);

      // Add selected major requirements
      const majorReqs = this.majorRequirements
        .filter(req => req.selected)
        .map(req => `${req.name} Requirements`);

      selectedRequirements = [...collegeReqs, ...majorReqs];

      // Add specific CS course selections if Computer Science Core is selected
      if (this.majorRequirements[1].selected) {
        const csOptions = this.csCourseOptions
          .filter(option => option.selected)
          .map(option => option.name);

        if (csOptions.length > 0) {
          // Format to match the screenshot: "Computer Science Core Requirements (CS 3110)"
          const selectedCourses = csOptions.join(', ');
          const csRequirement = `Computer Science Core Requirements (${selectedCourses})`;

          // Replace the generic "Computer Science Core Requirements" with the specific one
          const coreIndex = selectedRequirements.indexOf('Computer Science Core Requirements');
          if (coreIndex >= 0) {
            selectedRequirements[coreIndex] = csRequirement;
          } else {
            selectedRequirements.push(csRequirement);
          }
        }
      }

      this.$emit('save-requirements', this.course, selectedRequirements);
    },
    toggleCollegeRequirements() {
      this.showCollegeRequirements = !this.showCollegeRequirements;
      this.showMajorRequirements = false; // Close the other section
    },
    toggleMajorRequirements() {
      this.showMajorRequirements = !this.showMajorRequirements;
      this.showCollegeRequirements = false; // Close the other section
    },
    toggleCollegeRequirement(index: number) {
      this.collegeRequirements[index].expanded = !this.collegeRequirements[index].expanded;
    },
    toggleMajorRequirement(index: number) {
      this.majorRequirements[index].expanded = !this.majorRequirements[index].expanded;
    },
    handleCsCourseOptionChange(index: number) {
      // If a CS course option is selected, automatically select the CS Core requirement
      if (this.csCourseOptions[index].selected) {
        this.majorRequirements[1].selected = true; // Index 1 for Computer Science Core
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

.requirements-form {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
}

.requirements-section {
  margin-bottom: 16px;
}

.section-heading {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.separator {
  height: 1px;
  background-color: #e0e0e0;
  margin: 16px 0;
}

.requirements-accordion {
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
}

.requirements-accordion-header {
  display: flex;
  align-items: center;
  flex: 1;
  min-height: 38px;
}

.title {
  font-size: 15px;
  color: $emGreen;
  font-weight: 500;
  margin-left: 10px;
}

.requirement-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.requirement-name {
  flex: 1;
  font-size: 14px;
  color: #555;
  margin-left: 10px;
}

.requirement-progress {
  font-size: 14px;
  color: #777;
  margin-right: 16px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 30px;
}

/* Squared checkbox styling */
.squared-checkbox {
  position: relative;
  width: 16px;
  height: 16px;
}

.squared-checkbox input {
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  margin: 0;
  cursor: pointer;
}

.squared-checkbox label {
  position: absolute;
  left: 0;
  top: 0;
  width: 16px;
  height: 16px;
  background: #fff;
  border: 1px solid $emGreen;
  border-radius: 2px;
  cursor: pointer;
}

.squared-checkbox input:checked + label {
  background: $emGreen;
  border-color: $emGreen;
}

.squared-checkbox input:checked + label:after {
  content: '';
  position: absolute;
  top: 1px;
  left: 5px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.course-options {
  padding: 10px 0 20px 0;
  margin-left: 30px;
}

.options-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 15px;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-left: 0;

  span {
    font-size: 14px;
    color: #555;
  }

  .checkbox-container {
    padding-right: 20px;
    justify-content: flex-end;
  }
}

.expanded-content {
  margin-top: 8px;
}

:deep(.content-course) {
  padding: 16px 24px;
  width: 520px;
  max-width: 100%;
}

:deep(.modal-top) {
  padding-left: 4px;
  padding-right: 4px;
}

:deep(.modal-top h1) {
  font-size: 22px;
  font-weight: 600;
  margin-top: 4px;
  margin-bottom: 18px;
}
</style>

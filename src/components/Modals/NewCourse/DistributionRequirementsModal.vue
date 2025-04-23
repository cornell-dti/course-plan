<template>
  <TeleportModal
    title="Confirm Distribution Requirements"
    content-class="content-course"
    leftButtonText="Back"
    rightButtonText="Next"
    :rightButtonIsDisabled="!isValid"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backToCourseModal"
    @right-button-clicked="saveCourse"
    :titleBold="true"
  >
    <div class="distribution-form">
      <div v-if="selectedCourse === null">
        <div class="form-group">
          <label class="form-label">Cornell Equivalent Course</label>
          <course-selector
            search-box-class-name="newCourse-dropdown"
            :key="courseSelectorKey"
            placeholder='"CS 1110", "Multivariable Calculus", etc'
            :autoFocus="true"
            @on-escape="closeCurrentModal"
            @on-select="selectCourse"
            :allow-blank-card="false"
          />
        </div>

        <div class="manual-requirements">
          <a href="#" class="manual-link" @click.prevent="addManualRequirements">
            No equivalent course? Add requirements manually.
          </a>
        </div>
      </div>

      <div v-else>
        <div class="form-group">
          <div class="section-label">Selected Equivalent Course</div>
          <div class="section-text">
            {{ selectedCourse.subject }} {{ selectedCourse.catalogNbr }}:
            {{ selectedCourse.titleLong }}
          </div>
        </div>

        <div class="form-group" v-if="automaticallyFulfilledRequirements.length > 0">
          <div class="section-label">
            This class would automatically fulfill the following requirement(s):
          </div>
          <div class="requirements-list">
            <div
              v-for="(req, index) in automaticallyFulfilledRequirements"
              :key="index"
              class="requirement-item"
            >
              {{ req }}
            </div>
          </div>
        </div>

        <div class="form-group" v-if="potentialRequirements.length > 0">
          <div class="section-label">
            This class could potentially fulfill the following requirement(s):
          </div>
          <div class="requirements-list">
            <div
              v-for="(req, index) in potentialRequirements"
              :key="index"
              class="requirement-item"
            >
              {{ req }}
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
import CourseSelector from '@/components/Modals/NewCourse/CourseSelector.vue';
import store from '@/store';
import { getRelatedUnfulfilledRequirements } from '@/requirements/requirement-frontend-utils';

type Data = {
  selectedCourse: CornellCourseRosterCourse | null;
  courseSelectorKey: number;
  automaticallyFulfilledRequirements: string[];
  potentialRequirements: string[];
};

export default defineComponent({
  name: 'DistributionRequirementsModal',
  components: { TeleportModal, CourseSelector },
  props: {
    course: {
      type: Object as PropType<FirestoreSemesterCourse>,
      required: true,
    },
  },
  emits: {
    'close-modal': () => true,
    'back-to-course-modal': () => true,
    'save-course': (course: FirestoreSemesterCourse) => typeof course === 'object',
    'add-manual-requirements': () => true,
    'proceed-to-confirmation': (course: FirestoreSemesterCourse, requirements: string[]) =>
      typeof course === 'object' && Array.isArray(requirements),
  },
  data(): Data {
    return {
      selectedCourse: null,
      courseSelectorKey: 0,
      automaticallyFulfilledRequirements: [],
      potentialRequirements: [],
    };
  },
  computed: {
    isValid(): boolean {
      return this.selectedCourse !== null;
    },
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-modal');
    },
    backToCourseModal() {
      this.$emit('back-to-course-modal');
    },
    selectCourse(result: CornellCourseRosterCourse) {
      this.selectedCourse = result;
      this.courseSelectorKey += 1; // Force re-render of the component
      this.getRequirementsFulfilled(result);
    },
    saveCourse() {
      if (!this.selectedCourse) return;

      // Update the course with the selected equivalent course info
      const updatedCourse = {
        ...this.course,
        equivalentCourse: {
          subject: this.selectedCourse.subject,
          catalogNbr: this.selectedCourse.catalogNbr,
          titleLong: this.selectedCourse.titleLong,
          crseId: this.selectedCourse.crseId,
        },
      };

      // Instead of saving directly, proceed to the confirmation step
      this.$emit('proceed-to-confirmation', updatedCourse, this.automaticallyFulfilledRequirements);
    },
    addManualRequirements() {
      this.$emit('add-manual-requirements');
    },
    getRequirementsFulfilled(course: CornellCourseRosterCourse) {
      // Convert course to a format that can be used by the requirements functions
      const courseToCheck: Partial<CornellCourseRosterCourse> = {
        crseId: course.crseId,
        subject: course.subject,
        catalogNbr: course.catalogNbr,
        titleLong: course.titleLong,
        // Fields needed by requirement checking functions
        acadGroup: course.acadGroup || '',
        acadCareer: course.acadCareer || '',
        enrollGroups: course.enrollGroups || [],
        catalogWhenOffered: course.catalogWhenOffered || '',
      };

      try {
        // Use the same requirements function that's used in the regular Add Course flow
        const {
          relatedRequirements,
          selfCheckRequirements,
          automaticallyFulfilledRequirements,
        } = getRelatedUnfulfilledRequirements(
          courseToCheck as CornellCourseRosterCourse,
          store.state.groupedRequirementFulfillmentReport,
          store.state.onboardingData,
          store.state.toggleableRequirementChoices,
          store.state.overriddenFulfillmentChoices,
          store.state.userRequirementsMap
        );

        // Set automatically fulfilled requirements names
        this.automaticallyFulfilledRequirements = automaticallyFulfilledRequirements.map(
          ({ name }) => name
        );

        // Set potential requirements that could be fulfilled
        const automaticallyFulfilledRequirementIds = new Set(
          automaticallyFulfilledRequirements.map(({ id }) => id)
        );

        // Filter out requirements that are already automatically fulfilled
        const potentialRelatedRequirements = relatedRequirements
          .filter(req => !automaticallyFulfilledRequirementIds.has(req.id))
          .map(req => req.name);

        const potentialSelfCheckRequirements = selfCheckRequirements
          .filter(req => !automaticallyFulfilledRequirementIds.has(req.id))
          .map(req => req.name);

        this.potentialRequirements = [
          ...new Set([...potentialRelatedRequirements, ...potentialSelfCheckRequirements]),
        ];

        // If no requirements were found, show placeholders based on subject
        if (
          this.automaticallyFulfilledRequirements.length === 0 &&
          this.potentialRequirements.length === 0
        ) {
          const { subject } = course;

          if (subject === 'CS') {
            this.automaticallyFulfilledRequirements = ['CS Electives'];
            this.potentialRequirements = [
              'Advisor-Approved Electives',
              'Technical Electives',
              'Major-approved Elective(s)',
            ];
          } else if (subject === 'MATH') {
            this.automaticallyFulfilledRequirements = ['Calculus Requirements'];
            this.potentialRequirements = [
              'Math Major Requirements',
              'Engineering Math Requirements',
            ];
          } else {
            this.automaticallyFulfilledRequirements = ['Liberal Studies Requirements'];
            this.potentialRequirements = [
              'College Distribution Requirements',
              'Major-approved Elective(s)',
            ];
          }
        }
      } catch (error) {
        console.error('Error getting requirements fulfilled:', error);

        // Fall back to default requirements based on subject
        const { subject } = course;

        if (subject === 'CS') {
          this.automaticallyFulfilledRequirements = ['CS Electives'];
          this.potentialRequirements = [
            'Advisor-Approved Electives',
            'Technical Electives',
            'Major-approved Elective(s)',
          ];
        } else if (subject === 'MATH') {
          this.automaticallyFulfilledRequirements = ['Calculus Requirements'];
          this.potentialRequirements = ['Math Major Requirements', 'Engineering Math Requirements'];
        } else {
          this.automaticallyFulfilledRequirements = ['Liberal Studies Requirements'];
          this.potentialRequirements = [
            'College Distribution Requirements',
            'Major-approved Elective(s)',
          ];
        }
      }
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.distribution-form {
  padding: 16px 0;
}

.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-label {
  display: block;
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: 500;
  color: #333;
}

.section-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.section-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 16px;
  background-color: transparent;
}

.requirements-list {
  display: flex;
  flex-direction: column;
  margin-top: 4px;
  background: none;
}

.requirement-item {
  font-size: 14px;
  line-height: 1.5;
  color: $emGreen;
  font-weight: 500;
  margin-bottom: 4px;
  background: none !important;
  padding: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  border: none !important;
}

.manual-requirements {
  margin-top: 12px;
}

.manual-link {
  color: $emGreen;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
  position: relative;

  &:hover {
    text-decoration: underline;
  }
}

.newCourse-dropdown {
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
</style>

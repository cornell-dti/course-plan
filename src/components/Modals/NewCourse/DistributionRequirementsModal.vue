<template>
  <TeleportModal
    title="Distribution Requirements"
    content-class="content-course"
    leftButtonText="Back"
    rightButtonText="Next"
    :rightButtonIsDisabled="!isValid"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backToCourseModal"
    @right-button-clicked="saveCourse"
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
          <div class="manual-requirements">
            <a href="#" class="manual-link" @click.prevent="addManualRequirements">
              No equivalent course? Add requirements manually.
            </a>
          </div>
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
        <div v-else>
          <div class="section-label">
            <div class="requirement-item">
              This class does not automatically fulfill any requirements.
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
import {
  getRelatedUnfulfilledRequirements,
  getRelatedRequirementIdsForCourseOptOut,
} from '@/requirements/requirement-frontend-utils';

export default defineComponent({
  name: 'DistributionRequirementsModal',
  components: { TeleportModal, CourseSelector },
  props: {
    course: {
      type: Object as PropType<FirestoreSemesterBlankCourse>,
      required: true,
    },
  },
  emits: {
    'close-modal': () => true,
    'back-to-course-modal': () => true,
    'save-course': (course: FirestoreSemesterBlankCourse) => typeof course === 'object',
    'add-manual-requirements': (course: FirestoreSemesterBlankCourse) => typeof course === 'object',
    'proceed-to-confirmation': (
      course: FirestoreSemesterBlankCourse,
      choice: FirestoreCourseOptInOptOutChoices
    ) => typeof course === 'object' && typeof choice === 'object',
  },
  data() {
    return {
      selectedCourse: null as CornellCourseRosterCourse | null,
      selectedRequirementID: '' as string,
      courseSelectorKey: 0,
      automaticallyFulfilledRequirements: [] as readonly string[],
      potentialRequirements: [] as readonly string[],
      relatedRequirements: [] as readonly RequirementWithIDSourceType[],
      selfCheckRequirements: [] as readonly RequirementWithIDSourceType[],
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
      if (this.selectedCourse) {
        this.selectedCourse = null; // Reset selected course to allow re-selection
      } else this.$emit('back-to-course-modal');
    },
    selectCourse(result: CornellCourseRosterCourse) {
      this.selectedCourse = result;

      this.courseSelectorKey += 1; // Force re-render of the component
      this.getRequirementsFulfilled(result);
      this.getReqsRelatedToCourse(result);
    },
    saveCourse() {
      if (!this.selectedCourse) return;

      // Update the course with the selected equivalent course info
      // Hannah's Note: This function will be changed completely to support
      // the current backend idea

      // Update course with the selectedCourse info!

      // Semesters: remove periods and split on ', '
      // alternateSemesters option in case catalogWhenOffered for the course is null, undef, or ''
      const alternateSemesters =
        !this.selectedCourse.catalogWhenOffered || this.selectedCourse.catalogWhenOffered === ''
          ? []
          : this.selectedCourse.catalogWhenOffered.replace(/\./g, '').split(', ');
      const semesters = alternateSemesters;

      const updatedCourse: FirestoreSemesterBlankCourse = {
        ...this.course,
        crseId: this.selectedCourse.crseId,
        semesters,
        requirementsFulfilled: this.automaticallyFulfilledRequirements,
      };

      console.log('the course requiremnt fulfillments in saveCourse on distribution modal:', {
        updatedCourse,
        automaticallyFulfilledRequirements: this.automaticallyFulfilledRequirements,
      });

      const choice: FirestoreCourseOptInOptOutChoices = {
        optOut: getRelatedRequirementIdsForCourseOptOut(
          this.selectedCourse.crseId,
          this.selectedRequirementID,
          store.state.groupedRequirementFulfillmentReport,
          store.state.toggleableRequirementChoices,
          store.state.userRequirementsMap
        ),
        // Only include the selected requirement from opt-in.
        acknowledgedCheckerWarningOptIn: this.selfCheckRequirements
          .filter(it => it.id === this.selectedRequirementID)
          .map(it => it.id),
        arbitraryOptIn: {},
      };

      console.log('Course to be added; confirm course on DistributionRequirementsModal:', {
        updatedCourse,
        choice,
      });
      // Instead of saving directly, proceed to the confirmation step
      this.$emit('proceed-to-confirmation', updatedCourse, choice); // TODO: remove the automaticallyRequirements from the arguements
    },
    addManualRequirements() {
      this.$emit('add-manual-requirements', this.selectedCourse);
    },
    getReqsRelatedToCourse(selectedCourse: CornellCourseRosterCourse) {
      const {
        relatedRequirements,
        selfCheckRequirements,
        automaticallyFulfilledRequirements,
      } = getRelatedUnfulfilledRequirements(
        selectedCourse,
        store.state.groupedRequirementFulfillmentReport,
        store.state.onboardingData,
        store.state.toggleableRequirementChoices,
        store.state.overriddenFulfillmentChoices,
        store.state.userRequirementsMap
      );
      const automaticallyFulfilledRequirementIds = new Set(
        automaticallyFulfilledRequirements.map(({ id }) => id)
      );

      this.automaticallyFulfilledRequirements = automaticallyFulfilledRequirements.map(
        ({ name }) => name
      );
      this.relatedRequirements = relatedRequirements.filter(
        req => !automaticallyFulfilledRequirementIds.has(req.id)
      );
      this.selfCheckRequirements = selfCheckRequirements.filter(
        req => !automaticallyFulfilledRequirementIds.has(req.id)
      );
      if (this.relatedRequirements.length > 0) {
        this.selectedRequirementID = this.relatedRequirements[0].id;
      } else {
        this.selectedRequirementID = '';
      }
    },
    getRequirementsFulfilled(course: CornellCourseRosterCourse) {
      try {
        // Use the same requirements function that's used in the regular Add Course flow
        const {
          relatedRequirements,
          selfCheckRequirements,
          automaticallyFulfilledRequirements,
        } = getRelatedUnfulfilledRequirements(
          course as CornellCourseRosterCourse,
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

        console.log('Potential requirements:', this.potentialRequirements);
        console.log(
          'Automatically fulfilled requirements:',
          this.automaticallyFulfilledRequirements
        );
      } catch (error) {
        console.error('Error getting requirements fulfilled:', error);
      }
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.form-group {
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
}

.requirements-list {
  display: flex;
  flex-direction: column;
  margin-top: 4px;
}

.requirement-item {
  font-size: 14px;
  line-height: 1.5;
  color: $emGreen;
  font-weight: 500;
  margin-bottom: 4px;
}

.manual-requirements {
  margin-top: 12px;
}

.manual-link {
  color: $emGreen;
  font-size: 14px;
  text-decoration: none;

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

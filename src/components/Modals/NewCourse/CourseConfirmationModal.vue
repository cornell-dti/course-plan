<template>
  <TeleportModal
    title="Does Everything Look Okay?"
    content-class="content-course-confirmation"
    leftButtonText="Back"
    rightButtonText="Add"
    :rightButtonIsDisabled="false"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="backToDistributionModal"
    @right-button-clicked="confirmCourse"
  >
    <div class="confirmation-form">
      <!-- Use the actual Course component with proper color -->
      <div class="course-card-container">
        <Course
          :courseObj="courseWithColor"
          :compact="false"
          :active="false"
          :isReqCourse="false"
          :isSemesterCourseCard="false"
          :isCourseConfirmationCard="true"
          @note-height-change="() => {}"
        />
      </div>

      <!-- This class would automatically fulfill... text -->
      <p class="requirements-heading">
        This class would automatically fulfill the following requirement(s):
      </p>

      <!-- Requirements list -->
      <div class="requirements-items">
        <div
          v-if="typedCourse.requirementsFulfilled && typedCourse.requirementsFulfilled.length > 0"
        >
          <div
            v-for="(req, index) in typedCourse.requirementsFulfilled"
            :key="index"
            class="requirement-item"
          >
            {{ req }}
          </div>
        </div>
        <div v-else class="requirement-item">No specific requirements fulfilled.</div>
      </div>

      <!-- Advisory Note -->
      <div class="advisory-note">
        <p>
          <span class="advisory-icon">⚠️</span>
          Please note, we recommend checking in with your academic advisor regarding requirements to
          make sure you are inputting the correct info.
        </p>
      </div>
    </div>
  </TeleportModal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';
import Course from '@/components/Course/Course.vue';
import store from '@/store';
import { incrementUniqueID } from '@/global-firestore-data';

export default defineComponent({
  name: 'CourseConfirmationModal',
  components: { TeleportModal, Course },
  props: {
    course: {
      type: Object as PropType<FirestoreSemesterBlankCourse>,
      required: true,
    },
    choice: {
      type: Object as PropType<FirestoreCourseOptInOptOutChoices>,
      required: true,
    },
  },
  computed: {
    // type-safe blank course card
    typedCourse(): FirestoreSemesterBlankCourse {
      return this.course as FirestoreSemesterBlankCourse;
    },
    courseWithColor(): FirestoreSemesterBlankCourse {
      // Get subject from course code
      const subject = this.typedCourse.code.split(' ')[0];

      // Apply color and fix semesters if needed
      return {
        ...this.typedCourse,
        color: store.state.subjectColors[subject] || '32A0F2', // Use subject color or default blue
        semesters:
          this.typedCourse.semesters && this.typedCourse.semesters.length > 0
            ? this.typedCourse.semesters
            : ['Transfer'], // Default to Transfer if no semesters specified
      };
    },
  },
  emits: {
    'close-modal': () => true,
    'back-to-distribution-modal': () => true,
    'confirm-course': (
      course: FirestoreSemesterBlankCourse,
      choice: FirestoreCourseOptInOptOutChoices
    ) => typeof course === 'object' && typeof choice === 'object',
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-modal');
    },
    backToDistributionModal() {
      this.$emit('back-to-distribution-modal');
    },
    confirmCourse() {
      // Pass the course with color
      const updatedCourse: FirestoreSemesterBlankCourse = {
        ...this.typedCourse,
        uniqueID: incrementUniqueID(),
        crseId: this.typedCourse.crseId,
        userID: 'dummy for now',
        color: this.courseWithColor.color,
      };
      this.$emit('confirm-course', updatedCourse, this.choice);
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.confirmation-form {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  margin-bottom: 16px;
}

.course-card-container {
  width: 80%;
  margin: 0 auto 24px 0;
  max-width: 480px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.requirements-heading {
  font-size: 15px;
  color: #333;
  margin: 0 0 10px 0;
}

.requirements-items {
  margin-bottom: 24px;
}

.requirement-item {
  font-size: 15px;
  line-height: 1.5;
  color: $emGreen;
  font-weight: 500;
  margin-bottom: 4px;
}

.advisory-note {
  .advisory-icon {
    font-size: 16px;
  }

  p {
    font-size: 14px;
    color: #666;
    margin: 0;
    line-height: 1.5;
    display: inline;
  }
}

.content-course-confirmation {
  width: 32rem;
  max-width: 50%;
  padding: 20px;
}
</style>

<template>
  <TeleportModal
    title="Add Blank Course Card"
    content-class="content-course"
    leftButtonText="Back"
    rightButtonText="Next"
    :rightButtonIsDisabled="!isFormValid"
    @modal-closed="closeCurrentModal"
    @left-button-clicked="closeCurrentModal"
    @right-button-clicked="addBlankCourse"
  >
    <div class="blank-course-form">
      <div class="form-group">
        <label for="courseCode" class="form-label"
          >Course Code<span class="required">*</span></label
        >
        <input
          id="courseCode"
          type="text"
          class="form-input"
          v-model="courseCode"
          placeholder='"CSE 114"'
        />
      </div>

      <div class="form-group">
        <label for="courseName" class="form-label"
          >Course Name<span class="required">*</span></label
        >
        <input
          id="courseName"
          type="text"
          class="form-input"
          v-model="courseName"
          placeholder='"Introduction to Object Oriented Programming"'
        />
      </div>

      <div class="form-group">
        <label for="courseCredits" class="form-label"
          >Total Credits<span class="required">*</span></label
        >
        <input
          id="courseCredits"
          type="number"
          min="1"
          max="8"
          class="form-input"
          v-model="courseCredits"
          placeholder='"4"'
        />
      </div>

      <div class="form-group">
        <label class="form-label">Type of Course<span class="required">*</span></label>
        <div class="radio-group">
          <label class="radio-option" :class="{ 'radio-selected': courseType === 'Transfer' }">
            <div class="radio-circle">
              <input
                type="radio"
                id="transfer"
                value="Transfer"
                v-model="courseType"
                name="courseType"
              />
              <span class="radio-dot"></span>
            </div>
            <span class="radio-label">Transfer</span>
          </label>

          <label class="radio-option" :class="{ 'radio-selected': courseType === 'Study Abroad' }">
            <div class="radio-circle">
              <input
                type="radio"
                id="studyAbroad"
                value="Study Abroad"
                v-model="courseType"
                name="courseType"
              />
              <span class="radio-dot"></span>
            </div>
            <span class="radio-label">Study Abroad</span>
          </label>

          <label class="radio-option" :class="{ 'radio-selected': courseType === 'Other' }">
            <div class="radio-circle">
              <input type="radio" id="other" value="Other" v-model="courseType" name="courseType" />
              <span class="radio-dot"></span>
            </div>
            <span class="radio-label">Other</span>
          </label>
        </div>
      </div>
    </div>
  </TeleportModal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import TeleportModal from '@/components/Modals/TeleportModal.vue';

export default defineComponent({
  components: { TeleportModal },
  props: {
    year: { type: Number, required: false, default: undefined },
    season: {
      type: String as PropType<FirestoreSemesterSeason>,
      required: false,
      default: undefined,
    },
  },
  emits: {
    'close-modal': () => true,
    'add-blank-course': (blankCourse: FirestoreSemesterCourse) => typeof blankCourse === 'object',
    'open-distribution-modal': (blankCourse: FirestoreSemesterCourse) =>
      typeof blankCourse === 'object',
  },
  data() {
    return {
      courseCode: '',
      courseName: '',
      courseCredits: 3,
      courseType: 'Other', // Default selection
    };
  },
  computed: {
    isFormValid(): boolean {
      return (
        this.courseCode.trim().length > 0 &&
        this.courseName.trim().length > 0 &&
        this.courseCredits > 0 &&
        this.courseType !== ''
      );
    },
  },
  methods: {
    closeCurrentModal() {
      this.$emit('close-modal');
    },
    addBlankCourse() {
      if (!this.isFormValid) return;

      // Get the credits value as a number
      const creditsValue = parseInt(this.courseCredits.toString(), 10);

      // Use only the properties defined in FirestoreSemesterCourse
      const blankCourse: FirestoreSemesterBlankCourse = {
        type: 'BlankCourse',
        code: this.courseCode.trim(),
        name: this.courseName.trim(),
        credits: creditsValue,
        creditRange: [creditsValue, creditsValue] as const, // Assuming can't edit credit value
        color: 'FFFFFF', // Default white color
        courseType: this.courseType,
      };
      this.closeCurrentModal();
      this.$emit('open-distribution-modal', blankCourse);
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
  color: #858585 !important;

  .required {
    color: #105351;
    margin-left: 2px;
  }
}

.form-input {
  width: 92%;
  height: 30px;
  padding: 6px 12px;
  font-size: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  outline: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:focus {
    border-color: $sangBlue;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: #bbb;
  }
}

.radio-group {
  display: flex;
  flex-direction: column;
}

.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;

  &:hover {
    background-color: #f9f9f9;
  }

  &.radio-selected {
    .radio-label {
      color: $emGreen;
      font-weight: 500;
    }
  }
}

.radio-circle {
  position: relative;
  width: 22px;
  height: 22px;
  margin-right: 12px;

  input[type='radio'] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .radio-dot {
    display: block;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid #ccc;
    background: white;
    position: relative;
    transition: all 0.2s ease;
  }

  input[type='radio']:checked + .radio-dot {
    border-color: $emGreen;
    background-color: $emGreen;

    &:after {
      content: '';
      position: absolute;
      top: 45%;
      left: 50%;
      width: 6px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }
}

.radio-label {
  font-size: 15px;
  font-weight: 400;
  color: #858585;
}

.modal-button {
  color: $sangBlue;
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-weight: 500;

  &:hover {
    background-color: #f9f9f9;
  }

  &--add {
    background-color: $sangBlue;
    color: white;
    font-weight: 500;
    border: none;
    border-radius: 4px;

    &:not(.modal-button--disabled):hover {
      background-color: darken($sangBlue, 5%);
    }

    &.modal-button--disabled {
      background-color: #cccccc;
      color: #666666;
      opacity: 0.7;
    }
  }
}
</style>

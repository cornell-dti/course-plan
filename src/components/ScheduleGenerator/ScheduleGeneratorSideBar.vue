<template>
  <div class="generatorheader">
    <h1 class="top header-title">Semester Schedule Builder</h1>
    <div class="semester">
      <button class="semester-title-button semester-title full-opacity-on-hover" :disabled="true">
        <p class="semester-title-top">
          <!-- Example: "Spring 2025", as on Figma. -->
          {{ selectedSemester }}
        </p>
      </button>
    </div>
    <!-- NOTE: you cannot generate a schedule if you have not inputted any requirements. -->
    <button
      class="generate-schedule-button"
      :disabled="generateScheduleButtonDisabled"
      @click="openScheduleGenerateModal"
    >
      <!-- Tools SVG icon placed inline with the text. -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M5.33 3.271C5.99704 3.03298 6.72059 3.00293 7.40506 3.1848C8.08954 3.36668 8.70274 3.75193 9.16365 4.28966C9.62456 4.82739 9.91149 5.49229 9.98654 6.19653C10.0616 6.90077 9.92123 7.61121 9.584 8.234L20.293 18.944L18.879 20.358L8.169 9.648C7.54607 9.9839 6.83599 10.1232 6.13233 10.0475C5.42867 9.97181 4.76445 9.6847 4.22721 9.22401C3.68997 8.76332 3.30492 8.15066 3.1228 7.46677C2.94067 6.78289 2.97003 6.05987 3.207 5.393L5.444 7.63C5.58237 7.77327 5.74789 7.88754 5.93089 7.96615C6.1139 8.04477 6.31073 8.08614 6.5099 8.08788C6.70907 8.08961 6.90659 8.05165 7.09093 7.97623C7.27528 7.90081 7.44275 7.78943 7.58359 7.64859C7.72443 7.50775 7.83581 7.34028 7.91123 7.15593C7.98665 6.97159 8.02461 6.77407 8.02288 6.5749C8.02114 6.37573 7.97976 6.1789 7.90115 5.99589C7.82254 5.81289 7.70826 5.64737 7.565 5.509L5.329 3.27L5.33 3.271ZM15.697 5.155L18.879 3.387L20.293 4.801L18.525 7.983L16.757 8.337L14.637 10.458L13.222 9.044L15.343 6.923L15.697 5.155ZM8.979 13.287L10.393 14.701L5.09 20.004C4.9097 20.1848 4.66706 20.2898 4.41183 20.2974C4.1566 20.3051 3.90811 20.2148 3.71732 20.0451C3.52652 19.8754 3.40786 19.6392 3.38568 19.3848C3.36349 19.1304 3.43946 18.8772 3.598 18.677L3.676 18.59L8.979 13.287Z"
          fill="white"
        />
      </svg>
      Generate Schedule
    </button>
    <div class="credit-limit-container">
      <div>
        <label class="credit-limit-label">Credit Limit</label>
        <!--
          NOTE: min and max are only semantic here.
          
          That is to say, they would only be enforced using the up and down arrows, which have been purposefully removed for aesthetic reasons.

          As such, if we want to enforce the credit limit here, would have to implement some sort of reactive JavaScript listener.
        -->
        <input type="number" placeholder='"18"' min="0" max="30" class="credit-limit-input" />
      </div>
      <button class="add-requirement-button">+ Requirement</button>
    </div>
    <hr />
    <!-- The Figma wrote the below as 'No Requirements added' but I believe that was a capitalization mistake. -->
    <p class="no-requirements-added">No requirements added.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    // current semester being generated for
    selectedSemester: { type: String, required: true },
    // (linked with requirements) whether any requirements have been added
    generateScheduleButtonDisabled: { type: Boolean, required: true },
  },
  methods: {
    openScheduleGenerateModal() {
      console.log('here');
      this.menuOpen = false;
      this.$parent.$emit('openScheduleGenerateModal');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.generatorheader {
  width: 25rem;
  background-color: $white;
  padding: 1.625rem 1.5rem;
}

/*
  NOTE: There is a fair amount of overlap between the styles here and the styles in
  @/components/Requirements/RequirementHeader.vue.
*/

.top {
  margin: 1.5rem 0 1rem 0;

  &-small {
    margin: 0px;
  }
}

.header-title {
  color: $darkGray;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
}

.semester {
  display: flex;
  padding-bottom: 12.5px;

  &-title {
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    color: $lightPlaceholderGray;
    padding-bottom: 6px;

    &-button {
      border: none;
      background: none;
      text-align: center;
      display: flex;
      align-items: center;

      p {
        flex-direction: column;
      }
    }

    &-top {
      text-align: center;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      margin: 0;
    }

    &-bottom {
      text-align: center;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 15px;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.semester-title-button {
  border-bottom: 2px solid $emGreen;
}

.semester-title-top {
  font-weight: 500;
  color: $emGreen;
}

/* This is the actual text warning message. */
.no-requirements-added {
  color: #cecece;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-align: center;
  margin-top: 30px;
}

.generate-schedule-button {
  display: flex;
  width: 100%;
  height: 34px;
  padding: 5px 32px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 3px;
  color: $white;
  margin-bottom: 12px;
  border: 1px solid $emGreen;
  background: $emGreen;
  cursor: pointer; /* otherwise uses default cursor */
}

.generate-schedule-button:disabled {
  border: 1px solid $inactiveGray;
  background: $inactiveGray;
  cursor: not-allowed;
}

.credit-limit-label {
  color: $darkGray2;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 0;
  margin-right: 14px;
}

.credit-limit-input {
  width: 57.574px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 2px;
  border: 0.5px solid $lightPlaceholderGray;
  background: $white;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.credit-limit-input::placeholder {
  color: $darkPlaceholderGray;
}

/* Removes the default HTML up-and-down arrows from the number input. */
.credit-limit-input::-webkit-outer-spin-button,
.credit-limit-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.credit-limit-input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.credit-limit-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-requirement-button {
  display: flex;
  width: 162px;
  height: 34px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  background-color: $emGreen;
  color: $white;
  border-radius: 4px;
  font-size: 16px;
  align-items: center;
}
</style>

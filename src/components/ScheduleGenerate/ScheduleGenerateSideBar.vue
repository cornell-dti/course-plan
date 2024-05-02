<template>
  <div class="sidebar">
    <confirmation :text="confirmationText" v-if="isConfirmationOpen" />
    <div class="sidebar-header">
      <h1 class="top header-title">Semester Schedule Builder</h1>
      <div class="semester">
        <button class="semester-title-button semester-title full-opacity-on-hover" :disabled="true">
          <p class="semester-title-top">{{ season }} {{ year }}</p>
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
        {{ generateButtonText }}
      </button>
      <div class="credit-limit-container">
        <div>
          <label class="credit-limit-label">Credit Limit</label>
          <!--
            NOTE: min and max are only semantic here.
            
            That is to say, they would only be enforced using the up and down arrows, which have been purposefully removed for aesthetic reasons.

            As such, if we want to enforce the credit limit here, would have to implement some sort of reactive JavaScript listener.
          -->
          <input
            type="number"
            placeholder='"18"'
            min="12"
            max="22"
            class="credit-limit-input"
            v-model="creditLimit"
          />
        </div>
        <button class="add-requirement-button" @click="addRequirement">+ Requirement</button>
      </div>
      <div v-if="isInvalidCreditLimit" class="credit-limit-warning">
        Note: You must specify a credit limit. The credit limit must be between 12 and 22 inclusive.
      </div>
    </div>
    <p v-if="requirements.length === 0" class="no-requirements-added">No requirements added.</p>
    <div v-for="(req, index) in requirements" :key="req.reqId">
      <requirement-courses
        :available-requirements="availableRequirements"
        :selected-requirement="requirements[index]"
        :index="index"
        :year="year"
        :season="season"
        @add-course="addCourse"
        @delete-course="deleteCourse"
        @select-requirement="selectRequirement"
        @delete-requirement="deleteRequirement(index)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import RequirementCourses from '@/components/ScheduleGenerate/RequirementCourses.vue';
import Confirmation from '@/components/Modals/Confirmation.vue';
import store from '@/store';
import { cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor } from '@/user-data-converter';
import { getCourseWithCrseIdAndRoster } from '@/global-firestore-data/courses';
import Requirement from '@/schedule-generator/requirement';

export type ReqCourses = {
  reqId: string;
  reqName: string;
  courses: FirestoreSemesterCourse[];
};

export default defineComponent({
  data(): {
    // requirements is the list of requirement groups on the sidebar
    // it includes the requirement id, name, and the courses associated with it
    requirements: ReqCourses[];
    isConfirmationOpen: boolean;
    confirmationText: string;
    creditLimit?: number;
    isGenerating: boolean;
  } {
    return {
      requirements: [],
      isConfirmationOpen: false,
      confirmationText: '',
      creditLimit: undefined,
      isGenerating: false,
    };
  },
  components: {
    RequirementCourses,
    Confirmation,
  },
  props: {
    // current year and season being generated for
    year: { type: Number, required: true },
    season: { type: String as PropType<FirestoreSemesterSeason>, required: true },
  },
  emits: ['openScheduleGenerateModal'],
  computed: {
    isInvalidCreditLimit(): boolean {
      if (this.creditLimit !== undefined) {
        return this.creditLimit < 12 || this.creditLimit > 22;
      }
      return true;
    },
    generateButtonText(): string {
      return this.isGenerating ? 'Generating...' : 'Generate Schedule';
    },
    generateScheduleButtonDisabled(): boolean {
      // disables the "Generate Schedule" button until
      // 1. Credit limit has been specified and is between 12 and 22
      // 2. At least one requirement has been added
      // 3. Each requirement has at least one course added
      const isCreditLimitSpecified = this.creditLimit !== undefined;
      const hasOneRequirement = this.requirements.length > 0;
      const hasEveryRequirementOneCourse = this.requirements.every(req => req.courses.length > 0);
      return !(
        isCreditLimitSpecified &&
        hasOneRequirement &&
        hasEveryRequirementOneCourse &&
        !this.isGenerating &&
        !this.isInvalidCreditLimit
      );
    },
    groupedRequirementFulfillmentReports(): readonly GroupedRequirementFulfillmentReport[] {
      return store.state.groupedRequirementFulfillmentReport;
    },
    // this function is turning the groupedRequirementFulfillmentReports and taking the reqs out of each group
    // and concatenating them into one giant record with reqId's as keys and reqName's as values
    // it represents the available requirements that haven't been assigned yet
    availableRequirements(): Record<string, string> {
      const courseRecord: Record<string, string> = this.groupedRequirementFulfillmentReports.reduce(
        (accumulator: Record<string, string>, groupedReq: GroupedRequirementFulfillmentReport) =>
          groupedReq.reqs.reduce((acc: Record<string, string>, req: RequirementFulfillment) => {
            acc[req.requirement.id] = req.requirement.name;
            return acc;
          }, accumulator),
        {} as Record<string, string>
      );
      courseRecord['-1'] = 'No requirement'; // TODO: Double check that "-1" can never be an id
      return courseRecord;
    },
  },
  methods: {
    openConfirmationModal(msg: string) {
      // Set text and display confirmation modal, then have it disappear after 3 seconds
      this.confirmationText = msg;
      this.isConfirmationOpen = true;

      setTimeout(() => {
        this.closeConfirmationModal();
      }, 2000);
    },
    closeConfirmationModal() {
      this.isConfirmationOpen = false;
    },
    // add course to a requirement
    addCourse(course: CornellCourseRosterCourse, index: number) {
      this.requirements[index].courses.push(
        cornellCourseRosterCourseToFirebaseSemesterCourseWithCustomIDAndColor(
          course,
          -1,
          store.state.subjectColors[course.subject]
        )
      );
    },
    // delete a course from a requirement
    deleteCourse(code: string, index: number) {
      this.requirements[index].courses = this.requirements[index].courses.filter(
        course => course.code !== code
      );
    },
    // add a new requirement group
    addRequirement() {
      this.requirements = [{ reqId: '', reqName: '', courses: [] }, ...this.requirements];
    },

    // TODO: use availableRequirement once we start enforcing how many requirement groups we can add

    // add back an available requirement
    // addAvailableRequirement(requirement: ReqCourses) {
    //   if (requirement.reqId !== '')
    //     this.availableRequirements[requirement.reqId] = requirement.reqName;
    // },
    // get rid of an available requirement
    // deleteAvailableRequirement(reqId: string) {
    //   delete this.availableRequirements[reqId];
    // },
    // select a requirement on the dropdown
    selectRequirement(reqId: string, index: number) {
      const reqName = this.availableRequirements[reqId];
      this.requirements[index] = { reqId, reqName, courses: [] };
    },

    // delete a requirement group and add back to the available requirements
    deleteRequirement(index: number) {
      const requirement = this.requirements[index];
      // add back to the availableRequirements record
      // this.addAvailableRequirement(requirement);

      // delete this requirement from list
      this.requirements.splice(index, 1);
      this.openConfirmationModal(
        `Removed ${
          requirement.reqName === '' ? 'requirement' : requirement.reqName
        } from schedule builder`
      );
    },
    async openScheduleGenerateModal() {
      this.isGenerating = true;
      function formatTime(timeStr: string): string {
        const timeParts = timeStr.match(/(\d+):(\d+)(\w{2})/);
        if (!timeParts) return '';

        const hours = parseInt(timeParts[1], 10);
        const minutes = timeParts[2];
        const period = timeParts[3].toLowerCase();

        return `${hours}:${minutes}${period}`;
      }

      function getStartTime(course: FirestoreSemesterCourse): Promise<string> {
        return getCourseWithCrseIdAndRoster(course.lastRoster, course.crseId)
          .then(firestoreCourse => {
            const { meetings } = firestoreCourse.enrollGroups[0].classSections[0];
            if (meetings.length > 0 && meetings[0].timeStart) {
              const timeUnformatted = meetings[0].timeStart as string;
              return formatTime(timeUnformatted);
            }
            return '12:00AM';
          })
          .catch(error => {
            console.error(`Failed to fetch the course details. ${error}`);
            return '12:00AM';
          });
      }

      function getEndTime(course: FirestoreSemesterCourse): Promise<string> {
        return getCourseWithCrseIdAndRoster(course.lastRoster, course.crseId)
          .then(firestoreCourse => {
            const { meetings } = firestoreCourse.enrollGroups[0].classSections[0];
            if (meetings.length > 0 && meetings[0].timeEnd) {
              const timeUnformatted = meetings[0].timeEnd as string;
              return formatTime(timeUnformatted);
            }
            return '1:00AM';
          })
          .catch(error => {
            console.error(`Failed to fetch the course details. ${error}`);
            return '1:00AM';
          });
      }

      function getPattern(course: FirestoreSemesterCourse): Promise<string> {
        return getCourseWithCrseIdAndRoster(course.lastRoster, course.crseId)
          .then(firestoreCourse => {
            const pattern = firestoreCourse.enrollGroups[0].classSections[0].meetings[0]
              .pattern as string;
            return pattern;
          })
          .catch(error => {
            throw new Error(`Failed to fetch the course pattern. ${error}`);
          });
      }

      function getDaysOfTheWeek(patternStr?: string): string[] {
        if (patternStr === undefined) {
          return [];
        }

        const dayMap: { [key: string]: string } = {
          M: 'Monday',
          T: 'Tuesday',
          W: 'Wednesday',
          R: 'Thursday',
          F: 'Friday',
          S: 'Saturday',
          Su: 'Sunday',
        };

        const days: string[] = [];

        for (let i = 0; i < patternStr.length; i += 1) {
          if (patternStr[i] === 'S' && i + 1 < patternStr.length && patternStr[i + 1] === 'u') {
            days.push(dayMap.Su);
            i += 1;
          } else if (dayMap[patternStr[i]]) {
            days.push(dayMap[patternStr[i]]);
          }
        }

        return days;
      }

      // TODO: if a course does not exist in the firestore (outdated) an error
      // will be thrown. (Requires that user selected a bad course.)
      const coursesWithReqs = await Promise.all(
        this.requirements.map(async req => ({
          reqId: req.reqId,
          courses: await Promise.all(
            req.courses.map(async course => {
              const startTime = await getStartTime(course);
              const endTime = await getEndTime(course);
              const pattern = await getPattern(course);
              const daysOfTheWeek = getDaysOfTheWeek(pattern);
              return {
                title: course.name,
                color: course.color,
                code: course.code,
                courseCredits: course.credits,
                fulfilledReq: {
                  name: req.reqName,
                  for: req.reqId.split('-')[0],
                  typeValue: req.reqId.split('-')[1],
                } as Requirement,
                daysOfTheWeek,
                timeStart: startTime,
                timeEnd: endTime,
              };
            })
          ),
        }))
      );
      this.isGenerating = false;
      this.$emit('openScheduleGenerateModal', coursesWithReqs, this.creditLimit);
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.sidebar {
  width: 25rem;
  background-color: $white;
  padding: 1.625rem 1.5rem;
  overflow-y: scroll;

  &-header {
    margin-bottom: 1rem;
  }
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
  cursor: pointer;
  /* otherwise uses default cursor */
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

.credit-limit-warning {
  color: $warning;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  margin-top: 4px;
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
  // font-size: 16px;
  align-items: center;
}

.add-requirement-button:disabled {
  border: 1px solid $inactiveGray;
  background: $inactiveGray;
  cursor: not-allowed;
}
</style>

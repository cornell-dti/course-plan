<template>
  <div class="schedule-generate" @click="checkClickOutside" ref="modalBackground">
    <div class="schedule-generate-main">
      <div class="schedule-generate-content">
        <div class="schedule-generate-cancel">
          <button @click="cancel">
            <img
              class="schedule-generate-cancel-icon"
              src="@/assets/images/x.svg"
              alt="x to close modal"
            />
          </button>
        </div>
        <div class="schedule-generate-top">
          <div class="schedule-generate-header">
            <span
              ><img
                class="schedule-generate-header-emoji"
                src="@/assets/images/waveEmoji.svg"
                alt="wave"
              />
              Say hello to your generated schedule!</span
            >
          </div>
          <div class="schedule-generate-description">
            Please download before closing or it won't be saved!
          </div>
        </div>
        <div class="schedule-generate-body">
          <div class="schedule-generate-subHeader schedule-generate-subHeader--smallerIndent">
            Your Courses
          </div>
          <div class="schedule-generate-section-courses">
            <schedule-courses
              :total-credits="generatedScheduleOutputs[currentPage - 1]?.totalCredits ?? 0"
              :generated-schedule="generatedScheduleOutputs[currentPage - 1]?.schedule"
              :classes="classes"
            />
          </div>
          <div class="schedule-generate-section-schedule">
            <div class="schedule-generate-subHeader schedule-generate-subHeader--indent">
              {{ season }} {{ year }}
            </div>
            <schedule ref="calendar" :classesSchedule="classesSchedule" />
          </div>
        </div>
        <!-- TODO: connect everything in the footer here... -->
        <div class="schedule-generate-bottom">
          <button @click="regenerateSchedule" class="generate-schedules-button">
            <span class="footer-text">Generate New Schedules</span>
          </button>
          <div class="right-footer-container">
            <button
              @click="() => paginate(-1)"
              :disabled="currentPage === 1"
              :class="'footer-button' + (currentPage === 1 ? ' footer-button-disabled' : ' ')"
            >
              <span :class="currentPage === 1 ? 'footer-text-disabled' : 'footer-text'">Prev</span>
            </button>
            <button
              @click="() => paginate(1)"
              :disabled="currentPage === 5"
              :class="'footer-button' + (currentPage === 5 ? ' footer-button-disabled' : ' ')"
            >
              <span :class="currentPage === 5 ? 'footer-text-disabled' : 'footer-text'">Next</span>
            </button>
            <span class="pagination-text ml-25">Page {{ currentPage }}/5</span>
          </div>
          <div class="download-button" @click="downloadSchedule">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              class="download-button-icon"
              viewBox="0 0 19 19"
              fill="none"
            >
              <path
                d="M16.625 11.875V15.0417C16.625 15.4616 16.4582 15.8643 16.1613 16.1613C15.8643 16.4582 15.4616 16.625 15.0417 16.625H3.95833C3.53841 16.625 3.13568 16.4582 2.83875 16.1613C2.54181 15.8643 2.375 15.4616 2.375 15.0417V11.875"
                stroke="white"
                stroke-width="1.05556"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.54199 7.91699L9.50033 11.8753L13.4587 7.91699"
                stroke="white"
                stroke-width="1.05556"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.5 11.875V2.375"
                stroke="white"
                stroke-width="1.05556"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Download</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import Schedule from '@/components/ScheduleGenerate/Schedule.vue';
import ScheduleCourses from '@/components/ScheduleGenerate/ScheduleCourses.vue';
import { generateSchedulePDF } from '@/tools/export-plan';
import GeneratorRequest from '@/schedule-generator/generator-request';
import ScheduleGenerator from '@/schedule-generator/algorithm';
import type { GeneratedScheduleOutput } from '@/schedule-generator/algorithm';
import Course, {
  CourseForFrontend,
  DayOfTheWeek,
  Timeslot,
} from '@/schedule-generator/course-unit';
import Requirement from '@/schedule-generator/requirement';

export default defineComponent({
  props: {
    // current semester being generated for
    // current year and season being generated for
    year: { type: Number, required: true },
    season: { type: Object as PropType<FirestoreSemesterSeason>, required: true },
    courses: {
      type: Array as PropType<CourseForFrontend[]>,
      default: () => [],
    },
    creditLimit: {
      type: Number,
      default: 12,
    },
    reqIds: {
      type: Array as PropType<(string | undefined)[]>,
      default: () => [],
    },
  },
  components: {
    Schedule,
    ScheduleCourses,
  },
  emits: ['closeScheduleGenerateModal'],
  data() {
    return {
      currentPage: 1,
      generatedScheduleOutputs: [] as GeneratedScheduleOutput[],
    };
  },
  methods: {
    cancel() {
      this.$emit('closeScheduleGenerateModal');
    },
    checkClickOutside(e: MouseEvent) {
      if (e.target === this.$refs.modalBackground) {
        this.cancel();
      }
    },
    async downloadSchedule() {
      console.log(this.courses, this.reqIds, this.classes, this.classesSchedule);
      const calendarRef = this.$refs.calendar as typeof Schedule;
      // FIXME: pass in the other data, reqs no longer exists
      generateSchedulePDF(this.reqs, await calendarRef.generatePdfData(), this.year, this.season);
    },
    generateSchedules() {
      const output: {
        semester: string;
        schedule: Map<Course, Timeslot[]>;
        fulfilledRequirements: Map<string, Requirement[]>;
        totalCredits: number;
      }[] = [];

      function getRandomDaySet(): DayOfTheWeek[] {
        const daySets = [
          ['Monday', 'Wednesday', 'Friday'],
          ['Tuesday', 'Thursday'],
          ['Saturday', 'Sunday'],
        ] as DayOfTheWeek[][];
        const randomIndex = Math.floor(Math.random() * daySets.length);
        return daySets[randomIndex];
      }

      for (let i = 0; i < 5; i += 1) {
        const courses = this.courses.map(
          course =>
            new Course(
              course.name,
              // course.credits,
              '#'.concat(course.color),
              course.courseCredits,
              [
                {
                  start: course.timeStart,
                  end: course.timeEnd,
                  daysOfTheWeek: (course.daysOfTheWeek as DayOfTheWeek[]) || getRandomDaySet(),
                },
              ],
              [`${this.year} ${this.season}`],
              // this.reqIds.map(reqId => new Requirement(reqId))
              [
                {
                  type: course.fulfilledReqId,
                },
              ]
            )
        );

        const generatorRequest = new GeneratorRequest(
          courses,
          this.reqIds.map(reqId => new Requirement(reqId)),
          this.creditLimit,
          `${this.year} ${this.season}`
        );

        output.push(ScheduleGenerator.generateSchedule(generatorRequest));
      }

      this.generatedScheduleOutputs = output;
    },
    regenerateSchedule() {
      this.generateSchedules();
      this.currentPage = 1;
    },
    paginate(direction: number) {
      if ((this.currentPage < 5 && direction === 1) || (this.currentPage > 1 && direction === -1)) {
        this.currentPage += direction;
      }
    },
  },
  computed: {
    classes() {
      const returnCourses = Array.from(
        this.generatedScheduleOutputs[this.currentPage - 1]?.schedule.keys() ?? []
      ).map(course => ({
        title: this.courses.find(c => c.name === course.name)?.fulfilledReq ?? '',
        name: course.name,
        color: '#'.concat(this.courses.find(c => c.name === course.name)?.color ?? ''),
        code: this.courses.find(c => c.name === course.name)?.code ?? '',
        timeStart: this.courses.find(c => c.name === course.name)?.timeStart,
        timeEnd: this.courses.find(c => c.name === course.name)?.timeEnd,
      }));
      return returnCourses;
    },
    classesSchedule() {
      if (this.generatedScheduleOutputs.length === 0) {
        // Opening for the first time...
        this.generateSchedules();
      }

      type classList = {
        title: string;
        name: string;
        color: string;
        timeStart: string;
        timeEnd: string;
      }[];

      // ScheduleGenerator.prettyPrintSchedule(generatedSchedule);
      const mondayClasses: classList = [];
      const tuesdayClasses: classList = [];
      const wednesdayClasses: classList = [];
      const thursdayClasses: classList = [];
      const fridayClasses: classList = [];
      const saturdayClasses: classList = [];
      const sundayClasses: classList = [];

      this.generatedScheduleOutputs[this.currentPage - 1]?.schedule.forEach((timeslots, course) =>
        timeslots.forEach(timeslot =>
          timeslot.daysOfTheWeek.forEach(day => {
            if (day === 'Monday') {
              mondayClasses.push({
                title: course.name,
                name: course.name,
                color: course.color,
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
            if (day === 'Tuesday') {
              tuesdayClasses.push({
                title: course.name,
                name: course.name,
                color: course.color,
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
            if (day === 'Wednesday') {
              wednesdayClasses.push({
                title: course.name,
                name: course.name,
                color: course.color,
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
            if (day === 'Thursday') {
              thursdayClasses.push({
                title: course.name,
                name: course.name,
                color: course.color,
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
            if (day === 'Friday') {
              fridayClasses.push({
                title: course.name,
                name: course.name,
                color: course.color,
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
            if (day === 'Saturday') {
              saturdayClasses.push({
                title: course.name,
                name: course.name,
                color: course.color,
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
            if (day === 'Sunday') {
              sundayClasses.push({
                title: course.name,
                name: course.name,
                color: course.color,
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
          })
        )
      );

      return {
        Monday: mondayClasses,
        Tuesday: tuesdayClasses,
        Wednesday: wednesdayClasses,
        Thursday: thursdayClasses,
        Friday: fridayClasses,
        Saturday: saturdayClasses,
        Sunday: sundayClasses,
      };
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

button:hover {
  opacity: 0.5;
}

input {
  background-color: none;
}

.schedule-generate {
  padding: 1rem;
  width: 100%;

  &-main {
    background: $white;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    width: 69rem;
  }

  &-cancel {
    cursor: pointer;
    text-align: right;
    position: absolute;
    right: 1rem;
    top: 1rem;
    z-index: 5;

    &-icon {
      margin: 11px 11px 0 0;
    }
  }

  &-header {
    font-weight: bold;
    font-size: 36px;
    color: $onboardingGray;
    text-align: center;

    &-emoji {
      width: 36px;
      height: 36px;
      vertical-align: text-top;
    }
  }

  &-description {
    font-weight: 300;
    font-size: 18px;
    line-height: 36px;
    color: $onboardingGray;
    text-align: center;
  }

  &-content {
    position: relative;
    padding: 2rem;
  }

  &-body {
    padding: 0rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 2rem;
  }

  &-section {
    margin-bottom: 1rem;

    &-courses {
      width: 250px;
      margin-right: 2rem;
      display: flex;
      position: relative;
      z-index: 1;
    }

    &-schedule {
      display: flex;
      position: relative;
      z-index: 1;
    }
  }

  &-subHeader {
    font-weight: 900;
    text-align: center;
    color: $black;
    position: absolute;
    z-index: 2;
    line-height: 22px;
    margin-top: -0.5rem;
    background-color: $white;

    &--font {
      color: $black;
      flex-direction: row;
      background-color: $white;
      padding: 0rem 0.5rem 0rem 0.5rem;
    }
    &--review {
      font-weight: normal;
      padding: 5px;
      margin-left: 10px;
      background-color: $white;
      color: $lightPlaceholderGray;
      font-size: 16px;
    }
    &--smallerIndent {
      margin-left: 1.25rem;
      font-size: 18px;
    }

    &--indent {
      margin-left: 2rem;
      font-size: 18px;
    }
  }

  &-bottom {
    display: flex;
    justify-content: flex-start;
    margin-top: 1rem;
  }
}

.download-button {
  margin-left: auto;
  display: flex;
  width: 246px;
  height: 35px;
  padding: 0px 66.603px 0px 62px;
  align-items: center;
  flex-shrink: 0;
  border-radius: 3px;
  background: var(--Button-Color---Sang, $sangBlue);
  color: $white;
  cursor: pointer;

  &-icon {
    margin-right: 21.05px;
    width: 19px;
    height: 19px;
    flex-shrink: 0;
    margin-bottom: 3px;
  }
}

.generate-schedules {
  &-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    height: 35px;
    padding: 10px 28px;
    border: 1px solid $sangBlue;
    &-disabled {
      border-radius: 3px;
      background: rgba(231, 231, 231, 0.75);
      cursor: not-allowed;
    }
  }
}

.footer {
  &-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    height: 35px;
    padding: 10px 22px;
    border: 1px solid $sangBlue;
    &-disabled {
      border-radius: 3px;
      background: rgba(231, 231, 231, 0.75);
      border-color: $lightPlaceholderGray;
      opacity: 50%;
      cursor: not-allowed;
    }
  }

  &-text {
    color: $sangBlue;
    text-align: center;
    font-family: 'Proxima Nova';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    &-disabled {
      color: $lightPlaceholderGray;
      text-align: center;
      font-family: 'Proxima Nova';
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
}

.right-footer-container {
  display: flex;
  align-items: center;
  margin-left: 2rem;
  justify-content: space-between;
  gap: 10px;
}

.pagination-button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  height: 35px;
  padding: 10px 20px;
  border: 1px solid $sangBlue;
}

.pagination-text {
  color: $primaryGray;
  text-align: center;
  font-family: 'Proxima Nova';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.ml-25 {
  margin-left: 25px;
}
</style>

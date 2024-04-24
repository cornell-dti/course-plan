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
              :num-credits="totalCreditsGenerated"
              :num-classes="numberOfCoursesGenerated"
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
import { defineComponent } from 'vue';
import Schedule from '@/components/ScheduleGenerate/Schedule.vue';
import ScheduleCourses from '@/components/ScheduleGenerate/ScheduleCourses.vue';
import GeneratorRequest from '@/schedule-generator/generator-request';
import ScheduleGenerator from '@/schedule-generator/algorithm';
import Course from '@/schedule-generator/course-unit';
import Requirement from '@/schedule-generator/requirement';

export default defineComponent({
  props: {
    // current semester being generated for
    selectedSemester: { type: String, required: true },
    courses: {
      type: Array,
      default: () => [],
    },
    creditLimit: {
      type: Number,
      default: 12,
    },
    reqIds: {
      type: Array,
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
      numberOfCoursesGenerated: null,
      totalCreditsGenerated: 0,
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
  },
  computed: {
    classes() {
      // console.log('courses straight from the input - should be in firebase format');
      // console.log(this.courses);
      const returnCourses = this.courses.map(course => ({
        title: course.fulfilledReq,
        name: course.name,
        color: '#'.concat(course.color),
        timeStart: course.timeStart,
        timeEnd: course.timeEnd,
      }));
      return returnCourses;
    },
    classesSchedule() {
      console.log('courses from user input, in firebasesemestercourse format');
      console.log(this.courses);

      // console.log('reqs from userinput');
      // console.log(this.reqIds);

      // console.log('req mapping');
      // console.log(this.reqIds.map(reqId => new Requirement(reqId)));

      function getRandomDaySet(): string[] {
        const daySets = [
          ['Monday', 'Wednesday', 'Friday'],
          ['Tuesday', 'Thursday'],
          ['Saturday', 'Sunday'],
        ];
        const randomIndex = Math.floor(Math.random() * daySets.length);
        return daySets[randomIndex];
      }
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
                daysOfTheWeek: course.daysOfTheWeek || getRandomDaySet(),
              },
            ],
            [this.selectedSemester],
            // this.reqIds.map(reqId => new Requirement(reqId))
            course.fulfilledReqId
          )
      );

      const generatorRequest = new GeneratorRequest(
        courses,
        this.reqIds.map(reqId => new Requirement(reqId)),
        this.creditLimit,
        this.selectedSemester
      );

      const generatedSchedule = ScheduleGenerator.generateSchedule(generatorRequest);

      this.numberOfCoursesGenerated = generatedSchedule.schedule.size;
      this.totalCreditsGenerated = generatedSchedule.totalCredits;

      // ScheduleGenerator.prettyPrintSchedule(generatedSchedule);
      let mondayClasses = [];
      let tuesdayClasses = [];
      let wednesdayClasses = [];
      let thursdayClasses = [];
      let fridayClasses = [];
      let saturdayClasses = [];
      let sundayClasses = [];
      generatedSchedule.schedule.forEach((timeslots, course) =>
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

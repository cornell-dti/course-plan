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
            <schedule-courses :num-credits="creditLimit" :classes="classes" />
          </div>
          <div class="schedule-generate-section-schedule">
            <div class="schedule-generate-subHeader schedule-generate-subHeader--indent">
              {{ selectedSemester }}
            </div>
            <schedule :classesSchedule="classesSchedule" />
          </div>
        </div>
      </div>
      <div class="schedule-generate-bottom"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Schedule from '@/components/ScheduleGenerate/Schedule.vue';
import ScheduleCourses from '@/components/ScheduleGenerate/ScheduleCourses.vue';
import GeneratorRequest from '@/schedule-generator/generator-request';
import ScheduleGenerator from '@/schedule-generator/algorithm';
import Course, { Timeslot, DayOfTheWeek } from '@/schedule-generator/course-unit';
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
  methods: {
    cancel() {
      this.$emit('closeScheduleGenerateModal');
    },
    checkClickOutside(e: MouseEvent) {
      if (e.target === this.$refs.modalBackground) {
        this.cancel();
      }
    },
    // generateAndLogSchedule() {
    //   const courses = this.courses.map(
    //     course =>
    //       new Course(
    //         course.name,
    //         // course.credits,
    //         3,
    //         [
    //           {
    //             start: course.timeStart,
    //             end: course.timeEnd,
    //             daysOfTheWeek: course.daysOfTheWeek || ['Monday', 'Friday'],
    //           },
    //         ],
    //         [this.selectedSemester],
    //         this.reqIds.map(reqId => new Requirement(reqId))
    //       )
    //   );

    //   console.log('Courses with timeslots:', courses);
    //   const generatorRequest = new GeneratorRequest(
    //     courses,
    //     this.reqIds.map(reqId => new Requirement(reqId)),
    //     this.creditLimit,
    //     this.selectedSemester
    //   );

    //   const generatedSchedule = ScheduleGenerator.generateSchedule(generatorRequest);
    //   console.log('FROM generate and log scheedule method Generated Schedule:', generatedSchedule);
    //   ScheduleGenerator.prettyPrintSchedule(generatedSchedule);
    //   return generatedSchedule;
    // },
  },
  // mounted() {
  //   this.generateAndLogSchedule();
  // },
  computed: {
    classes() {
      const returnCourses = this.courses.map(course => ({
        title: course.title,
        name: course.name,
        color: '#'.concat(course.color),
        timeStart: course.timeStart,
        timeEnd: course.timeEnd,
      }));
      console.log('MODAL COLOR');
      console.log(returnCourses[0].color);
      console.log('From Schedule Generate MODAL COURSES SELECTED');
      console.log(returnCourses);
      console.log('From Schedule Generate MODAL REQS SELECTED');
      console.log(this.reqIds);
      return returnCourses;
    },
    classesSchedule() {
      function getRandomDaySet(): string[] {
        const daySets = [
          ['Monday', 'Wednesday', 'Friday'], // Set 1
          ['Tuesday', 'Thursday'], // Set 2
          ['Saturday', 'Sunday'], // Set 3
        ];
        const randomIndex = Math.floor(Math.random() * daySets.length); // Get a random index
        return daySets[randomIndex]; // Return a random set of days
      }
      const courses = this.courses.map(
        course =>
          new Course(
            course.name,
            // course.credits,
            3,
            [
              {
                start: course.timeStart,
                end: course.timeEnd,
                daysOfTheWeek: course.daysOfTheWeek || getRandomDaySet(),
              },
            ],
            [this.selectedSemester],
            this.reqIds.map(reqId => new Requirement(reqId))
          )
      );

      // console.log('Courses with timeslots:', courses);
      const generatorRequest = new GeneratorRequest(
        courses,
        this.reqIds.map(reqId => new Requirement(reqId)),
        this.creditLimit,
        this.selectedSemester
      );

      const generatedSchedule = ScheduleGenerator.generateSchedule(generatorRequest);
      // console.log('From computed class schedule!!:', generatedSchedule);
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
            // console.log(day, timeslot.start, timeslot.end);
            if (day === 'Monday') {
              console.log(day);
              console.log(timeslot.start);
              console.log(timeslot.end);
              mondayClasses.push({
                title: course.name,
                name: course.name,
                color: '#FF3B30',
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
            if (day === 'Tuesday') {
              console.log(day);
              console.log(timeslot.start);
              console.log(timeslot.end);
              tuesdayClasses.push({
                title: course.name,
                name: course.name,
                color: '#FF3B30',
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
            if (day === 'Wednesday') {
              console.log(day);
              console.log(timeslot.start);
              console.log(timeslot.end);
              wednesdayClasses.push({
                title: course.name,
                name: course.name,
                color: '#FF3B30',
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
            if (day === 'Thursday') {
              console.log(day);
              console.log(timeslot.start);
              console.log(timeslot.end);
              thursdayClasses.push({
                title: course.name,
                name: course.name,
                color: '#FF3B30',
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
            if (day === 'Friday') {
              console.log(day); // This will log 'Monday' if the day is Monday
              console.log('STARTIME', timeslot.start);
              console.log('ENDTIME', timeslot.end);
              fridayClasses.push({
                title: course.name,
                name: course.name,
                color: '#FF3B30',
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
            if (day === 'Saturday') {
              console.log(day);
              console.log('STARTIME', timeslot.start);
              console.log('ENDTIME', timeslot.end);
              saturdayClasses.push({
                title: course.name,
                name: course.name,
                color: '#FF3B30',
                timeStart: timeslot.start,
                timeEnd: timeslot.end,
              });
            }
            if (day === 'Sunday') {
              console.log(day);
              console.log('STARTIME', timeslot.start);
              console.log('ENDTIME', timeslot.end);
              sundayClasses.push({
                title: course.name,
                name: course.name,
                color: '#FF3B30',
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
    padding: 1.5rem 2rem 1.5rem 2rem;
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

    &--smallerIndent {
      margin-left: 1.25rem;
      font-size: 18px;
    }

    &--indent {
      margin-left: 2rem;
      font-size: 18px;
    }
  }
}
</style>

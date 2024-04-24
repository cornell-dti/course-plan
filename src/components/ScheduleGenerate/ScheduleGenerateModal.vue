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
            this.reqIds.map(reqId => new Requirement(reqId))
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

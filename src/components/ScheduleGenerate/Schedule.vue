<template>
  <div class="schedule-main">
    <div class="schedule-body">
      <div class="schedule-hours">
        <div class="schedule-hour" v-for="hour in hoursRange">{{ hour }}</div>
      </div>
      <div class="schedule-week">
        <div class="schedule-day" v-for="day in days">
          <span class="schedule-day-label">
            {{ day }}
          </span>
          <div
            class="schedule-course"
            v-for="cls in classesSchedule[day]"
            :style="getStyle(cls.color, cls.timeStart, cls.timeEnd)"
          >
            <div class="schedule-course-info">
              <span class="schedule-course-name">
                {{ cls.name }}
              </span>
              <span> {{ cls.timeStart }} - {{ cls.timeEnd }} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

type Course = {
  color: string;
  title: string;
  name: string;
  timeStart: string;
  timeEnd: string;
};

type Time = {
  hours: number;
  minutes: number;
};

const minHour = 8;
const totalMinutes = 600;
const totalPixels = 610;
export default defineComponent({
  props: {
    classesSchedule: {
      type: Object as PropType<{ [key: string]: Array<Course> }>,
      required: true,
    },
  },
  computed: {
    days(): string[] {
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    },
    hoursRange(): string[] {
      return ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];
    },
  },
  methods: {
    parseTimeString(time: string): Time {
      const parts = time.match(/(\d+):(\d+)(AM|PM)/i);
      if (!parts) {
        throw new Error('Invalid time format');
      }
      let hours = parseInt(parts[1], 10);
      const minutes = parseInt(parts[2]);

      const ampm = parts[3];
      if (ampm.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
      } else if (ampm.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }
      return { hours, minutes };
    },

    getTotalMinutes(classes: Course[]): number {
      // Initial min and max values set to the opposite extremes
      let minHour = 23;
      let maxHour = 0;

      classes.forEach(cls => {
        // Extract hours from timeStart and timeEnd and convert them to numbers
        const startHour = this.parseTimeString(cls.timeStart).hours;
        const endHour = this.parseTimeString(cls.timeEnd).minutes;

        // Update min and max hours
        minHour = Math.min(minHour, startHour);
        maxHour = Math.max(maxHour, endHour);
      });

      return (maxHour - minHour) * 60;
    },
    getStyle(color: string, timeStart: string, timeEnd: string): Record<string, string> {
      return {
        borderColor: color,
        top: this.getPixels(timeStart).toString() + 'px',
        height: (this.getPixels(timeEnd) - this.getPixels(timeStart)).toString() + 'px',
      };
    },
    getPixels(time: string): number {
      const t = this.parseTimeString(time);
      const hours = t.hours;
      const minutes = t.minutes;
      return Math.round((((hours - minHour) * 60 + minutes) / totalMinutes) * totalPixels) + 50;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.schedule {
  &-main {
    border-color: $inactiveGray;
    border: 1px solid $inactiveGray;
    box-sizing: border-box;
    border-radius: 4px;
    height: 780px;

    padding: 2rem 0.5rem 1rem 1.5rem;
  }
  &-week {
    display: flex;
    flex-direction: row;
    color: $secondaryGray;
  }
  &-day {
    width: 6rem;
    position: relative;
    display: grid;
    &-label {
      margin-bottom: 1.8rem;
      justify-self: center;
    }
    border-left: 1px solid $inactiveGray;
  }
  &-hours {
    display: flex;
    flex-direction: column;
    color: $secondaryGray;
    justify-content: space-between;
    margin-right: 2rem;
    margin-top: 3rem;
  }
  &-hour {
    margin-bottom: 40px;
  }
  &-body {
    display: flex;
    flex-direction: row;
  }
  &-course {
    font-size: 12px;
    border-left-width: 4px;
    border-left-style: solid;
    padding-left: 8px;
    height: 70px;
    width: 85px;
    position: absolute;
    &-info {
      display: flex;
      flex-direction: column;
      color: black;
    }
    &-name {
      font-weight: 900;
    }
  }
}
</style>

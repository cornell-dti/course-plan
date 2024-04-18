<template>
  <div class="schedule-main">
    <div class="schedule-body" :style="getTotalHeight()">
      <div class="schedule-hours" :style="getTotalHeight()">
        <div class="schedule-hour" :key="hour" v-for="hour in hoursRange">{{ hour }}</div>
      </div>
      <div class="schedule-week">
        <div class="schedule-day" :key="day" v-for="day in days">
          <span class="schedule-day-label">
            {{ day }}
          </span>
          <div
            class="schedule-course"
            :key="cls.name"
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
import html2canvas from 'html2canvas';

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

type MinMaxHour = {
  minHour: number;
  maxHour: number;
};

export default defineComponent({
  props: {
    classesSchedule: {
      type: Object as PropType<{ [key: string]: Array<Course> }>,
      required: true,
    },
  },
  data() {
    return {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    };
  },
  computed: {
    hoursRange(): string[] {
      const { minHour, maxHour } = this.getMinMaxHours();
      const hoursArray: string[] = [];
      for (let hour = minHour; hour <= maxHour; hour += 1) {
        // Determine AM or PM
        const suffix = hour < 12 ? 'am' : 'pm';
        // Convert hour to 12-hour format and create the string
        const formattedHour = `${hour <= 12 ? hour : hour - 12}${suffix}`;
        hoursArray.push(formattedHour);
      }
      return hoursArray;
    },
    totalMinutes(): number {
      const total = this.getTotalMinutes();
      return total;
    },
    availablePixels(): number {
      return this.hoursRange.length * 61 - 50;
    },
  },
  methods: {
    parseTimeString(time: string): Time {
      const parts = time.match(/(\d+):(\d+)(AM|PM)/i);
      if (!parts) {
        throw new Error('Invalid time format');
      }
      let hours = parseInt(parts[1], 10);
      const minutes = parseInt(parts[2], 10);

      const ampm = parts[3];
      if (ampm.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
      } else if (ampm.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }
      return { hours, minutes };
    },

    async generatePdfData(): Promise<string> {
      // Get the HTML of the Vue component
      const element = this.$el;
      // Use html2canvas to convert the HTML to a canvas
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      return imgData;
    },

    getMinMaxHours(): MinMaxHour {
      let minHour = 23;
      let maxHour = 0;

      this.days.forEach(day => {
        const classes = this.classesSchedule[day];
        classes.forEach(cls => {
          // Extract hours from timeStart and timeEnd and convert them to numbers
          const startHour = this.parseTimeString(cls.timeStart).hours;
          const { hours: endHour, minutes: endMinutes } = this.parseTimeString(cls.timeEnd);

          // Update min and max hours
          minHour = Math.min(minHour, startHour);
          if (maxHour < endHour) {
            maxHour = endHour + (endMinutes > 0 ? 1 : 0);
          }
        });
      });
      return { minHour, maxHour };
    },

    getTotalMinutes(): number {
      // Initial min and max values set to the opposite extremes
      const { maxHour, minHour } = this.getMinMaxHours();
      return (maxHour - minHour) * 60;
    },
    getPixels(time: string): number {
      const { hours, minutes } = this.parseTimeString(time);
      const { minHour } = this.getMinMaxHours();
      return (
        Math.round(
          (((hours - minHour) * 60 + minutes) / this.totalMinutes) * this.availablePixels
        ) + 50
      );
    },
    getStyle(color: string, timeStart: string, timeEnd: string): Record<string, string> {
      return {
        borderColor: color,
        top: `${this.getPixels(timeStart).toString()}px`,
        height: `${(this.getPixels(timeEnd) - this.getPixels(timeStart)).toString()}px`,
      };
    },
    getTotalHeight(): Record<string, string> {
      return {
        height: `${this.hoursRange.length * 61}px`,
      };
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
    border-left: 1px solid $veryLightGray;
  }
  &-hours {
    display: flex;
    flex-direction: column;
    color: $secondaryGray;
    margin-right: 2rem;
  }
  &-hour {
    padding-top: 40px;
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

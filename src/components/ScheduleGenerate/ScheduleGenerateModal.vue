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
            <schedule-courses :num-credits="12" :classes="classes" />
          </div>
          <div class="schedule-generate-section-schedule">
            <div class="schedule-generate-subHeader schedule-generate-subHeader--indent">
              {{ selectedSemester }}
            </div>
            <schedule ref="calendar" :classesSchedule="classesSchedule" />
          </div>
        </div>
      </div>
      <div class="schedule-generate-bottom">
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Schedule from '@/components/ScheduleGenerate/Schedule.vue';
import ScheduleCourses from '@/components/ScheduleGenerate/ScheduleCourses.vue';
import { generateSchedulePDF } from '@/tools/export-plan';

export default defineComponent({
  props: {
    // current semester being generated for
    selectedSemester: { type: String, required: true },
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
    downloadSchedule() {
      generateSchedulePDF();
    },
  },
  computed: {
    classes() {
      return [
        {
          title: 'Introductory Programming',
          name: 'CS 1110',
          color: '#FF3B30', // eventually want to use coursescolorset
          // and match with the right component of this modal
          timeStart: '8:00am',
          timeEnd: '8:50am',
        },
        {
          title: 'Information Science Major Concentration Group A',
          name: 'INFO 2450',
          color: '#34C759',
          timeStart: '8:40am',
          timeEnd: '9:55am',
        },
        {
          title: 'Information Science Major Core Courses',
          name: 'INFO 1260',
          color: '#32A0F2',
          timeStart: '10:10am',
          timeEnd: '11:00am',
        },
        {
          title: 'Information Science Major Electives',
          name: 'INFO 2300',
          color: '#AF52DE',
          timeStart: '12:20pm',
          timeEnd: '1:10pm',
        },
        {
          title: 'College Requirements Human Diversity (D)',
          name: 'DSOC 1101',
          color: '#FF9500',
          timeStart: '2:30pm',
          timeEnd: '3:20pm',
        },
        {
          title: 'No Requirement',
          name: 'ART 2301',
          color: '#B155E0',
          timeStart: '11:00pm',
          timeEnd: '11:50pm',
        },
        // question: what if # of courses overflows the box? not in designs iirc
      ];
    },
    classesSchedule() {
      return {
        Monday: [
          {
            title: 'Introductory Programming',
            name: 'CS 1110',
            color: '#FF3B30',
            timeStart: '8:00am',
            timeEnd: '8:50am',
          },
          {
            title: 'Information Science Major Core Courses',
            name: 'INFO 1260',
            color: '#32A0F2',
            timeStart: '10:10am',
            timeEnd: '11:00am',
          },
          {
            title: 'Information Science Major Electives',
            name: 'INFO 2300',
            color: '#AF52DE',
            timeStart: '11:15am',
            timeEnd: '12:05pm',
          },
        ],
        Tuesday: [
          {
            title: 'Information Science Major Concentration Group A',
            name: 'INFO 2450',
            color: '#34C759',
            timeStart: '8:40am',
            timeEnd: '9:55am',
          },
          {
            title: 'College Requirements Human Diversity (D)',
            name: 'DSOC 1101',
            color: '#FF9500',
            timeStart: '2:30pm',
            timeEnd: '3:20pm',
          },
        ],
        Wednesday: [
          {
            title: 'Introductory Programming',
            name: 'CS 1110',
            color: '#FF3B30',
            timeStart: '8:00am',
            timeEnd: '8:50am',
          },
          {
            title: 'Information Science Major Core Courses',
            name: 'INFO 1260',
            color: '#32A0F2',
            timeStart: '10:10am',
            timeEnd: '11:00am',
          },
          {
            title: 'Information Science Major Electives',
            name: 'INFO 2300',
            color: '#AF52DE',
            timeStart: '11:15am',
            timeEnd: '12:05pm',
          },
        ],
        Thursday: [
          {
            title: 'Information Science Major Concentration Group A',
            name: 'INFO 2450',
            color: '#34C759',
            timeStart: '8:40am',
            timeEnd: '9:55am',
          },
          {
            title: 'College Requirements Human Diversity (D)',
            name: 'DSOC 1101',
            color: '#FF9500',
            timeStart: '2:30pm',
            timeEnd: '3:20pm',
          },
        ],
        Friday: [
          {
            title: 'Introductory Programming',
            name: 'CS 1110',
            color: '#FF3B30',
            timeStart: '12:20pm',
            timeEnd: '1:10pm',
          },
        ],
        Saturday: [],
        Sunday: [],
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
      padding-left: 1.25rem;
      font-size: 18px;
    }
    &--indent {
      padding-left: 2rem;
      font-size: 18px;
    }
  }

  &-bottom {
    display: flex;
    justify-content: flex-end;
    padding: 0rem 2rem 1rem 2rem;
  }
}

.download-button {
  display: flex;
  width: 246px;
  height: 35px;
  padding: 0px 66.603px 0px 62px;
  align-items: center;
  flex-shrink: 0;
  border-radius: 3px;
  background: var(--Button-Color---Sang, #4d7d92);
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
</style>

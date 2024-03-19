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
          <div class="schedule-generate-section-courses">
            <div class="schedule-generate-subHeader schedule-generate-subHeader--smallerIndent">
              <span class="schedule-generate-subHeader--font">Your Courses</span>
            </div>
            <div class="schedule-generate-inputs">
              <div class="schedule-generate-inputWrapper">
                <schedule-courses :num-credits="12" :classes="classes" />
              </div>
            </div>
          </div>
          <div class="schedule-generate-section-schedule">
            <div class="schedule-generate-subHeader schedule-generate-subHeader--indent">
              <span class="schedule-generate-subHeader--font">Fall 2024</span>
            </div>
            <div class="schedule-generate-inputs">
              <div class="schedule-generate-inputWrapper">
                <schedule :classesSchedule="classesSchedule" />
              </div>
            </div>
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

export default defineComponent({
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
          timeStart: '5:10pm',
          timeEnd: '6:00pm',
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
            timeStart: '12:20pm',
            timeEnd: '1:10pm',
          },
          {
            title: 'No Requirement',
            name: 'ART 2301',
            color: '#B155E0',
            timeStart: '5:10pm',
            timeEnd: '6:00pm',
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
            timeStart: '12:20pm',
            timeEnd: '1:10pm',
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
  }

  &-section {
    margin-bottom: 1rem;
    &-courses {
      width: 250px;
      margin-right: 2rem;
    }
    &-schedule {
      flex: 1;
    }
  }

  &-subHeader {
    font-weight: bold;
    font-size: 16px;
    line-height: 22px;
    position: relative;
    top: 23px;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    /* identical to box height */
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: space-between;
    color: $darkGray2;
    margin-bottom: 0.75rem;

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
}
</style>

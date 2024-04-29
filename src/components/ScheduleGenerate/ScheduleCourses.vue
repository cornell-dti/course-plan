<template>
  <div class="courses-main">
    <div class="parent-info-div">
      <h3 class="info-subheader">
        <span class="info-subheader-heavy">{{ generatedScheduleOutput?.totalCredits ?? 0 }}</span
        >&nbsp;Credits
      </h3>
      <h3 class="info-subheader">
        <span class="info-subheader-heavy">{{
          new Set(generatedScheduleOutput?.schedule.keys()).size ?? 0
        }}</span
        >&nbsp;{{
          (new Set(generatedScheduleOutput?.schedule.keys()).size ?? 0) === 1 ? 'Course' : 'Courses'
        }}
      </h3>
    </div>
    <div class="requirement-between-justifier">
      <div v-for="cls of classes" :key="cls.name">
        <h4 class="requirement-title-text">{{ cls.title }}</h4>
        <div class="class-circle" :style="'border-color: ' + cls.color">
          <span class="class-text">{{ cls.code }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { Course } from '@/requirements/types';
import { Timeslot } from '@/schedule-generator/course-unit';
import Requirement from '@/schedule-generator/requirement';

export default defineComponent({
  props: {
    generatedScheduleOutput: {
      type: Object as PropType<{
        semester: string;
        schedule: Map<Course, Timeslot[]>;
        fulfilledRequirements: Map<string, Requirement[]>;
        totalCredits: number;
      } | null>,
      required: true,
    },
    classes: {
      type: Array as PropType<{ name: string; title: string; code: string; color: string }[]>,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.courses {
  &-main {
    border-color: $inactiveGray;
    border: 1px solid $inactiveGray;
    box-sizing: border-box;
    border-radius: 4px;

    padding: 2rem calc(28px + 10px) 2rem;
  }
}

.parent-info-div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 10px;
}

.info-subheader {
  font-size: 16px;
  color: $black;
  font-style: normal;
  line-height: normal;
}

.info-subheader-heavy {
  font-weight: 600;
}

.requirement-title-text {
  color: $lightPlaceholderGray;
  font-size: 14px;
  font-weight: 400;
}

.requirement-between-justifier > div:not(:first-child) {
  padding-top: 21px;
  border-top: 1px solid rgba(196, 196, 196, 0.4);
}

.requirement-between-justifier > div:not(:last-child) {
  margin-bottom: 21px;
}

.class {
  &-circle {
    border-radius: 6px;
    border: 1px solid;
    height: 33px;
    display: flex;
    align-items: center;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  }

  &-text {
    color: $primaryGray;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-left: 8px;
    margin-right: 15px;
  }
}
</style>

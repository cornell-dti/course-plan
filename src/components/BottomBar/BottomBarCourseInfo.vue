<template>
  <div class="info">
    <div class="info-section-wrapper">
      <div>
        <div class="section">
          <h1 class="info-head">Credits</h1>
          <p class="info-fact">{{ courseObj.credits }}</p>
        </div>
        <div class="section">
          <h1 class="info-head">Offered</h1>
          <p class="info-fact">{{ courseSemesters }}</p>
        </div>
      </div>
      <div>
        <div class="section">
          <h1 class="info-head">Instructors</h1>
          <p class="info-fact">{{ courseInstructors }}</p>
        </div>
        <div class="section">
          <h1 class="info-head">Enrollment Information</h1>
          <p class="info-fact">{{ courseEnrollment }}</p>
        </div>
      </div>
      <div>
        <div class="section">
          <h1 class="info-head">Distribution Category</h1>
          <p
            class="info-fact"
            v-for="distributionCategory in courseDistributions"
            :key="distributionCategory"
          >
            {{ distributionCategory }}
          </p>
        </div>
        <div class="section">
          <h1 class="info-head">{{ courseObj.currRoster }} Lecture Information</h1>
          <p class="info-fact" v-for="latestLecInfo in courseLectureTimes" :key="latestLecInfo">
            {{ latestLecInfo }}
          </p>
        </div>
      </div>
    </div>
    <div class="info-link">
      <a
        :href="rosterLink"
        class="info-link-blue"
        target="_blank"
        @click="clickViewCourseInformationOnRoster()"
      >
        <span class="info-link-blue-text">View Course Information on Roster</span>
        <span class="info-link-blue-img">
          <img src="@/assets/images/link-blue.svg" alt="link arrow" />
        </span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { GTagEvent } from '@/gtag';

const joinOrNAString = (arr: readonly string[]): string =>
  arr.length !== 0 && arr[0] !== '' ? arr.join(', ') : 'N/A';

const naIfEmptyStringArray = (arr: readonly string[]): readonly string[] =>
  arr && arr.length !== 0 && arr[0] !== '' ? arr : ['N/A'];

const cleanCourseDistributionsArray = (distributions: readonly string[]): readonly string[] => {
  // Iterates over distributions array and cleans every entry
  // Removes stray parentheses, spaces, and commas
  let matches: string[] = [];
  if (distributions[0] === '') {
    matches = ['N/A'];
  } else {
    for (let i = 0; i < distributions.length; i += 1) {
      distributions[i].replace(/[A-Za-z0-9-]+/g, d => {
        matches.push(d);
        return d;
      });
    }
  }

  return matches;
};

export default defineComponent({
  props: {
    courseObj: { type: Object as PropType<AppBottomBarCourse>, required: true },
  },

  computed: {
    courseSemesters(): string {
      return joinOrNAString(this.courseObj.semesters);
    },
    courseInstructors(): string {
      return joinOrNAString(this.courseObj.instructors);
    },
    courseEnrollment(): string {
      return joinOrNAString(this.courseObj.enrollment);
    },
    courseLectureTimes(): readonly string[] {
      return naIfEmptyStringArray(this.courseObj.lectureTimes);
    },
    courseDistributions(): readonly string[] {
      return cleanCourseDistributionsArray(this.courseObj.distributions);
    },
    rosterLink(): string {
      const [subject, number] = this.courseObj.code.split(' ');
      return `https://classes.cornell.edu/browse/roster/${this.courseObj.currRoster}/class/${subject}/${number}`;
    },
  },

  methods: {
    clickViewCourseInformationOnRoster(): void {
      GTagEvent(this.$gtag, 'bottom-bar-view-course-information-on-roster');
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.info {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 0rem;

  &-head {
    margin-top: 5px;
    font-weight: 500;
    font-size: 12px;
    color: $darkGray2;
    margin-bottom: 0rem;
  }

  &-fact {
    padding-right: 10px;
    font-size: 16px;
    color: $primaryGray;
    margin-bottom: 0rem;
  }

  &-link {
    font-size: 16px;
    line-height: 16px;

    margin-top: inherit;

    &-blue {
      // display: flex;
      align-items: center;

      &-text {
        color: $yuxuanBlue;
        font-weight: 500;
        text-decoration-line: underline;
      }

      &-img {
        margin-left: 0.2rem;

        img {
          transform: scale(0.9);
        }
      }
    }
  }
}

.section {
  margin-bottom: 8px;
  float: left;
  width: 50%;
  height: inherit;
}
</style>

<template>
  <main
    class="semesterView"
    data-cyId="semesterView"
    :class="{
      bottomBar: isBottomBar && isBottomBarExpanded,
      expandedBottomBarSemesterView: isBottomBarExpanded,
      collapsedBottomBarSemesterView: isBottomBar && !isBottomBarExpanded,
    }"
    @click="closeBar"
    :key="key"
  >
    <div class="semesterView-top">
      <new-semester-modal
        @add-semester="addSemester"
        @close-sem-modal="closeSemesterModal"
        v-if="isSemesterModalOpen"
      />
      <div
        class="semesterView-settings"
        :class="{ 'semesterView-settings--two': noSemesters }"
        style="position: relative"
      >
        <button
          v-if="noSemesters"
          class="semesterView-addSemesterButton"
          @click="openSemesterModal"
          data-cyId="semesterView-addSemesterButton"
        >
          + New Semester
        </button>
        <div class="view-toggle-wrapper">
          <FallGiveawayProgress
            :progress="giveawayProgress"
            :shouldGlow="shouldGlowForGiveaway"
            @openFall2025Giveaway="$emit('openFall2025Giveaway')"
            class="fall-giveaway-progress"
            v-if="isBeforeFall2025GiveawayCutoff"
          />
          <label
            class="semesterView-importButton"
            :class="{ 'semesterView-importButton--busy': isImportingTranscript }"
            data-cyId="semesterView-importTranscriptButton"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M8 10.5V2.5M4.5 6L8 2.5L11.5 6M2.5 10.5v2a1 1 0 001 1h9a1 1 0 001-1v-2" />
            </svg>
            {{ isImportingTranscript ? 'Importing…' : 'Import Transcript' }}
            <input
              type="file"
              accept=".pdf,application/pdf"
              :disabled="isImportingTranscript"
              @change="onTranscriptFileSelected"
              hidden
            />
          </label>
          <view-dropdown
            data-intro-group="req-tooltip"
            :data-intro="getToggleTooltipText()"
            data-disable-interaction="1"
            data-step="4"
            data-tooltipClass="tooltipCenter tourStep4"
            :compact="compact"
            @click-compact="toggleCompact"
          />
        </div>
      </div>
      <confirmation :text="confirmationText" v-if="isSemesterConfirmationOpen" />
      <div class="semesterView-content" :class="{ 'semesterView-content--compact': compact }">
        <div
          v-for="(sem, semesterIndex) in semesters"
          :key="`${sem.year}-${sem.season}`"
          class="semesterView-wrapper"
        >
          <semester
            ref="semester"
            :season="sem.season"
            :year="sem.year"
            :courses="sem.courses"
            :semesterIndex="semesterIndex"
            :compact="compact"
            :activatedCourse="activatedCourse"
            :isFirstSem="checkIfFirstSem(sem)"
            @course-onclick="courseOnClick"
            @new-semester="openSemesterModal"
            @delete-semester="deleteSemester"
          />
        </div>
      </div>
    </div>
    <div class="semesterView-bot">
      <div class="semesterView-builtBy">
        Built with
        <img class="semesterView-heart" src="@/assets/images/redHeart.svg" alt="heart" />
        by
        <a target="_blank" href="https://www.cornelldti.org/projects/courseplan/">
          Cornell Digital Tech &amp; Innovation
        </a>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Semester from '@/components/Semester/Semester.vue';
import Confirmation from '@/components/Modals/Confirmation.vue';
import NewSemesterModal from '@/components/Modals/NewSemesterModal.vue';

import store from '@/store';
import { GTagEvent } from '@/gtag';
import {
  addSemester,
  deleteSemester,
  addCoursesToSemesters,
  addTransferExams,
  cornellCourseRosterCoursesToFirebaseSemesterCoursesWithGlobalData,
  getDefaultRequirementChoices,
  updateRequirementChoices,
} from '@/global-firestore-data';
import { importTranscriptForPlan, importTranscriptSummaryMessage } from '@/tools/import-transcript';
import type { ImportTranscriptResult } from '@/tools/import-transcript';
import { closeBottomBar } from '@/components/BottomBar/BottomBarState';
import ViewDropdown from './ViewDropdown.vue';
import FallGiveawayProgress from './FallGiveawayProgress.vue';

export default defineComponent({
  components: { Confirmation, NewSemesterModal, Semester, ViewDropdown, FallGiveawayProgress },
  props: {
    compact: { type: Boolean, required: true },
    isBottomBar: { type: Boolean, required: true },
    isBottomBarExpanded: { type: Boolean, required: true },
    isMobile: { type: Boolean, required: true },
    startTour: { type: Boolean, required: true },
  },
  emits: {
    'compact-updated': (compact: boolean) => typeof compact === 'boolean',
    openFall2025Giveaway: () => true,
  },
  data() {
    return {
      confirmationText: '',
      key: 0,
      activatedCourse: {} as FirestoreSemesterCourse,
      isCourseClicked: false,
      isSemesterConfirmationOpen: false,
      isSemesterModalOpen: false,
      isImportingTranscript: false,
      showFall2025GiveawayModal: false,
    };
  },
  watch: {
    giveawayProgress(newVal) {
      const hasEntered = store.state.onboardingData.fa25giveaway.entered;
      if (newVal === 3 && !hasEntered && this.isBeforeFall2025GiveawayCutoff) {
        this.showFall2025GiveawayModal = true;
      }
    },
  },

  computed: {
    semesters(): readonly FirestoreSemester[] {
      if (store.state.plans.length === 0) {
        return [];
      }
      return store.getters.getCurrentPlanSemesters;
    },
    noSemesters(): boolean {
      return this.semesters.length === 0;
    },
    giveawayProgress(): number {
      const { step1 } = store.state.onboardingData.fa25giveaway;
      const { step2 } = store.state.onboardingData.fa25giveaway;
      const { step3 } = store.state.onboardingData.fa25giveaway;
      if (step1 && step2 && step3) {
        return 3;
      }
      if ((step1 && step2) || (step1 && step3) || (step2 && step3)) {
        return 2;
      }
      if (step1 || step2 || step3) {
        return 1;
      }
      return 0;
    },
    isBeforeFall2025GiveawayCutoff(): boolean {
      const currentDate = new Date();
      const cutoffDate = new Date('2025-04-20T23:59:00');
      console.log('Current date is before cutoff date', currentDate < cutoffDate);
      return currentDate < cutoffDate;
    },
    shouldGlowForGiveaway(): boolean {
      const { step1, step2, step3, entered } = store.state.onboardingData.fa25giveaway;
      return step1 && step2 && step3 && !entered;
    },
  },

  methods: {
    checkIfFirstSem(semester: FirestoreSemester) {
      return (
        this.semesters[0].year === semester.year && this.semesters[0].season === semester.season
      );
    },
    toggleCompact(toggled: boolean) {
      if (toggled !== this.compact) {
        this.$emit('compact-updated', toggled);
        GTagEvent(this.$gtag, toggled ? 'to-compact' : 'to-not-compact');
      }
    },
    openSemesterConfirmationModal(season: FirestoreSemesterSeason, year: number, isAdd: boolean) {
      this.openConfirmation(
        isAdd ? `Added ${season} ${year} to plan` : `Deleted ${season} ${year} from plan`
      );
    },
    openConfirmation(text: string, duration = 2000) {
      this.confirmationText = text;
      this.isSemesterConfirmationOpen = true;

      setTimeout(() => {
        this.isSemesterConfirmationOpen = false;
      }, duration);
    },
    async onTranscriptFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files != null && input.files.length > 0 ? input.files[0] : null;
      input.value = '';
      if (file == null) return;
      this.isImportingTranscript = true;
      const result = await file
        .arrayBuffer()
        .then(pdf =>
          importTranscriptForPlan(pdf, this.semesters, store.state.onboardingData.college)
        )
        .catch(() => null);
      this.isImportingTranscript = false;
      if (result == null) this.openConfirmation('Could not read that file');
      else this.applyTranscriptImport(result);
    },
    applyTranscriptImport(result: ImportTranscriptResult) {
      if (result.status === 'invalid-file') {
        this.openConfirmation("That doesn't look like a Cornell transcript");
        return;
      }
      const entries = result.semesters.map(({ season, year, courses }) => ({
        season,
        year,
        data: courses.map(({ course }) => course),
        courses: cornellCourseRosterCoursesToFirebaseSemesterCoursesWithGlobalData(courses).map(
          (course, i) => {
            const { credits } = courses[i];
            const [min, max] = course.creditRange;
            return credits != null && credits >= min && credits <= max
              ? { ...course, credits }
              : course;
          }
        ),
      }));
      const choices = getDefaultRequirementChoices(
        entries.flatMap(({ season, year, courses, data }) =>
          courses.map((course, i) => ({ season, year, course, data: data[i] }))
        )
      );
      addCoursesToSemesters(store.state.currentPlan, entries, this.$gtag);
      if (Object.keys(choices).length > 0) {
        updateRequirementChoices(old => ({ ...old, ...choices }));
      }
      if (result.exams.length > 0 || result.tookSwim) {
        addTransferExams(result.exams, result.tookSwim);
      }
      this.openConfirmation(importTranscriptSummaryMessage(result), 3500);
    },
    openSemesterModal() {
      this.isSemesterModalOpen = true;
    },
    closeSemesterModal() {
      this.isSemesterModalOpen = false;
    },
    addSemester(season: string, year: number) {
      addSemester(store.state.currentPlan, year, season as FirestoreSemesterSeason, this.$gtag);
      this.openSemesterConfirmationModal(season as FirestoreSemesterSeason, year, true);
    },
    deleteSemester(season: string, year: number) {
      deleteSemester(store.state.currentPlan, year, season as FirestoreSemesterSeason, this.$gtag);
      this.openSemesterConfirmationModal(season as FirestoreSemesterSeason, year, false);
    },
    courseOnClick(course: FirestoreSemesterCourse) {
      this.activatedCourse = course;
      this.key += 1;
      this.isCourseClicked = true;
    },
    closeBar() {
      if (!this.isCourseClicked) {
        closeBottomBar(this.$gtag);
      }
      this.isCourseClicked = false;
    },
    getToggleTooltipText() {
      return `<div class="introjs-tooltipTop"><div class="introjs-customTitle">Toggle between Views</div><div class="introjs-customProgress">4/4</div>
      </div><div class = "introjs-bodytext">View semesters and courses in full or compact mode.</div>`;
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.semesterView {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 3rem 0;
  position: relative;
  overflow-y: auto;

  &-content {
    display: grid;
    justify-items: center;
    grid-template-columns: repeat(auto-fill, minmax(min($regular-semester-width, 100%), 1fr));
    column-gap: 0.5rem;
    margin: 0 -0.75rem;

    &--compact {
      grid-template-columns: repeat(auto-fill, minmax(min($compact-semester-width, 100%), 1fr));
    }
  }

  &-addSemesterButton {
    background: $sangBlue;
    border-radius: 3px;
    min-height: 2.5rem;
    min-width: 9rem;
    color: $white;
    border: none;
    font-size: 16px;
  }

  &-importButton {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    height: 2.25rem;
    margin: 0 1.5rem 0.5rem 0;
    padding: 0 0.875rem;
    border: 1px solid $sangBlue;
    border-radius: 4px;
    background: $white;
    color: $sangBlue;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;

    &:hover {
      background: $sangBlue;
      color: $white;
    }

    &--busy {
      opacity: 0.6;
      pointer-events: none;
    }

    svg {
      width: 1rem;
      stroke-linecap: round;
    }
  }

  &-settings {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    min-height: 2.25rem;
    align-items: center;

    &--two {
      justify-content: space-between;
    }
  }

  &-switch {
    display: flex;
    color: $medGray;
    align-items: center;
  }

  &-switchText {
    margin-right: 0.5rem;
    font-size: 16px;
    line-height: 19px;
  }

  &-switchImage {
    width: 2.25rem;
    height: 2.25rem;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center;

    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }

  &-twoColumn {
    background-image: url('@/assets/images/views/twoColumn.svg');

    &:hover,
    &:focus,
    &:active,
    &--active {
      cursor: pointer;
      background-image: url('@/assets/images/views/twoColumnSelected.svg');
    }
  }

  &-fourColumn {
    background-image: url('@/assets/images/views/fourColumn.svg');

    &:hover,
    &:focus,
    &:active,
    &--active {
      cursor: pointer;
      background-image: url('@/assets/images/views/fourColumnSelected.svg');
    }
  }

  &-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
    padding: 0 0.25rem;
  }

  &-builtBy {
    color: $medGray;
    text-align: right;
    font-size: 15px;
    padding: 8px 10px;

    a {
      color: $medGray;

      &:hover {
        text-decoration: underline $medGray;
      }
    }
  }

  &-emoji-text {
    height: 14px;
  }

  &-heart {
    height: 18px;
  }
}

.view-toggle-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.fall-giveaway-progress {
  position: absolute;
  left: -110px;
  top: -35px;
  transform: scale(0.5);
}

.collapsedBottomBarSemesterView {
  padding-bottom: 70px;
}

.bottomBar {
  padding-bottom: 350px;
}

@media only screen and (max-width: $medium-breakpoint) {
  .semesterView {
    margin-top: 5.5rem;
    margin-left: 2.5rem;
    margin-right: 1rem;

    &-switch {
      padding-right: 0.75rem;
    }

    &-content {
      width: 100%;
      justify-content: center;
      grid-template-columns: repeat(auto-fill, minmax(min($compact-semester-width, 100%), 1fr));
    }
  }
}

@media only screen and (max-width: $small-breakpoint) {
  .semesterView {
    margin-top: 5.5rem;
    margin-left: 0;
    margin-right: 0;

    &-content {
      margin: 0;
    }

    &-wrapper {
      flex: 1 1 auto;
      padding: 0 2rem;
    }
  }
}
</style>

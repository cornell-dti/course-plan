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
import { addSemester, deleteSemester } from '@/global-firestore-data';
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
      if (isAdd) {
        this.confirmationText = `Added ${season} ${year} to plan`;
      } else {
        this.confirmationText = `Deleted ${season} ${year} from plan`;
      }

      this.isSemesterConfirmationOpen = true;

      setTimeout(() => {
        this.isSemesterConfirmationOpen = false;
      }, 2000);
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
@import '@/assets/scss/_tokens.scss';

.semesterView {
  @include cp-font;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 24px 0;
  position: relative;
  overflow-y: auto;
  background: $cp-canvas;
  color: $cp-ink;

  &-content {
    display: grid;
    justify-items: start;
    align-items: start;
    grid-template-columns: repeat(auto-fill, $cp-column-width);
    gap: 32px;

    &--compact {
      grid-template-columns: repeat(auto-fill, $cp-column-width-compact);
      gap: 24px;
    }
  }

  &-addSemesterButton {
    @include cp-button-secondary;
    gap: 8px;
    padding-left: 12px;

    &::first-letter {
      color: $cp-muted;
    }
  }

  &-settings {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    min-height: 38px;
    margin-bottom: 16px;

    &--two {
      justify-content: space-between;
    }
  }

  &-wrapper {
    display: flex;
    align-items: flex-start;
  }

  &-builtBy {
    @include cp-text(12px, 16px);
    color: $cp-muted;
    text-align: right;
    padding: 24px 0 16px;

    a {
      color: $cp-muted;

      &:hover {
        color: $cp-ink;
        text-decoration: underline;
      }
    }
  }

  &-heart {
    height: 14px;
    vertical-align: -2px;
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
    padding: 16px;

    &-content {
      justify-content: center;
      grid-template-columns: repeat(auto-fill, $cp-column-width-compact);
    }
  }
}

@media only screen and (max-width: $small-breakpoint) {
  .semesterView {
    &-content {
      grid-template-columns: 1fr;
    }

    &-wrapper {
      display: block;
    }
  }
}
</style>

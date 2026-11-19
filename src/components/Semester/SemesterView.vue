<template>
  <main
    class="semesterView"
    data-cyId="semesterView"
    :class="{
      'semesterView--canvas': isCanvas,
      bottomBar: isBottomBar && isBottomBarExpanded,
      expandedBottomBarSemesterView: isBottomBarExpanded,
      collapsedBottomBarSemesterView: isBottomBar && !isBottomBarExpanded,
    }"
    @click="closeBar"
    :key="key"
  >
    <new-semester-modal
      @add-semester="addSemester"
      @close-sem-modal="closeSemesterModal"
      v-if="isSemesterModalOpen"
    />
    <confirmation :text="confirmationText" v-if="isSemesterConfirmationOpen" />

    <div class="semesterView-settings">
      <button
        v-if="isCanvas || noSemesters"
        class="semesterView-addSemesterButton"
        @click="openSemesterModal"
        data-cyId="semesterView-addSemesterButton"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M8 3v10M3 8h10" />
        </svg>
        Add semester
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
          :showOrder="!isCanvas"
          @click-compact="toggleCompact"
        />
      </div>
    </div>

    <div
      class="semesterView-canvas"
      :class="{ 'semesterView-canvas--panning': panning }"
      ref="canvas"
      @wheel="onWheel"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div class="semesterView-stage" :style="stageStyle">
        <div
          ref="content"
          class="semesterView-content"
          :class="{ 'semesterView-content--compact': compact }"
        >
          <div
            v-for="sem in displayedSemesters"
            :key="`${sem.year}-${sem.season}`"
            class="semesterView-wrapper"
          >
            <semester
              ref="semester"
              :season="sem.season"
              :year="sem.year"
              :courses="sem.courses"
              :semesterIndex="semesters.indexOf(sem)"
              :compact="compact"
              :activatedCourse="activatedCourse"
              :isFirstSem="!isCanvas && checkIfFirstSem(sem)"
              @course-onclick="courseOnClick"
              @new-semester="openSemesterModal"
              @delete-semester="deleteSemester"
            />
          </div>
        </div>
      </div>
      <p v-if="isCanvas && noSemesters" class="semesterView-empty">
        Add your first semester to start planning.
      </p>
    </div>

    <div v-if="isCanvas" class="semesterView-zoom" role="toolbar" aria-label="Zoom">
      <button
        type="button"
        class="semesterView-zoomButton"
        aria-label="Fit all semesters"
        title="Fit all semesters"
        @click="fitToScreen"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" />
        </svg>
      </button>
      <span class="semesterView-zoomDivider" />
      <button
        type="button"
        class="semesterView-zoomButton"
        aria-label="Zoom out"
        :disabled="zoom <= minZoom"
        @click="stepZoom(-1)"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M3 8h10" />
        </svg>
      </button>
      <button
        type="button"
        class="semesterView-zoomLevel"
        title="Reset to 100%"
        :aria-label="`Zoom ${zoomPercent}%. Reset to 100%`"
        @click="resetZoom"
      >
        {{ zoomPercent }}%
      </button>
      <button
        type="button"
        class="semesterView-zoomButton"
        aria-label="Zoom in"
        :disabled="zoom >= maxZoom"
        @click="stepZoom(1)"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M8 3v10M3 8h10" />
        </svg>
      </button>
    </div>

    <div class="semesterView-builtBy">
      Built with
      <img class="semesterView-heart" src="@/assets/images/redHeart.svg" alt="heart" />
      by
      <a target="_blank" href="https://www.cornelldti.org/projects/courseplan/">
        Cornell Digital Tech &amp; Innovation
      </a>
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
import { sortedSemesters } from '@/utilities';
import ViewDropdown from './ViewDropdown.vue';
import FallGiveawayProgress from './FallGiveawayProgress.vue';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 1.5;
const ZOOM_STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5];
/** Space between the canvas edge and the semesters at the start and after fitting. */
const CANVAS_PAD = 24;
/** Pointer travel, in pixels, before a press on the background counts as a pan. */
const PAN_THRESHOLD = 3;

/** True when the wheel is over an element between target and canvas that can scroll vertically. */
const scrollsInside = (target: EventTarget | null, canvas: EventTarget | null): boolean => {
  let element = target instanceof HTMLElement ? target : null;
  while (element && element !== canvas) {
    const { overflowY } = getComputedStyle(element);
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      element.scrollHeight > element.clientHeight
    ) {
      return true;
    }
    element = element.parentElement;
  }
  return false;
};

const clampZoom = (zoom: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));

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
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      zoom: 1,
      panX: CANVAS_PAD,
      panY: 0,
      // background drag state; `moved` stops the click that ends a pan from closing the bottom bar
      panning: false,
      panPointer: null as { id: number; x: number; y: number; moved: boolean } | null,
      justPanned: false,
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
    // phones keep the stacked list; everything wider gets the pan-and-zoom canvas
    isCanvas(): boolean {
      return !this.isMobile;
    },
    // the canvas always reads left to right from the first semester
    displayedSemesters(): readonly FirestoreSemester[] {
      return this.isCanvas ? sortedSemesters(this.semesters, false) : this.semesters;
    },
    zoomPercent(): number {
      return Math.round(this.zoom * 100);
    },
    stageStyle(): Record<string, string> {
      if (!this.isCanvas) return {};
      return { transform: `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})` };
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
      if (this.justPanned) {
        this.justPanned = false;
        return;
      }
      if (!this.isCourseClicked) {
        closeBottomBar(this.$gtag);
      }
      this.isCourseClicked = false;
    },
    canvasRect(): DOMRect | null {
      const canvas = this.$refs.canvas as HTMLElement | undefined;
      return canvas ? canvas.getBoundingClientRect() : null;
    },
    /** Zooms while keeping the canvas point under (x, y), in canvas coordinates, in place. */
    zoomAt(nextZoom: number, x: number, y: number) {
      const zoom = clampZoom(nextZoom);
      const ratio = zoom / this.zoom;
      this.panX = x - (x - this.panX) * ratio;
      this.panY = y - (y - this.panY) * ratio;
      this.zoom = zoom;
    },
    zoomAtCenter(nextZoom: number) {
      const rect = this.canvasRect();
      if (!rect) return;
      this.zoomAt(nextZoom, rect.width / 2, rect.height / 2);
    },
    stepZoom(direction: 1 | -1) {
      const next =
        direction > 0
          ? ZOOM_STEPS.find(step => step > this.zoom + 0.001)
          : [...ZOOM_STEPS].reverse().find(step => step < this.zoom - 0.001);
      if (next !== undefined) this.zoomAtCenter(next);
    },
    resetZoom() {
      this.zoom = 1;
      this.panX = CANVAS_PAD;
      this.panY = 0;
    },
    /** Shows every semester: zooms out until they fit (never past 100%) and centers them. */
    fitToScreen() {
      const rect = this.canvasRect();
      const content = this.$refs.content as HTMLElement | undefined;
      if (!rect || !content) return;
      const width = content.offsetWidth;
      const height = content.offsetHeight;
      if (width === 0 || height === 0) return;
      const zoom = clampZoom(
        Math.min(1, (rect.width - CANVAS_PAD * 2) / width, (rect.height - CANVAS_PAD * 2) / height)
      );
      this.zoom = zoom;
      this.panX = Math.max(CANVAS_PAD, (rect.width - width * zoom) / 2);
      this.panY = 0;
    },
    onWheel(event: WheelEvent) {
      if (!this.isCanvas) return;
      // let lists and menus that scroll on their own keep the wheel
      if (!event.ctrlKey && !event.metaKey && scrollsInside(event.target, event.currentTarget)) {
        return;
      }
      event.preventDefault();
      // trackpad pinch arrives as ctrl + wheel; ctrl/cmd + mouse wheel also zooms
      if (event.ctrlKey || event.metaKey) {
        const rect = this.canvasRect();
        if (!rect) return;
        this.zoomAt(
          this.zoom * Math.exp(-event.deltaY * 0.01),
          event.clientX - rect.left,
          event.clientY - rect.top
        );
        return;
      }
      // a mouse wheel scrolls sideways with shift held, like a normal horizontal scroll
      const horizontal = event.shiftKey && event.deltaX === 0;
      this.panX -= horizontal ? event.deltaY : event.deltaX;
      this.panY -= horizontal ? 0 : event.deltaY;
    },
    onPointerDown(event: PointerEvent) {
      if (!this.isCanvas || event.button !== 0) return;
      const target = event.target as HTMLElement;
      // presses on a semester, a course or any control behave as before
      if (target.closest('.semesterView-wrapper, button, a, input, select, textarea')) return;
      this.panPointer = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    },
    onPointerMove(event: PointerEvent) {
      const pointer = this.panPointer;
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (!pointer.moved) {
        if (Math.abs(dx) < PAN_THRESHOLD && Math.abs(dy) < PAN_THRESHOLD) return;
        pointer.moved = true;
        this.panning = true;
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      }
      this.panX += dx;
      this.panY += dy;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    },
    onPointerUp(event: PointerEvent) {
      const pointer = this.panPointer;
      if (!pointer || pointer.id !== event.pointerId) return;
      if (pointer.moved) {
        // the click that ends a pan fires right after this; clear the flag once it has passed
        this.justPanned = true;
        setTimeout(() => {
          this.justPanned = false;
        }, 0);
      }
      this.panPointer = null;
      this.panning = false;
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
  padding: 16px 24px 0;
  position: relative;
  overflow-y: auto;
  background: $cp-canvas;
  color: $cp-ink;

  // desktop and tablet: a fixed-height viewport the semesters pan and zoom inside
  &--canvas {
    position: sticky;
    top: 0;
    height: 100vh;
    min-width: 0;
    overflow: hidden;
    padding: 0;
  }

  &-settings {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    min-height: 38px;
    margin-bottom: 16px;

    .semesterView--canvas & {
      position: relative;
      z-index: 2;
      margin: 0;
      padding: 16px 24px;
    }
  }

  &-addSemesterButton {
    @include cp-button-secondary;
    gap: 8px;
    padding-left: 12px;

    svg {
      color: $cp-muted;
    }
  }

  &-canvas {
    position: relative;

    .semesterView--canvas & {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      cursor: grab;
      touch-action: none;
      // a faint dot grid so the open area reads as a canvas
      background-image: radial-gradient(rgba(15, 23, 41, 0.08) 1px, transparent 1px);
      background-size: 20px 20px;
    }

    &--panning,
    &--panning * {
      cursor: grabbing !important;
      user-select: none;
    }
  }

  &-stage {
    .semesterView--canvas & {
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: 0 0;
      will-change: transform;
    }
  }

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

    // one row, Semester 1 on the left
    .semesterView--canvas & {
      display: flex;
      flex-wrap: nowrap;
      width: max-content;
      padding-bottom: 96px; // room to scroll the last courses above the zoom bar
    }
  }

  &-wrapper {
    display: flex;
    align-items: flex-start;
    cursor: auto;
  }

  &-empty {
    @include cp-text(14px, 20px);
    position: absolute;
    top: 40%;
    left: 0;
    right: 0;
    margin: 0;
    text-align: center;
    color: $cp-muted;
  }

  &-zoom {
    position: absolute;
    left: 50%;
    bottom: 24px;
    z-index: 2;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 4px;
    background: #fff;
    border: 1px solid $cp-line;
    border-radius: $cp-r-md;
    box-shadow: $cp-shadow-pop;
  }

  &-zoomButton,
  &-zoomLevel {
    @include cp-reset-button;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $cp-r-sm;
    color: $cp-ink;

    &:hover:not(:disabled) {
      background: $cp-hover;
    }

    &:active:not(:disabled) {
      background: $cp-press;
    }

    &:disabled {
      color: $cp-line-strong;
      cursor: default;
    }
  }

  &-zoomButton {
    width: 32px;
  }

  &-zoomLevel {
    @include cp-text(13px, 18px, 500);
    min-width: 52px;
    padding: 0 6px;
    font-variant-numeric: tabular-nums;
  }

  &-zoomDivider {
    width: 1px;
    height: 20px;
    margin: 0 4px;
    background: $cp-line;
  }

  &-builtBy {
    @include cp-text(12px, 16px);
    color: $cp-muted;
    text-align: right;
    padding: 24px 0 16px;

    .semesterView--canvas & {
      position: absolute;
      right: 24px;
      bottom: 12px;
      z-index: 1;
      padding: 0;
    }

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
  margin-left: auto;
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

    &--canvas {
      height: calc(100vh - 5.5rem);
      padding: 0;
    }

    &-builtBy {
      display: none;
    }
  }
}

// phones: the stacked list
@media only screen and (max-width: $small-breakpoint) {
  .semesterView {
    &-content {
      justify-content: center;
      grid-template-columns: 1fr;
    }

    &-wrapper {
      display: block;
    }
  }
}
</style>

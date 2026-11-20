<template>
  <main class="calendar" data-cyId="calendar">
    <header class="calendar-header">
      <h1 class="calendar-title">{{ greeting }}</h1>
      <p class="calendar-subtitle">
        {{ semesterLabel }} · {{ planName }} · Class times from the {{ semesterLabel }} roster
      </p>
    </header>

    <div class="calendar-toolbar">
      <span class="calendar-semester" title="Only the current semester is shown for now">
        {{ semesterLabel }}
      </span>
      <div v-if="comparing" class="calendar-legend" role="group" aria-label="Highlight classes">
        <button
          v-for="chip in legend"
          :key="chip.tone"
          type="button"
          class="calendar-legendChip"
          :class="`calendar-legendChip--${chip.tone}`"
          :aria-pressed="highlight === chip.tone"
          @click="highlight = highlight === chip.tone ? null : chip.tone"
        >
          <i class="calendar-legendDot" />
          {{ chip.label }}
        </button>
      </div>
      <span v-else-if="semester" class="calendar-meta">
        {{ totalCredits }} credits · {{ courses.length }}
        {{ courses.length === 1 ? 'class' : 'classes' }}
      </span>
      <span v-if="conflictCount > 0" class="calendar-conflicts" role="status">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M10.865 9L6.865 2a1 1 0 0 0-1.74 0l-4 7A1 1 0 0 0 2 10.5h8a1 1 0 0 0 .865-1.5Z"
          />
          <path d="M6 4.5v2" />
          <path d="M6 8.5h.005" />
        </svg>
        {{ conflictCount }} time {{ conflictCount === 1 ? 'conflict' : 'conflicts' }} · pick another
        section
      </span>
      <span v-if="isLoading" class="calendar-loading" role="status">Loading class times…</span>
      <span class="calendar-grow" />
      <button
        type="button"
        class="calendar-compare"
        :class="{ 'calendar-compare--on': friendsOpen }"
        :aria-pressed="friendsOpen"
        data-cyId="calendar-compare"
        @click="toggleFriends"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.33"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M10.67 14v-1.33A2.67 2.67 0 0 0 8 10H4a2.67 2.67 0 0 0-2.67 2.67V14M6 7.33A2.67 2.67 0 1 0 6 2a2.67 2.67 0 0 0 0 5.33ZM14.67 14v-1.33a2.67 2.67 0 0 0-2-2.58M10.67 2.09a2.67 2.67 0 0 1 0 5.17"
          />
        </svg>
        Compare with a friend
        <span
          v-if="incomingRequestCount > 0"
          class="calendar-badge"
          :aria-label="`${incomingRequestCount} friend ${
            incomingRequestCount === 1 ? 'request' : 'requests'
          }`"
          >{{ incomingRequestCount }}</span
        >
      </button>
    </div>

    <!-- no current semester in this plan -->
    <div v-if="!semester && !hasFriendEvents" class="calendar-empty">
      <p class="calendar-emptyTitle">{{ semesterLabel }} isn't in {{ planName }} yet</p>
      <p class="calendar-emptyText">
        Add a {{ semesterLabel }} semester on the Plan tab, then come back to see your week.
      </p>
    </div>

    <div v-else-if="courses.length === 0 && !hasFriendEvents" class="calendar-empty">
      <p class="calendar-emptyTitle">No classes in {{ semesterLabel }} yet</p>
      <p class="calendar-emptyText">
        Add classes to {{ semesterLabel }} on the Plan tab to see them here.
      </p>
    </div>

    <template v-else>
      <calendar-week
        :days="days"
        :events="positionedEvents"
        :startHour="hours.startHour"
        :endHour="hours.endHour"
        :selectedUniqueId="selectedUniqueId"
        :keepTones="keepTones"
        :flashCode="calendarFlashCode"
        @select="select"
      />

      <section v-if="unscheduled.length > 0" class="calendar-unscheduled" aria-label="Unscheduled">
        <div class="calendar-unscheduledHead">
          <h2 class="calendar-unscheduledTitle">Unscheduled</h2>
          <span class="calendar-count">{{ unscheduled.length }}</span>
          <span class="calendar-unscheduledHint">Classes without a meeting time this semester</span>
        </div>
        <div class="calendar-chips">
          <component
            :is="item.canPick ? 'button' : 'div'"
            v-for="item in unscheduled"
            :key="item.course.uniqueID"
            :type="item.canPick ? 'button' : undefined"
            class="calendar-chip"
            :class="{
              'calendar-chip--button': item.canPick,
              'calendar-chip--selected': item.course.uniqueID === selectedUniqueId,
            }"
            :style="{ '--course-color': `#${item.course.color}` }"
            @click="item.canPick && select(item.course.uniqueID)"
          >
            <span class="calendar-chipBar" />
            <span class="calendar-chipText">
              <span class="calendar-chipCode">{{ item.course.code }}</span>
              <span class="calendar-chipReason">{{ item.reason }}</span>
            </span>
          </component>
        </div>
      </section>
    </template>

    <calendar-section-panel
      v-if="selectedCourse"
      :key="selectedCourse.uniqueID"
      :course="selectedCourse"
      :options="selectedOptions"
      :semesterLabel="semesterLabel"
      @close="selectedUniqueId = null"
      @pick="pickSection"
    />

    <!-- kept mounted while a section panel covers them, so search and tab state survive -->
    <friends-panel
      v-if="friendsOpen && !comparing"
      v-show="!selectedCourse"
      @close="closeFriends"
      @compare="startCompare"
    />
    <friend-compare-panel
      v-if="friendsOpen && comparing"
      v-show="!selectedCourse"
      :key="comparing.email"
      :profile="comparing"
      :season="season"
      :year="year"
      :focus="compareFocus"
      :flashCode="panelFlashCode"
      @back="stopCompare"
      @close="closeFriends"
      @focus="compareFocus = $event"
      @pick="flashOnCalendar"
      @removed="stopCompare"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CalendarWeek from '@/components/Calendar/CalendarWeek.vue';
import CalendarSectionPanel from '@/components/Calendar/CalendarSectionPanel.vue';
import FriendsPanel from '@/components/Friends/FriendsPanel.vue';
import FriendComparePanel, { CompareFocus } from '@/components/Friends/FriendComparePanel.vue';
import { FriendProfile } from '@/global-firestore-data/friend-profiles';
import {
  CalendarDay,
  CalendarEvent,
  CompareTone,
  ComponentOptions,
  CourseSection,
  PositionedEvent,
  WEEKDAYS,
  WEEKEND,
  layoutDay,
  sectionsByComponent,
  selectedSections,
  visibleHours,
} from '@/components/Calendar/calendar-utils';
import store from '@/store';
import {
  getCourseWithSeasonAndYear,
  extractSubjectAndNumber,
} from '@/global-firestore-data/courses';
import { setCourseSectionChoice } from '@/global-firestore-data';
import { seasonAndYearToRosterIdentifier } from '@/user-data-converter';
import { getCurrentSeason, getCurrentYear, isPlaceholderCourse } from '@/utilities';

/** What we know about one course's roster data for this semester. */
type RosterState =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly options: readonly ComponentOptions[] }
  | { readonly status: 'not-offered' }
  | { readonly status: 'error' };

type UnscheduledItem = {
  readonly course: FirestoreSemesterCourse;
  readonly reason: string;
  /** True when the course has sections to choose from, so the panel can open. */
  readonly canPick: boolean;
};

/** Fixed colors while comparing, from the prototype: you blue, friend purple, together green. */
const TONE_COLORS: Record<CompareTone, string> = {
  you: '2f6fa3',
  friend: '7b4fb0',
  together: '318663',
};

/** Which tones each legend chip keeps at full strength. */
const KEEP_TONES: Record<CompareTone, readonly CompareTone[]> = {
  you: ['you', 'together'],
  friend: ['friend', 'together'],
  together: ['together'],
};

const FLASH_MS = 1200;

const sectionKey = (code: string, section: CourseSection) =>
  `${code}|${section.component}|${section.section}`;

const isCornellCourse = (
  course: FirestoreSemesterCourse
): course is FirestoreSemesterCornellCourse =>
  'lastRoster' in course && (course as { type?: string }).type !== 'BlankCourse';

export default defineComponent({
  components: { CalendarWeek, CalendarSectionPanel, FriendsPanel, FriendComparePanel },
  data() {
    return {
      season: getCurrentSeason(),
      year: getCurrentYear(),
      // keyed by course code; filled in as roster lookups finish
      roster: {} as Record<string, RosterState>,
      selectedUniqueId: null as number | null,
      friendsOpen: false,
      comparing: null as (FriendProfile & { plan: Plan }) | null,
      compareFocus: null as CompareFocus | null,
      highlight: null as CompareTone | null,
      calendarFlashCode: null as string | null,
      panelFlashCode: null as string | null,
      flashTimer: 0,
    };
  },
  computed: {
    semesterLabel(): string {
      return `${this.season} ${this.year}`;
    },
    rosterId(): string {
      return seasonAndYearToRosterIdentifier(this.season, this.year);
    },
    planName(): string {
      return store.state.currentPlan.name;
    },
    greeting(): string {
      const { firstName } = store.state.userName;
      return firstName ? `Hi ${firstName}, here’s your week` : 'Here’s your week';
    },
    semester(): FirestoreSemester | undefined {
      const semesters: readonly FirestoreSemester[] = store.getters.getCurrentPlanSemesters;
      return semesters.find(s => s.season === this.season && s.year === this.year);
    },
    courses(): FirestoreSemesterCourse[] {
      return (this.semester?.courses ?? []).filter(
        (course): course is FirestoreSemesterCourse => !isPlaceholderCourse(course)
      );
    },
    totalCredits(): number {
      return this.courses.reduce((sum, course) => sum + course.credits, 0);
    },
    // the codes we need roster data for; watched to start lookups
    cornellCodes(): string[] {
      const codes = [...this.courses, ...this.friendCourses]
        .filter(isCornellCourse)
        .map(course => course.code);
      return [...new Set(codes)];
    },
    incomingRequestCount(): number {
      return store.state.incomingFriendRequests.length;
    },
    friendFirstName(): string {
      return this.comparing ? this.comparing.name.split(' ')[0] : '';
    },
    // the compared friend's classes this semester, from the plan they share
    friendCourses(): FirestoreSemesterCourse[] {
      if (!this.comparing) return [];
      const semester = this.comparing.plan.semesters.find(
        s => s.season === this.season && s.year === this.year
      );
      return (semester?.courses ?? []).filter(
        (course): course is FirestoreSemesterCourse => !isPlaceholderCourse(course)
      );
    },
    /** Sections the friend is in, as `code|component|section`. */
    friendSectionKeys(): Set<string> {
      const keys = new Set<string>();
      this.friendCourses.forEach(course => {
        if (!isCornellCourse(course)) return;
        const state = this.roster[course.code];
        if (state?.status !== 'ready') return;
        selectedSections(state.options, course.sectionChoices).forEach(section =>
          keys.add(sectionKey(course.code, section))
        );
      });
      return keys;
    },
    friendEvents(): CalendarEvent[] {
      if (!this.comparing) return [];
      const mine = this.mySectionKeys;
      const events: CalendarEvent[] = [];
      this.friendCourses.forEach((course, index) => {
        if (!isCornellCourse(course)) return;
        const state = this.roster[course.code];
        if (state?.status !== 'ready') return;
        selectedSections(state.options, course.sectionChoices).forEach(section => {
          // a section you are both in is drawn once, as yours, in the together color
          if (mine.has(sectionKey(course.code, section))) return;
          section.meetings.forEach((meeting, meetingIndex) =>
            meeting.days.forEach(day =>
              events.push({
                key: `friend-${course.uniqueID}-${section.component}-${section.section}-${day}-${meetingIndex}`,
                // negative so friend blocks never collide with your course IDs
                courseUniqueID: -(index + 1),
                code: course.code,
                component: section.component,
                section: section.section,
                color: TONE_COLORS.friend,
                day,
                start: meeting.start,
                end: meeting.end,
                friendName: this.friendFirstName,
                tone: 'friend',
              })
            )
          );
        });
      });
      return events;
    },
    hasFriendEvents(): boolean {
      return this.friendEvents.length > 0;
    },
    mySectionKeys(): Set<string> {
      const keys = new Set<string>();
      this.courses.forEach(course => {
        if (!isCornellCourse(course)) return;
        const state = this.roster[course.code];
        if (state?.status !== 'ready') return;
        selectedSections(state.options, course.sectionChoices).forEach(section =>
          keys.add(sectionKey(course.code, section))
        );
      });
      return keys;
    },
    legend(): { tone: CompareTone; label: string }[] {
      return [
        { tone: 'you', label: 'You' },
        { tone: 'friend', label: this.friendFirstName },
        { tone: 'together', label: 'Taking together' },
      ];
    },
    keepTones(): readonly CompareTone[] | null {
      if (!this.comparing) return null;
      if (this.highlight) return KEEP_TONES[this.highlight];
      return this.compareFocus === 'together' ? KEEP_TONES.together : null;
    },
    isLoading(): boolean {
      return this.cornellCodes.some(code => this.roster[code]?.status === 'loading');
    },
    events(): CalendarEvent[] {
      return [...this.myEvents, ...this.friendEvents];
    },
    myEvents(): CalendarEvent[] {
      const events: CalendarEvent[] = [];
      const comparing = this.comparing != null;
      this.courses.forEach(course => {
        if (!isCornellCourse(course)) return;
        const state = this.roster[course.code];
        if (state?.status !== 'ready') return;
        selectedSections(state.options, course.sectionChoices).forEach(section => {
          let tone: CompareTone | undefined;
          if (comparing) {
            tone = this.friendSectionKeys.has(sectionKey(course.code, section))
              ? 'together'
              : 'you';
          }
          section.meetings.forEach((meeting, meetingIndex) =>
            meeting.days.forEach(day =>
              events.push({
                key: `${course.uniqueID}-${section.component}-${section.section}-${day}-${meetingIndex}`,
                courseUniqueID: course.uniqueID,
                code: course.code,
                component: section.component,
                section: section.section,
                color: tone ? TONE_COLORS[tone] : course.color,
                day,
                start: meeting.start,
                end: meeting.end,
                tone,
              })
            )
          );
        });
      });
      return events;
    },
    // weekdays always; Saturday/Sunday only when a class meets then
    days(): CalendarDay[] {
      const weekend = WEEKEND.filter(day => this.events.some(event => event.day === day));
      return [...WEEKDAYS, ...weekend];
    },
    positionedEvents(): PositionedEvent[] {
      return this.days.flatMap(day => layoutDay(this.events.filter(event => event.day === day)));
    },
    hours(): { startHour: number; endHour: number } {
      return visibleHours(this.events);
    },
    // courses with a conflict, counted once each
    conflictCount(): number {
      return new Set(this.positionedEvents.filter(e => e.conflict).map(e => e.courseUniqueID)).size;
    },
    unscheduled(): UnscheduledItem[] {
      const placed = new Set(this.myEvents.map(event => event.courseUniqueID));
      const items: UnscheduledItem[] = [];
      this.courses.forEach(course => {
        if (placed.has(course.uniqueID)) return;
        if (!isCornellCourse(course)) {
          items.push({ course, reason: 'Custom course · no roster times', canPick: false });
          return;
        }
        const state = this.roster[course.code];
        if (state == null || state.status === 'loading') return;
        if (state.status === 'not-offered') {
          items.push({ course, reason: `Not offered in ${this.semesterLabel}`, canPick: false });
        } else if (state.status === 'error') {
          items.push({ course, reason: 'Couldn’t load class times', canPick: false });
        } else {
          items.push({
            course,
            reason: 'No meeting time listed',
            canPick: state.options.some(option => option.sections.length > 1),
          });
        }
      });
      return items;
    },
    selectedCourse(): FirestoreSemesterCornellCourse | null {
      if (this.selectedUniqueId == null) return null;
      const course = this.courses.find(c => c.uniqueID === this.selectedUniqueId);
      return course && isCornellCourse(course) ? course : null;
    },
    selectedOptions(): readonly ComponentOptions[] {
      if (this.selectedCourse == null) return [];
      const state = this.roster[this.selectedCourse.code];
      return state?.status === 'ready' ? state.options : [];
    },
  },
  watch: {
    cornellCodes: {
      handler(codes: string[]) {
        codes.forEach(code => {
          if (this.roster[code] == null) this.loadRoster(code);
        });
      },
      immediate: true,
    },
    // close the panel if its course leaves the semester
    selectedCourse(course: FirestoreSemesterCornellCourse | null) {
      if (course == null) this.selectedUniqueId = null;
    },
  },
  methods: {
    async loadRoster(code: string) {
      this.roster = { ...this.roster, [code]: { status: 'loading' } };
      let next: RosterState;
      try {
        const { subject, number } = extractSubjectAndNumber(code);
        const course = await getCourseWithSeasonAndYear(this.season, this.year, subject, number);
        // getCourse falls back to the last roster a course was offered in; that is not this term
        next =
          course == null || course.roster !== this.rosterId
            ? { status: 'not-offered' }
            : { status: 'ready', options: sectionsByComponent(course) };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Calendar: could not load roster data for ${code}`, error);
        next = { status: 'error' };
      }
      this.roster = { ...this.roster, [code]: next };
    },
    select(uniqueID: number) {
      // a friend's block: point at that course in the Compare panel instead
      if (uniqueID < 0) {
        const event = this.friendEvents.find(e => e.courseUniqueID === uniqueID);
        if (event) this.flash('panelFlashCode', event.code);
        return;
      }
      this.selectedUniqueId = this.selectedUniqueId === uniqueID ? null : uniqueID;
    },
    toggleFriends() {
      if (this.friendsOpen) this.closeFriends();
      else {
        this.selectedUniqueId = null;
        this.friendsOpen = true;
      }
    },
    closeFriends() {
      this.friendsOpen = false;
      this.stopCompare();
    },
    startCompare(profile: FriendProfile) {
      if (profile.plan == null) return;
      this.comparing = { ...profile, plan: profile.plan };
      this.compareFocus = null;
      this.highlight = null;
    },
    stopCompare() {
      this.comparing = null;
      this.compareFocus = null;
      this.highlight = null;
    },
    flashOnCalendar(code: string) {
      this.flash('calendarFlashCode', code);
    },
    /** Sets a flash code for long enough to play the pulse, then clears it so it can replay. */
    flash(target: 'calendarFlashCode' | 'panelFlashCode', code: string) {
      window.clearTimeout(this.flashTimer);
      this.calendarFlashCode = null;
      this.panelFlashCode = null;
      this.$nextTick(() => {
        this[target] = code;
        this.flashTimer = window.setTimeout(() => {
          this[target] = null;
        }, FLASH_MS);
      });
    },
    pickSection(component: string, section: string) {
      if (this.selectedCourse == null) return;
      setCourseSectionChoice(
        this.year,
        this.season,
        this.selectedCourse.uniqueID,
        component,
        section
      );
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_tokens.scss';

.calendar {
  @include cp-font;
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: $cp-canvas;
  color: $cp-ink;

  &-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &-title {
    @include cp-text(32px, 40px, 700);
    letter-spacing: -0.48px;
    color: $cp-ink;
    margin: 0;
  }

  &-subtitle {
    @include cp-text(14px, 20px);
    color: $cp-muted;
    margin: 0;
  }

  &-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  &-semester {
    @include cp-text(14px, 20px, 600);
    padding: 8px 16px;
    background: #fff;
    border: 1px solid $cp-line-strong;
    border-radius: $cp-r-md;
  }

  &-grow {
    flex: 1;
  }

  &-compare {
    @include cp-button-secondary;
    gap: 8px;

    &--on {
      border-color: $cp-link;
      background: $cp-soft;
      color: $cp-link-strong;

      &:hover {
        background: $cp-soft-hover;
      }
    }
  }

  &-badge {
    @include cp-text(11px, 14px, 600);
    min-width: 18px;
    padding: 1px 5px;
    border-radius: 999px;
    background: $cp-err;
    color: #fff;
    text-align: center;
  }

  &-legend {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  &-legendChip {
    @include cp-reset-button;
    @include cp-text(13px, 18px);
    --tone: #2f6fa3;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 12px;
    color: $cp-ink;
    background: #fff;
    border: 1px solid $cp-line;
    border-radius: 999px;
    transition: background-color 150ms, border-color 150ms;

    &--friend {
      --tone: #7b4fb0;
    }

    &--together {
      --tone: #318663;
    }

    &:hover {
      border-color: $cp-line-strong;
    }

    &[aria-pressed='true'] {
      font-weight: 600;
      border-color: var(--tone);
      background: color-mix(in srgb, var(--tone) 10%, white);
    }
  }

  &-legendDot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--tone);
  }

  &-meta,
  &-loading {
    @include cp-text(13px, 18px);
    color: $cp-muted;
  }

  &-conflicts {
    @include cp-notice(warn);
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    font-weight: 500;
  }

  &-empty {
    background: #fff;
    border-radius: $cp-r-lg;
    box-shadow: $cp-shadow-rest;
    padding: 40px 24px;
    text-align: center;
  }

  &-emptyTitle {
    @include cp-text(16px, 22px, 600);
    margin: 0 0 4px;
  }

  &-emptyText {
    @include cp-text(13px, 18px);
    color: $cp-muted;
    margin: 0;
  }

  // the strip under the grid for classes without times
  &-unscheduled {
    background: #fff;
    border: 1px dashed $cp-line-strong;
    border-radius: $cp-r-lg;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &-unscheduledHead {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  &-unscheduledTitle {
    @include cp-text(14px, 20px, 600);
    margin: 0;
  }

  &-count {
    @include cp-pill(fill);
  }

  &-unscheduledHint {
    @include cp-text(12px, 16px);
    color: $cp-muted;
  }

  &-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &-chip {
    display: flex;
    gap: 8px;
    min-width: 180px;
    padding: 8px 12px 8px 8px;
    background: #fff;
    border: 1px solid $cp-line;
    border-radius: $cp-r-md;
    box-shadow: $cp-shadow-rest;
    text-align: left;

    &--button {
      @include cp-reset-button;
      background: #fff;
      border: 1px solid $cp-line;
      padding: 8px 12px 8px 8px;

      &:hover {
        border-color: var(--course-color);
      }
    }

    &--selected {
      border-color: var(--course-color);
      box-shadow: inset 0 0 0 1px var(--course-color);
    }
  }

  &-chipBar {
    width: 4px;
    flex-shrink: 0;
    align-self: stretch;
    border-radius: 999px;
    background: var(--course-color);
  }

  &-chipText {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &-chipCode {
    @include cp-text(13px, 18px, 600);
    color: color-mix(in srgb, var(--course-color) 72%, black);
  }

  &-chipReason {
    @include cp-text(11px, 14px);
    color: $cp-muted;
  }
}

@media only screen and (max-width: $medium-breakpoint) {
  .calendar {
    margin-top: 4.5rem;
    padding: 16px;

    &-title {
      @include cp-text(24px, 32px, 700);
    }
  }
}
</style>

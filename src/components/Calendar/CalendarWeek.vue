<template>
  <div class="week" role="region" aria-label="Weekly calendar">
    <div
      class="week-grid"
      :style="{ gridTemplateColumns: `56px repeat(${days.length}, minmax(120px, 1fr))` }"
    >
      <div class="week-corner" />
      <div v-for="day in days" :key="`label-${day}`" class="week-dayLabel">
        {{ dayLabels[day] }}
      </div>

      <div class="week-times" :style="{ height: `${bodyHeight}px` }">
        <span
          v-for="hour in innerHours"
          :key="`time-${hour}`"
          class="week-time"
          :style="{ top: `${hourTop(hour)}px` }"
          >{{ hourLabel(hour) }}</span
        >
      </div>

      <div
        v-for="day in days"
        :key="`col-${day}`"
        class="week-day"
        :style="{ height: `${bodyHeight}px` }"
      >
        <div
          v-for="hour in innerHours"
          :key="`line-${day}-${hour}`"
          class="week-hourLine"
          :style="{ top: `${hourTop(hour)}px` }"
        />
        <button
          v-for="event in eventsByDay[day]"
          :key="event.key"
          type="button"
          class="week-event"
          :class="{
            'week-event--selected': event.courseUniqueID === selectedUniqueId,
            'week-event--conflict': event.conflict,
            'week-event--short': event.end - event.start < 45,
            'week-event--friend': event.friendName != null,
            'week-event--dim': isDimmed(event),
            'week-event--flash': flashCode != null && event.code === flashCode,
          }"
          :style="eventStyle(event)"
          :aria-label="eventLabel(event)"
          :aria-pressed="
            event.friendName == null ? event.courseUniqueID === selectedUniqueId : undefined
          "
          @click="$emit('select', event.courseUniqueID)"
        >
          <span class="week-eventBar" />
          <span class="week-eventText">
            <span class="week-eventCode">
              {{ event.code }}
              <span class="week-eventComponent">{{ event.component }}</span>
            </span>
            <span class="week-eventTime">{{ timeRange(event) }}</span>
          </span>
          <svg
            v-if="event.conflict"
            class="week-eventWarn"
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
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import {
  CalendarDay,
  CompareTone,
  DAY_LABELS,
  PositionedEvent,
  formatTime,
} from '@/components/Calendar/calendar-utils';

/** Pixels per minute: one hour is about 67px tall. */
const PX_PER_MINUTE = 1.12;
/** Space above the first hour so its label isn't clipped. */
const TOP_PAD = 8;

export default defineComponent({
  props: {
    days: { type: Array as PropType<readonly CalendarDay[]>, required: true },
    events: { type: Array as PropType<readonly PositionedEvent[]>, required: true },
    startHour: { type: Number, required: true },
    endHour: { type: Number, required: true },
    selectedUniqueId: { type: Number as PropType<number | null>, default: null },
    /** While comparing: the tones to keep at full strength; the rest fade. Null keeps all. */
    keepTones: { type: Array as PropType<readonly CompareTone[] | null>, default: null },
    /** Briefly pulses the blocks of this course code. */
    flashCode: { type: String as PropType<string | null>, default: null },
  },
  emits: {
    select: (uniqueID: number) => typeof uniqueID === 'number',
  },
  data() {
    return { dayLabels: DAY_LABELS };
  },
  computed: {
    bodyHeight(): number {
      return (this.endHour - this.startHour) * 60 * PX_PER_MINUTE + TOP_PAD * 2;
    },
    // hours drawn as lines and labels, not counting the top and bottom edges
    innerHours(): number[] {
      const hours: number[] = [];
      for (let hour = this.startHour + 1; hour < this.endHour; hour += 1) hours.push(hour);
      return hours;
    },
    eventsByDay(): Record<string, PositionedEvent[]> {
      const byDay: Record<string, PositionedEvent[]> = {};
      this.days.forEach(day => {
        byDay[day] = [];
      });
      this.events.forEach(event => byDay[event.day]?.push(event));
      return byDay;
    },
  },
  methods: {
    minuteTop(minutes: number): number {
      return TOP_PAD + (minutes - this.startHour * 60) * PX_PER_MINUTE;
    },
    hourTop(hour: number): number {
      return this.minuteTop(hour * 60);
    },
    hourLabel(hour: number): string {
      return `${hour % 12 || 12} ${hour >= 12 ? 'pm' : 'am'}`;
    },
    timeRange(event: PositionedEvent): string {
      return `${formatTime(event.start)}–${formatTime(event.end)}`;
    },
    isDimmed(event: PositionedEvent): boolean {
      return this.keepTones != null && event.tone != null && !this.keepTones.includes(event.tone);
    },
    eventLabel(event: PositionedEvent): string {
      if (event.friendName != null) {
        return `${event.friendName}’s class: ${event.code} ${event.component}, ${
          DAY_LABELS[event.day]
        } ${this.timeRange(event)}. Show in panel`;
      }
      const together = event.tone === 'together' ? ' Taking together.' : '';
      const conflict = event.conflict ? ' Time conflict.' : '';
      return `${event.code} ${event.component} ${event.section}, ${
        DAY_LABELS[event.day]
      } ${this.timeRange(event)}.${together}${conflict} Choose a section`;
    },
    eventStyle(event: PositionedEvent): Record<string, string> {
      // overlapping events split the column side by side
      const width = `(100% - 8px) / ${event.columns}`;
      return {
        top: `${this.minuteTop(event.start) + 1}px`,
        height: `${(event.end - event.start) * PX_PER_MINUTE - 2}px`,
        left: `calc(4px + ${width} * ${event.column})`,
        width: `calc(${width} - 2px)`,
        '--course-color': `#${event.color}`,
      };
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/_tokens.scss';

.week {
  @include cp-font;
  background: #fff;
  border-radius: $cp-r-lg;
  box-shadow: $cp-shadow-rest;
  overflow: auto;

  &-grid {
    display: grid;
    min-width: 640px;
  }

  &-corner,
  &-dayLabel {
    position: sticky;
    top: 0;
    z-index: 3;
    background: #fff;
    border-bottom: 1px solid $cp-line;
  }

  &-dayLabel {
    @include cp-text(12px, 16px, 600);
    color: $cp-ink;
    padding: 12px 8px;
    text-align: center;
    border-left: 1px solid $cp-line;
  }

  &-times {
    position: relative;
  }

  &-time {
    @include cp-text(11px, 14px);
    position: absolute;
    right: 8px;
    transform: translateY(-50%);
    color: $cp-muted;
    white-space: nowrap;
  }

  &-day {
    position: relative;
    border-left: 1px solid $cp-line;
  }

  &-hourLine {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: $cp-line;
    opacity: 0.7;
  }

  // a class block: tinted with the course color, with its color bar on the left
  &-event {
    @include cp-reset-button;
    --ink: color-mix(in srgb, var(--course-color) 72%, black);
    position: absolute;
    z-index: 1;
    display: flex;
    gap: 6px;
    padding: 4px 6px 4px 4px;
    overflow: hidden;
    text-align: left;
    background: color-mix(in srgb, var(--course-color) 12%, white);
    border: 1px solid color-mix(in srgb, var(--course-color) 30%, white);
    border-radius: $cp-r-sm;
    transition: box-shadow 150ms, border-color 150ms, opacity 200ms;

    &:hover {
      z-index: 2;
      border-color: var(--course-color);
      box-shadow: $cp-shadow-pop;
    }

    &--selected {
      z-index: 2;
      border-color: var(--ink);
      box-shadow: inset 0 0 0 1px var(--ink), $cp-shadow-pop;
    }

    &--conflict {
      border-color: $cp-warn-line;
      box-shadow: inset 0 0 0 1px $cp-warn-line;
    }

    &--short &Time {
      display: none;
    }

    // a friend's class while comparing: dashed so it reads as theirs, not yours
    &--friend {
      border-style: dashed;
      border-color: var(--course-color);
    }

    &--dim {
      opacity: 0.25;
    }

    &--flash {
      animation: week-flash 1.2s ease-out;
    }
  }

  &-eventBar {
    width: 3px;
    flex-shrink: 0;
    align-self: stretch;
    border-radius: 999px;
    background: var(--course-color);
  }

  &-eventText {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &-eventCode {
    @include cp-text(12px, 16px, 600);
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-eventComponent {
    font-weight: 500;
    opacity: 0.8;
  }

  &-eventTime {
    @include cp-text(11px, 14px);
    color: $cp-ink;
    white-space: nowrap;
  }

  &-eventWarn {
    position: absolute;
    top: 4px;
    right: 4px;
    color: $cp-warn-accent;
  }
}

@keyframes week-flash {
  0%,
  40% {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--course-color) 45%, white);
  }
  100% {
    box-shadow: none;
  }
}
</style>

/**
 * Pure helpers for the Calendar tab: turn class roster sections into week-view events.
 * Nothing here touches Firestore or the store, so it can be unit tested directly.
 */

export type CalendarDay = 'M' | 'T' | 'W' | 'R' | 'F' | 'S' | 'Su';

export const WEEKDAYS: readonly CalendarDay[] = ['M', 'T', 'W', 'R', 'F'];
export const WEEKEND: readonly CalendarDay[] = ['S', 'Su'];

export const DAY_LABELS: Record<CalendarDay, string> = {
  M: 'Mon',
  T: 'Tue',
  W: 'Wed',
  R: 'Thu',
  F: 'Fri',
  S: 'Sat',
  Su: 'Sun',
};

export type SectionMeeting = {
  readonly days: readonly CalendarDay[];
  /** Minutes after midnight. */
  readonly start: number;
  readonly end: number;
};

export type CourseSection = {
  /** Roster component, e.g. LEC, DIS, LAB. */
  readonly component: string;
  /** Roster section number, e.g. '001'. */
  readonly section: string;
  /** Meetings that have days and times. TBA and online-async meetings are left out. */
  readonly meetings: readonly SectionMeeting[];
};

export type ComponentOptions = {
  readonly component: string;
  readonly sections: readonly CourseSection[];
};

type RosterMeeting = {
  readonly pattern?: unknown;
  readonly timeStart?: unknown;
  readonly timeEnd?: unknown;
};
type RosterSection = {
  readonly ssrComponent?: string;
  readonly section?: string;
  readonly meetings?: readonly RosterMeeting[];
};
type RosterCourse = {
  readonly enrollGroups?: readonly { readonly classSections?: readonly RosterSection[] }[];
};

/** Parses a roster time like '10:10AM' or '1:25PM' into minutes after midnight. */
export const parseRosterTime = (value: unknown): number | null => {
  if (typeof value !== 'string') return null;
  const match = /^\s*(\d{1,2}):(\d{2})\s*([AaPp])[Mm]\s*$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 1 || hours > 12 || minutes > 59) return null;
  const isPm = match[3].toUpperCase() === 'P';
  return ((hours % 12) + (isPm ? 12 : 0)) * 60 + minutes;
};

/**
 * Parses a roster meeting pattern like 'MWF', 'TR' or 'SSu' into days. Anything that is not made
 * only of day letters (e.g. 'TBA') has no days.
 */
export const parseRosterPattern = (value: unknown): CalendarDay[] => {
  if (typeof value !== 'string' || !/^(Su|[MTWRFS])+$/.test(value)) return [];
  const days: CalendarDay[] = [];
  for (let i = 0; i < value.length; i += 1) {
    const letter = value[i];
    if (letter === 'S' && value[i + 1] === 'u') {
      days.push('Su');
      i += 1;
    } else {
      days.push(letter as CalendarDay);
    }
  }
  return days.filter((day, i) => days.indexOf(day) === i);
};

const parseMeeting = (meeting: RosterMeeting): SectionMeeting | null => {
  const days = parseRosterPattern(meeting.pattern);
  const start = parseRosterTime(meeting.timeStart);
  const end = parseRosterTime(meeting.timeEnd);
  if (days.length === 0 || start == null || end == null || end <= start) return null;
  return { days, start, end };
};

/**
 * Groups a roster course's sections by component, keeping roster order (lectures usually come
 * first). Sections from every enroll group are included; the same component + section number is
 * only listed once.
 */
export const sectionsByComponent = (course: RosterCourse): ComponentOptions[] => {
  const byComponent = new Map<string, CourseSection[]>();
  (course.enrollGroups ?? []).forEach(group =>
    (group.classSections ?? []).forEach(rosterSection => {
      const component = rosterSection.ssrComponent || 'LEC';
      const section = rosterSection.section || '';
      const list = byComponent.get(component) ?? [];
      if (list.some(existing => existing.section === section)) return;
      const meetings = (rosterSection.meetings ?? [])
        .map(parseMeeting)
        .filter((meeting): meeting is SectionMeeting => meeting != null);
      list.push({ component, section, meetings });
      byComponent.set(component, list);
    })
  );
  return Array.from(byComponent, ([component, sections]) => ({ component, sections }));
};

/**
 * The section used for each component: the student's choice when it still exists in the roster,
 * otherwise the first section listed.
 */
export const selectedSections = (
  options: readonly ComponentOptions[],
  choices: { readonly [component: string]: string } | undefined
): CourseSection[] =>
  options
    .map(({ component, sections }) => {
      const chosen = choices?.[component];
      return sections.find(s => s.section === chosen) ?? sections[0];
    })
    .filter((section): section is CourseSection => section != null);

/** Formats minutes after midnight as '10:10am'. */
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours % 12 || 12}:${String(mins).padStart(2, '0')}${hours >= 12 ? 'pm' : 'am'}`;
};

/** Formats a meeting as 'MWF 10:10–11:00am'. */
export const formatMeeting = (meeting: SectionMeeting): string => {
  const startText = formatTime(meeting.start);
  const endText = formatTime(meeting.end);
  // drop the first am/pm when both ends share it: 10:10–11:00am
  const sameHalf = startText.slice(-2) === endText.slice(-2);
  return `${meeting.days.join('')} ${sameHalf ? startText.slice(0, -2) : startText}–${endText}`;
};

export type CalendarEvent = {
  /** Unique per placed block, e.g. `${uniqueID}-LEC-001-M-0`. */
  readonly key: string;
  readonly courseUniqueID: number;
  readonly code: string;
  readonly component: string;
  readonly section: string;
  readonly color: string;
  readonly day: CalendarDay;
  readonly start: number;
  readonly end: number;
};

export type PositionedEvent = CalendarEvent & {
  /** Column within its overlap group, starting at 0. */
  readonly column: number;
  /** Number of columns in its overlap group. */
  readonly columns: number;
  /** True when it overlaps a block from a different course. */
  readonly conflict: boolean;
};

/**
 * Lays out one day's events: events that overlap share a group and get side-by-side columns.
 * Returns events sorted by start time.
 */
export const layoutDay = (events: readonly CalendarEvent[]): PositionedEvent[] => {
  const sorted = [...events].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: PositionedEvent[] = [];
  let group: CalendarEvent[] = [];
  let groupEnd = -1;

  const flush = () => {
    const columnEnds: number[] = [];
    const placed = group.map(event => {
      let column = columnEnds.findIndex(end => end <= event.start);
      if (column < 0) {
        column = columnEnds.length;
        columnEnds.push(event.end);
      } else {
        columnEnds[column] = event.end;
      }
      return { event, column };
    });
    placed.forEach(({ event, column }) => {
      const conflict = group.some(
        other =>
          other !== event &&
          other.courseUniqueID !== event.courseUniqueID &&
          other.start < event.end &&
          event.start < other.end
      );
      out.push({ ...event, column, columns: columnEnds.length, conflict });
    });
  };

  sorted.forEach(event => {
    if (group.length > 0 && event.start >= groupEnd) {
      flush();
      group = [];
      groupEnd = -1;
    }
    group.push(event);
    groupEnd = Math.max(groupEnd, event.end);
  });
  if (group.length > 0) flush();
  return out;
};

/**
 * The visible hour range: 8am–5pm by default, widened to whole hours around any event outside it.
 */
export const visibleHours = (
  events: readonly CalendarEvent[]
): { readonly startHour: number; readonly endHour: number } => {
  let startHour = 8;
  let endHour = 17;
  events.forEach(event => {
    startHour = Math.min(startHour, Math.floor(event.start / 60));
    endHour = Math.max(endHour, Math.ceil(event.end / 60));
  });
  return { startHour, endHour };
};

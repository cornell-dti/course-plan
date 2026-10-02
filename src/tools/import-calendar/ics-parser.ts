import type { DayOfTheWeek } from '../../schedule-generator/course-unit';

export type IcsCourseGroup = {
  readonly roster: string;
  readonly crseId: number;
  readonly code: string;
  readonly meetings: readonly FirestoreCourseMeeting[];
};

type IcsEvent = Readonly<Record<string, string>>;

const ICS_DAYS: Readonly<Record<string, DayOfTheWeek>> = {
  SU: 'Sunday',
  MO: 'Monday',
  TU: 'Tuesday',
  WE: 'Wednesday',
  TH: 'Thursday',
  FR: 'Friday',
  SA: 'Saturday',
};

const UID_PATTERN = /^((?:FA|SP|SU|WI)\d{2})(\d+)\./;
const COURSE_CODE_PATTERN = /^[A-Z&]{2,8} \d{4}[A-Z]?$/;

const unescapeText = (value: string): string =>
  value.replace(/\\(.)/g, (_, char: string) => (char === 'n' || char === 'N' ? '\n' : char));

export const parseIcsEvents = (text: string): { isCalendar: boolean; events: IcsEvent[] } => {
  const lines = text
    .replace(/^\uFEFF/, '')
    .replace(/\r?\n[ \t]/g, '')
    .split(/\r?\n/);
  const events: IcsEvent[] = [];
  const stack: string[] = [];
  let isCalendar = false;
  let current: Record<string, string> | null = null;
  lines.forEach(line => {
    const parts = line.match(/^((?:[^":]|"[^"]*")*):(.*)$/);
    if (parts == null) return;
    const name = parts[1].split(';')[0].trim().toUpperCase();
    const value = parts[2];
    const component = value.trim().toUpperCase();
    if (name === 'BEGIN') {
      stack.push(component);
      if (component === 'VCALENDAR') isCalendar = true;
      if (component === 'VEVENT') current = {};
    } else if (name === 'END') {
      stack.pop();
      if (component === 'VEVENT' && current != null) events.push(current);
      if (component === 'VEVENT') current = null;
    } else if (current != null && stack[stack.length - 1] === 'VEVENT') {
      current[name] = value;
    }
  });
  return { isCalendar, events };
};

type IcsDateTime = { date: string; time: string; hhmm: string; shifted: boolean };

const parseDateTime = (value: string): IcsDateTime | null => {
  const raw = value.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})\d{2}(Z?)$/);
  if (!raw) return null;
  const [y, mo, d, h, mi] = raw.slice(1, 6).map(Number);
  const local = raw[6]
    ? new Date(Date.UTC(y, mo - 1, d, h, mi))
        .toLocaleString('sv-SE', { timeZone: 'America/New_York' })
        .match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/)
    : raw;
  if (!local) return null;
  const hours = parseInt(local[4], 10);
  const time = `${hours % 12 === 0 ? 12 : hours % 12}:${local[5]}${hours >= 12 ? 'pm' : 'am'}`;
  const date = `${local[1]}-${local[2]}-${local[3]}`;
  return { date, time, hhmm: local[4] + local[5], shifted: local[3] !== raw[3] };
};

const rruleValue = (rrule: string, key: string): string | null => {
  const match = rrule.match(new RegExp(`(?:^|;)${key}=([^;]*)`));
  return match ? match[1] : null;
};

const readEvent = (event: IcsEvent): (IcsCourseGroup & { isChild: boolean }) | null => {
  const uid = (event.UID ?? '').match(UID_PATTERN);
  const code = unescapeText(event.SUMMARY ?? '')
    .split(',')[0]
    .trim()
    .toUpperCase();
  const start = parseDateTime(event.DTSTART ?? '');
  const end = parseDateTime(event.DTEND ?? '');
  if (uid == null || !COURSE_CODE_PATTERN.test(code) || start == null || end == null) return null;

  const rrule = event.RRULE ?? '';
  const byDay = (rruleValue(rrule, 'BYDAY') ?? '').split(',');
  const week = Object.values(ICS_DAYS);
  let days = byDay
    .map(token => ICS_DAYS[token.replace(/^[+-]?\d+/, '')])
    .filter((day): day is DayOfTheWeek => day != null)
    .map(day => (start.shifted ? week[(week.indexOf(day) + 6) % 7] : day));
  if (days.length === 0) {
    const [y, m, d] = start.date.split('-').map(part => parseInt(part, 10));
    days = [week[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]];
  }
  const untilRaw = rruleValue(rrule, 'UNTIL') ?? '';
  const until = parseDateTime(untilRaw) ?? parseDateTime(`${untilRaw.slice(0, 8)}T235959`);
  let endDate: string | null = rrule ? null : start.date;
  if (until != null) {
    const dayBefore = until.hhmm < start.hhmm ? 1 : 0;
    const [y, m, d] = until.date.split('-').map(Number);
    endDate = new Date(Date.UTC(y, m - 1, d - dayBefore)).toISOString().slice(0, 10);
  }
  const [component = '', section = ''] = unescapeText(event.DESCRIPTION ?? '')
    .trim()
    .split(/\s+/);
  const location = unescapeText(event.LOCATION ?? '').trim();

  return {
    roster: uid[1],
    crseId: parseInt(uid[2], 10),
    code,
    isChild: event['RELATED-TO'] != null,
    meetings: [
      {
        component: component.toUpperCase(),
        section,
        location: location.length > 0 ? location : null,
        daysOfTheWeek: days,
        start: start.time,
        end: end.time,
        startDate: start.date,
        endDate,
      },
    ],
  };
};

// Keyed on code too since cross-listings share a crseId.
export const parseIcsCourseGroups = (events: readonly IcsEvent[]): IcsCourseGroup[] => {
  type Entry = {
    group: IcsCourseGroup;
    parents: FirestoreCourseMeeting[];
    children: FirestoreCourseMeeting[];
  };
  const byKey = new Map<string, Entry>();
  events.forEach(event => {
    const reading = readEvent(event);
    if (reading == null) return;
    const key = `${reading.roster}|${reading.crseId}|${reading.code}`;
    const entry = byKey.get(key) ?? { group: reading, parents: [], children: [] };
    byKey.set(key, entry);
    entry[reading.isChild ? 'children' : 'parents'].push(...reading.meetings);
  });
  return Array.from(byKey.values()).map(({ group, parents, children }) => ({
    roster: group.roster,
    crseId: group.crseId,
    code: group.code,
    meetings: [...parents, ...children],
  }));
};

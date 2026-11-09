import { ENROLLMENT_GROUPS, EnrollmentGroup, preEnrollDates } from './data/pre-enroll';

interface PreEnrollProfile {
  readonly gradYear: string;
  readonly gradSem: string;
  readonly entranceYear: string;
  readonly entranceSem: string;
  readonly grad?: string;
  readonly dismissedPreEnrollBanner?: Readonly<Record<string, boolean>>;
}

export interface PreEnrollWindow {
  termId: string;
  termLabel: string;
  group: EnrollmentGroup;
  timezone: string;
  start: Date;
  endExclusive: Date;
  daysRemaining: number;
  status: 'upcoming' | 'open' | 'ended';
}

/* Stages in days for when the banner will be displayed */
export const PRE_ENROLL_REMINDER_STAGES = ['14d', '7d', '3d', '1d', 'today'] as const;

export type PreEnrollReminderStage = typeof PRE_ENROLL_REMINDER_STAGES[number];

export interface PreEnrollReminder extends PreEnrollWindow {
  reminderStage: PreEnrollReminderStage;
  dismissalKey: string;
}

export function getPreEnrollDismissalKey(termId: string, stage: PreEnrollReminderStage): string {
  /* Regex to search for an error with the enrollment termId */
  if (!/^(SP|FA|SU|WI)\d{2}$/.test(termId)) {
    throw new Error('Invalid enrollment term');
  }

  if (!PRE_ENROLL_REMINDER_STAGES.includes(stage)) {
    throw new Error('Invalid enrollment reminder');
  }

  return `${termId}_${stage}`;
}

export function getPreEnrollReminderStage(
  enrollment: PreEnrollWindow
): PreEnrollReminderStage | null {
  if (enrollment.status === 'ended' || enrollment.daysRemaining > 14) {
    return null;
  }

  if (enrollment.status === 'open' || enrollment.daysRemaining === 0) return 'today';
  if (enrollment.daysRemaining === 1) return '1d';
  if (enrollment.daysRemaining <= 3) return '3d';
  if (enrollment.daysRemaining <= 7) return '7d';
  return '14d';
}

const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];

function termIndex(year: string, season: string): number | null {
  const seasonIndex = seasons.indexOf(season);

  if (!/^\d{4}$/.test(year) || seasonIndex === -1) {
    return null;
  }

  return Number(year) * 4 + seasonIndex;
}

export function getPreEnrollGroup(
  profile: PreEnrollProfile,
  termId: string
): EnrollmentGroup | null {
  const schedule = preEnrollDates[termId];

  // Graduate/professional programs need separate matching rules. (Ignore grad for now)
  if (!schedule || profile.grad) return null;

  const entrance = termIndex(profile.entranceYear, profile.entranceSem);
  const graduation = termIndex(profile.gradYear, profile.gradSem);
  const target = termIndex(String(schedule.year), schedule.season);

  if (
    entrance === null ||
    graduation === null ||
    target === null ||
    entrance > target ||
    graduation < target ||
    entrance >= graduation
  ) {
    return null;
  }

  // Example policy:
  // Spring/Summer 2028 graduates -> academic year 2028.
  // Fall 2027 graduates -> academic year 2028.
  const graduationAcademicYear = Number(profile.gradYear) + (profile.gradSem === 'Fall' ? 1 : 0);

  return (
    ENROLLMENT_GROUPS.find(
      group => schedule.windows[group].graduationAcademicYear === graduationAcademicYear
    ) ?? null
  );
}

// Use calendar dates in New York rather than elapsed 24-hour periods.
// This avoids daylight-saving changes affecting the countdown.
function calendarDay(date: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const value = (type: string): number => Number(parts.find(part => part.type === type)?.value);

  return Date.UTC(value('year'), value('month') - 1, value('day')) / 86400000;
}

export function getPreEnrollWindow(
  profile: PreEnrollProfile,
  termId: string,
  now: Date
): PreEnrollWindow | null {
  const schedule = preEnrollDates[termId];
  const group = getPreEnrollGroup(profile, termId);

  if (!schedule || !group) return null;

  const window = schedule.windows[group];
  const start = new Date(window.start);
  const endExclusive = new Date(window.endExclusive);
  let status: PreEnrollWindow['status'] = 'upcoming';

  if (now >= endExclusive) {
    status = 'ended';
  } else if (now >= start) {
    status = 'open';
  }

  return {
    termId,
    termLabel: schedule.label,
    group,
    timezone: schedule.timezone,
    start,
    endExclusive,
    daysRemaining: Math.max(
      0,
      calendarDay(start, schedule.timezone) - calendarDay(now, schedule.timezone)
    ),
    status,
  };
}

export function getPreEnrollBanner(profile: PreEnrollProfile, now: Date): PreEnrollReminder | null {
  const candidates: PreEnrollReminder[] = [];

  Object.entries(preEnrollDates).forEach(([termId, schedule]) => {
    if (!schedule || now < new Date(schedule.showFrom)) {
      return;
    }

    const enrollment = getPreEnrollWindow(profile, termId, now);
    if (!enrollment) return;

    const reminderStage = getPreEnrollReminderStage(enrollment);
    if (!reminderStage) return;

    // Legacy term-only dismissals do not suppress the new milestone reminders.
    const dismissalKey = getPreEnrollDismissalKey(termId, reminderStage);
    if (profile.dismissedPreEnrollBanner?.[dismissalKey]) return;

    candidates.push({ ...enrollment, reminderStage, dismissalKey });
  });

  return candidates.sort((a, b) => a.start.getTime() - b.start.getTime())[0] ?? null;
}

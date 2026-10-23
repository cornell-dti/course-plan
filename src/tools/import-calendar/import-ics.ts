import { isPlaceholderCourse } from '../../utilities';
import { parseIcsCourseGroups, parseIcsEvents } from './ics-parser';
import type { IcsCourseGroup } from './ics-parser';

export type IcsCourseLookup = {
  readonly byCrseId: (crseId: number) => readonly CornellCourseRosterCourse[];
  readonly rosterRank: (roster: string) => number;
};

export type ImportIcsResult =
  | { readonly status: 'invalid-file' }
  | { readonly status: 'wrong-season' }
  | {
      readonly status: 'ok';
      readonly matched: readonly {
        readonly course: CornellCourseRosterCourse;
        readonly schedule: FirestoreCourseSchedule;
      }[];
      readonly skipped: number;
      readonly notInCalendar: readonly FirestoreSemesterCourse[];
    };

const courseCodeOf = (course: CornellCourseRosterCourse): string =>
  `${course.subject} ${course.catalogNbr}`;

// Cross-listings share a crseId so match code too.
const matchCourse = (group: IcsCourseGroup, targetRoster: string, lookup: IcsCourseLookup) => {
  const sameCode = lookup.byCrseId(group.crseId).filter(c => courseCodeOf(c) === group.code);
  if (sameCode.length === 0) return null;
  return (
    sameCode.find(c => c.roster === targetRoster) ??
    sameCode.find(c => c.roster === group.roster) ??
    sameCode.reduce((a, b) => (lookup.rosterRank(b.roster) > lookup.rosterRank(a.roster) ? b : a))
  );
};

export const importIcsTextForSemester = (
  icsText: string,
  targetRoster: string,
  existingCourses: readonly (FirestoreSemesterCourse | FirestoreSemesterPlaceholder)[],
  lookup: IcsCourseLookup
): ImportIcsResult => {
  const { isCalendar, events } = parseIcsEvents(icsText);
  const groups = parseIcsCourseGroups(events);
  if (!isCalendar || groups.length === 0) return { status: 'invalid-file' };
  const seasonOf = (roster: string) => roster.slice(0, 2);
  if (groups.some(group => seasonOf(group.roster) !== seasonOf(targetRoster))) {
    return { status: 'wrong-season' };
  }

  const existing = existingCourses.filter(
    (course): course is FirestoreSemesterCourse => !isPlaceholderCourse(course)
  );
  const matched: { course: CornellCourseRosterCourse; schedule: FirestoreCourseSchedule }[] = [];
  const inCalendar: CornellCourseRosterCourse[] = [];
  let skipped = 0;

  groups.forEach(group => {
    const course = matchCourse(group, targetRoster, lookup);
    if (course != null) inCalendar.push(course);
    const isDuplicate =
      course != null &&
      (existing.some(c => c.code === courseCodeOf(course) || c.crseId === course.crseId) ||
        matched.some(entry => entry.course.crseId === course.crseId));
    if (course == null || isDuplicate) {
      skipped += 1;
      return;
    }
    // Dates are only valid in the file's own semester
    const datesApply = group.roster === targetRoster;
    const meetings = datesApply
      ? group.meetings
      : group.meetings
          .filter(meeting => meeting.startDate !== meeting.endDate)
          .map(meeting => ({ ...meeting, startDate: null, endDate: null }));
    matched.push({ course, schedule: { source: 'ics', roster: group.roster, meetings } });
  });

  const notInCalendar = existing.filter(
    c => !inCalendar.some(k => c.code === courseCodeOf(k) || c.crseId === k.crseId)
  );
  return {
    status: 'ok',
    matched,
    skipped,
    notInCalendar: inCalendar.length > 0 ? notInCalendar : [],
  };
};

export const importSummaryMessage = (
  result: Extract<ImportIcsResult, { status: 'ok' }>,
  season: FirestoreSemesterSeason,
  year: number,
  removed = 0
): string => {
  const count = result.matched.length;
  if (count === 0 && removed === 0) return `No new Cornell classes found for ${season} ${year}`;
  const classes = (n: number) => `${n} ${n === 1 ? 'class' : 'classes'}`;
  const replaced = removed > 0 ? `, replacing ${classes(removed)}` : '';
  const skipped = result.skipped > 0 ? ` (${result.skipped} skipped)` : '';
  return `Imported ${classes(count)} into ${season} ${year}${replaced}${skipped}`;
};

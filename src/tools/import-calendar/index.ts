import rosters from '../../assets/courses/rosters.json';
import { fullCoursesJson } from '../../assets/courses/typed-full-courses';
import { importIcsTextForSemester } from './import-ics';
import type { ImportIcsResult } from './import-ics';

export { importSummaryMessage } from './import-ics';

export const importIcsForSemester = (
  icsText: string,
  targetRoster: string,
  existingCourses: readonly (FirestoreSemesterCourse | FirestoreSemesterPlaceholder)[]
): ImportIcsResult =>
  importIcsTextForSemester(icsText, targetRoster, existingCourses, {
    byCrseId: crseId => fullCoursesJson[crseId] ?? [],
    rosterRank: roster => (rosters as readonly string[]).indexOf(roster),
  });

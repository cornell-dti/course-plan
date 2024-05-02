import json from './full-courses.json';
import { seasonAndYearToRosterIdentifier } from '../../user-data-converter';

const fullCoursesJsonWithStringKey = (json as unknown) as Readonly<
  Record<string, readonly CornellCourseRosterCourse[]>
>;

export type FullCourseJson = Readonly<Record<number, readonly CornellCourseRosterCourse[]>>;

/**
 * Mappings from courseId to a list of courses with that course id.
 *
 * ```js
 * {
 *   "1234": [cs2110, engrd2110],
 *   "5678": [cs1110]
 * }
 * ```
 */
export const fullCoursesJson: FullCourseJson = Object.fromEntries(
  Object.entries(fullCoursesJsonWithStringKey).map(([stringCourseID, courses]) => [
    parseInt(stringCourseID, 10),
    courses,
  ])
);

/**
 * A flattened list of all the courses.
 *
 * ```js
 * [cs1110, cs2110, engrd2110, cs3110, ...]
 * ```
 */
export const fullCoursesArray: readonly CornellCourseRosterCourse[] = Object.values(
  fullCoursesJsonWithStringKey
).flat();

export const specificRosterCoursesArrayWithSeasonAndYear = (
  season: FirestoreSemesterSeason,
  year: number
): readonly CornellCourseRosterCourse[] => {
  const currRoster = seasonAndYearToRosterIdentifier(season, year);
  return fullCoursesArray.filter(course => course.roster === currRoster);
};

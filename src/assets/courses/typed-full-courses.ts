import json from './full-courses.json';
import rosters from './rosters.json';
import rosterOfferings from './roster-offerings.json';

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

const rosterCoursesCache = new Map<string, readonly CornellCourseRosterCourse[]>();

export const specificRosterCoursesArray = (
  roster: string
): readonly CornellCourseRosterCourse[] => {
  const offeredIds = (rosterOfferings as Readonly<Record<string, readonly number[]>>)[roster];
  if (!rosters.includes(roster) || offeredIds == null) return fullCoursesArray;
  const cached = rosterCoursesCache.get(roster);
  if (cached) return cached;
  const offered = new Set(offeredIds);
  const courses = fullCoursesArray.filter(({ crseId }) => offered.has(crseId));
  rosterCoursesCache.set(roster, courses);
  return courses;
};

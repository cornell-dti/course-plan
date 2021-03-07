import json from './full-courses.json';

const fullCoursesJsonWithStringKey: Readonly<
  Record<string, readonly CornellCourseRosterCourse[]>
> = json;

export type FullCourseJson = Readonly<Record<number, readonly CornellCourseRosterCourse[]>>;

export const fullCoursesJson: FullCourseJson = Object.fromEntries(
  Object.entries(fullCoursesJsonWithStringKey).map(([stringCourseID, courses]) => [
    parseInt(stringCourseID, 10),
    courses,
  ])
);

export const fullCoursesArray: readonly CornellCourseRosterCourse[] = Object.values(
  fullCoursesJsonWithStringKey
).flat();

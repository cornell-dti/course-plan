import json from './full-courses.json';

const fullCoursesJsonWithStringKey: Readonly<
  Record<string, readonly CornellCourseRosterCourse[]>
> = json;

const fullCoursesJson: Readonly<
  Record<number, readonly CornellCourseRosterCourse[]>
> = Object.fromEntries(
  Object.entries(fullCoursesJsonWithStringKey).map(([stringCourseID, courses]) => [
    parseInt(stringCourseID, 10),
    courses,
  ])
);

export default fullCoursesJson;

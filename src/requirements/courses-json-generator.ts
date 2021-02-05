import { writeFileSync } from 'fs';
import filteredAllCourses from './filtered-all-courses';

export type CourseJson = {
  [courseCode: string]: {
    i: number; // course id
    t: string; // title
    r: string; // roster (aka semester)
  };
};

const courseJson: CourseJson = Object.fromEntries(
  Object.entries(filteredAllCourses)
    .map(([semester, courses]) =>
      courses.map(
        course =>
          [
            `${course.subject} ${course.catalogNbr}`,
            { i: course.crseId, t: course.titleLong, r: semester },
          ] as const
      )
    )
    .flat()
);

writeFileSync('src/assets/courses/courses.json', JSON.stringify(courseJson));

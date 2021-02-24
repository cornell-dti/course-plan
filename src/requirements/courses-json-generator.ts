import { writeFileSync } from 'fs';
import { courseCodeToDataAndOfferedMap } from './filtered-course-data';
import { Course } from './types';

export type CourseJson = {
  [courseCode: string]: {
    i: number; // course id
    t: string; // title
    r: string; // roster (aka semester)
  };
};

const courseJson: CourseJson = Object.fromEntries(
  Array.from(courseCodeToDataAndOfferedMap.values()).map(
    ([semester, course]) =>
      [
        `${course.subject} ${course.catalogNbr}`,
        { i: course.crseId, t: course.titleLong, r: semester },
      ] as const
  )
);

const fullCourseJson = (() => {
  const json: Record<number, Course & { roster: string }[]> = {};

  courseCodeToDataAndOfferedMap.forEach(([roster, course]) => {
    const existingArray = json[course.crseId] || [];
    existingArray.push({ ...course, roster });
    json[course.crseId] = existingArray;
  });

  return json;
})();

writeFileSync('src/assets/courses/courses.json', JSON.stringify(courseJson));
writeFileSync('src/assets/courses/full-courses.json', JSON.stringify(fullCourseJson));

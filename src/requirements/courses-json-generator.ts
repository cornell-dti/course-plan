import { writeFileSync } from 'fs';
import { courseCodeToDataAndOfferedMap } from './filtered-course-data';
import { Course } from './types';

const fullCourseJson = (() => {
  const json: Record<number, Course & { roster: string }[]> = {};

  courseCodeToDataAndOfferedMap.forEach(([roster, course]) => {
    const existingArray = json[course.crseId] || [];
    existingArray.push({ ...course, roster });
    json[course.crseId] = existingArray;
  });

  return json;
})();

writeFileSync('src/assets/courses/full-courses.json', JSON.stringify(fullCourseJson));

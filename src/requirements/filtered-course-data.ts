/** The module that recombined filter courses jsons and re-exposes with strict static types. */

import { readFileSync, readdirSync } from 'fs';
import { Course } from './types';

function abbreviatedSemesterTypeToOrder(type: string): number {
  switch (type) {
    case 'WI':
      return 0;
    case 'SP':
      return 1;
    case 'SU':
      return 2;
    case 'FA':
      return 3;
    default:
      return 4;
  }
}

export function orderAbbreviatedSemester(s1: string, s2: string): number {
  const y1 = parseInt(s1.slice(2), 10);
  const y2 = parseInt(s2.slice(2), 10);
  const c = y1 - y2;
  if (c !== 0) return c;
  return (
    abbreviatedSemesterTypeToOrder(s1.slice(0, 2)) - abbreviatedSemesterTypeToOrder(s2.slice(0, 2))
  );
}

/** Compares filteredCoursesPath1 and filteredCoursesPath2
 * based on the semester rosters in the paths.
 * filteredCoursesPath1, filteredCoursesPath2 follow the pattern
 * 'src/requirements/filtered-<roster>-courses.json'
 * where <roster> is i.e. 'FA14', 'SU20'.
 * <roster1> of filteredCoursesPath1 is compared to
 * <roster2> of filteredCoursesPath2
 */
function compareFilteredCoursesPaths(
  filteredCoursesPath1: string,
  filteredCoursesPath2: string
): number {
  // Extract just the roster part in the filteredCoursesPath
  const roster1 = filteredCoursesPath1.split('-')[1];
  const roster2 = filteredCoursesPath2.split('-')[1];
  return orderAbbreviatedSemester(roster1, roster2);
}

/** Returns filteredCoursesPaths sorted from least to most recent roster. */
function sortByLeastRecentRosters(filteredCoursesPaths: string[]): string[] {
  // Sorts from least recent roster
  return filteredCoursesPaths.sort(compareFilteredCoursesPaths);
}

/** All paths to the filtered-<semester name>-courses.json files. Sorted by least recent rosters */
const filteredCoursesPaths = sortByLeastRecentRosters(readdirSync('functions/filtered_courses/'));

/** All courses fetch from Cornell Class API, with only the fields we need.
 * First read and parse each JSON file using type cast trick.
 * Then reduce to one JSON object
 */

const filteredAllCourses: {
  readonly [semester: string]: readonly Course[];
} = filteredCoursesPaths
  .map(path => JSON.parse(readFileSync(`functions/filtered_courses/${path}`).toString()))
  .reduce((accum, currentValue) => Object.assign(accum, currentValue));

export default filteredAllCourses;

export const courseCodeToDataAndOfferedMap = new Map<string, readonly [string, Course]>();

Object.entries(filteredAllCourses).forEach(([semester, courses]) => {
  courses.forEach(course => {
    const courseCode = `${course.subject} ${course.catalogNbr}`;
    const existingOfferingAndData = courseCodeToDataAndOfferedMap.get(courseCode);
    if (existingOfferingAndData == null) {
      courseCodeToDataAndOfferedMap.set(courseCode, [semester, course]);
    } else {
      const [existingSemester] = existingOfferingAndData;
      if (orderAbbreviatedSemester(existingSemester, semester)) {
        // Use more recent data
        courseCodeToDataAndOfferedMap.set(courseCode, [semester, course]);
      }
    }
  });
});

export const coursesWithLastOfferingData: readonly Course[] = Array.from(
  courseCodeToDataAndOfferedMap.values()
).map(it => it[1]);

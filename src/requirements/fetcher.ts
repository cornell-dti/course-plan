// Disabled because we want to log progress.
/* eslint-disable no-await-in-loop */
// Disabled because we want the inefficiency to rate-limit ourselves.
/* eslint-disable no-console */
import fetch from 'node-fetch';
import { writeFileSync } from 'fs';
import { Course } from './types';

const PREFIX = 'https://classes.cornell.edu/api/2.0';

const wait = (time: number) => new Promise(resolve => setTimeout(() => resolve(), time));

const getSemesters = async (): Promise<readonly string[]> => {
  const response = await fetch(`${PREFIX}/config/rosters.json`);
  const json = await response.json();
  return json.data.rosters.map((it: { slug: string }) => it.slug);
};

const getSubjects = async (semester: string): Promise<readonly string[]> => {
  try {
    const response = await fetch(`${PREFIX}/config/subjects.json?roster=${semester}`);
    const json = await response.json();
    return json.data.subjects.map((it: { value: string }) => it.value);
  } catch {
    return [];
  }
};

type CourseFieldFilter<T extends keyof Course> = (course: Course) => Pick<Course, T>;

const getCourseFieldFilter = <T extends keyof Course>(allowedFields: T[]): CourseFieldFilter<T> => (
  course: Course
) => {
  const filteredCourseObject: any = {};
  Object.entries(course).forEach(([field, value]) => {
    if (allowedFields.includes(field as T)) {
      filteredCourseObject[field] = value;
    }
  });
  return filteredCourseObject;
};

const getCoursesInSemesterAndSubject = async <T extends keyof Course>(
  semester: string,
  subject: string,
  courseFieldFilter: CourseFieldFilter<T>
): Promise<readonly Pick<Course, T>[]> => {
  try {
    const response = await fetch(
      `${PREFIX}/search/classes.json?roster=${semester}&subject=${subject}`
    );
    const json = await response.json();
    return json.data.classes.map(courseFieldFilter);
  } catch {
    return [];
  }
};

const getAllCoursesInSemester = async <T extends keyof Course>(
  semester: string,
  courseFieldFilter: CourseFieldFilter<T>,
  coolingTimeMs: number = 50,
  doPrintDebuggingInfo: boolean = false
): Promise<readonly Pick<Course, T>[]> => {
  const courses: Pick<Course, T>[] = [];
  const subjects = await getSubjects(semester);
  if (doPrintDebuggingInfo) {
    console.log(`We have ${subjects.length} subjects in ${semester} total.`);
  }
  let subjectCount = 0;
  for (const subject of subjects) {
    const semesterCourses = await getCoursesInSemesterAndSubject(
      semester,
      subject,
      courseFieldFilter
    );
    courses.push(...semesterCourses);
    await wait(coolingTimeMs);
    subjectCount += 1;
    if (doPrintDebuggingInfo) {
      console.log(`There're ${semesterCourses.length} courses in ${subject} in ${semester}.`);
      console.log(`We fetched ${subjectCount} out of ${subjects.length} subjects in ${semester}.`);
    }
  }
  return courses;
};

type AllCourses<T extends keyof Course> = { [semester: string]: readonly Pick<Course, T>[] };

const getAllCourses = async <T extends keyof Course>(
  courseFieldFilter: CourseFieldFilter<T>,
  coolingTimeMs: number = 50,
  doPrintDebuggingInfo: boolean = true
): Promise<AllCourses<T>> => {
  const startTime = new Date().getTime();
  const courses: AllCourses<T> = {};
  const semesters = await getSemesters();
  if (doPrintDebuggingInfo) {
    console.log(`We have ${semesters.length} semesters in total.`);
  }
  let semesterCount = 0;
  for (const semester of semesters) {
    const semesterCourses = await getAllCoursesInSemester(
      semester,
      courseFieldFilter,
      coolingTimeMs,
      doPrintDebuggingInfo
    );
    courses[semester] = semesterCourses;
    semesterCount += 1;
    if (doPrintDebuggingInfo) {
      console.log(`We fetched ${semesterCount} out of ${semesters.length} semesters.`);
    }
  }
  if (doPrintDebuggingInfo) {
    console.log(`Total Running Time: ${new Date().getTime() - startTime}ms.`);
  }
  return courses;
};

const courseFieldFilter = getCourseFieldFilter([
  'subject',
  'crseId',
  'catalogNbr',
  'titleLong',
  'description',
  'catalogBreadth',
  'catalogDistr',
  'catalogAttribute',
  'catalogComments',
  'catalogSatisfiesReq',
  'acadCareer',
  'acadGroup'
]);

getAllCourses(courseFieldFilter).then(allCourses => {
  writeFileSync('src/requirements/filtered-all-courses.json', JSON.stringify(allCourses));
  writeFileSync('functions/filtered-all-courses.json', JSON.stringify(allCourses));
});

// Disabled because we want to log progress.
/* eslint-disable no-await-in-loop */
// Disabled because we want the inefficiency to rate-limit ourselves.
/* eslint-disable no-console */
import fetch from 'node-fetch';
import { writeFileSync } from 'fs';
import { Course } from './types';

const PREFIX = 'https://classes.cornell.edu/api/2.0';

const wait = (time: number) => new Promise<void>(resolve => setTimeout(() => resolve(), time));

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
  // Too dynamic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  coolingTimeMs = 50,
  doPrintDebuggingInfo = false
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

const generateSemesterJSONs = async <T extends keyof Course>(
  courseFieldFilter: CourseFieldFilter<T>,
  coolingTimeMs = 50,
  doPrintDebuggingInfo = true
): Promise<void> => {
  const startTime = new Date().getTime();
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
    const courses: AllCourses<T> = {};
    courses[semester] = semesterCourses;
    const fileFunctionsSrc = `functions/filtered_courses/filtered-${semester}-courses.json`;
    writeFileSync(fileFunctionsSrc, JSON.stringify(courses));
    semesterCount += 1;
    if (doPrintDebuggingInfo) {
      console.log(`We fetched ${semesterCount} out of ${semesters.length} semesters.`);
    }
  }
  if (doPrintDebuggingInfo) {
    console.log(`Total Running Time: ${new Date().getTime() - startTime}ms.`);
  }
};

const courseFieldFilter = getCourseFieldFilter([
  'subject',
  'crseId',
  'catalogNbr',
  'titleLong',
  'description',
  'enrollGroups',
  'catalogWhenOffered',
  'catalogPrereqCoreq',
  'catalogBreadth',
  'catalogDistr',
  'catalogAttribute',
  'catalogComments',
  'catalogSatisfiesReq',
  'acadCareer',
  'acadGroup',
]);

generateSemesterJSONs(courseFieldFilter).then(() => {
  console.log('All semester JSONs generated.');
});

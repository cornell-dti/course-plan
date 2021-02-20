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

const courseFieldFilter = ({
  subject,
  crseId,
  catalogNbr,
  titleLong,
  description,
  enrollGroups,
  catalogWhenOffered,
  catalogPrereqCoreq,
  catalogBreadth,
  catalogDistr,
  catalogAttribute,
  catalogComments,
  catalogSatisfiesReq,
  catalogCourseSubfield,
  acadCareer,
  acadGroup,
}: Course): Course => ({
  subject,
  crseId,
  catalogNbr,
  titleLong,
  description,
  enrollGroups: enrollGroups.map(({ unitsMaximum, unitsMinimum, classSections }) => ({
    unitsMaximum,
    unitsMinimum,
    classSections: classSections.map(({ ssrComponent, meetings }) => ({
      ssrComponent,
      meetings: meetings.map(({ pattern, timeStart, timeEnd, instructors }) => ({
        pattern,
        timeStart,
        timeEnd,
        instructors: instructors.map(({ netid, firstName, lastName }) => ({
          netid,
          firstName,
          lastName,
        })),
      })),
    })),
  })),
  catalogWhenOffered: catalogWhenOffered || undefined,
  catalogPrereqCoreq: catalogPrereqCoreq || undefined,
  catalogBreadth: catalogBreadth || undefined,
  catalogDistr: catalogDistr || undefined,
  catalogAttribute,
  catalogComments: catalogComments || undefined,
  catalogSatisfiesReq: catalogSatisfiesReq || undefined,
  catalogCourseSubfield: catalogCourseSubfield || undefined,
  acadCareer,
  acadGroup,
});

const getCoursesInSemesterAndSubject = async <T extends keyof Course>(
  semester: string,
  subject: string
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

const getAllCoursesInSemester = async (
  semester: string,
  coolingTimeMs = 50,
  doPrintDebuggingInfo = false
): Promise<readonly Course[]> => {
  const courses: Course[] = [];
  const subjects = await getSubjects(semester);
  if (doPrintDebuggingInfo) {
    console.log(`We have ${subjects.length} subjects in ${semester} total.`);
  }
  let subjectCount = 0;
  for (const subject of subjects) {
    const semesterCourses = await getCoursesInSemesterAndSubject(semester, subject);
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

type AllCourses = { [semester: string]: readonly Course[] };

const generateSemesterJSONs = async (
  coolingTimeMs = 50,
  doPrintDebuggingInfo = true
): Promise<void> => {
  const startTime = new Date().getTime();
  const semesters = await getSemesters();
  writeFileSync('src/assets/courses/rosters.json', JSON.stringify(semesters));
  if (doPrintDebuggingInfo) {
    console.log(`We have ${semesters.length} semesters in total.`);
  }
  let semesterCount = 0;
  for (const semester of semesters) {
    const semesterCourses = await getAllCoursesInSemester(
      semester,
      coolingTimeMs,
      doPrintDebuggingInfo
    );
    const courses: AllCourses = {};
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

generateSemesterJSONs().then(() => {
  console.log('All semester JSONs generated.');
});

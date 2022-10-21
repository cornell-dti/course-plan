// Disabled because we want to log progress.
/* eslint-disable no-await-in-loop */
// Disabled because we want the inefficiency to rate-limit ourselves.
/* eslint-disable no-console */
import fetch from 'node-fetch';
import { writeFileSync } from 'fs';
import { Course } from './types';

const PREFIX = 'https://classes.cornell.edu/api/2.0';

/** A helper function to generate a wait promise. Used for cooldown to limit API usage. */
const wait = (time: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), time);
  });

/** @returns a list of available semesters from roster. */
const getSemesters = async (): Promise<readonly string[]> => {
  const response = await fetch(`${PREFIX}/config/rosters.json`);
  const json = await response.json();
  return json.data.rosters.map((it: { slug: string }) => it.slug);
};

/** @returns a list of available subjects available in given semester. */
const getSubjects = async (semester: string): Promise<readonly string[]> => {
  try {
    const response = await fetch(`${PREFIX}/config/subjects.json?roster=${semester}`);
    const json = await response.json();
    return json.data.subjects.map((it: { value: string }) => it.value);
  } catch {
    return [];
  }
};

const cleanString = (value: string | null | undefined) =>
  value?.replace(/\u00a0/g, ' ') || undefined;

/** Throws away course object fields we don't need. Used for generate small-enough course json. */
const courseFieldFilter = ({
  subject,
  crseId,
  catalogNbr,
  titleLong,
  enrollGroups,
  catalogWhenOffered,
  catalogBreadth,
  catalogDistr,
  catalogComments,
  catalogSatisfiesReq,
  catalogCourseSubfield,
  catalogAttribute,
  acadCareer,
  acadGroup,
}: Course): Course => ({
  subject: cleanString(subject) || '',
  crseId,
  catalogNbr: cleanString(catalogNbr) || '',
  titleLong: cleanString(titleLong) || '',
  enrollGroups: enrollGroups.map(({ unitsMaximum, unitsMinimum }) => ({
    unitsMaximum,
    unitsMinimum,
  })),
  catalogWhenOffered: cleanString(catalogWhenOffered),
  catalogBreadth: cleanString(catalogBreadth),
  catalogDistr: cleanString(catalogDistr),
  catalogComments: cleanString(catalogComments),
  catalogSatisfiesReq: cleanString(catalogSatisfiesReq),
  catalogCourseSubfield: cleanString(catalogCourseSubfield),
  catalogAttribute: cleanString(catalogAttribute),
  acadCareer: cleanString(acadCareer) || '',
  acadGroup: cleanString(acadGroup) || '',
});

/** @returns a list of all course objects in a semester for a given subject. */
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

/** Combined APIs above, get all courses available within a semester. */
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

/** Compare function for semesters. */
const orderAbbreviatedSemester = (s1: string, s2: string): number => {
  const y1 = parseInt(s1.slice(2), 10);
  const y2 = parseInt(s2.slice(2), 10);
  const c = y1 - y2;
  if (c !== 0) return c;

  const abbreviatedSemesterTypeToOrder = (type: string): number => {
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
  };

  return (
    abbreviatedSemesterTypeToOrder(s1.slice(0, 2)) - abbreviatedSemesterTypeToOrder(s2.slice(0, 2))
  );
};

type AllCourses = { [semester: string]: readonly Course[] };

/** @returns a mapping from semester to all courses in that semester. */
const generateSemesterJSONs = async (
  coolingTimeMs = 50,
  doPrintDebuggingInfo = true
): Promise<AllCourses> => {
  const startTime = new Date().getTime();
  // Filter away all semester data before 2017
  const semesters = (await getSemesters()).filter(
    semester => parseInt(semester.substring(2), 10) >= 17
  );
  writeFileSync('src/assets/courses/rosters.json', `${JSON.stringify(semesters)}\n`);
  if (doPrintDebuggingInfo) {
    console.log(`We have ${semesters.length} semesters in total.`);
  }
  let semesterCount = 0;
  const courses: AllCourses = {};
  for (const semester of semesters) {
    const semesterCourses = await getAllCoursesInSemester(
      semester,
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

/** Mapping from course code -> [semester, course object]. */
type CourseCodeToDataAndOfferedMap = Map<string, readonly [string, Course]>;

/**
 * We only want a course with the last offering data.
 * This function builds a map from course code to [semester id, course object].
 * The map only contains [semester id, course object] from the latest offering.
 *
 * e.g.
 * ```js
 * { "CS 2112": ["FA20", cs2112Data], "CS 2800": ["SP21", cs2800Data], ... }
 * ```
 */
const getCoursesWithLastOfferingData = (
  filteredAllCourses: AllCourses
): CourseCodeToDataAndOfferedMap => {
  const courseCodeToDataAndOfferedMap = new Map<string, readonly [string, Course]>();

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

  return courseCodeToDataAndOfferedMap;
};

/**
 * @returns A map from crseId to [all courses with that ID].
 * e.g.
 * ```js
 * { 123: [{crseId:123, code: 'CS 4242'}, {crseId:123, code: 'CS 6666'}], ... }
 * ```
 */
const getFullCourseJson = (courseCodeToDataAndOfferedMap: CourseCodeToDataAndOfferedMap) => {
  const json: Record<number, (Course & { roster: string })[]> = {};

  courseCodeToDataAndOfferedMap.forEach(([roster, course]) => {
    const existingArray: (Course & { roster: string })[] = json[course.crseId] || [];
    existingArray.push({ ...course, roster });
    json[course.crseId] = existingArray.sort((a, b) =>
      `${a.subject} ${a.catalogNbr}`.localeCompare(`${b.subject} ${b.catalogNbr}`)
    );
  });

  return Object.fromEntries(Object.entries(json).sort(([a], [b]) => a.localeCompare(b)));
};

generateSemesterJSONs()
  .then(getCoursesWithLastOfferingData)
  .then(courseCodeToDataAndOfferedMap => {
    // Generate a single source of truth for all courses.
    // The typed version is provided at src/assets/courses/typed-full-courses.ts
    writeFileSync(
      'src/assets/courses/full-courses.json',
      JSON.stringify(getFullCourseJson(courseCodeToDataAndOfferedMap), undefined, 2)
    );

    console.log('All course JSONs generated.');
  });

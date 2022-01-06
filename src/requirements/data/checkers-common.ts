import { Course, RequirementChecker } from '../types';
import { SPECIAL_COURSES, FWS_COURSE_ID } from './constants';

// course codes representing foreign languages from: https://lrc.cornell.edu/languages-cornell
// codes are commented out if they cannot count for the A&S language requirement
const FLcourses: readonly string[] = [
  // 'AKKAD',
  'ARAB',
  'ASL',
  'BCS',
  'BENGL',
  'BURM',
  'CHIN',
  'CZECH',
  'DUTCH',
  'FINN',
  'FREN',
  'GERST',
  'GREEK',
  'HEBRW',
  'HINDI',
  'HUNGR',
  'INDO',
  'ITAL',
  'JAPAN',
  // 'KANAD',
  'KHMER',
  'KOREA',
  'LATIN',
  'NEPAL',
  // 'PALI',
  'PERSN',
  'POLSH',
  'PORT',
  'PUNJB',
  'RUSSA',
  'SANSK',
  'SINHA',
  'SPAN',
  'SWAHL',
  'SWED',
  'TAG',
  'TAMIL',
  'THAI',
  'TIBET',
  'TURK',
  'UKRAN',
  'URDU',
  'VIET',
  'WOLOF',
  'YORUB',
  'ZULU',
];

/**
 * @param courseName name of the course (as a code)
 * @param code code to check courseName (can contain * to denote any value)
 * @returns if a code matches the course name (CS 2110 and CS 2*** returns true, AEM 3110 and AEM 32** returns false)
 */
export const ifCodeMatch = (courseName: string, code: string): boolean => {
  for (let i = 0; i < courseName.length; i += 1) {
    if (code[i] !== '*' && courseName[i] !== code[i]) return false;
  }
  return true;
};

/**
 * @param course course object with useful information retrived from Cornell courses API.
 * @param code code to check courseName (can contain * to denote any value)
 * @see ifCodeMatch
 * @returns if a code matches the course.
 */
export const courseMatchesCode = (course: Course, code: string): boolean =>
  ifCodeMatch(`${course.subject} ${course.catalogNbr}`, code);

/**
 * @param course course object with useful information retrived from Cornell courses API.
 * @param codeOptions a list of all satisfiable course code options.
 * @see courseMatchesCode
 * @returns if any code in `codeOptions` matches the course.
 */
export const courseMatchesCodeOptions = (course: Course, codeOptions: readonly string[]): boolean =>
  codeOptions.some(code => ifCodeMatch(`${course.subject} ${course.catalogNbr}`, code));

/**
 * Almost all colleges have FWS requirements. Instead of writing them from scratch each time, call this
 * function.
 *
 * @param course course object with useful information retrived from Cornell courses API.
 * @returns if the course satisfies FWS requirement.
 */
export const courseIsFWS = (course: Course): boolean =>
  course.crseId === FWS_COURSE_ID ||
  course.titleLong.includes('FWS:') ||
  (course.catalogSatisfiesReq?.includes('First-Year Writing Seminar') ?? false);

/**
 * Call this function to check if a course meets a foreign language requirement, since the 'FL'
 * category is missing from course data
 *
 * @param course course object with useful information retrived from Cornell courses API.
 * @returns if the course could potentially be a foreign language course
 */
export const courseIsForeignLang = (course: Course): boolean =>
  FLcourses.some(language => course.subject?.includes(language) ?? false);

/**
 * This function checks whether a course's maximum number of credits reaches a specified minimum
 *
 * @param course course object with useful information retrived from Cornell courses API.
 * @param minCredits number of credits to check if this course can fulfill
 * @returns if course can possibly be taken with credits equal to or greater than minCredits
 */
export const courseMeetsCreditMinimum = (course: Course, minCredits: number): boolean => {
  for (let i = 0; i < course.enrollGroups.length; i += 1) {
    if (course.enrollGroups[i].unitsMaximum >= minCredits) {
      return true;
    }
  }

  return false;
};

/**
 * This function checks whether a course has a catalogAttribute of attribute
 *
 * @param course course object with useful information retrived from Cornell courses API.
 * @param attribute attribute the course object might have
 * @returns if course has attribute in field catalogAttribute
 */
export const courseHasAttribute = (course: Course, attribute: string): boolean =>
  course.catalogAttribute?.includes(attribute) ?? false;

/**
 * This function returns a checker that checks whether a course satisfy a single requirement by
 * checking whether the course code appears in the includes array.
 *
 * Usage:
 * ```typescript
 * const checker = includesWithSingleRequirement('CS 211*', 'CS 280*');
 *
 * checker({ code: 'CS 2110' }) // returns true
 * checker({ code: 'CS 2112' }) // returns true
 * checker({ code: 'CS 2800' }) // returns true
 * checker({ code: 'CS 2802' }) // returns true
 * checker({ code: 'CS 3110' }) // returns false
 * ```
 *
 * The above example is equivalent to the old includes field like:
 * ```json
 * {
 *   "includes": [ ["CS 211*", "CS 280*"] ]
 * }
 * ```
 *
 * @param includes a list of course code pattern to check against.
 * @returns a list with a single checker that checks whether this single sub-requirement can be
 * fulfilled by courses.
 */
export const includesWithSingleRequirement = (
  ...includes: readonly string[]
): readonly RequirementChecker[] => [
  (course: Course): boolean => courseMatchesCodeOptions(course, includes),
];

/**
 * This function returns an array of checkers.
 * Each checker in the array checks whether a course can satisfy a sub-requirement with in a bigger
 * requirement by checking whether the course code appears in the includes array.
 *
 * Usage:
 * ```typescript
 * const checkers = includesWithSubRequirements(['CS 211*'], ['CS 280*']);
 *
 * checkers[0]({ code: 'CS 2110' }) // returns true
 * checkers[0]({ code: 'CS 2112' }) // returns true
 * checkers[1]({ code: 'CS 2800' }) // returns true
 * checkers[1]({ code: 'CS 2802' }) // returns true
 * checkers[0]({ code: 'CS 2800' }) // returns false
 * checkers[1]({ code: 'CS 2110' }) // returns false
 * checkers[0]({ code: 'CS 3110' }) // returns false
 * checkers[1]({ code: 'CS 3110' }) // returns false
 * ```
 *
 * The above example is equivalent to the old includes field like:
 * ```json
 * {
 *   "includes": [ ["CS 211*"], ["CS 280*"] ]
 * }
 * ```
 *
 * @param includes a list of array of course code pattern to check against.
 * @returns an array of checkers that can be directly assigned to requirement object.
 */
export const includesWithSubRequirements = (
  ...includes: readonly string[][]
): readonly ((course: Course) => boolean)[] =>
  includes.map(subRequirementInclude => (course: Course) =>
    courseMatchesCodeOptions(course, subRequirementInclude)
  );

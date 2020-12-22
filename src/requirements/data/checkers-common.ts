import { Course } from '../types';
import { CREDITS_COURSE_ID, FWS_COURSE_ID } from './constants';

/**
 * @param courseName name of the course (as a code)
 * @param code code to check courseName (can contain * to denote any value)
 * @returns if a code matches the course name (CS 2110 and CS 2*** returns true, AEM 3110 and AEM 32** returns false)
 */
export function ifCodeMatch(courseName: string, code: string): boolean {
  for (let i = 0; i < courseName.length; i += 1) {
    if (code[i] !== '*' && courseName[i] !== code[i]) return false;
  }
  return true;
}

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
 * @param course course object with useful information retrived from Cornell courses API.
 * @returns true if the course is AP/IB equivalent course or credit
 */
export const courseIsAPIB = (course: Course): boolean =>
  [CREDITS_COURSE_ID, FWS_COURSE_ID].includes(course.crseId) ||
  ['AP', 'IB', 'CREDITS'].includes(course.subject);

/**
 * Almost colleges have FWS requirements. Instead of writing them from scratch each time, call this
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
 * Used for total academic credit requirements for all colleges except EN and AR
 * @param course course object with useful information retrived from Cornell courses API.
 * @returns true if the course is not PE or 10** level
 */
export const courseIsAllEligible = (course: Course): boolean =>
  course.crseId === CREDITS_COURSE_ID ||
  (!courseIsAPIB(course) &&
    !ifCodeMatch(course.subject, 'PE') &&
    !ifCodeMatch(course.catalogNbr, '10**'));

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
 * @returns a checker that can be directly assigned to requirement object.
 */
export const includesWithSingleRequirement = (...includes: readonly string[]) => (
  course: Course
): boolean => courseMatchesCodeOptions(course, includes);

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

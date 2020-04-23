import { Course } from '../types';
/**
 * @param courseName name of the course (as a code)
 * @param code code to check courseName (can contain * to denote any value)
 * @returns if a code matches the course name (CS 2110 and CS 2*** returns true, AEM 3110 and AEM 32** returns false)
 */
export declare function ifCodeMatch(courseName: string, code: string): boolean;
/**
 * @param course course object with useful information retrived from Cornell courses API.
 * @param code code to check courseName (can contain * to denote any value)
 * @see ifCodeMatch
 * @returns if a code matches the course.
 */
export declare const courseMatchesCode: (course: Course, code: string) => boolean;
/**
 * @param course course object with useful information retrived from Cornell courses API.
 * @param codeOptions a list of all satisfiable course code options.
 * @see courseMatchesCode
 * @returns if any code in `codeOptions` matches the course.
 */
export declare const courseMatchesCodeOptions: (course: Course, codeOptions: readonly string[]) => boolean;
/**
 * Almost colleges have FWS requirements. Instead of writing them from scratch each time, call this
 * function.
 *
 * @param course course object with useful information retrived from Cornell courses API.
 * @returns if the course satisfies FWS requirement.
 */
export declare const courseIsFWS: (course: Course) => boolean;
export declare const includesWithSingleRequirement: (...includes: readonly string[]) => (course: Course) => boolean;
export declare const includesWithSubRequirements: (...includes: readonly string[][]) => readonly ((course: Course) => boolean)[];

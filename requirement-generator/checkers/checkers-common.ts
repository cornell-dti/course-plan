import { Course } from '../types';

/**
 * @param courseName : name of the course (as a code)
 * @param code : code to check courseName (can contain * to denote any value)
 * @returns if a code matches the course name (CS 2110 and CS 2*** returns true, AEM 3110 and AEM 32** returns false)
 */
export function ifCodeMatch(courseName: string, code: string): boolean {
  for (let i = 0; i < courseName.length; i += 1) {
    if (code[i] !== '*' && courseName[i] !== code[i]) return false;
  }
  return true;
}

export const courseMatchesCode = (course: Course, code: string): boolean => (
  ifCodeMatch(`${course.subject} ${course.catalogNbr}`, code)
);

export const courseMatchesCodeOptions = (course: Course, codeOptions: readonly string[]): boolean => (
  codeOptions.some(code => ifCodeMatch(`${course.subject} ${course.catalogNbr}`, code))
);

export const courseIsFWS = (course: Course): boolean => (
  course.titleLong.includes('FWS:')
  || (course.catalogSatisfiesReq?.includes('First-Year Writing Seminar') ?? false)
);

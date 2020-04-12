/**
 * The module that re-exposes all jsons with strict static types.
 */

import { readFileSync } from 'fs';
import { Course } from './types';

// NOTE:
//   We need to use the type cast trick here,
//   because TypeScript has limited capability to correctly infer types of deeply nested json with enums.

/** All courses fetch from Cornell Class API, with only the fields we need. */
const filteredAllCourses: { readonly [semester: string]: readonly Course[] } = JSON.parse(
  // Need to read from file. It will take TS forever to type checker this giant json.
  readFileSync('src/requirements/filtered-all-courses.json').toString()
);

export default filteredAllCourses;

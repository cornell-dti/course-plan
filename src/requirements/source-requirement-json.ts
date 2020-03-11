/**
 * The module that re-exposes all jsons with strict static types.
 */

import { readFileSync } from 'fs';
import { Course, RequirementsJson } from './types';
import sourceRequirementJson from './reqs.json';

// NOTE:
//   We need to use the type cast trick here,
//   because TypeScript has limited capability to correctly infer types of deeply nested json with enums.

/** All courses fetch from Cornell Class API, with only the fields we need. */
export const filteredAllCourses: { readonly [semester: string]: readonly Course[] } = JSON.parse(
  // Need to read from file. It will take TS forever to type checker this giant json.
  readFileSync('src/requirements/filtered-all-courses.json').toString()
);

/** The requirement json that guides our algorithm to decide whether a class satisfies a requirement. */
export const sourceRequirements = (sourceRequirementJson as unknown) as RequirementsJson;

/**
 * The module that re-exposes the generated jsons with strict static types.
 */

import { readFileSync } from 'fs';
import { Course, RequirementsJson } from './types';

/** All courses fetch from Cornell Class API, with only the fields we need. */
export const filteredAllCourses: { readonly [semester: string]: readonly Course[] } = JSON.parse(
  readFileSync('requirement-generator/filtered-all-courses.json').toString()
);

/** The requirement json that guides our algorithm to decide whether a class satisfies a requirement. */
export const requirementJson: RequirementsJson = JSON.parse(
  readFileSync('src/requirements/reqs.json').toString()
);

/**
 * The module that re-exposes all jsons with strict static types.
 */

import { readFileSync, readdirSync } from 'fs';
import { Course } from './types';


/** All paths to the filtered-<semester name>-courses.json files. */
const filteredCoursesPaths: string[] = readdirSync('src/requirements/').filter(
  path => path.includes('filtered') && path.includes('courses.json')
);

// NOTE:
//   We need to use the type cast trick here,
//   because TypeScript has limited capability to correctly infer types of deeply nested json with enums.

/** All courses fetch from Cornell Class API, with only the fields we need. */
const filteredAllCourses: { readonly [semester: string]: readonly Course[] } =
  // Read and parse each JSON file using type cast trick.
  // Reduce to one JSON object
  filteredCoursesPaths.map(path => JSON.parse(readFileSync('src/requirements/' + path).toString()))
                      .reduce((accum, currentValue) => Object.assign(accum, currentValue));


export default filteredAllCourses;

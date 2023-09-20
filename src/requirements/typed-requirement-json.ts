/**
 * The module that re-exposes all jsons with strict static types.
 */

import { DecoratedRequirementsJson } from './types';
import decoratedRequirementJson from './decorated-requirements.json';

// NOTE:
// 1. We need to use the type cast trick here,
//    because TypeScript has limited capability to correctly infer types of deeply nested json with enums.
// 2. We do not put all json in one ts file for the following two reasons:
//    - Requirement generation runs on node, requirement checking runs in browser.
//      They have different import mechanisms. It's better to separate them.
//    - To help webpack to avoid bundling the giant `filtered-all-courses.json`.

/** The generated requirement json that contains all pre-computed courses that satisfy each requirement. */
export default decoratedRequirementJson as unknown as DecoratedRequirementsJson;

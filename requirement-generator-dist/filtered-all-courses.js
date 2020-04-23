"use strict";
/**
 * The module that re-exposes all jsons with strict static types.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
// NOTE:
//   We need to use the type cast trick here,
//   because TypeScript has limited capability to correctly infer types of deeply nested json with enums.
/** All courses fetch from Cornell Class API, with only the fields we need. */
const filteredAllCourses = JSON.parse(
// Need to read from file. It will take TS forever to type checker this giant json.
fs_1.readFileSync('src/requirements/filtered-all-courses.json').toString());
exports.default = filteredAllCourses;

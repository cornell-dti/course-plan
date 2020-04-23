"use strict";
/**
 * The module that re-exposes all jsons with strict static types.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const reqs_json_1 = __importDefault(require("./reqs.json"));
// NOTE:
//   We need to use the type cast trick here,
//   because TypeScript has limited capability to correctly infer types of deeply nested json with enums.
/** All courses fetch from Cornell Class API, with only the fields we need. */
exports.filteredAllCourses = JSON.parse(
// Need to read from file. It will take TS forever to type checker this giant json.
fs_1.readFileSync('src/requirements/filtered-all-courses.json').toString());
/** The requirement json that guides our algorithm to decide whether a class satisfies a requirement. */
exports.sourceRequirements = reqs_json_1.default;

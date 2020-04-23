"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const historyPre1800Classes = (course) => (
// REQ_TODO: investigate whether course data has this field (catalogCourseSubfield)
// @ts-ignore
course.catalogCourseSubfield && course.catalogCourseSubfield.includes('HPE'));
exports.default = { historyPre1800Classes };

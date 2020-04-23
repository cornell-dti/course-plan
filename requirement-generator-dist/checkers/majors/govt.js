"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const governmentIntroductoryGovernmentCourses = (course) => checkers_common_1.courseMatchesCodeOptions(course, [
    'GOVT 1111',
    'GOVT 1313',
    'GOVT 1615',
    'GOVT 1616',
    'GOVT 1817',
    'GOVT 1827'
]);
const governmentCourseWork = (course) => checkers_common_1.courseMatchesCode(course, 'GOVT 2***');
const governmentTenthGovernmentCourse = (course) => checkers_common_1.courseMatchesCode(course, 'GOVT ****');
exports.default = {
    governmentIntroductoryGovernmentCourses,
    governmentCourseWork,
    governmentTenthGovernmentCourse
};

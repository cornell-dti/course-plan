"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const economicsAdmissionToTheMajor = [
    (course) => checkers_common_1.courseMatchesCode(course, 'ECON 1110'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ECON 1120'),
    (course) => checkers_common_1.courseMatchesCode(course, 'MATH 1110')
];
const economicsCoreEconomics = [
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ECON 3030']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ECON 3040']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ECON 3110', 'ECON 3130']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ECON 3120', 'ECON 3140'])
];
const economics4000LevelCourses = (course) => checkers_common_1.courseMatchesCode(course, 'ECON 4***');
const econimicsBasicRequirements = (course) => checkers_common_1.courseMatchesCodeOptions(course, [
    'ECON 1110',
    'ECON 1120',
    'ECON 3***',
    'ECON 4***'
]);
exports.default = {
    economicsAdmissionToTheMajor,
    economicsCoreEconomics,
    economics4000LevelCourses,
    econimicsBasicRequirements
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const mechanicalEngineeringEngineeringDistribution = (course) => (checkers_common_1.courseMatchesCode(course, 'ENGRD 2020'));
const mechanicalEngineeringRequiredMajorCourses = [
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MAE 2210']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MAE 2030']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MAE 2250']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MAE 3230']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MAE 3240']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MAE 3260']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MAE 3270']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MAE 3780', 'ENGRD 2100', 'PHYS 3360']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MAE 4272']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MAE 4300'])
];
const mechanicalEngineeringMathematicsElective = (course) => checkers_common_1.courseMatchesCodeOptions(course, [
    'MAE 3100',
    'ENGRD 2700',
    'CEE 3040',
    'ENGRD 3200',
    'ENGRD 3100',
    'BTRY 3010',
    'CS 2800'
]);
exports.default = {
    mechanicalEngineeringEngineeringDistribution,
    mechanicalEngineeringRequiredMajorCourses,
    mechanicalEngineeringMathematicsElective
};

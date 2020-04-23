"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const isstProbabilityStatisticsAndOptimization = [
    (course) => checkers_common_1.courseMatchesCode(course, 'ORIE 3300'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ORIE 3500')
];
const isstInformationSystems = [
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['INFO 2300']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ORIE 3800']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['INFO 3300', 'INFO 4300'])
];
const isstEconomicOrganizationAndSocialContext = [
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['INFO 2040']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['INFO 2450', 'ENGRC 3350'])
];
const isstEngineeringMathematics = [
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MATH 1910']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MATH 1920']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MATH 2940']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MATH 2930', 'MATH 3040', 'CS 2800'])
];
const isstEngineeringDistributions = [
    (course) => checkers_common_1.courseMatchesCode(course, 'ENGRD 2110'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ENGRD 2700')
];
exports.default = {
    isstProbabilityStatisticsAndOptimization,
    isstInformationSystems,
    isstEconomicOrganizationAndSocialContext,
    isstEngineeringMathematics,
    isstEngineeringDistributions
};

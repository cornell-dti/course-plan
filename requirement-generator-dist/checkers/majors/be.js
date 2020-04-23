"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const bioEngineeringEngineeringDistributions = [
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ENGRD 2020']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ENGRD 2600', 'ENGRD 2510'])
];
const bioEngineeringIntroBio = (course) => checkers_common_1.courseMatchesCodeOptions(course, ['BIOMG 1350', 'BIOG 1440', 'BIOG 1445', 'BIOEE/BIOSM 1610']);
const bioEngineeringRequiredMajorCourses = [
    (course) => checkers_common_1.courseMatchesCode(course, 'BIOG/BIOSM 1500'),
    (course) => checkers_common_1.courseMatchesCode(course, 'BEE 3500'),
    (course) => checkers_common_1.courseMatchesCode(course, 'BEE 3310'),
    (course) => checkers_common_1.courseMatchesCode(course, 'BEE 3400'),
    (course) => checkers_common_1.courseMatchesCode(course, 'BEE 3600'),
    (course) => checkers_common_1.courseMatchesCode(course, 'BEE 4500')
];
const bioEngineeringBioChemistry = [
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['BIOMG 3300', 'BIOMG 3330', 'BIOMG 3350', 'BIOMG 3310']),
    (course) => checkers_common_1.courseMatchesCode(course, 'BIOMG 3320')
];
const bioEngineeringEngineeringStatistics = (course) => (checkers_common_1.courseMatchesCodeOptions(course, ['BEE 2220', 'ENGRD 2210', 'CHEME 3130', 'MSE 3030'])
    || checkers_common_1.courseMatchesCodeOptions(course, ['CEE 3040', 'ENGRD 2700']));
const bioEngineeringFocusAreaElective = (course) => checkers_common_1.courseMatchesCodeOptions(course, [
    'BEE 4550', 'BEE 4590', 'BEE 4640', 'BEE 7600', 'CHEME 4010', 'CHEME 4020',
    'BEE 3299', 'BEE 3710', 'BEE 4270', 'BEE 4730', 'BEE 4750', 'BEE 4760', 'BEE 4870',
    'BEE 4550', 'BEE 4590', 'BEE 7600', 'CHEME 5940', 'ECE 4070', 'ECE 5320', 'ECE 5350', 'MAE 5240', 'MSE 5630', 'MSE 5890',
    'BEE 4530', 'BEE 4600', 'BME 3300', 'BME 5400', 'CHEME 5940', 'CS 4220', 'CS 4820', 'ECE 3530', 'ECE 3200', 'MAE 3260', 'ORIE 4350', 'ORIE 4580', 'SYSEN 5100',
    'BEE 4550', 'CHEME 5430', 'CHEME 5940', 'ECE 3530',
    'BEE 4530', 'BEE 4590', 'BEE 4600', 'BEE 4810', 'BME 5200', 'BME 5390', 'BME 5710', 'MSE 4610', 'MSE 5130', 'MSE 5620',
    'BEE 3299', 'BEE 4010', 'BEE 4350', 'BEE 4740', 'BEE 4760', 'BEE 4810', 'BEE 4870', 'BEE 4880', 'BEE 7540'
]);
exports.default = {
    bioEngineeringEngineeringDistributions,
    bioEngineeringIntroBio,
    bioEngineeringRequiredMajorCourses,
    bioEngineeringBioChemistry,
    bioEngineeringEngineeringStatistics,
    bioEngineeringFocusAreaElective
};

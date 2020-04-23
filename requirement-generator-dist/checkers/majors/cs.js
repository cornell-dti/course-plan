"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const csIntroProgramming = [
    (course) => (checkers_common_1.courseMatchesCodeOptions(course, ['CS 1110', 'CS 1112', 'CS 1114', 'CS 1115'])),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['CS 2110', 'CS 2112'])
];
const csCore = [
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['CS 2800', 'CS 2802']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['CS 3110']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['CS 3410', 'CS 3420']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['CS 4820']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['CS 4410'])
];
const csPracticumOrProject = (course) => checkers_common_1.courseMatchesCodeOptions(course, [
    'CS 4**1',
    'CS 3152',
    'CS 4152',
    'CS 4154',
    'CS 4740',
    'CS 4752',
    'CS 5150',
    'CS 5152',
    'CS 5412',
    'CS 5414',
    'CS 5431',
    'CS 5625',
    'CS 5643'
]);
exports.default = { csIntroProgramming, csCore, csPracticumOrProject };

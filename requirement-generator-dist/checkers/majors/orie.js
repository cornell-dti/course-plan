"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const orieMajorRequiredClasses = [
    (course) => checkers_common_1.courseMatchesCode(course, 'ORIE 3120'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ORIE 3150'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ORIE 3300'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ORIE 3310'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ORIE 3500'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ORIE 3510'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ORIE 4580')
];
const orieElectives = (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ORIE 4***', 'ORIE 5***', 'ORIE 6***']);
const orieEngineeringDistributionCourses = [
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ENGRD 2700']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ENGRD 2***', 'ENGRD 3***']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ENGRI 1***'])
];
exports.default = { orieMajorRequiredClasses, orieElectives, orieEngineeringDistributionCourses };

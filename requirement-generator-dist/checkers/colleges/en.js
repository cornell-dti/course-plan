"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const engineeringMathematics = [
    (course) => checkers_common_1.courseMatchesCode(course, 'MATH 1910'),
    (course) => checkers_common_1.courseMatchesCode(course, 'MATH 1920'),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MATH 2930', 'MATH 2940'])
];
const engineeringPhysics = [
    (course) => checkers_common_1.courseMatchesCode(course, 'PHYS 1112'),
    (course) => checkers_common_1.courseMatchesCode(course, 'PHYS 2213')
];
const engineeringChemistry = (course) => checkers_common_1.courseMatchesCode(course, 'CHEM 2090');
const engineeringFWS = checkers_common_1.courseIsFWS;
const engineeringComputing = (course) => checkers_common_1.courseMatchesCodeOptions(course, [
    'CS 1110',
    'CS 1112',
    'CS 1114',
    'CS 1115'
]);
const engineeringENGRI = (course) => course.subject === 'ENGRI';
const engineeringDistribution = (course) => course.subject === 'ENGRD';
const engineeringLiberalArts = (course) => (['CA', 'HA', 'LA/LAD', 'KCM', 'SBA', 'FL', 'CE'].some(distribution => { var _a, _b; return _b = (_a = course.catalogDistr) === null || _a === void 0 ? void 0 : _a.includes(distribution), (_b !== null && _b !== void 0 ? _b : false); }));
exports.default = {
    engineeringMathematics,
    engineeringPhysics,
    engineeringChemistry,
    engineeringFWS,
    engineeringComputing,
    engineeringENGRI,
    engineeringDistribution,
    engineeringLiberalArts
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const ilrCoreRequirements = [
    (course) => checkers_common_1.courseMatchesCode(course, 'ILROB 1220'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ILRLR 1100'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ECON 1110'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ECON 1120'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ILRST 2100'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ILRLR 2010'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ILRHR 2600'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ILRLR 2050'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ILRLE 2400')
];
const ilrFWS = checkers_common_1.courseIsFWS;
const ilrAdvanceWriting = (course) => checkers_common_1.courseMatchesCodeOptions(course, [
    'ILRHR 2360',
    'ILRIC 2390',
    'ILRLE 2400',
    'ILRLR 2060',
    'ILRLR 2070',
    'ILROB 2230',
    'ILROB 2290',
    'ENGL 2880',
    'ENGL 2890'
]);
exports.default = { ilrCoreRequirements, ilrFWS, ilrAdvanceWriting };

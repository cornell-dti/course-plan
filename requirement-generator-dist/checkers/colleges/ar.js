"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const aapIntroductoryStudioPractice = [
    (course) => checkers_common_1.courseMatchesCode(course, 'ART 2201'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ART 2301'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ART 2401'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ART 2501'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ART 2601'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ART 2701')
];
const aapElectiveStudioPractice = (course) => checkers_common_1.courseMatchesCodeOptions(course, [
    'ART 3201',
    'ART 3301',
    'ART 3401',
    'ART 3501',
    'ART 3601',
    'ART 3705',
    'ART 3001',
    'ART 3003'
]);
const aapPreThesisStudioPractice = (course) => checkers_common_1.courseMatchesCode(course, 'ART 3006');
const aapThesisStudioPractice = [
    (course) => checkers_common_1.courseMatchesCode(course, 'ART 4003'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ART 4004')
];
const aapShopInstruction = (course) => checkers_common_1.courseMatchesCode(course, 'ART 2900');
const aapTheoryAndCriticism = [
    (course) => checkers_common_1.courseMatchesCode(course, 'ART 2103'),
    (course) => checkers_common_1.courseMatchesCode(course, 'ART 4100')
];
const aapFWS = checkers_common_1.courseIsFWS;
exports.default = {
    aapIntroductoryStudioPractice,
    aapElectiveStudioPractice,
    aapPreThesisStudioPractice,
    aapThesisStudioPractice,
    aapShopInstruction,
    aapTheoryAndCriticism,
    aapFWS
};

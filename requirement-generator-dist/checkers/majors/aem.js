"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const aemManagementRequirements = [
    (course) => checkers_common_1.courseMatchesCode(course, 'AEM 2200'),
    (course) => checkers_common_1.courseMatchesCode(course, 'AEM 2225'),
    (course) => checkers_common_1.courseMatchesCode(course, 'AEM 2240'),
    (course) => checkers_common_1.courseMatchesCode(course, 'AEM 2420'),
    (course) => checkers_common_1.courseMatchesCode(course, 'AEM 2601'),
    (course) => checkers_common_1.courseMatchesCode(course, 'AEM 3200'),
    (course) => checkers_common_1.courseMatchesCode(course, 'AEM 3230')
];
const aemEconomicsRequirements = [
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ECON 1110']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['ECON 1120']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['AEM 2600', 'ECON 3030'])
];
const aemQuantitativeMethodsRequirements = [
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['AEM 2100']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['MATH 1110', 'MATH 1120']),
    (course) => checkers_common_1.courseMatchesCodeOptions(course, ['AEM 2010'])
];
const aemQuantitativeMethodsElectivesRequirements = (course) => checkers_common_1.courseMatchesCodeOptions(course, [
    'AEM 2770',
    'AEM 2830',
    'AEM 2840',
    'AEM 3100',
    'AEM 3390',
    'AEM 4060',
    'AEM 4110',
    'AEM 4120',
    'AEM 4190',
    'BTRY 3080',
    'ILRST 3080',
    'STSCI 3080',
    'ECON 3130',
    'ECON 3140',
    'ECON 4020',
    'ILRST 2110',
    'ILRST 3110'
]);
const aemGradChallengeRequirementPart1 = (course) => checkers_common_1.courseMatchesCodeOptions(course, [
    'AEM 2000',
    'AEM 2555',
    'AEM 2800',
    'AEM 2805',
    'AEM 4940'
]);
const aemGradChallengeRequirementPart2 = (course) => (checkers_common_1.courseMatchesCode(course, 'AEM 3000'));
const aemGradChallengeRequirementPart3 = (course) => (checkers_common_1.courseMatchesCode(course, 'AEM 4000'));
exports.default = {
    aemManagementRequirements,
    aemEconomicsRequirements,
    aemQuantitativeMethodsRequirements,
    aemQuantitativeMethodsElectivesRequirements,
    aemGradChallengeRequirementPart1,
    aemGradChallengeRequirementPart2,
    aemGradChallengeRequirementPart3
};

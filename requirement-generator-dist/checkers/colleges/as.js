"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const casCredits = (course) => course.acadGroup.includes('AS');
const casFWS = checkers_common_1.courseIsFWS;
const casIntermediateLanguageCourse = (course) => checkers_common_1.courseMatchesCodeOptions(course, [
    'ARAB 2***',
    'BENGL 2***',
    'BURM 2***',
    'CHIN 2***',
    'FREN 2***',
    'GERST 2***',
    'GREEK 2***',
    'HEBRW 2***',
    'HINDI 2***',
    'INDO 2***',
    'ITAL 2***',
    'JAPAN 2***',
    'KHMER 2***',
    'KOREA 2***',
    'LATIN 2***',
    'NEPAL 2***',
    'PERSN 2***',
    'POLSH 2***',
    'PORT 2***',
    'RUSSA 2***',
    'SANSK 2***',
    'SINHA 2***',
    'SPAN 2***',
    'SWAHL 2***',
    'TAG 2***',
    'THAI 2***',
    'TURK 2***',
    'VIET 2***',
    'YORUB 2***',
    'ZULU 2***'
]);
const casLanguageCourseCredits = (course) => [
    'ARAB',
    'BENGL',
    'BURM',
    'CHIN',
    'FREN',
    'GERST',
    'GREEK',
    'HEBRW',
    'HINDI',
    'INDO',
    'ITAL',
    'JAPAN',
    'KHMER',
    'KOREA',
    'LATIN',
    'NEPAL',
    'PERSN',
    'POLSH',
    'PORT',
    'RUSSA',
    'SANSK',
    'SINHA',
    'SPAN',
    'SWAHL',
    'TAG',
    'THAI',
    'TURK',
    'VIET',
    'YORUB',
    'ZULU'
].includes(course.subject);
const casPBSOrMQR = (course) => ['(PBS-AS)', '(PBSS-AS)', '(MQR-AS)'].some(distribution => { var _a, _b; return _b = (_a = course.catalogDistr) === null || _a === void 0 ? void 0 : _a.includes(distribution), (_b !== null && _b !== void 0 ? _b : false); });
const casPhysicalAndBiologicalSciences = (course) => ['(PBS-AS)', '(PBSS-AS)'].some(distribution => { var _a, _b; return _b = (_a = course.catalogDistr) === null || _a === void 0 ? void 0 : _a.includes(distribution), (_b !== null && _b !== void 0 ? _b : false); });
const casMathematicsAndQuantitativeAndReasoning = (course) => {
    var _a, _b;
    return (_b = (_a = course.catalogDistr) === null || _a === void 0 ? void 0 : _a.includes('(MQR-AS)'), (_b !== null && _b !== void 0 ? _b : false));
};
const casLiberalArts = (course) => [
    '(CA-AS)',
    '(HA-AS)',
    '(KCM-AS)',
    '(LA-AS)',
    '(SBA-AS)'
].some(distribution => { var _a, _b; return _b = (_a = course.catalogDistr) === null || _a === void 0 ? void 0 : _a.includes(distribution), (_b !== null && _b !== void 0 ? _b : false); });
const casGeographicBreadthRequirement = (course) => ['GB', 'GHB'].some(breadth => { var _a, _b; return _b = (_a = course.catalogBreadth) === null || _a === void 0 ? void 0 : _a.includes(breadth), (_b !== null && _b !== void 0 ? _b : false); });
const casHistoricBreadthRequirement = (course) => ['HB', 'GHB'].some(breadth => { var _a, _b; return _b = (_a = course.catalogBreadth) === null || _a === void 0 ? void 0 : _a.includes(breadth), (_b !== null && _b !== void 0 ? _b : false); });
exports.default = {
    casCredits,
    casFWS,
    casIntermediateLanguageCourse,
    casLanguageCourseCredits,
    casPBSOrMQR,
    casPhysicalAndBiologicalSciences,
    casMathematicsAndQuantitativeAndReasoning,
    casLiberalArts,
    casGeographicBreadthRequirement,
    casHistoricBreadthRequirement
};

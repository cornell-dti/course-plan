"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const englishRequirements = [
    {
        name: 'Total Credits',
        description: 'To graduate with a major in English, a student must complete with a grade of C or better 40 credit hours approved for the English major. '
            + 'All 2000-level ENGL courses (with the exception of 2800-2810 and 2880-2890) count for the major, as do all 3000-and 4000-level courses.',
        source: 'https://english.cornell.edu/majoring-and-minoring-english-cornell#requirements-for-the-major',
        checker: (course) => {
            if (checkers_common_1.courseMatchesCodeOptions(course, ['ENGL 2800', 'ENGL 2810', 'ENGL 2880', 'ENGL 2890'])) {
                return false;
            }
            return checkers_common_1.courseMatchesCodeOptions(course, ['ENGL 2***', 'ENGL 3***', 'ENGL 4***', 'ENGL 5***', 'ENGL 6***']);
        },
        fulfilledBy: 'credits',
        minCount: 40
    },
    {
        name: 'Pre-1800',
        description: '12 credits (normally 3 courses) must be from courses in which 50% or more of the material consists of literature originally written in English '
            + 'before 1800 (such courses are indicated in the English course listings)',
        source: 'https://english.cornell.edu/majoring-and-minoring-english-cornell#requirements-for-the-major',
        checker: (course) => {
            var _a, _b, _c, _d;
            return ((_b = (_a = course.catalogComments) === null || _a === void 0 ? void 0 : _a.includes('pre-1800'), (_b !== null && _b !== void 0 ? _b : false))
                || (_d = (_c = course.catalogSatisfiesReq) === null || _c === void 0 ? void 0 : _c.includes('pre-1800'), (_d !== null && _d !== void 0 ? _d : false)));
        },
        fulfilledBy: 'credits',
        minCount: 12
    },
    {
        name: '4000 or Above',
        description: '8 credits (2 courses) must be at the 4000 level or above',
        source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
        checker: checkers_common_1.includesWithSingleRequirement('ENGL 4***'),
        fulfilledBy: 'credits',
        minCount: 8
    },
    {
        name: 'Concentration',
        description: '12 credits (3 courses) must form an intellectually coherent concentration (see below).',
        source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
        checker: null,
        fulfilledBy: 'self-check',
        minCount: 12
    }
];
exports.default = englishRequirements;

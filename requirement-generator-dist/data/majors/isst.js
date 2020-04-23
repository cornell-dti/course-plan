"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const isstRequirements = [
    {
        name: 'Probability, Statistics, and Optimization',
        description: 'ORIE 3300: Optimization I, ORIE 3500: Engineering Probability and Statistics II',
        source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-systems-and-technology/degree-requirements/core',
        checker: checkers_common_1.includesWithSubRequirements(['ORIE 3300'], ['ORIE 3500']),
        fulfilledBy: 'courses',
        minCount: 2
    },
    {
        name: 'Information Systems',
        description: 'INFO 2300: Intermediate Design and Programming for the Web, '
            + 'ORIE 3800: Information Systems and Analysis or ORIE 3120: Practical Tools for Operations Research, Machine Learning and Data Science, '
            + 'one of -- INFO 3300: Data-Driven Web Applications, INFO 4300: Language and Information',
        source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-systems-and-technology/degree-requirements/core',
        checker: checkers_common_1.includesWithSubRequirements(['INFO 2300'], ['ORIE 3800'], ['INFO 3300', 'INFO 4300']),
        fulfilledBy: 'courses',
        minCount: 3
    },
    {
        name: 'Economic, Organization, and Social Context',
        description: 'INFO 2040: Networks, one of -- INFO 2450: Communication and Technology, ENGRC 3350: Communications for Engineering Managers',
        source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-systems-and-technology/degree-requirements/core',
        checker: checkers_common_1.includesWithSubRequirements(['INFO 2040'], ['INFO 2450', 'ENGRC 3350']),
        fulfilledBy: 'courses',
        minCount: 2
    },
    {
        name: 'Engineering Mathematics',
        description: 'For majors in ISST, the sequence of required mathematics courses is MATH 1910, MATH 1920, MATH 2940, and finally, one of MATH 2930 or MATH 3040 or CS 2800.',
        source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-systems-and-technology/degree-requirements/math',
        checker: checkers_common_1.includesWithSubRequirements(['MATH 1910'], ['MATH 1920'], ['MATH 2940'], ['MATH 2930', 'MATH 3040', 'CS 2800']),
        fulfilledBy: 'courses',
        minCount: 4
    },
    {
        name: 'Engineering Distributions',
        description: 'The major requires ENGRD 2700 as an Engineering Distribution course. '
            + 'ENGRD 2110 is also required by the major and it is recommended that this course be taken as an Engineering Distribution course.',
        source: 'https://infosci.cornell.edu/undergraduate/info-sci-majors/bs-information-science-systems-and-technology/degree-requirements/math',
        checker: checkers_common_1.includesWithSubRequirements(['ENGRD 2110'], ['ENGRD 2700']),
        fulfilledBy: 'courses',
        minCount: 2
    }
];
exports.default = isstRequirements;

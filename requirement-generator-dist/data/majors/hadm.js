"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const hotelAdminRequirements = [
    {
        name: 'Accounting; Real Estate Development',
        description: 'HADM 1210, HADM 2210, HADM 2220, HADM 3210',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: checkers_common_1.includesWithSubRequirements(['HADM 1210'], ['HADM 2210'], ['HADM 2220'], ['HADM 3210']),
        fulfilledBy: 'courses',
        minCount: 4
    },
    {
        name: 'Employment Relations; HR; Law',
        description: 'HADM 1150, HADM 2810, HADM 3870',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: checkers_common_1.includesWithSubRequirements(['HADM 1150'], ['HADM 2810'], ['HADM 3870']),
        fulfilledBy: 'courses',
        minCount: 3
    },
    {
        name: 'Food and Beverage Management',
        description: 'HADM 2360, HADM 3350',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: checkers_common_1.includesWithSubRequirements(['HADM 2360'], ['HADM 3350']),
        fulfilledBy: 'courses',
        minCount: 2
    },
    {
        name: 'Information Systems',
        description: 'HADM 1740',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: checkers_common_1.includesWithSingleRequirement('HADM 1740'),
        fulfilledBy: 'courses',
        minCount: 1
    },
    {
        name: 'Management Communication',
        description: 'HADM 1650, HADM 3650',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: checkers_common_1.includesWithSubRequirements(['HADM 1650'], ['HADM 3650']),
        fulfilledBy: 'courses',
        minCount: 2
    },
    {
        name: 'Operations',
        description: 'HADM 1350, HADM 1360, HADM 2010, HADM 3010',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: checkers_common_1.includesWithSubRequirements(['HADM 1350'], ['HADM 1360'], ['HADM 2010'], ['HADM 3010']),
        fulfilledBy: 'courses',
        minCount: 4
    },
    {
        name: 'Properties Development and Management',
        description: 'HADM 2550, HADM 3550',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: checkers_common_1.includesWithSubRequirements(['HADM 2550'], ['HADM 3550']),
        fulfilledBy: 'courses',
        minCount: 2
    },
    {
        name: 'Services Marketing',
        description: 'HADM 1410, HADM 2430',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: checkers_common_1.includesWithSubRequirements(['HADM 1410'], ['HADM 2430']),
        fulfilledBy: 'courses',
        minCount: 2
    },
    {
        name: 'Strategy',
        description: 'HADM 4410',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: checkers_common_1.includesWithSingleRequirement('HADM 4410'),
        fulfilledBy: 'courses',
        minCount: 1
    },
    {
        name: 'SHA Electives',
        description: 'A minimum of 14 credits, 3000-level or higher, in SHA.',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: checkers_common_1.includesWithSingleRequirement('HADM 3***'),
        fulfilledBy: 'credits',
        minCount: 14
    },
    {
        name: 'Non-HADM Electives',
        description: 'A minimum of 18 credits, to be taken outside SHA. 3 of these 18 credits must be FWS.',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: null,
        fulfilledBy: 'self-check',
        minCount: 15
    },
    {
        name: 'First-Year Writing Seminars',
        description: 'A minimum of 18 credits, to be taken outside SHA. 3 of these 18 credits must be FWS.',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: checkers_common_1.courseIsFWS,
        fulfilledBy: 'credits',
        minCount: 3
    },
    {
        name: 'Free Electives',
        description: 'A minimum of 24 credits, to be taken either in or outside SHA.',
        source: 'https://sha.cornell.edu/current-students/handbook/2015-2016-handbook/curriculum-requirements/',
        checker: null,
        fulfilledBy: 'self-check',
        minCount: 24
    }
];
exports.default = hotelAdminRequirements;

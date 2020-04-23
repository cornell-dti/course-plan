"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_common_1 = require("../checkers-common");
const hotelAdminAccounting = [
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 1210'),
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 2210'),
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 2220'),
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 3210')
];
const hotelAdminEmploymentRelationsHRLaw = [
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 1150'),
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 2810'),
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 3870')
];
const hotelAdminFoodAndBeverageManagement = [
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 2360'),
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 3350')
];
const hotelAdminInformationSystems = (course) => checkers_common_1.courseMatchesCode(course, 'HADM 1740');
const hotelAdminManagementCommunication = [
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 1650'),
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 3650')
];
const hotelAdminOperations = [
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 1350'),
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 1360'),
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 2010'),
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 3010')
];
const hotelAdminPropertiesDevelopmentAndManagement = [
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 2550'),
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 3550')
];
const hotelAdminServicesMarketing = [
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 1410'),
    (course) => checkers_common_1.courseMatchesCode(course, 'HADM 2430')
];
const hotelAdminStrategy = (course) => checkers_common_1.courseMatchesCode(course, 'HADM 4410');
const hotelAdminSHAElectives = (course) => checkers_common_1.courseMatchesCode(course, 'HADM 3***');
const hotelAdminFWS = checkers_common_1.courseIsFWS;
exports.default = {
    hotelAdminAccounting,
    hotelAdminEmploymentRelationsHRLaw,
    hotelAdminFoodAndBeverageManagement,
    hotelAdminInformationSystems,
    hotelAdminManagementCommunication,
    hotelAdminOperations,
    hotelAdminPropertiesDevelopmentAndManagement,
    hotelAdminServicesMarketing,
    hotelAdminStrategy,
    hotelAdminSHAElectives,
    hotelAdminFWS
};

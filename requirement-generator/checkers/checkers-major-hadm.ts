import { Course } from '../types';
import { courseMatchesCode, courseIsFWS } from './checkers-common';

const hotelAdminAccounting = (course: Course): boolean => (
  courseMatchesCode(course, 'HADM 1210')
  || courseMatchesCode(course, 'HADM 2210')
  || courseMatchesCode(course, 'HADM 2220')
  || courseMatchesCode(course, 'HADM 3210')
);

const hotelAdminEmploymentRelationsHRLaw = (course: Course): boolean => (
  courseMatchesCode(course, 'HADM 1150')
  || courseMatchesCode(course, 'HADM 2810')
  || courseMatchesCode(course, 'HADM 3870')
);

const hotelAdminFoodAndBeverageManagement = (course: Course): boolean => (
  courseMatchesCode(course, 'HADM 2360') || courseMatchesCode(course, 'HADM 3350')
);

const hotelAdminInformationSystems = (course: Course): boolean => courseMatchesCode(course, 'HADM 1740');

const hotelAdminManagementCommunication = (course: Course): boolean => (
  courseMatchesCode(course, 'HADM 1650') || courseMatchesCode(course, 'HADM 3650')
);

const hotelAdminOperations = (course: Course): boolean => (
  courseMatchesCode(course, 'HADM 1350')
  || courseMatchesCode(course, 'HADM 1360')
  || courseMatchesCode(course, 'HADM 2010')
  || courseMatchesCode(course, 'HADM 3010')
);

const hotelAdminPropertiesDevelopmentAndManagement = (course: Course): boolean => (
  courseMatchesCode(course, 'HADM 2550') || courseMatchesCode(course, 'HADM 3550')
);

const hotelAdminServicesMarketing = (course: Course): boolean => (
  courseMatchesCode(course, 'HADM 1410') || courseMatchesCode(course, 'HADM 2430')
);

const hotelAdminStrategy = (course: Course): boolean => courseMatchesCode(course, 'HADM 4410');

const hotelAdminSHAElectives = (course: Course) => courseMatchesCode(course, 'HADM 3***');

const hotelAdminFWS = courseIsFWS;

export default {
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

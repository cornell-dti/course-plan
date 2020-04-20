import { courseIsFWS, includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const hotelAdminAccounting = includesWithSubRequirements(
  ['HADM 1210'],
  ['HADM 2210'],
  ['HADM 2220'],
  ['HADM 3210']
);

const hotelAdminEmploymentRelationsHRLaw = includesWithSubRequirements(
  ['HADM 1150'],
  ['HADM 2810'],
  ['HADM 3870']
);

const hotelAdminFoodAndBeverageManagement = includesWithSubRequirements(
  ['HADM 2360'],
  ['HADM 3350']
);

const hotelAdminInformationSystems = includesWithSingleRequirement('HADM 1740');

const hotelAdminManagementCommunication = includesWithSubRequirements(
  ['HADM 1650'],
  ['HADM 3650']
);

const hotelAdminOperations = includesWithSubRequirements(
  ['HADM 1350'],
  ['HADM 1360'],
  ['HADM 2010'],
  ['HADM 3010']
);

const hotelAdminPropertiesDevelopmentAndManagement = includesWithSubRequirements(
  ['HADM 2550'],
  ['HADM 3550']
);

const hotelAdminServicesMarketing = includesWithSubRequirements(
  ['HADM 1410'],
  ['HADM 2430']
);

const hotelAdminStrategy = includesWithSingleRequirement('HADM 4410');

const hotelAdminSHAElectives = includesWithSingleRequirement('HADM 3***');

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

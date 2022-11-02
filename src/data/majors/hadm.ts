import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseIsFWS,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/types';

const hotelAdminRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'First-Year Writing Seminars',
    description:
      'A minimum of 18 credits, to be taken outside SHA. 3 of these 18 credits must be FWS.',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    checker: [courseIsFWS],
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Accounting; Real Estate Development',
    description: 'HADM 1210, HADM 2210, HADM 2220, HADM 3210',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    checker: includesWithSubRequirements(
      ['HADM 1210'],
      ['HADM 2210'],
      ['HADM 2220'],
      ['HADM 3210']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: ['HADM 1210', 'HADM 2210', 'HADM 2220', 'HADM 3210'],
  },
  {
    name: 'Employment Relations; HR; Law',
    description: 'HADM 1150, HADM 2810, HADM 3870',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    checker: includesWithSubRequirements(['HADM 1150'], ['HADM 2810'], ['HADM 3870']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['HADM 1150', 'HADM 2810', 'HADM 3870'],
  },
  {
    name: 'Food and Beverage Management',
    description: 'HADM 2360, HADM 3350',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    checker: includesWithSubRequirements(['HADM 2360'], ['HADM 3350']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['HADM 2360', 'HADM 3350'],
  },
  {
    name: 'Information Systems',
    description: 'HADM 1740',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    checker: includesWithSingleRequirement('HADM 1740'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Management Communication',
    description: 'HADM 1650, HADM 3650',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    checker: includesWithSubRequirements(['HADM 1650'], ['HADM 3650']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['HADM 1650', 'HADM 3650'],
  },
  {
    name: 'Operations',
    description: 'HADM 1350, HADM 1360, HADM 2010, HADM 3010',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    checker: includesWithSubRequirements(
      ['HADM 1350'],
      ['HADM 1360'],
      ['HADM 2010'],
      ['HADM 3010']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: ['HADM 1350', 'HADM 1360', 'HADM 2010', 'HADM 3010'],
  },
  {
    name: 'Properties Development and Management',
    description: 'HADM 2550, HADM 3550',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    checker: includesWithSubRequirements(['HADM 2550'], ['HADM 3550']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['HADM 2550', 'HADM 3550'],
  },
  {
    name: 'Services Marketing',
    description: 'HADM 1410, HADM 2430',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    checker: includesWithSubRequirements(['HADM 1410'], ['HADM 2430']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['HADM 1410', 'HADM 2430'],
  },
  {
    name: 'Strategy',
    description: 'HADM 4410',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    checker: includesWithSingleRequirement('HADM 4410'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'HADM Electives',
    description: 'A minimum of 14 credits, 3000-level or higher, in SHA.',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    checker: includesWithSingleRequirement('HADM 3***'),
    fulfilledBy: 'credits',
    perSlotMinCount: [14],
  },
  {
    // TODO: remove self-check
    name: 'Non-HADM Electives',
    description:
      'A minimum of 18 credits, to be taken outside SHA. 3 of these 18 credits must be FWS.',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    fulfilledBy: 'self-check',
    minCount: 15,
  },
  {
    name: 'Free Electives',
    description: 'A minimum of 24 credits, to be taken either in or outside SHA.',
    source: 'https://sha.cornell.edu/current-students/handbook/',
    fulfilledBy: 'self-check',
    minCount: 24,
  },
];

export default hotelAdminRequirements;

export const hotelAdminAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Nolan School Advising', email: 'ha-advising@cornell.edu' }],
};

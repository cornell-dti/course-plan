import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseIsFWS,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const commRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description: 'COMM 1101, COMM 1300, COMM 2010, COMM 2310',
    source: 'https://communication.cals.cornell.edu/undergraduate-program/major-requirements/',
    checker: includesWithSubRequirements(
      ['COMM 1101'],
      ['COMM 1300'],
      ['COMM 2010'],
      ['COMM 2310']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: ['COMM 1101', 'COMM 1300', 'COMM 2010', 'COMM 2310'],
  },
  {
    name: 'Data Literacy Courses',
    description:
      'COMM 2820 and a 3-4 credit introductory statistics class, such as PAM 2100, AEM 2100, ILRST 2100',
    source: 'https://communication.cals.cornell.edu/undergraduate-program/major-requirements/',
    checker: includesWithSubRequirements(['COMM 2820'], ['PAM 2100', 'AEM 2100', 'ILRST 2100']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['COMM 2820', 'PAM 2100 or AEM 2100 or ILRST 2100'],
  },
  {
    name: 'Introduction to Concentration Courses',
    description: '2 courses in COMM 2200, COMM 2450, COMM 2760, or COMM 2850',
    source: 'https://communication.cals.cornell.edu/undergraduate-program/major-requirements/',
    checker: includesWithSingleRequirement('COMM 2200', 'COMM 2450', 'COMM 2760', 'COMM 2850'),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Upper-Level Concentration Courses',
    description:
      'Students must take six credits (two courses) of coursework within their declared Concentration at the 3100+ level',
    source: 'https://communication.cals.cornell.edu/undergraduate-program/major-requirements/',
    checker: includesWithSingleRequirement(
      'COMM 31**',
      'COMM 32**',
      'COMM 33**',
      'COMM 34**',
      'COMM 35**',
      'COMM 36**',
      'COMM 37**',
      'COMM 38**',
      'COMM 39**',
      'COMM 4***',
      'COMM 5***',
      'COMM 6***'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
  },
  {
    name: 'Upper-Level COMM Electives',
    description:
      'Students must complete 9 additional credit hours at the 3100+ level. Electives can come from any of the Concentrations. ' +
      'Refer to the Course and Time Roster for the most up-to-date offerings. ',
    source: 'https://communication.cals.cornell.edu/undergraduate-program/major-requirements/',
    checker: includesWithSingleRequirement(
      'COMM 2179',
      'COGST 4330',
      'COML 2703',
      'COMM 2179',
      'COMM 3110',
      'COMM 3150',
      'COMM 3189',
      'COMM 3200',
      'COMM 3210',
      'COMM 3300',
      'COMM 3350',
      'COMM 3400',
      'COMM 3450',
      'COMM 3460',
      'COMM 3560',
      'COMM 3710',
      'COMM 3720',
      'COMM 3760',
      'COMM 3800',
      'COMM 4200',
      'COMM 4201',
      'COMM 4220',
      'COMM 4250',
      'COMM 4260',
      'COMM 4280',
      'COMM 4292',
      'COMM 4300',
      'COMM 4350',
      'COMM 4360',
      'COMM 4380',
      'COMM 4400',
      'COMM 4410',
      'COMM 4450',
      'COMM 4560',
      'COMM 4650',
      'COMM 4660',
      'COMM 4760',
      'COMM 4800',
      'COMM 4860',
      'COMM 4940',
      'COMM 4970',
      'COMM 4990'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [9],
  },
  {
    name: 'Communication Practica',
    description: 'Three credits in the COMM 30XX range courses',
    source: 'https://communication.cals.cornell.edu/undergraduate-program/major-requirements/',
    checker: includesWithSingleRequirement('COMM 30**'),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Introductory Statistics Class',
    description:
      'Students must take an introductory statistics class, such as PAM 2100, AEM 2100, ILRST 2100, etc. or a score of 5 in AP statistics',
    source: 'https://communication.cals.cornell.edu/undergraduate-program/major-requirements/',
    checker: includesWithSingleRequirement(
      'PAM 2100',
      'AEM 2100',
      'ILRST 2100',
      'STSCI 2100',
      'STSCI 2200',
      'STSCI 2150',
      'BTRY 3010',
      'BTRY 6010',
      'ENGRD 2700',
      'HADDM 2010',
      'HADDM 6110',
      'MATH 1710',
      'PAM 2101',
      'PSYCH 2500',
      'SOC 3010'
    ),
    fulfilledBy: 'courses',
    allowCourseDoubleCounting: true,
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'First-Year Writing Seminars (FWS)',
    description:
      'One First-Year Writing Workshop (FWS). (A score of 5 on the AP English Language exam is accepted.)',
    source: 'https://as.cornell.edu/education/degree-requirements',
    checker: [courseIsFWS],
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
    allowCourseDoubleCounting: true,
  },
];

export default commRequirements;

export const commAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Ashlee Cherry', email: 'ac2396@cornell.edu' }],
};

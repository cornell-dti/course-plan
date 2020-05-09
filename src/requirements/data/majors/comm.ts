import { CollegeOrMajorRequirement } from '../../types';
import { courseIsFWS, includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const commRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description: '15 credits in COMM 1101, COMM 1300, COMM 2010, COMM 2310, COMM 2820',
    source: 'https://communication.cals.cornell.edu/undergraduate-program/major-requirements/',
    checker: includesWithSubRequirements(
      ['COMM 1101'],
      ['COMM 1300'],
      ['COMM 2010'],
      ['COMM 2310'],
      ['COMM 2820']
    ),
    operator: 'and',
    fulfilledBy: 'credits',
    minCount: 15
  },
  {
    name: 'Focus Area',
    description: '6 credits in COMM 2200, COMM 2450, COMM 2760, or COMM 2850',
    source: 'https://communication.cals.cornell.edu/undergraduate-program/major-requirements/',
    checker: includesWithSubRequirements(
      ['COMM 2200'],
      ['COMM 2450'],
      ['COMM 2760'],
      ['COMM 2850'],
    ),
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 6
  },
  {
    name: 'Focus Area Upper Level',
    description: 'Students must take six credits (two courses) of coursework within their declared Focus Area at the 3100+ level.',
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
      'COMM 6***',
    ),
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 6
  },
  {
    name: 'Upper-Level COMM',
    description: 'Students must complete 9 additional credit hours at the 3100+ level.* Electives can come from any of the focus area lists. '
    + 'A student may elect to fulfill 3 of these credit hours by taking a third focus area introductory course. '
    + 'A maximum of 3 credits in either 4970 or 4990 (combined) can be counted toward the upper level major requirements. Refer to the Course and Time Roster for the most up-to-date offerings. ',
    source: 'https://communication.cals.cornell.edu/undergraduate-program/major-requirements/',
    checker: includesWithSubRequirements(
      ['COMM 2179'],
      ['ANTHR 4330', 'COGST 4330', 'STS 4330'],
      ['COML 2703', 'ENG 2703', 'MUSIC 2703', 'PMA 2703'],
      ['COMM 2179'],
      ['COMM 3110'],
      ['COMM 3150'],
      ['COMM 3189'],
      ['COMM 3200'],
      ['COMM 3210'],
      ['COMM 3300'],
      ['COMM 3350'],
      ['COMM 3400'],
      ['COMM 3450'],
      ['COMM 3460'],
      ['COMM 3560'],
      ['COMM 3710'],
      ['COMM 3720'],
      ['COMM 3760'],
      ['COMM 3800'],
      ['COMM 4200'],
      ['COMM 4201'],
      ['COMM 4220'],
      ['COMM 4250'],
      ['COMM 4260'],
      ['COMM 4280'],
      ['COMM 4292'],
      ['COMM 4300'],
      ['COMM 4350'],
      ['COMM 4360'],
      ['COMM 4380'],
      ['COMM 4400'],
      ['COMM 4410'],
      ['COMM 4450'],
      ['COMM 4560'],
      ['COMM 4650'],
      ['COMM 4660'],
      ['COMM 4760'],
      ['COMM 4800'],
      ['COMM 4860'],
      ['COMM 4940'],
      ['COMM 4970'],
      ['COMM 4990']
    ),
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 15
  },
  {
    name: 'Communication Practica',
    description: 'Three credits in the COMM 30XX range courses',
    source: 'https://communication.cals.cornell.edu/undergraduate-program/major-requirements/',
    checker: includesWithSingleRequirement(
      'COMM 30**',
    ),
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 3
  },
  {
    name: 'First-Year Writing Workshop (FWS)',
    description: 'One First-Year Writing Workshop (FWS). (A score of 5 on the AP English Language exam is accepted.)',
    source: 'https://communication.cals.cornell.edu/undergraduate-program/major-requirements/',
    checker: courseIsFWS,
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1
  },
  {
    name: 'Introductory Statistics Class',
    description: 'Students must take an introductory statistics class, such as PAM 2100, AEM 2100, ILRST 2100, etc. or a score of 5 in AP statistics',
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
      'SOC 3010',
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1
  }
];

export default commRequirements;

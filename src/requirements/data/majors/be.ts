import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const bioEngineeringRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Engineering Distriubtions',
    description: 'ENGRD 2020 and ENGRD 2600 or ENGRD 2510',
    source:
      'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    checker: includesWithSubRequirements(['ENGRD 2020'], ['ENGRD 2600', 'ENGRD 2510']),
    subRequirementProgress: 'every-course-needed',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  {
    name: 'Intro Bio',
    description:
      'Choose 2 of the following 4: BIOMG 1350, BIOG 1440, BIOG 1445, and BIOEE/BIOSM 1610',
    source:
      'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    checker: includesWithSingleRequirement(
      'BIOMG 1350',
      'BIOG 1440',
      'BIOG 1445',
      'BIOEE/BIOSM 1610'
    ),
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  {
    name: 'Required Major Courses',
    description:
      'Major requirements for BE: BIOG/BIOSM 1500, BEE 3500, BEE 3310, BEE 3400, BEE 3600, and BEE 4500',
    source:
      'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    checker: includesWithSubRequirements(
      ['BIOG/BIOSM 1500'],
      ['BEE 3500'],
      ['BEE 3310'],
      ['BEE 3400'],
      ['BEE 3600'],
      ['BEE 4500']
    ),
    subRequirementProgress: 'every-course-needed',
    fulfilledBy: 'courses',
    minCount: 6,
  },
  {
    name: 'Biochemistry',
    description: 'BIOMG 3300, BIOMG 3330, BIOMG 3350, or BIOMG 3310 and BIOMG 3320',
    source:
      'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    checker: includesWithSubRequirements(
      ['BIOMG 3300', 'BIOMG 3330', 'BIOMG 3350', 'BIOMG 3310'],
      ['BIOMG 3320']
    ),
    subRequirementProgress: 'every-course-needed',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  {
    name: 'Upper-level Biology',
    description:
      'Any biology course at the 2000-level or above which has a biology prerequisite and is taken for a letter grade. ' +
      'This requirement may also be satisfied by an upper-level course in a science department (excluding engineering, liberal studies, social sciences, and mathematics) ' +
      'which has a biology (not social science) content of 95% or greater and a biology prerequisite. ' +
      'Students must receive approval for these alternative courses by consulting their BE faculty advisor or the main BE Advising Office, 207 Riley-Robb Hall. ' +
      'One credit seminars and BIOG 2990/4990 credits may not be used to meet this requirement.',
    source:
      'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    fulfilledBy: 'self-check',
  },
  {
    name: 'Engineering Statistics',
    description:
      'BEE 2220 or ENGRD 2210 or CHEME 3130 or MSE 3030 and engineering statistics preferably before semester 6. ' +
      'CEE 3040 is the preferred version of statistics.',
    source:
      'http://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/5215877281438417/MobilePagedReplica.action?pm=2&folio=12#pg14',
    checker: includesWithSubRequirements(
      ['BEE 2220', 'ENGRD 2210', 'CHEME 3130', 'MSE 3030'],
      ['CEE 3040', 'ENGRD 2700']
    ),
    subRequirementProgress: 'every-course-needed',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  {
    name: 'BE Focus Area Elective',
    description:
      'BE Focus Area Electives must include a BEE capstone design course. ' +
      'See beadvised.bee.cornell.edu for a current list of approved courses. ' +
      'In place of one focus area course, students may use up to 4 credits of research, project team, teaching, ' +
      'or independent study taken in an engineering department towards the engineering credits in category 8.',
    source: 'https://beadvised.bee.cornell.edu/full-list-of-focus-area-courses/',
    checker: includesWithSingleRequirement(
      'BEE 4550',
      'BEE 4590',
      'BEE 4640',
      'BEE 7600',
      'CHEME 4010',
      'CHEME 4020',
      'BEE 3299',
      'BEE 3710',
      'BEE 4270',
      'BEE 4730',
      'BEE 4750',
      'BEE 4760',
      'BEE 4870',
      'BEE 4550',
      'BEE 4590',
      'BEE 7600',
      'CHEME 5940',
      'ECE 4070',
      'ECE 5320',
      'ECE 5350',
      'MAE 5240',
      'MSE 5630',
      'MSE 5890',
      'BEE 4530',
      'BEE 4600',
      'BME 3300',
      'BME 5400',
      'CHEME 5940',
      'CS 4220',
      'CS 4820',
      'ECE 3530',
      'ECE 3200',
      'MAE 3260',
      'ORIE 4350',
      'ORIE 4580',
      'SYSEN 5100',
      'BEE 4550',
      'CHEME 5430',
      'CHEME 5940',
      'ECE 3530',
      'BEE 4530',
      'BEE 4590',
      'BEE 4600',
      'BEE 4810',
      'BME 5200',
      'BME 5390',
      'BME 5710',
      'MSE 4610',
      'MSE 5130',
      'MSE 5620',
      'BEE 3299',
      'BEE 4010',
      'BEE 4350',
      'BEE 4740',
      'BEE 4760',
      'BEE 4810',
      'BEE 4870',
      'BEE 4880',
      'BEE 7540'
    ),
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'courses',
    minCount: 4,
  },
];

export default bioEngineeringRequirements;

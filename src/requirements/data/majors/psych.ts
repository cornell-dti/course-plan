import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSubRequirements, includesWithSingleRequirement } from '../checkers-common';
import { AdvisorGroup } from '../../tools-types';

const psychRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Credit Requirements',
    description:
      'A total of 40 credits in psychology (including prerequisites), ' +
      'from which students majoring in psychology are expected to choose, in consultation with their advisors, ' +
      'a range of courses that covers the basic processes in psychology.',
    source: 'https://psychology.cornell.edu/major',
    checker: includesWithSingleRequirement('PSYCH ****'),
    fulfilledBy: 'credits',
    perSlotMinCount: [40],
    allowCourseDoubleCounting: true,
    disallowTransferCredit: true,
  },
  {
    name: 'Statistics Requirements',
    description: 'Students are required to demonstrate their proficiency in statistics',
    source: 'https://psychology.cornell.edu/major',
    checker: includesWithSubRequirements([
      'PSYCH 2500',
      'ILRST 2100',
      'STSCI 2100',
      'BTRY 3010',
      'STSCI 2200',
      'NTRES 3130',
      'PAM 2100',
      'ILRST 3100',
      'STSCI 3110',
      'ECON 3110',
      'ECON 3130',
      'AEM 2100',
      'STSCI 2150',
      'SCO 3010',
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Statistics'],
  },
  {
    name: 'General Requirements',
    description:
      'Unless otherwise approved by the advisor, all Psychology students should take ' +
      'at least one course in each of the following three areas of psychology.',
    source: 'https://psychology.cornell.edu/major',
    checker: includesWithSubRequirements(
      [
        'PSYCH 1102',
        'PSYCH 2050',
        'PSYCH 2090',
        'PSYCH 2150',
        'PSYCH 3140',
        'PSYCH 3160',
        'PSYCH 3350',
        'PSYCH 3420',
        'PSYCH 4120',
        'PSYCH 4180',
        'PSYCH 4270',
        'PSYCH 4280',
        'PSYCH 4331',
        'PSYCH 4320',
        'PSYCH 4360',
        'PSYCH 4370',
        'PSYCH 4650',
        'PSYCH 4770',
        'PSYCH 4780',
      ],
      [
        'PSYCH 2230',
        'PSYCH 3220',
        'PSYCH 3240',
        'PSYCH 3260',
        'PSYCH 3320',
        'PSYCH 4200',
        'PSYCH 4230',
        'PSYCH 4240',
        'PSYCH 4250',
        'PSYCH 4260',
        'PSYCH 4350',
        'PSYCH 4390',
        'PSYCH 4400',
        'PSYCH 4410',
      ],
      [
        'PSYCH 1500',
        'PSYCH 2650',
        'PSYCH 2750',
        'PSYCH 2800',
        'PSYCH 2820',
        'PSYCH 2940',
        'PSYCH 3250',
        'PSYCH 3270',
        'PSYCH 3280',
        'PSYCH 3800',
        'PSYCH 3850',
        'PSYCH 4050',
        'PSYCH 4300',
        'PSYCH 4810',
        'PSYCH 4820',
        'PSYCH 4840',
        'PSYCH 4850',
        'PSYCH 4910',
      ]
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['PCD', 'BEN', 'S&P'],
  },
];

export default psychRequirements;

export const psychAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Vivian Zayas', email: 'psych-dus@cornell.edu' }],
};

import { CollegeOrMajorRequirement, Course } from '../../types';
import {
  ifCodeMatch,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../checkers-common';

const environmentAndSustainability: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Required courses',
    description: 'Required courses',
    source: 'https://cals.cornell.edu/environment-sustainability/education/core-curriculum',
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    checker: includesWithSubRequirements(
      ['NTRES 1101', 'NTRES 1201'],
      ['NTRES 2201'],
      ['BIOEE 1610', 'BIOSM 1610', 'BIOEE 1780', 'BIOEE 1781', 'BIOSM 1780'],
      ['CHEM 1560', 'CHEM 2070', 'EAS 1600'],
      [
        'AEM 2100',
        'BTRY 3010',
        'STSCI 2200',
        'MATH 1710',
        'STSCI 2100',
        'ILRST 2100',
        'STSCI 2150',
      ],
      [
        'ANTHR 2201',
        'ANTHR 2420',
        'ASIAN 2273',
        'BSOC 2061',
        'COML 2036',
        'ENGL 3675',
        'ENGL 3795',
        'HIST 2581',
        'NTRES 2320',
        'NTRES 3320',
        'NTRES 3330',
        'PHIL 1440',
      ],
      ['AEM 1500', 'AEM 2500'],
      [
        'BIOEE 3611',
        'ENTOM 2120',
        'NTRES 2100',
        'NTRES 2400',
        'NTRES 3260',
        'NTRES 4560',
        'BIOSM 2500',
      ],
      ['ENVS 2000', 'BEE 2000', 'BEE 2010'],
      ['EAS 4443', 'ENVS 4444', 'ENVS 4940', 'NTRES 4600', 'BIOSM 3750']
    ),
    slotNames: [
      'Foundation course',
      'Social science',
      'Biology',
      'Chemistry/physics',
      'Statistics',
      'Humanities',
      'Economics',
      'Field/Engaged experience',
      'Sustainability science colloquium',
      'Capstone course',
    ],
  },
  {
    name: 'Concentration',
    description:
      'The E&S major comprises an interdisciplinary core curriculum coupled with the completion of courses in a thematic concentration of your choice. All students must select one of six concentrations, consisting of six to ten additional courses beyond the core.',
    source: 'https://cals.cornell.edu/environment-sustainability/education/concentrations',
    fulfilledBy: 'self-check',
    checkerWarning:
      'We currently do not check fulfillment of a concentration. Please check the official CALS/A&S websites.',
  },
];

export default environmentAndSustainability;

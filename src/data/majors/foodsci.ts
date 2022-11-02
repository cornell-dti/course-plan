import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSubRequirements,
  includesWithSingleRequirement,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const foodSciRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Biology Courses',
    description:
      'Two courses out of BIOG 1140, BIOG 1440, BIOG 1500, BIOEE 1610, BIOEE 1780, BIOAP 1100 and PLSCI 1115.',
    source: 'https://cals.cornell.edu/education/degrees-programs/food-science-major-minor',
    checker: includesWithSingleRequirement(
      'BIOG 1140',
      'BIOG 1440',
      'BIOG 1500',
      'BIOEE 1610',
      'BIOEE 1780',
      'BIOAP 1100',
      'PLSCI 1115'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'General Chemistry',
    description: 'Option 1: CHEM 2070 AND CHEM 2080, Option 2: CHEM 2150.',
    source: 'https://cals.cornell.edu/education/degrees-programs/food-science-major-minor',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description: 'CHEM 2070 AND CHEM 2080',
        checker: includesWithSubRequirements(['CHEM 2070'], ['CHEM 2080']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 2070', 'CHEM 2080'],
      },
      'Option 2': {
        description: 'CHEM 2150',
        checker: includesWithSubRequirements(['CHEM 2150']),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
    },
  },
  {
    name: 'Organic Chemistry',
    description: 'CHEM 3570 and CHEM 3580.',
    source: 'https://cals.cornell.edu/education/degrees-programs/food-science-major-minor',
    checker: includesWithSubRequirements(['CHEM 3570'], ['CHEM 3580']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['CHEM 3570', 'CHEM 3580'],
  },
  {
    name: 'Calculus I',
    description: 'MATH 1110',
    source: 'https://cals.cornell.edu/education/degrees-programs/food-science-major-minor',
    checker: includesWithSingleRequirement('MATH 1110'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Statistics',
    description: 'AEM 2100 or STSCI 2100 or STSCI 2150 or STSCI 2200 or MATH 1710 or PSYCH 3500.',
    source: 'https://cals.cornell.edu/education/degrees-programs/food-science-major-minor',
    checker: includesWithSingleRequirement(
      'AEM 2100',
      'STSCI 2100',
      'STSCI 2150',
      'STSCI 2200',
      'MATH 1710',
      'PSYCH 3500'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Microbiology (Lecture & Lab)',
    description: 'BIOMI 2900 (lecture) and BIOMI 2911 (lab).',
    source: 'https://cals.cornell.edu/education/degrees-programs/food-science-major-minor',
    checker: includesWithSubRequirements(['BIOMI 2900'], ['BIOMI 2911']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['BIOMI 2900', 'BIOMI 2911'],
  },
  {
    name: 'Biochemistry',
    description: 'BIOMG 3310 or BIOMG 3350 or NS 3200.',
    source: 'https://cals.cornell.edu/education/degrees-programs/food-science-major-minor',
    checker: includesWithSingleRequirement('BIOMG 3310', 'BIOMG 3350', 'NS 3200'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Physics',
    description: 'PHYS 1101 or PHYS 2207.',
    source: 'https://cals.cornell.edu/education/degrees-programs/food-science-major-minor',
    checker: includesWithSingleRequirement('PHYS 1101', 'PHYS 2207'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Core Courses',
    description:
      'These are the core courses required for every concentration. ' +
      'FDSC 1101, FDSC 1102, NS 1150, FDSC 2000, FDSC 2100, FDSC 2110, ' +
      'FDSC 3940, FDSC 3960, FDSC 4000, FDSC 4170, and FDSC 4210.',
    source: 'https://cals.cornell.edu/education/degrees-programs/food-science-major-minor',
    checker: includesWithSubRequirements(
      ['FDSC 1101'],
      ['FDSC 1102'],
      ['NS 1150'],
      ['FDSC 2000'],
      ['FDSC 2100'],
      ['FDSC 2110'],
      ['FDSC 3940'],
      ['FDSC 3960'],
      ['FDSC 4000'],
      ['FDSC 4170'],
      ['FDSC 4210']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    slotNames: [
      'FDSC 1101',
      'FDSC 1102',
      'NS 1150',
      'FDSC 2000',
      'FDSC 2100',
      'FDSC 2110',
      'FDSC 3940',
      'FDSC 3960',
      'FDSC 4000',
      'FDSC 4170',
      'FDSC 4210',
    ],
  },
  {
    name: 'Concentration',
    description:
      'Students are required to complete one concentration from Science, Safety and Business.\nWarning: For the optional electives in each concentration, we do not check whether the courses selected fulfil the minimum credits needed for that category.',
    source: 'https://cals.cornell.edu/education/degrees-programs/food-science-major-minor',
    fulfilledBy: 'toggleable',
    // TODO: Can change Science and Business options to be fulfilled by credits instead, however would lose slot names.
    fulfillmentOptions: {
      Science: {
        description:
          'Required FDSC courses, and 3 4000+ FDSC electives (with at least 3 credits from group 1 and 2 credits from group 2).',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['FDSC 3950'],
          ['FDSC 4100'],
          ['FDSC 4190'],
          ['FDSC 4230'],
          ['FDSC 4010', 'FDSC 4040', 'FDSC 4050', 'FDSC 4220', 'FDSC 4250', 'FDSC 4400'],
          [
            'FDSC 4020',
            'FDSC 4110',
            'FDSC 4500',
            'FDSC 4510',
            'FDSC 4880',
            'FDSC 5970',
            'FDSC 6950',
          ],
          [
            'FDSC 4020',
            'FDSC 4110',
            'FDSC 4500',
            'FDSC 4510',
            'FDSC 4880',
            'FDSC 5970',
            'FDSC 6950',
            'FDSC 4010',
            'FDSC 4040',
            'FDSC 4050',
            'FDSC 4220',
            'FDSC 4250',
            'FDSC 4400',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 1, 1, 1, 1],
        slotNames: [
          'FDSC 3950',
          'FDSC 4100',
          'FDSC 4190',
          'FDSC 4230',
          'Group 1 4000+ elective',
          'Group 2 4000+ elective',
          'Group 1 or Group 2 4000+ elective',
        ],
      },
      Safety: {
        description:
          '1. Required FDSC courses 2. Epidemiology course 3. Risk analysis and management course 4. Microbial pathogenesis course 5. 2 credits of 4000+ FDSC electives.\nNote: The course options for requirements 2 - 4 are given in order of the preferred course for fulfillment.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['FDSC 3950'],
          ['FDSC 4230', 'FDSC 4250'],
          ['FDSC 5970'],
          ['NS 3600', 'PAM 3280', 'ENTOM 4250'],
          ['PAM 4240', 'DSOC 4080', 'ORIE 2380'],
          ['BIOMS 4040', 'BIOMS 4090', 'BIOMS 4150', 'BIOMS 4340', 'BIOMG 4390'],
          [
            'FDSC 4010',
            'FDSC 4020',
            'FDSC 4040',
            'FDSC 4050',
            'FDSC 4100',
            'FDSC 4110',
            'FDSC 4220',
            'FDSC 4230',
            'FDSC 4250',
            'FDSC 4400',
            'FDSC 4500',
            'FDSC 4880',
            'FDSC 5400',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 1, 1, 1, 1],
        slotNames: [
          'FDSC 3950',
          'FDSC 4230 or FDSC 4250',
          'FDSC 5970',
          'NS 3600 or PAM 3280 or ENTOM 4250 (in preferred order)',
          'PAM 4240 or DSOC 4080 or ORIE 2380 (in preferred order)',
          'BIOMS 4040 or BIOMS 4090 or BIOMS 4150 or BIOMS 4340 or BIOMG 4390 (in preferred order)',
          '2 credits of 4000+ FDSC electives',
        ],
      },
      Business: {
        description:
          'Required FDSC courses, economics course, management course, marketing course, accounting course, finance course, 2 credits of 4000+ FDSC electives, and 6 credits of business electives.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['FDSC 4230'],
          ['FDSC 5970'],
          ['ECON 1110', 'ECON 3030', 'PAM 2000'],
          ['AEM 1200', 'HADM 1810', 'ILRID 1700', 'AEM 2200', 'ILROB 1220'],
          ['AEM 2400', 'HADM 2410', 'NCC 5530', 'AEM 2420'],
          ['AEM 2210', 'HADM 2230', 'NCC 5500', 'AEM 2225'],
          ['AEM 2241', 'NCC 5560', 'HADM 2250', 'AEM 2240'],
          ['FDSC 4***', 'FDSC 5***', 'FDSC 6***'],
          [
            'AEM 3340',
            'AEM 3440',
            'AEM 4485',
            'AEM 3020',
            'AEM 4420',
            'AEM 4450',
            'AEM 3270',
            'AEM 3230',
            'AEM 2011',
            'AEM 2220',
            'AEM 3249',
            'AEM 2230',
            'AEM 2015',
            'AEM 3120',
            'AEM 3249',
            'AEM 4190',
            'NBA 5070',
            'AEM 2480',
            'HADM 3470',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1, 2],
        slotNames: [
          'FDSC 4230',
          'FDSC 5970',
          'Economics Course',
          'Management Course',
          'Marketing Course',
          'Accounting Course',
          'Finance Course',
          '2 credits of 4000+ FDSC electives',
          '6 credits of business electives',
        ],
      },
    },
  },
];

export default foodSciRequirements;

export const foodSciAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Jennifer Alcaine', email: 'jsa97@cornell.edu' }],
};

import { Course, CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const aemRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'CALS Credits',
    description:
      '55 CALS credits are required for graduation. ' +
      'CALS credits include all courses from departments within CALS and courses offered in Applied Economics and Management, ' +
      'Biological Sciences, Biology & Society, Earth and Atmospheric Sciences, Information Science, Nutritional Science, ' +
      'and The Department of Statistics and Data Science.',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/distribution/',
    checker: [
      (course: Course): boolean =>
        ['AG'].includes(course.acadGroup) ||
        ['AEM', 'BIOEE', 'BIOMG', 'BIOMI', 'BIONB', 'BSOC', 'EAS', 'INFO', 'NS', 'STSCI'].includes(
          course.subject
        ),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [55],
  },
  // TODO: only supports one concentration
  {
    name: 'AEM Concentration Requirement',
    // TODO: counting is temp courses. should eventually be credits
    description:
      'AEM majors must choose at least one of the following eleven concentrations by the beginning of their junior year, ' +
      'and may choose no more than two. No more than one course may fulfill the elective credits of two concentrations. ' +
      'Courses used to fulfill a core Applied Economics or Quantitative Methods requirement cannot also count towards a concentration requirement except in EERE. ',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/concentrations/',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      Accounting: {
        description: 'AEM 3360, AEM 3370 and 9 credits from the list.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['AEM 3360'],
          ['AEM 3370'],
          [
            'AEM 3520',
            'AEM 4225',
            'AEM 4520',
            'AEM 4521',
            'AEM 4530',
            'AEM 4531',
            'AEM 4532',
            'AEM 4533',
            'AEM 4534',
            'AEM 4535',
            'AEM 4560',
            'NBA 5090',
            'NBA 5110',
          ]
        ),
        perSlotMinCount: [1, 1, 3],
        slotNames: ['AEM 3360', 'AEM 3370', '9 credits from the list below'],
      },
      'Agribusiness Management': {
        description: 'AEM 3020, HADM 2810 or ILRHR 2600 and 9 credits from the list.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['AEM 3020'],
          ['HADM 2810', 'ILRHR 2600'],
          [
            'AEM 3040',
            'AEM 3260',
            'AEM 3290',
            'AEM 4030',
            'AEM 4050',
            'AEM 4070',
            'AEM 4150',
            'AEM 4210',
            'AEM 4310',
            'AEM 4510',
            'AEM 4560',
          ]
        ),
        perSlotMinCount: [1, 1, 3],
        slotNames: ['AEM 3020', 'HADM 2810 or ILRHR 2600', 'Additional AEM courses'],
      },
      'Applied Economics and Management': {
        description:
          'ECON 3040, at least 12 credits listed under Applied Economics, and at least 3 credits listed under Quantitative Methods. ' +
          'Must be courses that have not already been used to fulfill AEM Core Requirements.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['ECON 3040'],
          // Applied Economics Requirement
          [
            'AEM 2500',
            'AEM 4500',
            'AEM 4510',
            'AEM 4515',
            'AEM 3310',
            'AEM 4100',
            'AEM 4140',
            'AEM 4160',
            'AEM 4550',
            'AEM 2300',
            'AEM 2350',
            'AEM 4300',
            'AEM 4420',
            'AEM 4350',
            'AEM 4420',
            'AEM 4450',
            'AEM 4485',
            'AEM 4545',
            'AEM 4150',
            'AEM 4210',
            'AEM 4310',
          ],
          // Quantitative Methods
          [
            'AEM 2100',
            'AEM MATH 1110',
            'AEM 2010',
            'AEM 2770',
            'AEM 2830',
            'AEM 2840',
            'AEM 3100',
            'AEM 3390',
            'AEM 4060',
            'AEM 4110',
            'AEM 4120',
            'AEM 4190',
            'BTRY 3080',
            'ILRST 3080',
            'STSCI 3080',
            'ECON 3130',
            'ECON 3140',
            'ECON 4020',
            'ILRST 2110',
            'ILRST 3110',
          ]
        ),
        perSlotMinCount: [1, 4, 1],
        slotNames: ['ECON 3040', 'Applied Economics Requirement', 'Quantitative Methods'],
      },
      'Business Analytics': {
        description:
          'AEM 3100 or AEM 4110, AEM 2830 or AEM 2840 or CS 1112, AEM 2820 or CSS/PLSCS 4200 and 6 credits from the list.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['AEM 3100', 'AEM 4110'],
          ['AEM 2830', 'AEM 2840', 'CS 1112'],
          ['AEM 2820', 'CSS 4200'],
          [
            'AEM 2770',
            'AEM 3460',
            'AEM 3561',
            'AEM ',
            'AEM ',
            'AEM ',
            'AEM ',
            'AEM ',
            'AEM ',
            'AEM ',
            'AEM ',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 2],
        slotNames: [
          'AEM 3100 or AEM 4110',
          'AEM 2830 or AEM 2840 or CS 1112',
          'AEM 2820 or CSS 4200',
          '6 credits from the list',
        ],
      },
      Entrepreneurship: {
        description: 'Complete 15 credits from the list with at least 6 credits from AEM.',
        counting: 'courses',
        checker: includesWithSubRequirements([
          'AEM 1220',
          'AEM 2220',
          'AEM 3110',
          'AEM 3220',
          'AEM 3245',
          'AEM 3249',
          'AEM 3250',
          'AEM 3251',
          'AEM 3340',
          'AEM 3380',
          'AEM 4080',
          'AEM 4370',
          'AEM 4371',
          'AEM 4380',
          'AEM 4390',
          'AEM 4420',
          'AEM 4615',
          'HADM 4130',
          'HADM 4211',
          'NBA 3000',
          'NBA 6230',
        ]),
        perSlotMinCount: [5],
        slotNames: ['Course'],
      },
      'Environmental, Energy, and Resource Economics': {
        description:
          'ECON 3030, ECON 3040, AEM 2500, 6 credits from AEM 4500/4510/4515 and 3 credits from the list below.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['ECON 3030'],
          ['ECON 3040'],
          ['AEM 2500'],
          ['AEM 4500', 'AEM 4510', 'AEM 4515'],
          [
            'AEM 3100',
            'AEM 4110',
            'ECON 3120',
            'ECON 3140',
            'ILRST 2110',
            'HADM 3740',
            'PLSCS 4200',
            'STSCI 4060',
            'HADM 4010',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 2, 1],
        slotNames: [
          'ECON 3030',
          'ECON 3040',
          'AEM 2500',
          'AEM 4500 or AEM 4510 or AEM 4515',
          '3 credits from the list below',
        ],
      },
      Finance: {
        description: 'AEM 4570, AEM 4670, AEM 3520 or AEM 3360, 6 credits from the list below.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['AEM 4570'],
          ['AEM 4670'],
          ['AEM 3520', 'AEM 3360'],
          [
            'AEM 4060',
            'AEM 4210',
            'AEM 4230',
            'AEM 4260',
            'AEM 4280',
            'AEM 4290',
            'AEM 4590',
            'AEM 4620',
            'AEM 4630',
            'AEM 4680',
            'AEM 4681',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 2],
        slotNames: [
          'AEM 4570',
          'AEM 4670',
          'AEM 3520 or AEM 3360',
          '6 credits from the list below',
        ],
      },
      'Food Industry Management': {
        description:
          'AEM 2480, AEM 3340 or HADM 3470, AEM 4400, and 6 credits from the list below.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['AEM 2480'],
          ['AEM 3340', 'HADM 3470'],
          ['AEM 4400'],
          ['AEM 3270', 'AEM 4150', 'AEM 4460']
        ),
        perSlotMinCount: [1, 1, 1, 2],
        slotNames: [
          'AEM 2480',
          'AEM 3340 or HADM 3470',
          'AEM 4400',
          'AEM 3270 or AEM 4150 or AEM 4460',
        ],
      },
      'International Trade and Development': {
        description: 'AEM 2300 or AEM 2350 and 12 credits from the list below.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['AEM 2300', 'AEM 2350'],
          [
            'AEM 2110',
            'AEM 4290',
            'AEM 4300',
            'AEM 4350',
            'AEM 4420',
            'AEM 4421',
            'AEM 4450',
            'AEM 4485',
            'AEM 4545',
            'AEM 4640',
          ]
        ),
        perSlotMinCount: [1, 4],
        slotNames: ['AEM 2300 or AEM 2350', '12 credits from the list below'],
      },
      Marketing: {
        description: 'AEM 3440 or HADM 3470, AEM 4410 and 9 credits from the list below.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['AEM 3440', 'HADM 3470'],
          ['AEM 4410'],
          [
            'AEM 3245',
            'AEM 3249',
            'AEM 3270',
            'AEM 4015',
            'AEM 4080',
            'AEM 4095',
            'AEM 4150',
            'AEM 4160',
            'AEM 4400',
            'AEM 4420',
            'AEM 4435',
            'AEM 4495',
            'AEM 4550',
          ]
        ),
        perSlotMinCount: [1, 1, 3],
        slotNames: ['AEM 3440 or HADM 3470', 'AEM 4410', '9 credits from the list below'],
      },
      Strategy: {
        description: '6 and 9 credits from the lists below.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['AEM 3220', 'AEM 4160', 'AEM 4190', 'AEM 4371', 'AEM 4380', 'AEM 4390', 'AEM 4615'],
          [
            'AEM 3110',
            'AEM 3245',
            'AEM 3260',
            'AEM 3249',
            'AEM 3320',
            'AEM 4010',
            'AEM 4015',
            'AEM 4080',
            'AEM 4580',
            'AEM 4421',
          ]
        ),
        perSlotMinCount: [2, 3],
        slotNames: ['6 credits from the list below', '9 credits from the list below'],
      },
    },
  },
  {
    name: 'Management Requirements',
    description:
      'AEM 3200 and AEM 3230 are optional for the following three concentrations: ' +
      'applied economics; environmental, energy, and resource economics; and international trade and development.',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSubRequirements(
      ['AEM 2200'],
      ['AEM 2225'],
      ['AEM 2240'],
      ['AEM 2420'],
      ['AEM 2601'],
      ['AEM 3200'],
      ['AEM 3230']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1],
    slotNames: ['AEM 2200', 'AEM 2225', 'AEM 2240', 'AEM 2420', 'AEM 2601', 'AEM 3200', 'AEM 3230'],
  },
  {
    name: 'Economics Requirements',
    description:
      'ECON 1110, ECON 1120, AND AEM 2600. For students concentrating in environmental, energy, and resource economics, ECON 3030 is required instead of AEM 2600.',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSubRequirements(['ECON 1110'], ['ECON 1120'], ['AEM 2600', 'ECON 3030']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['ECON 1110', 'ECON 1120', 'AEM 2600 or ECON 3030'],
  },
  {
    name: 'Quantitative Methods Requirements',
    description: 'AEM 2100, MATH 1110 OR MATH 1120, AND AEM 2010',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSubRequirements(['AEM 2100'], ['MATH 1110', 'MATH 1120'], ['AEM 2010']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['AEM 2100', 'MATH 1110 OR MATH 1120', 'AEM 2010'],
  },
  {
    name: 'Quantitative Methods Elective Requirements',
    description: 'At least 3 elective credits from the following.',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSingleRequirement(
      'AEM 2770',
      'AEM 2830',
      'AEM 2840',
      'AEM 3100',
      'AEM 3390',
      'AEM 4060',
      'AEM 4110',
      'AEM 4120',
      'AEM 4190',
      'BTRY 3080',
      'ILRST 3080',
      'STSCI 3080',
      'ECON 3130',
      'ECON 3140',
      'ECON 4020',
      'ILRST 2110',
      'ILRST 3110'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Applied Economics Requirements',
    description:
      'At least 6 credits; must come from two of the four categories below. ' +
      'Courses used to fulfill a quantitative methods requirement or a concentration requirement or elective ' +
      'cannot also be counted toward a core applied economics requirement, unless that concentration is environmental, energy, and resource economics.',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSubRequirements(
      ['AEM 2500', 'AEM 4500', 'AEM 4510', 'AEM 4515'],
      ['AEM 3310', 'AEM 4100', 'AEM 4140', 'AEM 4160', 'AEM 4550'],
      [
        'AEM 2300',
        'AEM 2350',
        'AEM 4300',
        'AEM 4420',
        'AEM 4350',
        'AEM 4420',
        'AEM 4450',
        'AEM 4485',
        'AEM 4545',
      ],
      ['AEM 4150', 'AEM 4210', 'AEM 4310']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: [
      'Environmental, Energy, and Resource Economics',
      'Economic Analysis',
      'International Trade and Development',
      'Food and Agricultural Economics',
    ],
    minNumberOfSlots: 2,
  },
  {
    name: 'Grand Challenges Reqiurement Part 1: Written expression course',
    description:
      'Taken during Sophomore year. Focus: Critical thinking. ' +
      'These course options are centered around contemporary global issues and will help you learn communication, business analysis, and critical thinking skills as you develop cultural awareness. ' +
      "Available courses may vary per semester. You'll choose one of the following:",
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSingleRequirement(
      'AEM 2000',
      'AEM 2555',
      'AEM 2800',
      'AEM 2805',
      'AEM 4940'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Grand Challenges Reqiurement Part 2: Pre-Project Weekend Immersion',
    description: 'Taking during Junior year. Focus: Working as part of a team',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSingleRequirement('AEM 3000'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Grand Challenges Reqiurement Part 3: Project Course',
    description: 'Taking during Senior year. Focus: Local and global community involvement',
    source: 'https://dyson.cornell.edu/programs/undergraduate/degree-requirements/core/',
    checker: includesWithSingleRequirement('AEM 4000'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
];

export default aemRequirements;

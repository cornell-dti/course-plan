import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const source = 'https://catalog.cornell.edu/programs/agricultural-sciences-bs/';

const agsciRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description:
      'PLSCI 1101, PLSCI 1110, PLSCI 1900, PLSCI 2110, PLSCI 2440, and PLSCI 2600. ' +
      'PLSCI 1110 (Pathways to Success) is required only for fall-entry first-year students and is waived for transfer students. ' +
      'All courses that satisfy a major requirement must be taken for a letter grade unless S/U grading is the only option, ' +
      'and a course cannot be used to satisfy more than one requirement in the major.',
    source,
    checker: includesWithSubRequirements(
      ['PLSCI 1101'],
      ['PLSCI 1110'],
      ['PLSCI 1900'],
      ['PLSCI 2110'],
      ['PLSCI 2440'],
      ['PLSCI 2600']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1],
    slotNames: ['PLSCI 1101', 'PLSCI 1110', 'PLSCI 1900', 'PLSCI 2110', 'PLSCI 2440', 'PLSCI 2600'],
  },
  {
    name: 'Introductory Biology',
    description:
      'Select two introductory biology courses from the approved list. AP credit in Biology may be used to fulfill this requirement. ' +
      'Students should discuss biology options with their advisor, particularly those interested in research, graduate school, or pre-health studies.',
    source,
    checker: includesWithSingleRequirement(
      'BIOAP 1100',
      'BIOEE 1610',
      'BIOEE 1780',
      'BIOG 1140',
      'BIOG 1440',
      'BIOG 1445',
      'BIOMG 1350',
      'PLSCI 1115',
      'PLSCI 1130',
      'PLSCI 1420',
      'PLSCI 2400',
      'PLSCI 2410',
      'PLSCI 2470'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Chemistry or Physics',
    description:
      'Select one of: CHEM 1560 with CHEM 1561, CHEM 2070 with CHEM 2071, PHYS 1203, or PHYS 2207. ' +
      'AP credit in Chemistry or Physics may be used to fulfill this requirement. ' +
      'Two semesters of chemistry, including organic chemistry, are recommended for students interested in research, graduate school, or pre-health studies.',
    source,
    checker: includesWithSingleRequirement('CHEM 1560', 'CHEM 2070', 'PHYS 1203', 'PHYS 2207'),
    checkerWarning: 'We do not check that the corresponding chemistry laboratory course was taken.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Data Literacy',
    description:
      'Select one of: AEM 2100, ENTOM 3030, PLSCI 2200, STSCI 2100, or STSCI 2150. ' +
      'An AP Statistics score of 5 may be used to fulfill this requirement.',
    source,
    checker: includesWithSingleRequirement(
      'AEM 2100',
      'ENTOM 3030',
      'PLSCI 2200',
      'STSCI 2100',
      'STSCI 2150'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Food Systems',
    description: 'Select one of: AEM 2310, FDSC 1200, FDSC 2000, PLSCI 1300, or PLSCI 2020.',
    source,
    checker: includesWithSingleRequirement(
      'AEM 2310',
      'FDSC 1200',
      'FDSC 2000',
      'PLSCI 1300',
      'PLSCI 2020'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Education / Extension',
    description:
      'Select one of: COMM 2850, EDUC 2200, EDUC 2210, EDUC 2410, EDUC 3510, EDUC 4223, or ENTOM 3350.',
    source,
    checker: includesWithSingleRequirement(
      'COMM 2850',
      'EDUC 2200',
      'EDUC 2210',
      'EDUC 2410',
      'EDUC 3510',
      'EDUC 4223',
      'ENTOM 3350'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Agribusiness',
    description: 'Select one of: AEM 1200, AEM 2050, AEM 3020, or AEM 3260.',
    source,
    checker: includesWithSingleRequirement('AEM 1200', 'AEM 2050', 'AEM 3020', 'AEM 3260'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Animal Science',
    description:
      'Select one of: ANSC 2120, ANSC 2500, ANSC 2650, ANSC 3300, ANSC 3500, ANSC 3600, or ANSC 3800.',
    source,
    checker: includesWithSingleRequirement(
      'ANSC 2120',
      'ANSC 2500',
      'ANSC 2650',
      'ANSC 3300',
      'ANSC 3500',
      'ANSC 3600',
      'ANSC 3800'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'International Agriculture',
    description:
      'Select one of: ANSC 2550 with ANSC 2551, ANSC 3560 with ANSC 3561 and ANSC 3562, ANSC 4880, GDEV 2300, GDEV 4140, or GDEV 4450.',
    source,
    checker: includesWithSingleRequirement(
      'ANSC 2550',
      'ANSC 3560',
      'ANSC 4880',
      'GDEV 2300',
      'GDEV 4140',
      'GDEV 4450'
    ),
    checkerWarning:
      'We do not check that the companion courses (ANSC 2551, ANSC 3561, ANSC 3562) were taken.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Focused Electives',
    description:
      'Students choose one of the focus areas and complete all of its requirements: Animal Science; ' +
      'Agribusiness (Track One: Business Management, or Track Two: Policy Analysis; tracks may not be mixed); ' +
      'Sustainable Cropping Systems Management; or Soil Health Management. ' +
      'Focused electives require 15 to 25.5 credits depending on the area and must be taken for a letter grade unless S/U is the only option.',
    source,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Animal Science': {
        description:
          'ANSC 2210; two courses from List One (ANSC 2120, ANSC 2400 with ANSC 2410, ANSC 3540, ANSC 3550); ' +
          'and two courses from List Two (ANSC 2500, ANSC 2650, ANSC 3300, ANSC 3500, ANSC 3510, ANSC 3600, ANSC 3800).',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['ANSC 2210'],
          ['ANSC 2120', 'ANSC 2400', 'ANSC 3540', 'ANSC 3550'],
          [
            'ANSC 2500',
            'ANSC 2650',
            'ANSC 3300',
            'ANSC 3500',
            'ANSC 3510',
            'ANSC 3600',
            'ANSC 3800',
          ]
        ),
        perSlotMinCount: [1, 2, 2],
        slotNames: ['ANSC 2210', 'List One', 'List Two'],
      },
      'Agribusiness: Business Management': {
        description:
          'AEM 1200, ECON 1110, and AEM 2310; one Management course (AEM 3020 or AEM 3260); ' +
          'one Marketing / Strategy course (AEM 2480, AEM 3270, AEM 3385, or AEM 4420); ' +
          'and one Finance course (AEM 2050, AEM 4060, or AEM 4210).',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['AEM 1200'],
          ['ECON 1110'],
          ['AEM 2310'],
          ['AEM 3020', 'AEM 3260'],
          ['AEM 2480', 'AEM 3270', 'AEM 3385', 'AEM 4420'],
          ['AEM 2050', 'AEM 4060', 'AEM 4210']
        ),
        perSlotMinCount: [1, 1, 1, 1, 1, 1],
        slotNames: [
          'AEM 1200',
          'ECON 1110',
          'AEM 2310',
          'Management',
          'Marketing / Strategy',
          'Finance',
        ],
      },
      'Agribusiness: Policy Analysis': {
        description:
          'AEM 1200, ECON 1110, and AEM 2310; one Applied Economics course (AEM 2300, AEM 2310, AEM 2350, or AEM 2500); ' +
          'one Policy Issues and Communication course (AEM 2000, AEM 2805, AEM 3310, BSOC 3311, COMM 2200, or PUBPOL 2040); ' +
          'and two Policy Analysis courses (AEM 4350, AEM 4450, NS 4480).',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['AEM 1200'],
          ['ECON 1110'],
          ['AEM 2310'],
          ['AEM 2300', 'AEM 2310', 'AEM 2350', 'AEM 2500'],
          ['AEM 2000', 'AEM 2805', 'AEM 3310', 'BSOC 3311', 'COMM 2200', 'PUBPOL 2040'],
          ['AEM 4350', 'AEM 4450', 'NS 4480']
        ),
        perSlotMinCount: [1, 1, 1, 1, 1, 2],
        slotNames: [
          'AEM 1200',
          'ECON 1110',
          'AEM 2310',
          'Applied Economics',
          'Policy Issues and Communication',
          'Policy Analysis',
        ],
      },
      'Sustainable Cropping Systems Management': {
        description:
          'PLSCI 2250 and PLSCI 2940; two Cropping Systems courses; two Pest Management courses (ENTOM 3410, PLSCI 3010, PLSCI 3150); ' +
          'and one Soil Science course (ANSC 4120, PLSCI 2200, PLSCI 3210, PLSCI 4200, PLSCI 4660, PLSCI 4720).',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['PLSCI 2250'],
          ['PLSCI 2940'],
          [
            'PLSCI 3025',
            'PLSCI 3210',
            'PLSCI 3350',
            'PLSCI 3520',
            'PLSCI 4020',
            'PLSCI 4030',
            'PLSCI 4140',
            'PLSCI 4230',
            'PLSCI 4500',
            'PLSCI 4551',
            'PLSCI 4730',
            'NTRES 3250',
            'VIEN 2400',
          ],
          ['ENTOM 3410', 'PLSCI 3010', 'PLSCI 3150'],
          ['ANSC 4120', 'PLSCI 2200', 'PLSCI 3210', 'PLSCI 4200', 'PLSCI 4660', 'PLSCI 4720']
        ),
        perSlotMinCount: [1, 1, 2, 2, 1],
        slotNames: [
          'PLSCI 2250',
          'PLSCI 2940',
          'Cropping Systems',
          'Pest Management',
          'Soil Science',
        ],
      },
      'Soil Health Management': {
        description:
          'A minimum of 15 credits from: PLSCI 2200, PLSCI 3210, PLSCI 3630, PLSCI 3650, ANSC 4120, PLSCI 4200, ' +
          'PLSCI 4660 (must be taken with lab), and PLSCI 4720.',
        counting: 'credits',
        checker: includesWithSingleRequirement(
          'PLSCI 2200',
          'PLSCI 3210',
          'PLSCI 3630',
          'PLSCI 3650',
          'ANSC 4120',
          'PLSCI 4200',
          'PLSCI 4660',
          'PLSCI 4720'
        ),
        perSlotMinCount: [15],
      },
    },
  },
  {
    name: 'Required Internship',
    description:
      'Students must complete an agriculturally-related internship of at least six weeks of full-time effort before senior year, ' +
      'with a learning agreement and post-experience reflection assessed in the required course PLSCI 4900.',
    source,
    checker: includesWithSingleRequirement('PLSCI 4900'),
    checkerWarning: 'We do not check that the internship itself was completed.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['PLSCI 4900'],
  },
];

export default agsciRequirements;

export const agsciAdvisors: AdvisorGroup = {
  advisors: [
    { name: 'Frank Rossi', email: 'fsr3@cornell.edu' },
    { name: 'Lisa Woodruff', email: 'sips-studentsvcs@cornell.edu' },
  ],
};

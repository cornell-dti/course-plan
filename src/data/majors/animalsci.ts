import { CollegeOrMajorRequirement, Course, RequirementChecker } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

/**
 * CoursePlan allows only one checker on a credits-counted requirement, so the
 * per-area checkers of a concentration are merged into one and the per-area
 * credit minimums are stated in the description and checkerWarning instead.
 */
const anyOf = (checkers: readonly RequirementChecker[]): readonly RequirementChecker[] => [
  (course: Course): boolean => checkers.some(checker => checker(course)),
];

const source = 'https://catalog.cornell.edu/programs/animal-science-bs/';

const generalChemistryWithLab = ['CHEM 1560', 'CHEM 1561', 'CHEM 2070', 'CHEM 2071'];
const organicChemistryOrPhysics = ['CHEM 1570', 'CHEM 3570', 'EAS 1600', 'PHYS 1203'];
const economicsFinance = [
  'AEM 1200',
  'AEM 1500',
  'AEM 2210',
  'AEM 2220',
  'ALS 2050',
  'ECON 1110',
  'ECON 1120',
  'HADM 2230',
];
const physiologyCourses = [
  'ANSC 3000',
  'ANSC 3300',
  'ANSC 3400',
  'ANSC 3410',
  'ANSC 3450',
  'ANSC 3540',
  'ANSC 3700',
  'ANSC 3920',
  'ANSC 4270',
  'ANSC 4310',
  'ANSC 4410',
  'ANSC 4500',
];
const nutritionCourses = ['ANSC 3550', 'ANSC 4110', 'ANSC 4200', 'ANSC 4280'];
const additionalCourses = [
  'BIOEE 1610',
  'BIOEE 1780',
  'BIOEE 2740',
  'BIOEE 4700',
  'BIOEE 4750',
  'BIOMI 2900',
  'BIOSM 1500',
  'BIOSM 1610',
  'BIOSM 1780',
  'EAS 1600',
  'ENTOM 2030',
  'ENTOM 2120',
  'FDSC 2000',
  'NS 1150',
  'NS 2750',
  'NS 3410',
  'NTRES 1101',
  'NTRES 2010',
  'NTRES 2100',
  'NTRES 2201',
  'PLSCI 1101',
  'PLSCI 1115',
  'PLSCI 2410',
  'PLSCI 2600',
  'PLSCI 3440',
];

const animalsciRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Foundational Competency',
    description:
      'ANSC 1101, ANSC 1105, BIOAP 1100, ANSC 2120, ANSC 2210, and ANSC 2400. ' +
      'ANSC 1101 and ANSC 1105 are waived for transfer students. ' +
      'AP, IB, and dual-enrollment credit cannot be used to fulfill Core Coursework requirements.',
    source,
    checker: includesWithSubRequirements(
      ['ANSC 1101'],
      ['ANSC 1105'],
      ['BIOAP 1100'],
      ['ANSC 2120'],
      ['ANSC 2210'],
      ['ANSC 2400']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1],
    slotNames: ['ANSC 1101', 'ANSC 1105', 'BIOAP 1100', 'ANSC 2120', 'ANSC 2210', 'ANSC 2400'],
    disallowTransferCredit: true,
  },
  {
    name: 'Fundamentals of Animal Management',
    description:
      'Select one of: ANSC 2500, ANSC 2650, ANSC 3000, ANSC 3450, ANSC 3600, or ANSC 3800. ' +
      'ANSC 2500 may be used to meet both this requirement and the prerequisite requirement for the Dairy Management concentration.',
    source,
    checker: includesWithSingleRequirement(
      'ANSC 2500',
      'ANSC 2650',
      'ANSC 3000',
      'ANSC 3450',
      'ANSC 3600',
      'ANSC 3800'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
  {
    name: 'Ethics and Animal Welfare',
    description: 'ANSC 3100 or ANSC 4140.',
    source,
    checker: includesWithSingleRequirement('ANSC 3100', 'ANSC 4140'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
  {
    name: 'Statistics',
    description:
      'Select one of: AEM 2100, STSCI 2100, STSCI 2150, or STSCI 2200. ' +
      'Any course with the DLS-AG tag that meets the CALS data literacy: statistics requirement is also accepted.',
    source,
    checker: includesWithSingleRequirement('AEM 2100', 'STSCI 2100', 'STSCI 2150', 'STSCI 2200'),
    checkerWarning: 'We only check the courses listed in the catalog, not every DLS-AG course.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
  {
    name: 'Sustainability Challenges',
    description:
      'Select one course from the approved sustainability list (e.g. ANSC 1120, ANSC 2000, GDEV 2300, PLSCI 1900). ' +
      'SCH-AG courses are also accepted for this requirement.',
    source,
    checker: includesWithSingleRequirement(
      'AEM 1500',
      'ANSC 1120',
      'ANSC 2000',
      'ANSC 4120',
      'ANSC 4880',
      'BIOEE 4690',
      'EAS 1108',
      'ENTOM 3440',
      'FDSC 1200',
      'GDEV 2300',
      'NS 4450',
      'NTRES 1101',
      'NTRES 2010',
      'NTRES 3240',
      'NTRES 3250',
      'NTRES 4600',
      'PLSCI 1900',
      'PLSCI 2400',
      'PLSCI 4730'
    ),
    checkerWarning: 'We only check the courses listed in the catalog, not every SCH-AG course.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
  {
    name: 'Minimum Animal Science Credits',
    description:
      'Students must complete a minimum of 36 credits in Animal Science courses, including BIOAP 1100 and any course coded or cross-listed with ANSC. ' +
      'No more than 3 of the 36 credits can come from Special Studies courses (ANSC 4960, ANSC 4970, ANSC 4980, ANSC 4990). ' +
      'Transfer courses coded as ANSC do not count toward this requirement.',
    source,
    checker: includesWithSingleRequirement('ANSC ****', 'BIOAP 1100'),
    checkerWarning: 'We do not check the 3-credit limit on Special Studies courses.',
    fulfilledBy: 'credits',
    perSlotMinCount: [36],
    allowCourseDoubleCounting: true,
    disallowTransferCredit: true,
  },
  {
    name: 'Concentration',
    description:
      'Students select one concentration and complete all of its requirements (30-42 credits): Pre-Veterinary Medicine, Dairy Management, ' +
      'Animal Ecology and Conservation, Applied Animal Biology and Management, or Integrative Physiology and Nutrition. ' +
      'A course cannot fulfill both a Core Coursework and a Concentration requirement (except ANSC 2500 for Dairy Management), ' +
      'and a course cannot fulfill more than one requirement within a concentration. ' +
      'For credit-counted concentrations only the total credits are checked; the per-area credit minimums in each description must be confirmed with your advisor.',
    source,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Pre-Veterinary Medicine': {
        description:
          'BIOMG 1350 and BIOG 1500; 11 credits of upper-level ANSC courses including at least 3 credits in Nutrition and 6 credits in Physiology; ' +
          'CHEM 2070, CHEM 2071, CHEM 2080, and CHEM 2081; CHEM 3570; at least 4 credits of biochemistry (BIOMG 3310 and BIOMG 3320 recommended, or BIOMG 3300, NS 3200, or BIOMG 3350); ' +
          'one Advanced Life Sciences course; and PHYS 2207 and PHYS 2208. ' +
          'Students must maintain a cumulative GPA of 2.8 or higher and a grade of C- or better in all major coursework to remain in this concentration.',
        counting: 'credits',
        checker: anyOf(
          includesWithSubRequirements(
            ['BIOMG 1350'],
            ['BIOG 1500'],
            nutritionCourses,
            physiologyCourses,
            [...nutritionCourses, ...physiologyCourses],
            ['CHEM 2070', 'CHEM 2071', 'CHEM 2080', 'CHEM 2081'],
            ['CHEM 3570'],
            ['BIOMG 3310', 'BIOMG 3320', 'BIOMG 3300', 'NS 3200', 'BIOMG 3350'],
            [
              'BIOAP 3110',
              'BIOAP 3190',
              'BIOAP 4130',
              'BIOEE 4700',
              'BIOMG 3850',
              'BIOMI 2900',
              'BIOMI 2911',
              'BIOMS 3160',
              'NS 3410',
            ],
            ['PHYS 2207', 'PHYS 2208']
          )
        ),
        perSlotMinCount: [42],
      },
      'Dairy Management': {
        description:
          'ANSC 2500 (prerequisite); ANSC 3450 or ANSC 4040; ANSC 3510; ANSC 3540; ANSC 3550; ANSC 4510; ANSC 4560; ALS 3020; ' +
          'CHEM 1560 and CHEM 1561; two Economics/Finance courses; and one Additional course from the approved list ' +
          '(PLSCI 3210 requires PLSCI 1900 or PLSCI 2600 as a prerequisite).',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['ANSC 2500'],
          ['ANSC 3450', 'ANSC 4040'],
          ['ANSC 3510'],
          ['ANSC 3540'],
          ['ANSC 3550'],
          ['ANSC 4510'],
          ['ANSC 4560'],
          ['ALS 3020'],
          ['CHEM 1560'],
          ['CHEM 1561'],
          [
            'AEM 1200',
            'AEM 1500',
            'AEM 2210',
            'AEM 2220',
            'AEM 2241',
            'ALS 2050',
            'ECON 1110',
            'ECON 1120',
            'HADM 2230',
            'HADM 2250',
          ],
          [
            'AEM 2011',
            'AEM 2310',
            'AEM 2400',
            'AEM 2480',
            'AEM 2820',
            'AEM 2830',
            'AEM 2850',
            'AEM 3040',
            'ALS 1110',
            'ANSC 4110',
            'ANSC 4120',
            'ANSC 4880',
            'HADM 4150',
            'ILRHR 2600',
            'NBA 3000',
            'PLSCI 2110',
            'PLSCI 2200',
            'PLSCI 2600',
            'PLSCI 3030',
            'PLSCI 3150',
            'PLSCI 3210',
          ]
        ),
        perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        slotNames: [
          'ANSC 2500',
          'ANSC 3450 or ANSC 4040',
          'ANSC 3510',
          'ANSC 3540',
          'ANSC 3550',
          'ANSC 4510',
          'ANSC 4560',
          'ALS 3020',
          'CHEM 1560',
          'CHEM 1561',
          'Economics/Finance',
          'Additional Course',
        ],
      },
      'Animal Ecology and Conservation': {
        description:
          'One Foundational course (BIOEE 1610, BIOEE 1780, BIOSM 1610, or BIOSM 1780); 12 credits of Core Physiological Principles; ' +
          '5 credits of Species Diversity and Evolution; 3 credits of Ecosystem and Conservation; ' +
          'at least 4 credits of general chemistry with lab (CHEM 1560 and CHEM 1561, or CHEM 2070 and CHEM 2071); ' +
          '3 credits of organic chemistry or physics; one Economics/Finance course; and one Applied Laboratory and Research Techniques course. ' +
          'Up to 3 credits of research (4990 in any department) can be used for the applied laboratory requirement with faculty advisor approval.',
        counting: 'credits',
        checker: anyOf(
          includesWithSubRequirements(
            ['BIOEE 1610', 'BIOEE 1780', 'BIOSM 1610', 'BIOSM 1780'],
            [
              'ANSC 2300',
              'ANSC 3000',
              'ANSC 3300',
              'ANSC 3400',
              'ANSC 3410',
              'ANSC 3700',
              'ANSC 3920',
              'ANSC 4200',
              'ANSC 4270',
              'ANSC 4280',
              'ANSC 4310',
              'ANSC 4410',
              'ANSC 4500',
            ],
            [
              'ANSC 1130',
              'BIOEE 1780',
              'BIOEE 2740',
              'BIOEE 3730',
              'BIOEE 4530',
              'BIOEE 4700',
              'BIOEE 4750',
              'BIOEE 4751',
              'BIOSM 1640',
              'BIOSM 1650',
              'BIOSM 3210',
              'BIOSM 3450',
              'BIOSM 3740',
              'BIOSM 4650',
              'ENTOM 2030',
              'ENTOM 2120',
              'ENTOM 3310',
              'ENTOM 3311',
            ],
            [
              'ANSC 4880',
              'BIOEE 3610',
              'BIOEE 4660',
              'BIOEE 4780',
              'BIOMI 3500',
              'BIOSM 2800',
              'BIOSM 3750',
              'EAS 2680',
              'NTRES 2010',
              'NTRES 3220',
              'NTRES 4600',
            ],
            generalChemistryWithLab,
            organicChemistryOrPhysics,
            economicsFinance,
            [
              'ANSC 2410',
              'ANSC 4020',
              'ANSC 4310',
              'ANSC 4990',
              'BIOG 1500',
              'BIOEE 3611',
              'BIOMI 2911',
              'BIOMG 4810',
              'BIOSM 1500',
              'BIOSM 2350',
              'BIOSM 2450',
              'BIOSM 3750',
              'ENTOM 3030',
              'NTRES 2100',
              'NTRES 2400',
              'NTRES 3100',
              'NTRES 3150',
              'NTRES 3400',
              'NTRES 4100',
              'NTRES 4120',
            ]
          )
        ),
        perSlotMinCount: [36],
      },
      'Applied Animal Biology and Management': {
        description:
          'One Nutrition course (ANSC 3550, ANSC 4110, ANSC 4200, or ANSC 4280); 5 credits of Physiology; 9 credits of Animal Management; ' +
          'at least 4 credits of general chemistry with lab (CHEM 1560 and CHEM 1561, or CHEM 2070 and CHEM 2071); ' +
          '3 credits of organic chemistry or physics; one Economics/Finance course; and one Additional course from the approved list.',
        counting: 'credits',
        checker: anyOf(
          includesWithSubRequirements(
            nutritionCourses,
            [
              'ANSC 3000',
              'ANSC 3300',
              'ANSC 3400',
              'ANSC 3410',
              'ANSC 3700',
              'ANSC 3920',
              'ANSC 4270',
              'ANSC 4310',
              'ANSC 4410',
              'ANSC 4500',
            ],
            [
              'ANSC 1130',
              'ANSC 2100',
              'ANSC 2300',
              'ANSC 2500',
              'ANSC 2650',
              'ANSC 3000',
              'ANSC 3100',
              'ANSC 3310',
              'ANSC 3450',
              'ANSC 3500',
              'ANSC 3510',
              'ANSC 3540',
              'ANSC 3600',
              'ANSC 3800',
              'ANSC 4120',
            ],
            generalChemistryWithLab,
            organicChemistryOrPhysics,
            [...economicsFinance, 'ALS 3020'],
            additionalCourses
          )
        ),
        perSlotMinCount: [30],
      },
      'Integrative Physiology and Nutrition': {
        description:
          '12 credits in Animal Physiology and Nutrition, including at least 3 credits in Physiology and 3 credits in Nutrition; ' +
          'at least 4 credits of general chemistry with lab (CHEM 1560 and CHEM 1561, or CHEM 2070 and CHEM 2071); ' +
          '3 credits of organic chemistry or physics; one Economics/Finance course; 5 credits of Applied Laboratory and Research Techniques ' +
          '(no more than 3 credits of research); and one Additional course from the approved list.',
        counting: 'credits',
        checker: anyOf(
          includesWithSubRequirements(
            physiologyCourses.filter(code => code !== 'ANSC 3540'),
            nutritionCourses,
            [...physiologyCourses.filter(code => code !== 'ANSC 3540'), ...nutritionCourses],
            generalChemistryWithLab,
            organicChemistryOrPhysics,
            economicsFinance,
            [
              'ANSC 2410',
              'ANSC 3310',
              'ANSC 4020',
              'ANSC 4310',
              'ANSC 4990',
              'BIOG 1500',
              'BIOAP 3190',
              'BIOMI 2911',
              'BIOEE 3611',
              'BIOMG 4810',
              'ENTOM 3030',
              'NTRES 2100',
              'NTRES 3100',
              'NTRES 3150',
              'NTRES 3400',
            ],
            additionalCourses
          )
        ),
        perSlotMinCount: [30],
      },
    },
  },
];

export default animalsciRequirements;

export const animalsciAdvisors: AdvisorGroup = {
  advisors: [],
};

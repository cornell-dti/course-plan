import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const CATALOG = 'https://catalog.cornell.edu/programs/fiber-science-bs/';

/** Special studies and honors courses that cannot count toward the Advanced Courses requirement. */
const EXCLUDED_ADVANCED = ['4000', '4010', '4020', '4030', '4990'];

/** Courses that may not count toward the Outside of Fiber Science requirement. */
const EXCLUDED_OUTSIDE = ['PUBPOL 2100', 'PUBPOL 3120', 'DEA 3550', 'HD 2830'];
const SPECIAL_STUDIES_NBRS = ['4000', '4010', '4020', '4030'];

const fiberScienceRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description:
      'FSAD 1140, FSAD 1350, FSAD 1360, FSAD 2370, FSAD 3200, FSAD 3320, FSAD 3350, FSAD 4360, FSAD 4460, and FSAD 4660 (28 credits). ' +
      'Courses taken for this area cannot also count for the Introductory Courses or Advanced Courses requirements.',
    source: CATALOG,
    checker: includesWithSubRequirements(
      ['FSAD 1140'],
      ['FSAD 1350'],
      ['FSAD 1360'],
      ['FSAD 2370'],
      ['FSAD 3200'],
      ['FSAD 3320'],
      ['FSAD 3350'],
      ['FSAD 4360'],
      ['FSAD 4460'],
      ['FSAD 4660']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    slotNames: [
      'FSAD 1140',
      'FSAD 1350',
      'FSAD 1360',
      'FSAD 2370',
      'FSAD 3200',
      'FSAD 3320',
      'FSAD 3350',
      'FSAD 4360',
      'FSAD 4460',
      'FSAD 4660',
    ],
  },
  {
    name: 'Introductory Courses',
    description:
      'Two FSAD courses at the 1000, 2000, or 3000 level (6-8 credits) beyond the Core Courses.',
    source: CATALOG,
    checker: includesWithSingleRequirement('FSAD 1***', 'FSAD 2***', 'FSAD 3***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Advanced Courses',
    description:
      'Two upper-level FSAD courses (6-8 credits), at least one at the 6000 level. ' +
      'FSAD 4000, FSAD 4010, FSAD 4020, FSAD 4030, and FSAD 4990 cannot count here.',
    source: CATALOG,
    checker: [
      (course: Course): boolean =>
        course.subject === 'FSAD' &&
        Number(course.catalogNbr) >= 4000 &&
        !EXCLUDED_ADVANCED.includes(course.catalogNbr),
      (course: Course): boolean => course.subject === 'FSAD' && course.catalogNbr.startsWith('6'),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['Upper-level FSAD course', '6000-level FSAD course'],
  },
  {
    name: 'Computer Science',
    description:
      'One of CS 1110, CS 1112, CS 2110, or AEM 2841. An AP Computer Science score of 5 also fulfills this requirement.',
    source: CATALOG,
    checker: includesWithSingleRequirement('CS 1110', 'CS 1112', 'CS 2110', 'AEM 2841'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Introductory Chemistry',
    description:
      'CHEM 2070, CHEM 2071, CHEM 2080, and CHEM 2081 (8 credits), or CHEM 2150 ' +
      '(eligible to take with an AP Chemistry score of 5).',
    source: CATALOG,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'General Chemistry Sequence': {
        description: 'CHEM 2070, CHEM 2071, CHEM 2080, and CHEM 2081',
        checker: includesWithSubRequirements(
          ['CHEM 2070'],
          ['CHEM 2071'],
          ['CHEM 2080'],
          ['CHEM 2081']
        ),
        counting: 'courses',
        perSlotMinCount: [1, 1, 1, 1],
        slotNames: ['CHEM 2070', 'CHEM 2071', 'CHEM 2080', 'CHEM 2081'],
      },
      'Honors General Chemistry': {
        description: 'CHEM 2150 (eligible to take with an AP Chemistry score of 5)',
        checker: includesWithSingleRequirement('CHEM 2150'),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['CHEM 2150'],
      },
    },
  },
  {
    name: 'Organic Chemistry',
    description: 'CHEM 2510 and one of CHEM 3570 or CHEM 3590.',
    source: CATALOG,
    checker: includesWithSubRequirements(['CHEM 2510'], ['CHEM 3570', 'CHEM 3590']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['CHEM 2510', 'CHEM 3570 or CHEM 3590'],
  },
  {
    name: 'Physics',
    description: 'PHYS 1112 and PHYS 2213, or PHYS 2207 and PHYS 2208.',
    source: CATALOG,
    checker: includesWithSubRequirements(['PHYS 1112', 'PHYS 2207'], ['PHYS 2213', 'PHYS 2208']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['Physics I', 'Physics II'],
  },
  {
    name: 'Additional Approved Elective Sequence',
    description:
      'Students choose one area to complete: Apparel Design, Materials Science and Engineering, ' +
      'Environment and Sustainability, or Biomedical. ' +
      'Courses used here may not apply towards the Introductory Courses or Advanced Courses requirements.',
    source: CATALOG,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Apparel Design': {
        description: 'FSAD 1450 and one of FSAD 3370, FSAD 3650, FSAD 3990, or FSAD 6900.',
        checker: includesWithSubRequirements(
          ['FSAD 1450'],
          ['FSAD 3370', 'FSAD 3650', 'FSAD 3990', 'FSAD 6900']
        ),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['FSAD 1450', 'FSAD 3370, FSAD 3650, FSAD 3990, or FSAD 6900'],
      },
      'Materials Science and Engineering': {
        description: 'MSE 2610 and one of MSE 2620, MSE 3010, MSE 3040, or MSE 3050.',
        checker: includesWithSubRequirements(
          ['MSE 2610'],
          ['MSE 2620', 'MSE 3010', 'MSE 3040', 'MSE 3050']
        ),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['MSE 2610', 'MSE 2620, MSE 3010, MSE 3040, or MSE 3050'],
      },
      'Environment and Sustainability': {
        description:
          'NTRES 1101 and NTRES 1201, or DEA 2020 and BEE 3299. Both courses must come from the same pair.',
        checker: includesWithSubRequirements(
          ['NTRES 1101', 'DEA 2020'],
          ['NTRES 1201', 'BEE 3299']
        ),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['NTRES 1101 or DEA 2020', 'NTRES 1201 or BEE 3299'],
      },
      Biomedical: {
        description: 'MSE 4610 and one of ENGRI 1310 or CHEME 2880.',
        checker: includesWithSubRequirements(['MSE 4610'], ['ENGRI 1310', 'CHEME 2880']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['MSE 4610', 'ENGRI 1310 or CHEME 2880'],
      },
    },
  },
  {
    name: 'Social Science',
    description: 'ECON 1110.',
    source: CATALOG,
    checker: includesWithSingleRequirement('ECON 1110'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['ECON 1110'],
  },
  {
    name: 'Humanities',
    description:
      'Choose any course (3-4 credits) with a Historical Analysis (HA-AG, HA-HE, HST-AS), ' +
      'Literature and the Arts (ALC-AAP, ALC-AS, ALC-HA, LA-AG, LAD-HE), or Cultural Analysis (CA-AG, CA-HE) distribution.',
    source: CATALOG,
    checker: [
      (course: Course): boolean =>
        [
          'HA-AG',
          'HA-HE',
          'HST-AS',
          'ALC-AAP',
          'ALC-AS',
          'ALC-HA',
          'LA-AG',
          'LAD-HE',
          'CA-AG',
          'CA-HE',
        ].some(distribution => course.catalogDistr?.includes(distribution) ?? false),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Quantitative Analysis',
    description:
      'One of PUBPOL 2100, AEM 2100, ILRST 2100, ENGRD 2700, or PSYCH 2500. ' +
      'Must be taken at Cornell; AP credits are not accepted for Statistics.',
    source: CATALOG,
    checker: includesWithSingleRequirement(
      'PUBPOL 2100',
      'AEM 2100',
      'ILRST 2100',
      'ENGRD 2700',
      'PSYCH 2500'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
  {
    name: 'Calculus',
    description:
      'MATH 1110 and MATH 1120, or MATH 1910 and MATH 1920. ' +
      'A score of 4 or 5 on AP Calculus AB fulfills the Calculus I requirement; ' +
      'a score of 4 or 5 on AP Calculus BC fulfills the Calculus I and II requirements.',
    source: CATALOG,
    checker: includesWithSubRequirements(['MATH 1110', 'MATH 1910'], ['MATH 1120', 'MATH 1920']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['Calculus I', 'Calculus II'],
  },
  {
    name: 'Linear Algebra',
    description: 'One of MATH 2210, MATH 2230, MATH 2310, or MATH 2940.',
    source: CATALOG,
    checker: includesWithSingleRequirement('MATH 2210', 'MATH 2230', 'MATH 2310', 'MATH 2940'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Ethics/Sustainability',
    description:
      'One of DEA 4220, FSAD 4021 and FSAD 4022 (taken together), FSAD 4025, FSAD 4682, or FSAD 4800.',
    source: CATALOG,
    checker: includesWithSingleRequirement(
      'DEA 4220',
      'FSAD 4021',
      'FSAD 4022',
      'FSAD 4025',
      'FSAD 4682',
      'FSAD 4800'
    ),
    checkerWarning:
      'We do not check that FSAD 4021 and FSAD 4022 are taken together; both are required if you choose that option.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Outside of Fiber Science Requirement',
    description:
      'Students must complete a minimum of 11 total credits from Design and Environmental Analysis (DEA), ' +
      'Human Development (HD), Human Ecology non-departmental (HE) at the 1500 level or higher, ' +
      'Nutritional Sciences (NS), or Public Policy (PUBPOL). ' +
      'FWS, PUBPOL 2100, PUBPOL 3120, DEA 3550, HD 2830, HE 3400, and Special Studies (4000, 4010, 4020, 4030) do not count. ' +
      'Courses in this section may also double count with the Humanities, Social Science, Natural Science, Ethics, and Additional Distribution requirements.',
    source: CATALOG,
    checker: [
      (course: Course): boolean => {
        const code = `${course.subject} ${course.catalogNbr}`;
        if (EXCLUDED_OUTSIDE.includes(code)) return false;
        if (SPECIAL_STUDIES_NBRS.includes(course.catalogNbr)) return false;
        // HE 3400 is also excluded (it is not in the current roster, so it is matched by number here).
        if (course.subject === 'HE')
          return Number(course.catalogNbr) >= 1500 && course.catalogNbr !== '3400';
        return ['DEA', 'HD', 'NS', 'PUBPOL'].includes(course.subject);
      },
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [11],
    allowCourseDoubleCounting: true,
  },
];

export default fiberScienceRequirements;

export const fiberScienceAdvisors: AdvisorGroup = {
  advisors: [{ name: 'FSAD Director of Undergraduate Studies', email: 'fsad-dus@cornell.edu' }],
};

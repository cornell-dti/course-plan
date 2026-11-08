import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const CATALOG = 'https://catalog.cornell.edu/programs/human-biology-health-society-bs/';

/** Courses that may not count toward the Outside of HBHS requirement. */
const EXCLUDED_OUTSIDE = ['PUBPOL 2100', 'PUBPOL 3120', 'DEA 3550', 'HD 2830'];
const SPECIAL_STUDIES_NBRS = ['4000', '4010', '4020', '4030'];

const BIOLOGY_ELECTIVE_LIST = ['BIOMG 2801', 'BIOMG 3340', 'BIOMI 4040', 'NS 3420'];

const hbhsRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Course',
    description:
      'NS 1400. This is a required course for students in the HBHS major and serves as the foundation for many of the subsequent required and elective courses.',
    source: CATALOG,
    checker: includesWithSingleRequirement('NS 1400'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['NS 1400'],
  },
  {
    name: 'Survey Course',
    description: 'One of NS 1150 or NS 1220.',
    source: CATALOG,
    checker: includesWithSingleRequirement('NS 1150', 'NS 1220'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Social Science Perspective on Health Selectives',
    description:
      'At least 6 credits of courses covering some aspect of health (including nutrition) from a social science perspective. ' +
      'More than half of the course content must be devoted to health/life course/disease issues from a social science perspective. ' +
      'See Requirements for HBHS majors for regular updates to course options.',
    source: CATALOG,
    checker: includesWithSingleRequirement(
      'NS 2450',
      'NS 4250',
      'NS 4450',
      'AEM 4450',
      'NS 4480',
      'NS 4500',
      'NS 4510',
      'NS 4570',
      'ECON 3910',
      'COMM 2850',
      'COMM 4760',
      'GDEV 3020',
      'GDEV 3111',
      'HD 2170',
      'HD 2180',
      'HD 2250',
      'HD 2300',
      'HD 2510',
      'HD 2600',
      'PSYCH 2750',
      'HD 3290',
      'HD 3300',
      'HD 3490',
      'HD 3620',
      'HD 4110',
      'PUBPOL 2350',
      'PUBPOL 3110',
      'PUBPOL 3280',
      'PUBPOL 3320',
      'PUBPOL 3780',
      'PUBPOL 4280',
      'ECON 3710'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
  },
  {
    name: 'Natural Science Perspective on Health Selectives',
    description:
      'At least 6 credits of courses covering some aspect of health (including nutrition) from a life science perspective. ' +
      'Courses must be at the 2000 level or above. Coursework taken for HBHS Selectives may not also count for Biology Electives.',
    source: CATALOG,
    checker: includesWithSingleRequirement(
      'NS 3060',
      'NS 3150',
      'NS 3310',
      'NS 3320',
      'NS 3450',
      'NS 4200',
      'NS 4300',
      'NS 4330',
      'NS 4410',
      'NS 4420',
      'NS 4430',
      'NS 6310',
      'NS 6320',
      'BIOMG 4390',
      'BIOMI 2500',
      'BIOMI 2600',
      'BIOMI 2950',
      'BIOMI 3210',
      'BIOMI 4040',
      'BIONB 3215',
      'BIONB 3920',
      'BIONB 4560',
      'BIONB 4750',
      'ENTOM 4000',
      'ENTOM 4520',
      'FDSC 4220',
      'HD 2200',
      'HD 3210',
      'HD 3660',
      'MSE 4610',
      'PLSCI 2100'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
  },
  {
    name: 'Nutritional Science Perspective on Health Selectives',
    description:
      'At least 3 credits (3-4 credits) of courses covering some aspect of health from a nutritional science perspective. ' +
      'Courses must be at the 2000 level or above. Coursework taken for HBHS Selectives may not also count for Biology Electives.',
    source: CATALOG,
    checker: includesWithSingleRequirement(
      'NS 3060',
      'NS 3150',
      'NS 4200',
      'NS 4210',
      'NS 4300',
      'NS 4330',
      'NS 4410',
      'NS 4420',
      'NS 4450',
      'NS 4480',
      'NS 4500',
      'NS 5510'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Introductory Chemistry',
    description:
      'Option A (recommended, especially for pre-health students): CHEM 2070, CHEM 2071, CHEM 2080, and CHEM 2081. ' +
      'Option B: AP Chemistry score of 5 or IB Chemistry score of 6 or 7, plus CHEM 2080 and CHEM 2081. ' +
      'Option C: AP Chemistry score of 5 or IB Chemistry score of 6 or 7, plus CHEM 2150 (only for students very strong in chemistry who are not considering pre-health).',
    source: CATALOG,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option A: General Chemistry Sequence': {
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
      'Option B: AP/IB Chemistry plus General Chemistry II': {
        description:
          'AP Chemistry score of 5 or IB Chemistry score of 6 or 7 to place out of CHEM 2070 + CHEM 2071, plus CHEM 2080 and CHEM 2081',
        checker: includesWithSubRequirements(['CHEM 2080'], ['CHEM 2081']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 2080', 'CHEM 2081'],
      },
      'Option C: AP/IB Chemistry plus Honors General Chemistry': {
        description: 'AP Chemistry score of 5 or IB Chemistry score of 6 or 7, plus CHEM 2150',
        checker: includesWithSingleRequirement('CHEM 2150'),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['CHEM 2150'],
      },
    },
  },
  {
    name: 'Introductory Biology Laboratory',
    description: 'One of BIOG 1500 or BIOSM 1500.',
    source: CATALOG,
    checker: includesWithSingleRequirement('BIOG 1500', 'BIOSM 1500'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Introductory Biology Lectures',
    description:
      'Two of the following three categories: BIOMG 1350; BIOG 1440 or BIOG 1445; BIOEE 1610 or BIOEE 1780. ' +
      'Cannot take both courses within one category to fulfill this requirement. ' +
      'An AP Biology score of 5 or IB HL Biology score of 7 may place out of one introductory biology lecture (not recommended for pre-health students).',
    source: CATALOG,
    checker: includesWithSubRequirements(
      ['BIOMG 1350'],
      ['BIOG 1440', 'BIOG 1445'],
      ['BIOEE 1610', 'BIOEE 1780']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    minNumberOfSlots: 2,
    slotNames: ['BIOMG 1350', 'BIOG 1440 or BIOG 1445', 'BIOEE 1610 or BIOEE 1780'],
  },
  {
    name: 'Physics',
    description:
      'One of PHYS 2207 or PHYS 2208. Students interested in pre-health tracks should take both PHYS 2207 and PHYS 2208.',
    source: CATALOG,
    checker: includesWithSingleRequirement('PHYS 2207', 'PHYS 2208'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Organic Chemistry Lecture',
    description:
      'Option A: CHEM 1570. Option B: CHEM 3570 and CHEM 3580. Option C: CHEM 3590 and CHEM 3600. ' +
      'Students interested in pre-health tracks should take a two-course sequence (option B or C); ' +
      'both courses must be taken in sequence, one course alone will not fulfill the requirement.',
    source: CATALOG,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option A: CHEM 1570': {
        description: 'CHEM 1570',
        checker: includesWithSingleRequirement('CHEM 1570'),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['CHEM 1570'],
      },
      'Option B: CHEM 3570 and CHEM 3580': {
        description: 'CHEM 3570 and CHEM 3580',
        checker: includesWithSubRequirements(['CHEM 3570'], ['CHEM 3580']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 3570', 'CHEM 3580'],
      },
      'Option C: CHEM 3590 and CHEM 3600': {
        description: 'CHEM 3590 and CHEM 3600',
        checker: includesWithSubRequirements(['CHEM 3590'], ['CHEM 3600']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 3590', 'CHEM 3600'],
      },
    },
  },
  {
    name: 'Organic Chemistry Lab',
    description: 'One of CHEM 2510 or CHEM 3010.',
    source: CATALOG,
    checker: includesWithSingleRequirement('CHEM 2510', 'CHEM 3010'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Physiology',
    description: 'One of NS 3410 or BIOAP 3110.',
    source: CATALOG,
    checker: includesWithSingleRequirement('NS 3410', 'BIOAP 3110'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Biochemistry',
    description:
      'One of NS 3200, BIOMG 3300, BIOMG 3350, BIOMG 3310 and BIOMG 3320, or BIOMG 3310 and BIOMI 2900.',
    source: CATALOG,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Single Course': {
        description: 'NS 3200, BIOMG 3300, or BIOMG 3350',
        checker: includesWithSingleRequirement('NS 3200', 'BIOMG 3300', 'BIOMG 3350'),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
      'BIOMG 3310 Sequence': {
        description: 'BIOMG 3310 and one of BIOMG 3320 or BIOMI 2900',
        checker: includesWithSubRequirements(['BIOMG 3310'], ['BIOMG 3320', 'BIOMI 2900']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['BIOMG 3310', 'BIOMG 3320 or BIOMI 2900'],
      },
    },
  },
  {
    name: 'Biology Electives',
    description:
      'Complete 6 credits selected from any course with a distribution code of BSC-AG or BIO-AS at the 3000 level or higher, ' +
      'or from BIOMG 2801, BIOMG 3340, BIOMI 4040, or NS 3420. ' +
      'Coursework taken for Biology Electives may not also count for Biochemistry or HBHS Selectives. ' +
      'May not include Special Studies credits (e.g., NS 4000, NS 4010, NS 4020, NS 4030, NS 4990 or non-DNS equivalent).',
    source: CATALOG,
    checker: [
      (course: Course): boolean => {
        const code = `${course.subject} ${course.catalogNbr}`;
        if (BIOLOGY_ELECTIVE_LIST.includes(code)) return true;
        if ([...SPECIAL_STUDIES_NBRS, '4990'].includes(course.catalogNbr)) return false;
        return (
          Number(course.catalogNbr) >= 3000 &&
          ['BSC-AG', 'BIO-AS'].some(
            distribution => course.catalogDistr?.includes(distribution) ?? false
          )
        );
      },
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
  },
  {
    name: 'Calculus/Advanced Math',
    description:
      'One of MATH 1105 (not for pre-health), MATH 1106, MATH 1110, or MATH 1120. ' +
      'Unless a student scored a 5 on the AB or BC Calculus AP Examination, they must take Calculus at Cornell.',
    source: CATALOG,
    checker: includesWithSingleRequirement('MATH 1105', 'MATH 1106', 'MATH 1110', 'MATH 1120'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Statistics',
    description:
      'One of STSCI 2100/ILRST 2100, STSCI 2150 (recommended), STSCI 2200, PUBPOL 2100, AEM 2100, PSYCH 2500, or SOC 3010. ' +
      'AP Statistics credit is not accepted. Students planning to take NS 3600 Epidemiology must take either STSCI 2150 or STSCI 2200.',
    source: CATALOG,
    checker: includesWithSingleRequirement(
      'STSCI 2100',
      'ILRST 2100',
      'STSCI 2150',
      'STSCI 2200',
      'PUBPOL 2100',
      'AEM 2100',
      'PSYCH 2500',
      'SOC 3010'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
  {
    name: 'Outside of Human Biology, Health, and Society Requirement',
    description:
      'Students must complete a minimum of 11 total credits from Design and Environmental Analysis (DEA), ' +
      'Fiber Science & Apparel Design (FSAD), Human Development (HD), Human Ecology non-departmental (HE) at the 1500 level or higher, ' +
      'or Public Policy (PUBPOL). FWS, PUBPOL 2100, PUBPOL 3120, DEA 3550, HD 2830, HE 3400, and Special Studies (4000, 4010, 4020, 4030) do not count. ' +
      'Courses in this section may also double count with the Social Science and Natural Science Perspective on Health Selectives and Humanities.',
    source: CATALOG,
    checker: [
      (course: Course): boolean => {
        const code = `${course.subject} ${course.catalogNbr}`;
        if (EXCLUDED_OUTSIDE.includes(code)) return false;
        if (SPECIAL_STUDIES_NBRS.includes(course.catalogNbr)) return false;
        // HE 3400 is also excluded (it is not in the current roster, so it is matched by number here).
        if (course.subject === 'HE')
          return Number(course.catalogNbr) >= 1500 && course.catalogNbr !== '3400';
        return ['DEA', 'FSAD', 'HD', 'PUBPOL'].includes(course.subject);
      },
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [11],
    allowCourseDoubleCounting: true,
  },
];

export default hbhsRequirements;

export const hbhsAdvisors: AdvisorGroup = {
  advisors: [],
};

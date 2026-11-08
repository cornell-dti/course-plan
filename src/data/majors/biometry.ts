import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const source = 'https://catalog.cornell.edu/programs/biometry-statistics-bs/';

const excludedStsciCourses = ['STSCI 4970', 'STSCI 4980', 'STSCI 4990'];

const stsciElectiveCodes = ['STSCI 3740', 'STSCI 3900', 'STSCI 3090', 'STSCI 3100'];
const nonStsciElectiveCodes = [
  'BIOCB 4830',
  'BIOCB 4840',
  'MATH 4260',
  'MATH 4740',
  'ECON 4130',
  'INFO 3300',
  'INFO 4310',
  'ORIE 3120',
  'ORIE 3300',
  'ORIE 3510',
  'ORIE 4580',
  'ORIE 3741',
  'ORIE 4742',
  'CS 3220',
  'CS 4220',
  'CS 3780',
  'CS 4320',
  'CS 4740',
  'CS 4787',
  'CS 4789',
];
const isStsciElective = (course: Course): boolean =>
  (courseMatchesCodeOptions(course, ['STSCI 4***']) &&
    !courseMatchesCodeOptions(course, excludedStsciCourses)) ||
  courseMatchesCodeOptions(course, stsciElectiveCodes);

const biometryRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Calculus I',
    description:
      'MATH 1110. May be fulfilled by a score of 4 or 5 on AP Calculus AB, a passing score on the CASE exam for MATH 1110, ' +
      'or credit for MATH 1110 earned through GCE A-level or IB higher-level exams.',
    source,
    checker: includesWithSingleRequirement('MATH 1110'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['MATH 1110'],
  },
  {
    name: 'Calculus II',
    description:
      'MATH 1120 or MATH 1910. May be fulfilled by a score of 4 or 5 on AP Calculus BC, a passing score on the CASE exam for MATH 1120, ' +
      'or credit for MATH 1120 earned through GCE A-level exams.',
    source,
    checker: includesWithSingleRequirement('MATH 1120', 'MATH 1910'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Statistical Methods I',
    description:
      'STSCI 2200 or an equivalent course: AEM 2100, ENGRD 2700, HADM 2010, HADM 2011, ILRST 2100, ILRST 6100, MATH 1710, PSYCH 2500, ' +
      'PUBPOL 2100, PUBPOL 2101, SOC 3010, STSCI 2100, or STSCI 2150. May be fulfilled by a score of 5 on AP Statistics.',
    source,
    checker: includesWithSingleRequirement(
      'STSCI 2200',
      'AEM 2100',
      'ENGRD 2700',
      'HADM 2010',
      'HADM 2011',
      'ILRST 2100',
      'ILRST 6100',
      'MATH 1710',
      'PSYCH 2500',
      'PUBPOL 2100',
      'PUBPOL 2101',
      'SOC 3010',
      'STSCI 2100',
      'STSCI 2150'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Linear Algebra',
    description: 'Select one of: MATH 2210, MATH 2240, MATH 2310, or MATH 2940.',
    source,
    checker: includesWithSingleRequirement('MATH 2210', 'MATH 2240', 'MATH 2310', 'MATH 2940'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Multivariable Calculus',
    description:
      'Select one of: MATH 2220, MATH 2240, or MATH 1920 (MATH 1920 may be fulfilled with a passing score on its CASE exam). ' +
      'Students following the Data Science Track replace this requirement with CS 2110.',
    source,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      Standard: {
        description: 'MATH 2220, MATH 2240, or MATH 1920.',
        counting: 'courses',
        checker: includesWithSubRequirements(['MATH 2220', 'MATH 2240', 'MATH 1920']),
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
      'Data Science Track': {
        description:
          'CS 2110 replaces multivariable calculus. Data Science Track students also use CS 4320 as one of their non-STSCI electives.',
        counting: 'courses',
        checker: includesWithSubRequirements(['CS 2110']),
        perSlotMinCount: [1],
        slotNames: ['CS 2110'],
      },
    },
  },
  {
    name: 'Statistical Methods II',
    description: 'STSCI 3200.',
    source,
    checker: includesWithSingleRequirement('STSCI 3200'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['STSCI 3200'],
  },
  {
    name: 'Probability',
    description: 'Select one of: STSCI 3080, ECON 3130, MATH 4710, or ORIE 3500.',
    source,
    checker: includesWithSingleRequirement('STSCI 3080', 'ECON 3130', 'MATH 4710', 'ORIE 3500'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Linear Models',
    description: 'STSCI 4030 or ECON 3140.',
    source,
    checker: includesWithSingleRequirement('STSCI 4030', 'ECON 3140'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Theory of Statistics',
    description: 'STSCI 4090 or MATH 4720.',
    source,
    checker: includesWithSingleRequirement('STSCI 4090', 'MATH 4720'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Statistical Computing',
    description: 'STSCI 4520.',
    source,
    checker: includesWithSingleRequirement('STSCI 4520'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['STSCI 4520'],
  },
  {
    name: 'Introduction to Computing',
    description:
      'CS 1110 or CS 1112. May be fulfilled with a passing score on the CASE exam for CS 1110, a 5 on AP Computer Science A, ' +
      'or a 6 or 7 on the IB Computer Science exam.',
    source,
    checker: includesWithSingleRequirement('CS 1110', 'CS 1112'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Elective Courses',
    description:
      'Five elective courses with significant statistical content, each worth at least 3 credits. ' +
      'At least three of the five electives must be STSCI courses or cross-listed with STSCI courses ' +
      '(any 4000-level STSCI course except STSCI 4970, STSCI 4980, and STSCI 4990, or STSCI 3740, STSCI 3900, STSCI 3090, STSCI 3100). ' +
      'The remaining electives may come from the pre-approved list of non-STSCI courses; any course not on the list must be approved by the major advisor. ' +
      'Two of STSCI 3600, STSCI 4610, STSCI 4720, STSCI 4725, STSCI 4850, and STSCI 4881 together count as one elective (this may be done multiple times without repeating courses).',
    source,
    checker: [
      isStsciElective,
      (course: Course): boolean =>
        isStsciElective(course) || courseMatchesCodeOptions(course, nonStsciElectiveCodes),
    ],
    checkerWarning:
      'We do not check that two of the 2-credit STSCI courses are paired to form one elective, nor the 3-credit minimum per course.',
    fulfilledBy: 'courses',
    perSlotMinCount: [3, 2],
    slotNames: ['STSCI Electives', 'Additional Electives'],
  },
];

export default biometryRequirements;

export const biometryAdvisors: AdvisorGroup = {
  advisors: [],
};

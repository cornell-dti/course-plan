import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const SOURCE = 'https://catalog.cornell.edu/programs/plant-sciences-bs/';

/** PLSCI 3400, 3401, 3402 and 4940-4999 (special topics, independent study, research, etc.) are excluded. */
const excludedFocusedElectives = [
  'PLSCI 3400',
  'PLSCI 3401',
  'PLSCI 3402',
  'PLSCI 494*',
  'PLSCI 495*',
  'PLSCI 496*',
  'PLSCI 497*',
  'PLSCI 498*',
  'PLSCI 499*',
];

const plantsciRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Biology',
    description:
      'One of BIOEE 1780, BIOG 1140, BIOG 1440, or BIOMG 1350 (3-5 credits). AP, IB, and GCE credit in Biology is not accepted.',
    source: SOURCE,
    checker: includesWithSingleRequirement('BIOEE 1780', 'BIOG 1140', 'BIOG 1440', 'BIOMG 1350'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
  {
    name: 'Introductory Chemistry',
    description:
      'CHEM 1560 and CHEM 1561, or CHEM 2070 and CHEM 2071 (4 credits). AP, IB, and GCE credit in Chemistry is not accepted.',
    source: SOURCE,
    checker: includesWithSubRequirements(['CHEM 1560', 'CHEM 2070'], ['CHEM 1561', 'CHEM 2071']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['Lecture', 'Laboratory'],
    disallowTransferCredit: true,
  },
  {
    name: 'Organic Chemistry',
    description: 'CHEM 1570 or CHEM 3570 (3 credits).',
    source: SOURCE,
    checker: includesWithSingleRequirement('CHEM 1570', 'CHEM 3570'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Statistics',
    description:
      'One of ENTOM 3030, STSCI 2100, STSCI 2150, or STSCI 2200 (4 credits). An AP Statistics score of 5 may be used to fulfill this requirement.',
    source: SOURCE,
    checker: includesWithSingleRequirement('ENTOM 3030', 'STSCI 2100', 'STSCI 2150', 'STSCI 2200'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Primary Plant Science Courses',
    description: 'PLSCI 1101, PLSCI 1420, PLSCI 2410, and PLSCI 2430 (14 credits).',
    source: SOURCE,
    checker: includesWithSubRequirements(
      ['PLSCI 1101'],
      ['PLSCI 1420'],
      ['PLSCI 2410'],
      ['PLSCI 2430']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: ['PLSCI 1101', 'PLSCI 1420', 'PLSCI 2410', 'PLSCI 2430'],
  },
  {
    name: 'Foundational Plant Science Courses',
    description:
      'Four of the following (minimum 16 credits): PLSCI 2250, PLSCI 2480, PLSCI 2600, PLSCI 3010, PLSCI 3420 with PLSCI 3421, PLSCI 3430 with PLSCI 3431.',
    source: SOURCE,
    checker: includesWithSingleRequirement(
      'PLSCI 2250',
      'PLSCI 2480',
      'PLSCI 2600',
      'PLSCI 3010',
      'PLSCI 3420',
      'PLSCI 3430'
    ),
    checkerWarning:
      'We do not check that PLSCI 3421 and PLSCI 3431 are taken with their corresponding lecture courses.',
    fulfilledBy: 'courses',
    perSlotMinCount: [4],
    slotNames: ['Course'],
  },
  {
    name: 'Focused Elective Courses',
    description:
      'A minimum of 12 credits of related upper-level (3000+) PLSCI courses that share a common plant-related theme built on foundational courses. ' +
      'At least 6 of the 12 credits must be PLSCI courses at the 4000-4939 level. PLSCI 3400, PLSCI 3401, and PLSCI 3402 do not count.',
    source: SOURCE,
    checker: [
      (course: Course): boolean =>
        courseMatchesCodeOptions(course, ['PLSCI 3***', 'PLSCI 4***']) &&
        !courseMatchesCodeOptions(course, excludedFocusedElectives),
    ],
    checkerWarning:
      'We do not check that the courses share a common plant-related theme, or that at least 6 of the 12 credits are at the 4000-4939 level.',
    fulfilledBy: 'credits',
    perSlotMinCount: [12],
  },
  {
    name: 'Experiential Learning Course',
    description: 'PLSCI 4900: Reflection on Experiential Learning (0.5 credits).',
    source: SOURCE,
    checker: includesWithSingleRequirement('PLSCI 4900'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['PLSCI 4900'],
  },
  {
    name: 'Bookend Courses',
    description:
      'PLSCI 1110 (Pathways to Success in Agriculture and Plant Sciences; waived for transfer students) and PLSCI 4950 (Senior Seminar in Plant Sciences, ' +
      'required of all graduating Plant Sciences students, including those who graduate early or in January or August).',
    source: SOURCE,
    checker: includesWithSubRequirements(['PLSCI 1110'], ['PLSCI 4950']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['PLSCI 1110', 'PLSCI 4950'],
  },
];

export default plantsciRequirements;

export const plantsciAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Greg Peck', email: 'gmp32@cornell.edu' }],
};

import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const source = 'https://catalog.cornell.edu/programs/entomology-bs/';

const groupACourses = [
  'ENTOM 3030',
  'ENTOM 3310',
  'ENTOM 3410',
  'ENTOM 4100',
  'ENTOM 4520',
  'ENTOM 4550',
  'ENTOM 4610',
  'ENTOM 4830',
];
const groupBCourses = [
  'ENTOM 2030',
  'ENTOM 2440',
  'ENTOM 2500',
  'ENTOM 3150',
  'ENTOM 3350',
  'ENTOM 3440',
  'ENTOM 3630',
  'ENTOM 3690',
  'ENTOM 3755',
  'ENTOM 4000',
  'ENTOM 4700',
];

const entomRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Statistics or Biometry',
    description:
      'ENTOM 3030, STSCI 2150, or STSCI 2200. If ENTOM 3030 is used here, it may not also be used to satisfy the Group A or B entomology requirements.',
    source,
    checker: includesWithSingleRequirement('ENTOM 3030', 'STSCI 2150', 'STSCI 2200'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Physics',
    description:
      'One semester of physics (EAS 1600 is accepted). PHYS 1200-level courses for non-science majors are excluded. ' +
      'Two semesters may be needed depending on future plans.',
    source,
    checker: [
      (course: Course): boolean =>
        courseMatchesCodeOptions(course, ['PHYS ****', 'EAS 1600']) &&
        !courseMatchesCodeOptions(course, ['PHYS 12**']),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'General Chemistry',
    description:
      'Option 1: CHEM 2070 with CHEM 2071 and CHEM 2080 with CHEM 2081. Option 2: CHEM 2150 (with AP Chemistry). ' +
      'AP Chemistry may only be used to satisfy CHEM 2070 / CHEM 2071.',
    source,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description: 'CHEM 2070, CHEM 2071, CHEM 2080, and CHEM 2081.',
        counting: 'courses',
        checker: includesWithSubRequirements(
          ['CHEM 2070'],
          ['CHEM 2071'],
          ['CHEM 2080'],
          ['CHEM 2081']
        ),
        perSlotMinCount: [1, 1, 1, 1],
        slotNames: ['CHEM 2070', 'CHEM 2071', 'CHEM 2080', 'CHEM 2081'],
      },
      'Option 2': {
        description: 'CHEM 2150 (with AP Chemistry).',
        counting: 'courses',
        checker: includesWithSubRequirements(['CHEM 2150']),
        perSlotMinCount: [1],
        slotNames: ['CHEM 2150'],
      },
    },
  },
  {
    name: 'Organic Chemistry',
    description:
      'Option 1: CHEM 1570. Option 2: CHEM 3570 and CHEM 3580 (recommended for students planning on medical school).',
    source,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description: 'CHEM 1570.',
        counting: 'courses',
        checker: includesWithSubRequirements(['CHEM 1570']),
        perSlotMinCount: [1],
        slotNames: ['CHEM 1570'],
      },
      'Option 2': {
        description: 'CHEM 3570 and CHEM 3580.',
        counting: 'courses',
        checker: includesWithSubRequirements(['CHEM 3570'], ['CHEM 3580']),
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 3570', 'CHEM 3580'],
      },
    },
  },
  {
    name: 'Investigative Biology Laboratory',
    description: 'BIOG 1500 or BIOSM 1500.',
    source,
    checker: includesWithSingleRequirement('BIOG 1500', 'BIOSM 1500'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Evolutionary Biology',
    description: 'BIOEE 1780, BIOEE 1781, or BIOSM 1780.',
    source,
    checker: includesWithSingleRequirement('BIOEE 1780', 'BIOEE 1781', 'BIOSM 1780'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Genetics',
    description: 'BIOMG 2800 or NTRES 2830, and BIOMG 2801.',
    source,
    checker: includesWithSubRequirements(['BIOMG 2800', 'NTRES 2830'], ['BIOMG 2801']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['BIOMG 2800 or NTRES 2830', 'BIOMG 2801'],
  },
  {
    name: 'Ecology',
    description:
      'BIOEE 1610 or ENTOM 4550. If ENTOM 4550 is used here, it may not also be used to satisfy the Group A or B entomology requirements.',
    source,
    checker: includesWithSingleRequirement('BIOEE 1610', 'ENTOM 4550'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Additional Life Science Courses',
    description:
      'Two courses from two of the following three areas: Biochemistry (BIOMG 3300, BIOMG 3310, BIOMG 3320, or BIOMG 3350); ' +
      'Cell Biology (BIOMG 1350); Physiology (BIOG 1440, BIOG 1445, or ENTOM 4830). ' +
      'If ENTOM 4830 is used here, it may not also be used to satisfy the Group A or B entomology requirements.',
    source,
    checker: includesWithSubRequirements(
      ['BIOMG 3300', 'BIOMG 3310', 'BIOMG 3320', 'BIOMG 3350'],
      ['BIOMG 1350'],
      ['BIOG 1440', 'BIOG 1445', 'ENTOM 4830']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    minNumberOfSlots: 2,
    slotNames: ['Biochemistry', 'Cell Biology', 'Physiology'],
  },
  {
    name: 'Insect Biology',
    description: 'ENTOM 2120.',
    source,
    checker: includesWithSingleRequirement('ENTOM 2120'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['ENTOM 2120'],
  },
  {
    name: 'Group A Core Courses',
    description:
      'Select two of: ENTOM 3030, ENTOM 3310 with ENTOM 3311, ENTOM 3410, ENTOM 4100, ENTOM 4520 with ENTOM 4521, ENTOM 4550, ENTOM 4610, or ENTOM 4830. ' +
      'Courses used to satisfy the statistics, ecology, or physiology requirements above may not be reused here.',
    source,
    checker: includesWithSingleRequirement(...groupACourses),
    checkerWarning:
      'We do not check that the companion laboratory courses (ENTOM 3311 with ENTOM 3310, ENTOM 4521 with ENTOM 4520) were taken.',
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Additional Entomology Courses',
    description:
      'Two additional entomology courses from Group A or Group B (advanced electives). ' +
      'For a complete list of Entomology courses, visit the course catalog, roster, or department website.',
    source,
    checker: includesWithSingleRequirement(...groupACourses, ...groupBCourses),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
];

export default entomRequirements;

export const entomAdvisors: AdvisorGroup = {
  advisors: [],
};

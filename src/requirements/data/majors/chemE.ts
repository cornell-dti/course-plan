import { CollegeOrMajorRequirement, Course } from '../../types';
import { ifCodeMatch, includesWithSubRequirements } from '../checkers-common';
import { AdvisorGroup } from '@/requirements/tools-types';

const chemERequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Freshman Requirements',
    description:
      'The undergraduate major in chemical engineering comprises a coordinated sequence of courses beginning in the sophomore year ' +
      'and extending through the fourth year. These are the major specific requirements. ' +
      'Students who plan to enter the major take CHEM 2090 - CHEM 2080 or CHEM 2150 with AP credit during the freshman year.',
    source:
      'https://www.cheme.cornell.edu/cbe/academics/undergraduate/curriculum/degree-requirements',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description: 'CHEM 2090 AND CHEM 2080',
        checker: includesWithSubRequirements(['CHEM 2090'], ['CHEM 2080']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 2090', 'CHEM 2080'],
      },
      'Option 2': {
        description: 'CHEM 2150 with AP credit',
        checker: includesWithSubRequirements(['CHEM 2150']),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
    },
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Semester 3',
    description: 'MATH 2930, PHYS 2213, CHEM 3890, and ENGRD 2190',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19817',
    checker: includesWithSubRequirements(
      ['MATH 2930'],
      ['PHYS 2213'],
      ['CHEM 3890'],
      ['ENGRD 2190']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: ['MATH 2930', 'PHYS 2213', 'CHEM 3890', 'ENGRD 2190'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Semester 4',
    description: 'MATH 2940 or CEE 3040 or ENGRD 2700, CHEME 3230, CHEM 3090, and CHEM 2900.',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19817',
    checker: includesWithSubRequirements(
      ['MATH 2940', 'CEE 3040', 'ENGRD 2700'],
      ['CHEME 3230'],
      ['CHEM 3090'],
      ['CHEM 2900']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: ['MATH 2940 or CEE 3040 or ENGRD 2700', 'CHEME 3230', 'CHEM 3090', 'CHEM 2900'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Semester 4: Biology Elective',
    description:
      'Every student must complete one of the seven following options for the biology elective.',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19817',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'CHEME 2880': {
        description: 'CHEME 2880',
        checker: includesWithSubRequirements(['CHEME 2880']),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
      'CHEME 5430': {
        description: 'CHEME 5430',
        checker: includesWithSubRequirements(['CHEME 5430']),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
      '8 credits of pre-med biology sequence: option 1': {
        description: 'Take BIOG 1500, BIOMG 1350, and BIOG 1440',
        checker: includesWithSubRequirements(['BIOG 1500', 'BIOMG 1350', 'BIOG 1440']),
        counting: 'courses',
        perSlotMinCount: [3],
        slotNames: ['Course'],
      },
      '8 credits of pre-med biology sequence: option 2': {
        description: 'Take BIOG 1107, BIOG 1108, and BIOG 1500',
        checker: includesWithSubRequirements(['BIOG 1107', 'BIOG 1108', 'BIOG 1500']),
        counting: 'courses',
        perSlotMinCount: [3],
        slotNames: ['Course'],
      },
      'BIOMI 2900': {
        description: 'BIOMI 2900',
        checker: includesWithSubRequirements(['BIOMI 2900']),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
      'BIOMG 3300 or BIOMG 3350': {
        description: 'BIOMG 3300 or BIOMG 3350',
        checker: includesWithSubRequirements(['BIOMG 3300', 'BIOMG 3350']),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
      'BIOMG 3310 and BIOMG 3320': {
        description: 'BIOMG 3310 and BIOMG 3320',
        checker: includesWithSubRequirements(['BIOMG 3310'], ['BIOMG 3320']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['BIOMG 3310', 'BIOMG 3320'],
      },
    },
  },
  {
    name: 'Semester 5',
    description:
      'CS 1112, CHEM 3570 or CHEM 3530 or CHEM 3590, CHEM 2510, CHEME 3130, and CHEME 3240.',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19817',
    checker: includesWithSubRequirements(
      ['CS 1112'],
      ['CHEM 3570', 'CHEM 3530', 'CHEM 3590'],
      ['CHEM 2510'],
      ['CHEME 3130'],
      ['CHEME 3240']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
    slotNames: [
      'CS 1112',
      'CHEM 3570 or CHEM 3530 or CHEM 3590',
      'CHEM 2510',
      'CHEME 3130',
      'CHEME 3240',
    ],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Semester 6',
    description:
      'Three credits of advanced CHEME electives, CHEME 3010, CHEME 3320, CHEME 3720, CHEME 3900',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19817',
    checker: includesWithSubRequirements(
      [
        'CHEME 4010',
        'CHEME 4020',
        'CHEME 4130',
        'CHEME 4610',
        'CHEME 4630',
        'CHEME 4700',
        'CHEME 4810',
        'CHEME 4840',
        'CHEME 5430',
        'CHEME 5440',
        'CHEME 5640',
        'CHEME 5720',
        'CHEME 6240',
        'CHEME 6310',
        'CHEME 6400',
        'CHEME 6440',
        'CHEME 6560',
        'CHEME 6610',
        'CHEME 6640',
        'CHEME 6650',
        'CHEME 6660',
        'CHEME 6800',
      ],
      ['CHEME 3010'],
      ['CHEME 3320'],
      ['CHEME 3720'],
      ['CHEME 3900']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
    slotNames: [
      '3 credits of advanced CHEME electives',
      'CHEME 3010',
      'CHEME 3320',
      'CHEME 3720',
      'CHEME 3900',
    ],
  },
  {
    name: 'Semester 7',
    description: 'CHEME 4320 and three credits of advanced CHEME electives',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19817',
    checker: includesWithSubRequirements(
      ['CHEME 4320'],
      [
        'CHEME 4010',
        'CHEME 4020',
        'CHEME 4130',
        'CHEME 4610',
        'CHEME 4630',
        'CHEME 4700',
        'CHEME 4810',
        'CHEME 4840',
        'CHEME 5430',
        'CHEME 5440',
        'CHEME 5640',
        'CHEME 5720',
        'CHEME 6240',
        'CHEME 6310',
        'CHEME 6400',
        'CHEME 6440',
        'CHEME 6560',
        'CHEME 6610',
        'CHEME 6640',
        'CHEME 6650',
        'CHEME 6660',
        'CHEME 6800',
      ]
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['CHEME 4320', '3 credits of advanced CHEME electives'],
  },
  {
    name: 'Semester 8',
    description: 'CHEME 4620 or CHEME 4930',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19817',
    checker: includesWithSubRequirements(
      ['CS 1112'],
      ['CHEM 3570', 'CHEM 3530', 'CHEM 3590'],
      ['CHEM 2510'],
      ['CHEME 3130'],
      ['CHEME 3240']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
    slotNames: [
      'CS 1112',
      'CHEM 3570 or CHEM 3530 or CHEM 3590',
      'CHEM 2510',
      'CHEME 3130',
      'CHEME 3240',
    ],
  },
  // TOOD: repeated checker
  {
    name: 'Major-Approved Electives',
    description:
      "Three credits of electives are required and must be approved by the student's faculty advisor.",
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19817',
    checker: [
      (course: Course): boolean => {
        const { subject, catalogNbr } = course;
        return !(ifCodeMatch(subject, 'PE') || ifCodeMatch(catalogNbr, '10**'));
      },
    ],
    checkerWarning: 'We do not check that the courses are major approved.',
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
];

export default chemERequirements;

export const chemEAdvisors: AdvisorGroup = {
  advisors: [],
};

import { Course, CollegeOrMajorRequirement } from '../../requirements/types';

import {
  courseIsFWS,
  ifCodeMatch,
  includesWithSingleRequirement,
  courseMeetsCreditMinimum,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const philMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Courses Above 3000',
    description:
      'A minimum of five philosophy courses (of a minimum of 3 credits each, with a total of at least 15 credits) must be taken for a letter grade (C or better). ' +
      'At least two must be numbered above 3000.',
    source: 'https://philosophy.cornell.edu/undergraduate#minoring-in-philosophy',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'PHIL') &&
        !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***')) &&
        !ifCodeMatch(course.catalogNbr, '*9**') &&
        !courseIsFWS(course) &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'History of Philosophy before 1900',
    description: 'At least one must be in the history of philosophy before 1900.',
    source: 'https://philosophy.cornell.edu/undergraduate#minoring-in-philosophy',
    checker: includesWithSingleRequirement('PHIL 2200', 'PHIL 2220'),
    checkerWarning:
      'We only check for PHIL 2200 and PHIL 2220. Other history of philosophy courses may also count.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Additional Course: 2000 or above',
    description:
      'No more than one course numbered below 2000. ' +
      'Important note: PHIL courses numbered 1900-1999, 4900, 4901 (or any courses with a "9" digit in the second place) will not be accepted for the minor, ' +
      'nor will First-Year Writing Seminars (PHIL 1110, PHIL 1111, PHIL 1112).',
    source: 'https://philosophy.cornell.edu/undergraduate#minoring-in-philosophy',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'PHIL') &&
        !ifCodeMatch(course.catalogNbr, '1***') &&
        !ifCodeMatch(course.catalogNbr, '*9**') &&
        !courseIsFWS(course) &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Additional Course: 1000 or above',
    description:
      'No more than one course numbered below 2000. No more than two courses completed at other institutions. ' +
      'Students who matriculated at Cornell in the fall semester of 2024 (or before) may count one PHIL FWS toward the minor.',
    source: 'https://philosophy.cornell.edu/undergraduate#minoring-in-philosophy',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'PHIL') &&
        !ifCodeMatch(course.catalogNbr, '*9**') &&
        !courseIsFWS(course) &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
];

export default philMinorRequirements;

export const philMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Harold Hodes', email: 'harold.hodes@cornell.edu' }],
};

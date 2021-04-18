import { Course, CollegeOrMajorRequirement } from '../../types';

import {
  courseIsFWS,
  ifCodeMatch,
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
  courseMeetsCreditMinimum,
} from '../checkers-common';

const lingMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introduction to Linguistics',
    description: 'LING 1101.',
    source: 'https://linguistics.cornell.edu/undergraduate#minor-requirements:',
    checker: includesWithSingleRequirement('LING 1101'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Foundation Course',
    description: 'LING 3302, LING 3303, or LING 3314.',
    source: 'https://linguistics.cornell.edu/undergraduate#minor-requirements:',
    checker: includesWithSingleRequirement('LING 3302', 'LING 3303', 'LING 3314'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  // TODO - currently has a double counting issue because this is a minor with the foundation courses that can fulfill the elective courses, so they double count.
  // TODO - furthermore, this req is split into 3 and is a "compounded requirement." It works in the major right now, but in the minor
  // the double counting issue means one course can fulfill each part of the compounded requirement.
  {
    name: 'Additional Course: 3000 or above',
    description:
      'At least 1 additional linguistics course must be at the 3000 level or above and at least 3 credits. Language courses do not count.',
    source: 'https://linguistics.cornell.edu/undergraduate#minor-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***')) &&
        !courseIsFWS(course) &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Additional Course: 2000 or above',
    description:
      'At least 1 additional linguistics course must be 2000 level or above and at least 3 credits. Language courses do not count.',
    source: 'https://linguistics.cornell.edu/undergraduate#minor-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !ifCodeMatch(course.catalogNbr, '1***') &&
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
      'At most 1 additional linguistics course can be 1000 level or above, but it must be at least 3 credits. Language courses do not count.',
    source: 'https://linguistics.cornell.edu/undergraduate#minor-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !courseMatchesCodeOptions(course, ['LING 1101']) &&
        !courseIsFWS(course) &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
];

export default lingMinorRequirements;

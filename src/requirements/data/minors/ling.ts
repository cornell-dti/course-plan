import { Course, CollegeOrMajorRequirement } from '../../types';

import {
  courseIsFWS,
  ifCodeMatch,
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
} from '../checkers-common';

const lingMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introduction to Linguistics',
    description: 'LING 1101.',
    source: 'https://linguistics.cornell.edu/undergraduate#minor-requirements:',
    checker: includesWithSingleRequirement('LING 1101'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Foundation Course',
    description: 'LING 3302, LING 3303, or LING 3314.',
    source: 'https://linguistics.cornell.edu/undergraduate#minor-requirements:',
    checker: includesWithSingleRequirement('LING 3302', 'LING 3303', 'LING 3314'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Additional Course: 3000 or above',
    description: 'At least 1 additional course must be at the 3000 level or above.',
    source: 'https://linguistics.cornell.edu/undergraduate#minor-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***')) &&
        !courseMatchesCodeOptions(course, ['LING 1101', 'LING 3302', 'LING 3303', 'LING 3314']) &&
        !courseIsFWS(course),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Additional Course: 2000 or above',
    description: 'At least 1 additional course must be 2000 level or above.',
    source: 'https://linguistics.cornell.edu/undergraduate#minor-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !ifCodeMatch(course.catalogNbr, '1***') &&
        !courseMatchesCodeOptions(course, ['LING 1101', 'LING 3302', 'LING 3303', 'LING 3314']) &&
        !courseIsFWS(course),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Additional Course: 1000 or above',
    description: 'At most 1 additional course can be 1000 level or above.',
    source: 'https://linguistics.cornell.edu/undergraduate#minor-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !courseMatchesCodeOptions(course, ['LING 1101', 'LING 3302', 'LING 3303', 'LING 3314']) &&
        !courseIsFWS(course),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Additional Courses: 10 credits',
    description:
      'Additional courses must each be 3 credits or more, and the minor requires 18 credits total.',
    source: 'https://linguistics.cornell.edu/undergraduate#minor-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !courseMatchesCodeOptions(course, ['LING 1101', 'LING 3302', 'LING 3303', 'LING 3314']) &&
        !courseIsFWS(course),
    ],
    allowCourseDoubleCounting: true,
    fulfilledBy: 'credits',
    perSlotMinCount: [10],
  },
];

export default lingMinorRequirements;

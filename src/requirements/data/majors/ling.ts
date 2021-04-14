import { Course, CollegeOrMajorRequirement } from '../../types';

import {
  courseIsFWS,
  ifCodeMatch,
  courseMatchesCodeOptions,
  includesWithSubRequirements,
  courseMeetsCreditMinimum,
} from '../checkers-common';

const lingRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Foundation Courses',
    description: 'LING 1101, LING 3302, LING 3303, and LING 3314.',
    source: 'https://linguistics.cornell.edu/undergraduate#major-requirements:',
    checker: includesWithSubRequirements(
      ['LING 1101'],
      ['LING 3302'],
      ['LING 3303'],
      ['LING 3314']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
  },
  // TODO - change this into a compounded requirement instead of 3000, 2000, 1000+ electives. Works as expected right now though.
  // TODO - "language courses" cannot be used for this requirement, but some courses with language course codes can. Unless we have a way of checking
  // "FL" designations besides the broad subjects we do now, we can't restrict this.
  // TODO - max 1 additional course can have a CU-UGR designation. Can be checked after the catalogAttribute is stored in Course.
  {
    name: 'Additional Courses: 3000 or above',
    description:
      'At least 2 additional linguistics courses must be at the 3000 level or above and at least 3 credits. Language courses do not count.',
    source: 'https://linguistics.cornell.edu/undergraduate#major-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***')) &&
        !courseMatchesCodeOptions(course, ['LING 1101', 'LING 3302', 'LING 3303', 'LING 3314']) &&
        !courseIsFWS(course) &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
  },
  {
    name: 'Additional Courses: 2000 or above',
    description:
      'At least 3 additional linguistics courses must be 2000 level or above and at least 3 credits. Language courses do not count.',
    source: 'https://linguistics.cornell.edu/undergraduate#major-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !ifCodeMatch(course.catalogNbr, '1***') &&
        !courseMatchesCodeOptions(course, ['LING 1101', 'LING 3302', 'LING 3303', 'LING 3314']) &&
        !courseIsFWS(course) &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
  },
  {
    name: 'Additional Courses: 1000 or above',
    description:
      'At most 1 additional linguistics course can be 1000 level or above, but it must be at least 3 credits. Language courses do not count.',
    source: 'https://linguistics.cornell.edu/undergraduate#major-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !courseMatchesCodeOptions(course, ['LING 1101', 'LING 3302', 'LING 3303', 'LING 3314']) &&
        !courseIsFWS(course) &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Ancillary Skills Courses',
    description:
      'Two courses (3 credits or more) must be in areas relevant to specific areas in linguistics.',
    source: 'https://linguistics.cornell.edu/undergraduate#major-requirements:',
    checker: [
      (course: Course): boolean =>
        !courseMatchesCodeOptions(course, ['LING 1101', 'LING 3302', 'LING 3303', 'LING 3314']) &&
        courseMeetsCreditMinimum(course, 3),
    ],
    checkerWarning: 'We do not check that the courses are from linguistics related areas.',
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
  },
];

export default lingRequirements;

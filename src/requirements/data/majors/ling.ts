import { Course, CollegeOrMajorRequirement } from '../../types';

import {
  courseIsFWS,
  ifCodeMatch,
  courseMatchesCodeOptions,
  includesWithSubRequirements,
  courseMeetsCreditMinimum,
  courseHasAttribute,
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
  // TODO - The CU-UGR restriction should probably be part of this compounded requirement as well. Right now assumes a CU-UGR course in linguistics is 3000+ and the language is confusing.
  {
    name: 'Additional Courses: 3000 or above, CU-UGR',
    description:
      'At least 1 additional linguistics courses must be at the 3000 level or above and at least 3 credits. Max of 1 course can have a CU-UGR designation (and must be 4 credits). Language courses do not count.',
    source: 'https://linguistics.cornell.edu/undergraduate#major-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***')) &&
        !courseMatchesCodeOptions(course, ['LING 1101', 'LING 3302', 'LING 3303', 'LING 3314']) &&
        !courseIsFWS(course) &&
        (courseMeetsCreditMinimum(course, 3) ||
          (courseMeetsCreditMinimum(course, 4) && courseHasAttribute(course, 'CU-UGR'))),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Additional Courses: 3000 or above',
    description:
      'At least 1 additional linguistics courses must be at the 3000 level or above and at least 3 credits. Language courses and CU-UGR courses do not count.',
    source: 'https://linguistics.cornell.edu/undergraduate#major-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***')) &&
        !courseMatchesCodeOptions(course, ['LING 1101', 'LING 3302', 'LING 3303', 'LING 3314']) &&
        !courseIsFWS(course) &&
        !courseHasAttribute(course, 'CU-UGR') &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Additional Courses: 2000 or above',
    description:
      'At least 3 additional linguistics courses must be 2000 level or above and at least 3 credits. Language courses and CU-UGR courses do not count.',
    source: 'https://linguistics.cornell.edu/undergraduate#major-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !ifCodeMatch(course.catalogNbr, '1***') &&
        !courseMatchesCodeOptions(course, ['LING 1101', 'LING 3302', 'LING 3303', 'LING 3314']) &&
        !courseIsFWS(course) &&
        !courseHasAttribute(course, 'CU-UGR') &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
  },
  {
    name: 'Additional Courses: 1000 or above',
    description:
      'At most 1 additional linguistics course can be 1000 level or above, but it must be at least 3 credits. Language courses and CU-UGR courses do not count.',
    source: 'https://linguistics.cornell.edu/undergraduate#major-requirements:',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'LING') &&
        !courseMatchesCodeOptions(course, ['LING 1101', 'LING 3302', 'LING 3303', 'LING 3314']) &&
        !courseIsFWS(course) &&
        !courseHasAttribute(course, 'CU-UGR') &&
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

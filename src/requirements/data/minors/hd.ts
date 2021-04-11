import { Course, CollegeOrMajorRequirement } from '../../types';

import {
  ifCodeMatch,
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
} from '../checkers-common';

const hdMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Course',
    description: 'HD 1100, HD 1150, or HD 1170.',
    source: 'https://www.human.cornell.edu/hd/academics/undergraduate/minor',
    checker: includesWithSingleRequirement('HD 1100', 'HD 1150', 'HD 1170'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Human Development: 4 courses',
    description: '4 more Human Development courses.',
    source: 'https://www.human.cornell.edu/hd/academics/undergraduate/minor',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'HD') &&
        !courseMatchesCodeOptions(course, ['HD 4000', 'HD 4010', 'HD 4020', 'HD 4030']),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [4],
  },
  {
    name: 'Human Development: 6 credits',
    description: 'At least 6 credits must be taken at the 3000/4000 level',
    source: 'https://www.human.cornell.edu/hd/academics/undergraduate/minor',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'HD') &&
        !courseMatchesCodeOptions(course, ['HD 4000', 'HD 4010', 'HD 4020', 'HD 4030']) &&
        (ifCodeMatch(course.catalogNbr, '3***') || ifCodeMatch(course.catalogNbr, '4***')),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
    allowCourseDoubleCounting: true,
  },
];

export default hdMinorRequirements;

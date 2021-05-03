import { Course, CollegeOrMajorRequirement } from '../../types';
import { includesWithSubRequirements, ifCodeMatch } from '../checkers-common';

const spanishRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description: 'Students are required to complete 4 core courses.',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#major-requirements',
    checker: includesWithSubRequirements(
      ['SPAN 2140', 'SPAN 2235'],
      ['SPAN 2150', 'SPAN 2205'],
      ['SPAN 2170'],
      ['SPAN 2180']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: ['SPAN 2140 or SPAN 2235', 'SPAN 2150 or SPAN 2205', 'SPAN 2170', 'SPAN 2180'],
  },
  // TODO: see if there is a way to identify senior seminar courses.
  {
    name: 'Senior Seminar',
    description: 'Must include a senior seminar in the 15 credits of electives.',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#major-requirements',
    allowCourseDoubleCounting: true,
    checker: [
      (course: Course): boolean =>
        (ifCodeMatch(course.subject, 'SPAN') || ifCodeMatch(course.subject, 'PORT')) &&
        ifCodeMatch(course.catalogNbr, '4***'),
    ],
    checkerWarning: 'We do not check that the course is a senior seminar.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
];

export default spanishRequirements;

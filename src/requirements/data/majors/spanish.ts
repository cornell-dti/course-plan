import { Course, CollegeOrMajorRequirement } from '../../types';
import {
  includesWithSubRequirements,
  ifCodeMatch,
  courseMeetsCreditMinimum,
} from '../checkers-common';
import { AdvisorGroup } from '@/requirements/tools-types';

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
  {
    name: 'Electives',
    description:
      'Students are required to complete 15 credits of courses focusing on the Hispanic world. SPAN 2090, SPAN 2070 and SPAN 2095 are excluded. Only courses beginning at SPAN 2130 count.',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#major-requirements',
    checker: [
      (course: Course): boolean =>
        (ifCodeMatch(course.subject, 'SPAN') || ifCodeMatch(course.subject, 'PORT')) &&
        !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '20**')) &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [15],
  },
  // TODO: see if there is a way to identify senior seminar courses.
  {
    name: 'Senior Seminar',
    description: 'Must include a senior seminar in the 15 credits of electives.',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#major-requirements',
    // Allowing double counting, since this is a check to see if the 15 credits
    // of electives include a senior seminar course.
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

export const spanishAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Callean Hile', email: 'clh2@cornell.edu' }],
};

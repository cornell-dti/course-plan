import { Course, CollegeOrMajorRequirement } from '../../types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
  courseMatchesCodeOptions,
  ifCodeMatch,
  courseIsSpecial,
} from '../checkers-common';

const spanishRequirements: readonly CollegeOrMajorRequirement[] = [
  // {
  //   name: 'Intermediate Spanish',
  //   description: 'SPAN 2095',
  //   source: 'https://romancestudies.cornell.edu/spanish-undergraduate#major-requirements',
  //   // Allow double counting, because it overlaps with A&S language requirement.
  //   allowCourseDoubleCounting: true,
  //   checker: includesWithSingleRequirement('SPAN 2095'),
  //   fulfilledBy: 'courses',
  //   perSlotMinCount: [1],
  //   slotNames: ['Course'],
  // },
  {
    name: 'Requirement 1',
    description: 'SPAN 2140 or SPAN 2235',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#major-requirements',
    checker: includesWithSingleRequirement('SPAN 2140', 'SPAN 2235'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Requirement 2',
    description: 'SPAN 2150 or SPAN 2205',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#major-requirements',
    checker: includesWithSingleRequirement('SPAN 2150', 'SPAN 2205'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Requirement 3',
    description: 'SPAN 2170',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#major-requirements',
    checker: includesWithSingleRequirement('SPAN 2170'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Requirement 4',
    description: 'SPAN 2180',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#major-requirements',
    checker: includesWithSingleRequirement('SPAN 2180'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Electives',
    description: '15 credits of electives of courses focusing on the Hispanic world. SPAN 2090, SPAN 2070 and SPAN 2095 are excluded. Only courses beginning at SPAN 2130 count.',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#major-requirements',
    checker: [
      (course: Course): boolean => {
        return (
          ((ifCodeMatch(course.subject, 'SPAN') || ifCodeMatch(course.subject, 'PORT')) && !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '20**')))
        );
      },
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [15],
  },
  {
    name: 'Senior Seminar',
    description: 'Must include a senior seminar in the 15 credits of electives.',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#major-requirements',
    allowCourseDoubleCounting: true,
    checker: [
      (course: Course): boolean => {
        return (
          ((ifCodeMatch(course.subject, 'SPAN') || ifCodeMatch(course.subject, 'PORT')) && ifCodeMatch(course.catalogNbr, '4***'))
        );
      },
    ],
    checkerWarning: 'We do not check that the course is a senior seminar.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
];

export default spanishRequirements;

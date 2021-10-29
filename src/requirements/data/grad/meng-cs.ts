import { CollegeOrMajorRequirement, Course } from '../../types';
import {
  courseMatchesCodeOptions,
  ifCodeMatch,
  includesWithSingleRequirement,
} from '../checkers-common';

const isAdvancedCSCourse = (course: Course): boolean =>
  ifCodeMatch(course.subject, 'CS') &&
  !(
    ifCodeMatch(course.catalogNbr, '1***') ||
    ifCodeMatch(course.catalogNbr, '2***') ||
    ifCodeMatch(course.catalogNbr, '3***') ||
    ifCodeMatch(course.catalogNbr, '4***')
  );

// not seminars, independent studies (CS 5999/7999), CS 5199, or M.Eng project (CS 5999)
const isAdvancedAcademicCSCourse = (course: Course): boolean =>
  isAdvancedCSCourse(course) &&
  !(
    ifCodeMatch(course.catalogNbr, '5999') ||
    ifCodeMatch(course.catalogNbr, '5199') ||
    ifCodeMatch(course.catalogNbr, '7***')
  );

// non cs electives that are considered technical and advanced
// source: https://www.cs.cornell.edu/masters/academics/preapprovedcourses
const technicalAdvancedCourses: string[] = [];

const mengCSRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Total Credits',
    description:
      'Any work that contributes to these 30 credits must begin after entering the M.Eng program. ' +
      'At least 28 credits must be taken for a letter grade. ' +
      'For courses co-listed at the 4000 and 5000 levels, M.Eng students must enroll in the 5000 level version.',
    source: 'https://www.cs.cornell.edu/masters/academics/preapprovedcourses',
    checker: [
      (course: Course): boolean =>
        isAdvancedCSCourse(course) || courseMatchesCodeOptions(course, technicalAdvancedCourses),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [30],
    allowCourseDoubleCounting: true,
    disallowTransferCredit: true,
  },
  {
    name: 'Project',
    description:
      '3 to 6 degree credits must be earned by completing an M.Eng. Project. ' +
      'Project courses and practicum courses do not count as your M.Eng Project. ' +
      'Project grade must not be lower than a B to count towards project requirement.',
    source: 'https://www.cs.cornell.edu/masters/academics/projectinformation',
    checker: includesWithSingleRequirement('CS 5999'),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Computer Science Courses',
    description:
      'At least 15 credits must come from Computer Science courses that are not ' +
      'seminars, independent studies (CS 5999/7999), CS 5199, or M.Eng project (CS 5999).',
    source: 'https://www.cs.cornell.edu/masters/academics/degreerequirements',
    checker: [isAdvancedAcademicCSCourse],
    fulfilledBy: 'credits',
    perSlotMinCount: [15],
  },
];

export default mengCSRequirements;

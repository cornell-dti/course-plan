import { Course, CollegeOrMajorRequirement } from '../../types';
import {
  courseIsFWS,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../checkers-common';

const engineeringLiberalArtsDistributions: readonly string[] = [
  'CA',
  'HA',
  'LA',
  'LAD',
  'KCM',
  'SBA',
  'FL',
  'CE',
  'ALC',
  'SCD',
  'HST',
  'ETM',
  'SSC',
  'GLC',
];

const engineeringRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Mathematics',
    description: 'MATH 1910, 1920, 2930 or 2940, and a mathematics course chosen by the Major.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: includesWithSubRequirements(['MATH 1910'], ['MATH 1920'], ['MATH 2930', 'MATH 2940']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
  },
  {
    name: 'Physics',
    description:
      'PHYS 1112 and 2213, and, depending on the Major, either PHYS 2214 or a designated mathematics or science course.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: includesWithSubRequirements(['PHYS 1112'], ['PHYS 2213']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
  },
  {
    name: 'Chemistry',
    description:
      'CHEM 2090. Majors in Chemical Engineering or those planning on a health-related career should take CHEM 2090 and then 2080.  ' +
      'Students in Environmental Engineering should take CHEM 2090 and CHEM 1570/3570.  ' +
      'Earth and Atmospheric Sciences majors should take CHEM 2090 and then 2080/1570.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: includesWithSingleRequirement('CHEM 2090'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'First-Year Writing Seminars',
    description: 'All students are required to take two first-year writing seminars.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: [courseIsFWS],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
  },
  {
    name: 'Computing',
    description: 'CS 1110, 1112, 1114, or 1115.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: includesWithSingleRequirement('CS 1110', 'CS 1112', 'CS 1114', 'CS 1115'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Introduction to Engineering',
    description: 'One introduction to engineering (ENGRI) course.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: [(course: Course): boolean => course.subject === 'ENGRI'],
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Engineering Distribution',
    description:
      'Two different category distribution courses (ENGRD), one of which may be required by the Major.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: [(course: Course): boolean => course.subject === 'ENGRD'],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
  },
  {
    name: 'Liberal Studies Distribution: 6 courses',
    description:
      'Liberal arts commonly include courses in the humanities. A minimum of six courses must be taken. ' +
      'At least two courses must be at the 2000 level or higher.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/advising/liberal-studies',
    checker: [
      (course: Course): boolean =>
        engineeringLiberalArtsDistributions.some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [6],
  },
  {
    name: 'Liberal Studies Distribution: 3 categories',
    description:
      'In addition to six courses, the liberal studies courses must be from 3 categories.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/advising/liberal-studies',
    checker: [
      (course: Course): boolean =>
        (course.catalogDistr?.includes('LA') || course.catalogDistr?.includes('LAD')) ?? false,
      ...engineeringLiberalArtsDistributions
        .filter(it => it !== 'LA' && it !== 'LAD')
        .map(distribution => (course: Course): boolean =>
          course.catalogDistr?.includes(distribution) ?? false
        ),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    minNumberOfSlots: 3,
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Liberal Studies Distribution: 18 credits',
    description:
      'In addition to six courses, the liberal studies distribution must total a minimum of 18 credits.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/advising/liberal-studies',
    checker: [
      (course: Course): boolean =>
        engineeringLiberalArtsDistributions.some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [18],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Advisor-Approved Electives',
    description:
      'Six credits of electives are required and must be approved by the student’s faculty advisor.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    fulfilledBy: 'self-check',
    minCount: 6,
  },
  {
    name: 'Engineering Communications',
    description:
      'An engineering communications course must be taken as an engineering distribution, liberal studies, Advisor-approved Elective, or Major course. ' +
      'Students can fulfill the upper-level engineering communications requirement in one of the six ways.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/engineering-communications-program/technical',
    checker: includesWithSingleRequirement(
      'ENGRC 3500',
      'ENGRC 3020',
      'ENGRC 3350',
      'ENGRC 3340',
      'ENGRD 2640',
      'AEP 2640',
      'CHEME 4320',
      'MAE 4272',
      'BEE 4730',
      'BEE 4890',
      'BEE 4530',
      'BEE 4590',
      'CIS 3000',
      'INFO 1200',
      'COMM 3030',
      'COMM 3020',
      'ENGRC 3023',
      'ENGRC 2640',
      'ENGRC 3152',
      'ENGRC 3160',
      'ENGRC 4152',
      'ENGRC 4530',
      'ENGRC 4890',
      'MSE 4030',
      'MSE 4040',
      'MSE 4050',
      'MSE 4060'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    allowCourseDoubleCounting: true,
  },
];

export default engineeringRequirements;

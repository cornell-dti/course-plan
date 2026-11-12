import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const stsciExcludedCourses = ['STSCI 4970', 'STSCI 4980', 'STSCI 4990'];

const stsciElectiveCourses = [
  'STSCI 4***',
  'STSCI 3090',
  'STSCI 3100',
  'STSCI 3740',
  'STSCI 3900',
  'STSCI 3600',
];

const nonStsciElectiveCourses = [
  'BIOCB 4830',
  'BIOCB 4840',
  'MATH 4260',
  'MATH 4740',
  'ECON 4130',
  'INFO 3300',
  'INFO 4310',
  'ORIE 3120',
  'ORIE 3300',
  'ORIE 3310',
  'ORIE 3510',
  'ORIE 3741',
  'ORIE 4580',
  'ORIE 4742',
  'CS 4220',
  'CS 3220',
  'CS 3780',
  'CS 4320',
  'CS 4740',
  'CS 4787',
  'CS 4789',
];

const isStsciElective = (course: Course): boolean =>
  courseMatchesCodeOptions(course, stsciElectiveCourses) &&
  !courseMatchesCodeOptions(course, stsciExcludedCourses);

const stsciRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Linear Algebra',
    description: 'MATH 2210, MATH 2240, MATH 2310, or MATH 2940.',
    source: 'https://catalog.cornell.edu/programs/statistics-data-science-ba/',
    checker: includesWithSingleRequirement('MATH 2210', 'MATH 2240', 'MATH 2310', 'MATH 2940'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Multivariable Calculus',
    description:
      'MATH 2220, MATH 2230, or MATH 1920. Students following the Data Science Track replace the multivariable calculus requirement with CS 2110 ' +
      '(and use CS 4320 as one of their non-STSCI electives).',
    source: 'https://catalog.cornell.edu/programs/statistics-data-science-ba/',
    checker: includesWithSingleRequirement('MATH 2220', 'MATH 2230', 'MATH 1920', 'CS 2110'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Statistical Methods II',
    description: 'STSCI 3200: Statistics II.',
    source: 'https://catalog.cornell.edu/programs/statistics-data-science-ba/',
    checker: includesWithSingleRequirement('STSCI 3200'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Probability',
    description: 'STSCI 3080, ECON 3130, MATH 4710, or ORIE 3500.',
    source: 'https://catalog.cornell.edu/programs/statistics-data-science-ba/',
    checker: includesWithSingleRequirement('STSCI 3080', 'ECON 3130', 'MATH 4710', 'ORIE 3500'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Linear Models',
    description: 'STSCI 4030 (Linear Models with Matrices) or ECON 3140 (Econometrics).',
    source: 'https://catalog.cornell.edu/programs/statistics-data-science-ba/',
    checker: includesWithSingleRequirement('STSCI 4030', 'ECON 3140'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Theory of Statistics',
    description: 'STSCI 4090 or MATH 4720.',
    source: 'https://catalog.cornell.edu/programs/statistics-data-science-ba/',
    checker: includesWithSingleRequirement('STSCI 4090', 'MATH 4720'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Statistical Computing',
    description: 'STSCI 4520: Statistical Computing.',
    source: 'https://catalog.cornell.edu/programs/statistics-data-science-ba/',
    checker: includesWithSingleRequirement('STSCI 4520'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Introduction to Computing',
    description:
      'CS 1110 or CS 1112. May be waived with a passing score on the CASE exam for CS 1110, a 5 on AP Computer Science A, ' +
      'or a 6 or 7 on the IB Computer Science exam.',
    source: 'https://catalog.cornell.edu/programs/statistics-data-science-ba/',
    checker: includesWithSingleRequirement('CS 1110', 'CS 1112'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Elective Courses',
    description:
      'Five elective courses with significant statistical content, each at least 3 credits (minimum 15 credits). ' +
      'At least three of the five electives must be STSCI courses or cross-listed with STSCI courses (any 4000-level STSCI course except ' +
      'STSCI 4970, STSCI 4980, and STSCI 4990, or STSCI 3090, 3100, 3740, 3900). The remaining two may come from the pre-approved list of ' +
      'non-STSCI electives; any course not on the list must be approved by the major advisor. Two of STSCI 3600, 4610, 4720, 4725, 4850, ' +
      'and 4881 together count as one elective.',
    source: 'https://catalog.cornell.edu/programs/statistics-data-science-ba/',
    checker: [
      isStsciElective,
      (course: Course): boolean =>
        isStsciElective(course) || courseMatchesCodeOptions(course, nonStsciElectiveCourses),
    ],
    checkerWarning:
      'We do not check that two half-courses (STSCI 3600, 4610, 4720, 4725, 4850, 4881) are combined to count as one elective.',
    fulfilledBy: 'courses',
    perSlotMinCount: [3, 2],
    slotNames: ['STSCI Elective', 'Elective'],
  },
  {
    name: 'Grade Requirement',
    description:
      'All major requirements must be taken for a letter grade, and a grade of C- or better must be earned to meet major requirements. ' +
      'The core requirements total a minimum of 40 credits and the electives a minimum of 15 credits.',
    source: 'https://catalog.cornell.edu/programs/statistics-data-science-ba/',
    fulfilledBy: 'self-check',
  },
];

export default stsciRequirements;

export const stsciAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Martin T. Wells', email: 'mtw1@cornell.edu' }],
};

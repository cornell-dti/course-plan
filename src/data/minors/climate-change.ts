import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import {
  courseMatchesCodeOptions,
  ifCodeMatch,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const source = 'https://www.duffield.cornell.edu/eas/degree/climate-change-minor-requirements/';

// Category 1: Physical Science Behind Climate Change
const physicalScienceCourses = [
  'BEE 4800',
  'EAS 4800',
  'EAS 3030',
  'NTRES 3030',
  'EAS 2680',
  'EAS 3050',
  'EAS 4860',
  'PLSCI 3650',
];

// Category 2: Ecosystems, Water Resources and Climate Change
const ecosystemsCourses = [
  'BEE 3710',
  'BEE 4730',
  'NTRES 3240',
  'NTRES 6240',
  'BIOEE 1610',
  'BIOEE 4780',
  'NTRES 3220',
  'EAS 3340',
  'PLSCS 4290',
  'PLSCS 5290',
  'EAS 3555',
];

// Category 3: Humans and Climate Change
const humansCourses = [
  'LAW 4444',
  'AEM 2555',
  'AEM 4090',
  'NTRES 3311',
  'AMST 2581',
  'ANTHR 2482',
  'ANTHR 2729',
  'CLASS 3750',
  'ENGL 3795',
  'HIST 4262',
  'NTRES 3330',
  'ENGRI 1165',
  'CRP 5545',
  'GOVT 3061',
  'AMST 3061',
  'SYSEN 5120',
  'SYSEN 5210',
  'SYSEN 5240',
];

// Category 4: Additional Climate Change Courses
const additionalCourses = ['CEE 4210', 'CEE 4640', 'CEE 6648', 'EAS 1101', 'ANSC 4880'];

const allClimateChangeCourses = [
  'BEE 2000',
  ...physicalScienceCourses,
  ...ecosystemsCourses,
  ...humansCourses,
  ...additionalCourses,
];

const climateChangeMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Climate Change Seminar',
    description:
      'BEE 2000 Perspectives on the Climate Change Challenge (1 credit spring seminar consisting of public lectures on climate change)',
    source,
    checker: includesWithSingleRequirement('BEE 2000'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['BEE 2000'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Category Courses',
    description:
      'At least one course in each of the following categories: ' +
      'Category 1: Physical Science Behind Climate Change, ' +
      'Category 2: Ecosystems, Water Resources, and Climate Change, ' +
      'Category 3: Humans and Climate Change',
    source,
    checker: includesWithSubRequirements(physicalScienceCourses, ecosystemsCourses, humansCourses),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: [
      'Physical Science Behind Climate Change',
      'Ecosystems, Water Resources, and Climate Change',
      'Humans and Climate Change',
    ],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Total Credits',
    description:
      'At least 18 credits of appropriate coursework, chosen from BEE 2000 and the courses in Categories 1-4. ' +
      'Only one course at the 1000 level can count for the minor. ' +
      'Students must earn a grade of C- or better in each course in the minor. ' +
      'No more than 3 unstructured credits can count towards the minor. AP credit cannot be used toward the minor.',
    source,
    checker: [
      (course: Course): boolean => courseMatchesCodeOptions(course, allClimateChangeCourses),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [18],
    allowCourseDoubleCounting: true,
    disallowTransferCredit: true,
    // TODO: the one-1000-level-course limit, C- minimum grade, and 3-unstructured-credit cap cannot be checked yet.
    checkerWarning:
      'Only one 1000-level course can count toward the minor, each course must be a C- or better, and no more than 3 unstructured credits can count.',
  },
  {
    name: 'Upper-Level Credits',
    description: 'At least 12 credits must be at the 3000 level or higher.',
    source,
    checker: [
      (course: Course): boolean =>
        courseMatchesCodeOptions(course, allClimateChangeCourses) &&
        !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***')),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [12],
    allowCourseDoubleCounting: true,
  },
];

export default climateChangeMinorRequirements;

export const climateChangeMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Annmarie Card', email: 'ac2666@cornell.edu' }],
};

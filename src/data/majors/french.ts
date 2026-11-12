import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseMeetsCreditMinimum,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const frenchRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introduction to French and Francophone Literature and Culture',
    description:
      'FREN 2310 is required for the major (for students who have not already taken an equivalent course). ' +
      'The minimum grade for a course to be applied to the French major is B-, and no course may be taken S/U.',
    source: 'https://catalog.cornell.edu/programs/french-ba/',
    checker: includesWithSubRequirements(['FREN 2310']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['FREN 2310'],
  },
  {
    name: 'French Major Courses',
    description:
      'The major consists of eight courses, minimum 3 credits each, at the FREN 2095 level and higher ' +
      '(seven courses in addition to FREN 2310). These must include at least one course at the 4000 level, ' +
      'one course on the Francophone world beyond France, and three eligible elective courses. ' +
      'Up to two FREN courses conducted in English, and up to two Cornell courses from outside Romance Studies ' +
      '(e.g., Comparative Literature, History, History of Art), may count provided 50% of their content deals directly with France or the Francophone world. ' +
      'Up to three courses from an institution other than Cornell (such as EDUCO in Paris) may also count under the same 50% rule.',
    source: 'https://catalog.cornell.edu/programs/french-ba/',
    checker: [
      (course: Course): boolean =>
        course.subject === 'FREN' &&
        course.catalogNbr !== '2310' &&
        Number(course.catalogNbr) >= 2095 &&
        courseMeetsCreditMinimum(course, 3),
    ],
    checkerWarning:
      'We do not check courses from outside Romance Studies or from other institutions.',
    fulfilledBy: 'courses',
    perSlotMinCount: [7],
    slotNames: ['Course'],
  },
  {
    name: '4000-Level Course',
    description: 'At least one of the eight courses must be at the 4000 level.',
    source: 'https://catalog.cornell.edu/programs/french-ba/',
    checker: includesWithSingleRequirement('FREN 4***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Francophone World Beyond France',
    description:
      'At least one of the eight courses must focus on the Francophone world beyond France.',
    source: 'https://catalog.cornell.edu/programs/french-ba/',
    fulfilledBy: 'self-check',
  },
];

export default frenchRequirements;

export const frenchAdvisors: AdvisorGroup = {
  advisors: [
    { name: 'Julia Chang', email: 'roms_dus@cornell.edu' },
    { name: 'Mary Beth Martini-Lyons', email: 'mm524@cornell.edu' },
  ],
};

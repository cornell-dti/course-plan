import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const PHIL_FWS_NUMBERS = ['1110', '1111', '1112'];

/**
 * A PHIL course that may count toward the eight core courses: not a First-Year Writing Seminar,
 * not a course numbered X9XX (e.g. PHIL 2990, PHIL 4900), and at or above the given level.
 */
const corePhilosophyCourseAtLevel = (minLevel: number) => (course: Course): boolean =>
  course.subject === 'PHIL' &&
  Number(course.catalogNbr.charAt(0)) >= minLevel &&
  course.catalogNbr.charAt(1) !== '9' &&
  !PHIL_FWS_NUMBERS.includes(course.catalogNbr);

const philosophyRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Greek and Roman Philosophy',
    description:
      'PHIL 2200 Greek and Roman Philosophy, or an ancient philosophy course with a large component on Plato or Aristotle.',
    source: 'https://catalog.cornell.edu/programs/philosophy-ba/',
    checker: includesWithSubRequirements(['PHIL 2200']),
    checkerWarning:
      'We only check PHIL 2200. Other ancient philosophy courses must be approved by your advisor.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['PHIL 2200'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Modern Philosophy',
    description:
      'PHIL 2220 Modern Philosophy, or one course on the history of modern philosophy before 1900.',
    source: 'https://catalog.cornell.edu/programs/philosophy-ba/',
    checker: includesWithSubRequirements(['PHIL 2220']),
    checkerWarning:
      'We only check PHIL 2220. Other history of modern philosophy courses must be approved by your advisor.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['PHIL 2220'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Eight Core Philosophy Courses',
    description:
      'A minimum of eight philosophy courses taken for a letter grade and a minimum of 24 total credit hours: ' +
      '6 Philosophy courses at the 2000-level or higher (including PHIL 2200 and PHIL 2220), of which at least three must be at the 3000-level or higher, ' +
      'plus 2 Philosophy courses at any level. ' +
      'The eight courses may not include any First-Year Writing Seminar (PHIL 1110, PHIL 1111, PHIL 1112), ' +
      'any PHIL course with a catalog number X9XX (e.g. PHIL 2990, PHIL 4900, PHIL 4901), or more than four courses completed at other institutions. ' +
      'Students who matriculated at Cornell in fall 2024 or before may count one PHIL FWS toward the major. ' +
      'PHIL 2310 Introduction to Deductive Logic is recommended but not required.',
    source: 'https://catalog.cornell.edu/programs/philosophy-ba/',
    checker: [
      corePhilosophyCourseAtLevel(3),
      corePhilosophyCourseAtLevel(2),
      corePhilosophyCourseAtLevel(1),
    ],
    checkerWarning:
      'We do not check the 24-credit minimum or the limit of four courses from other institutions.',
    fulfilledBy: 'courses',
    perSlotMinCount: [3, 3, 2],
    slotNames: ['3000-Level or Higher', '2000-Level or Higher', 'Any Level'],
  },
  {
    name: 'Philosophy Electives',
    description:
      'Six additional credits (generally two courses) in Philosophy or philosophy-adjacent subjects. ' +
      'Philosophy Electives must be approved by the major advisor if not offered by the Philosophy Department. ' +
      'A grade of C or better is required for any course to count as a Philosophy Elective.',
    source: 'https://catalog.cornell.edu/programs/philosophy-ba/',
    checker: includesWithSingleRequirement('PHIL ****'),
    checkerWarning:
      'We only check PHIL courses. Courses from other departments must be approved by your advisor.',
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
  },
  {
    name: 'Minimum Grade',
    description:
      'All ten classes (30 credit hours) counted toward the major must be completed with grades of C or better.',
    source: 'https://catalog.cornell.edu/programs/philosophy-ba/',
    fulfilledBy: 'self-check',
  },
];

export default philosophyRequirements;

export const philosophyAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Harold Hodes', email: 'harold.hodes@cornell.edu' }],
};

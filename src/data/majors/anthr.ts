import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import {
  ifCodeMatch,
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
  includesWithSubRequirements,
  courseMeetsCreditMinimum,
  courseIsFWS,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const anthrRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Sociocultural, Archaeological, and Biological Anthropology',
    description:
      'One course of 3 or more credits in each of the three subfields (sociocultural, archaeological, biological) from the list below.' +
      'Sociocultural - ANTHR 1400, ANTHR 2400, ANTHR 2421, ANTHR 2468.' +
      'Archaeological - ANTHR 1200, ANTHR 2245, ANTHR 2430, ANTHR 2729.' +
      'Biological - ANTHR 1300, ANTHR 2310.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28110',
    checker: includesWithSubRequirements(
      ['ANTHR 1400', 'ANTHR 2400', 'ANTHR 2421', 'ANTHR 2468'],
      ['ANTHR 1200', 'ANTHR 2245', 'ANTHR 2430', 'ANTHR 2729'],
      ['ANTHR 1300', 'ANTHR 2310']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['Sociocultural', 'Archaeological', 'Biological'],
  },
  {
    name: 'Introduction to Anthropological Theory',
    description: 'ANTHR 3000',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28110',
    checker: includesWithSingleRequirement('ANTHR 3000'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['ANTHR 3000'],
  },
  {
    name: 'Two 3000-level Courses',
    description: 'Two other courses of at least 3 credits at the 3000-level.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28110',
    checker: [
      (course: Course): boolean => {
        const { catalogNbr, subject } = course;
        return (
          ifCodeMatch(subject, 'ANTHR') &&
          !courseMatchesCodeOptions(course, ['ANTHR 3000']) &&
          ifCodeMatch(catalogNbr, '3***') &&
          courseMeetsCreditMinimum(course, 3)
        );
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Two 4000-level Courses',
    description:
      'Two 4000-level courses of at least 3 credits each, one of which must be a seminar course in your senior year with a research paper or project component (ANTHR 4263 is not a seminar course and does not fill the requirement).',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28110',
    checker: [
      (course: Course): boolean => {
        const { catalogNbr, subject } = course;
        return (
          ifCodeMatch(subject, 'ANTHR') &&
          ifCodeMatch(catalogNbr, '4***') &&
          courseMeetsCreditMinimum(course, 3)
        );
      },
    ],
    checkerWarning:
      'We do not check a course is of seminar style with a research paper / project component.',
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Two Elective Courses',
    description:
      'An additional two elective courses of at least 3 credits each, which may be in cognate disciplines with the approval of your advisor.' +
      'No S–U credits or First-Year Writing Seminars may count towards this requirement (or indeed the major).',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28110',
    checker: [
      (course: Course): boolean => {
        const { subject } = course;
        return (
          ifCodeMatch(subject, 'ANTHR') &&
          !courseMatchesCodeOptions(course, ['ANTHR 3000']) &&
          !courseIsFWS(course) &&
          courseMeetsCreditMinimum(course, 3)
        );
      },
    ],
    checkerWarning:
      'We do not check that a given discipline is cognate and would be approved by your advisor.',
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
];

export default anthrRequirements;

export const anthrAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Brett Preston Jr', email: 'bp454@cornell.edu' }],
};

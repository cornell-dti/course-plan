import { CollegeOrMajorRequirement, Course } from '../../types';
import { ifCodeMatch, includesWithSingleRequirement } from '../checkers-common';

const governmentRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Government Courses',
    description:
      'Pass two of the introductory government courses in the subfields of American Government (AM), Comparative Politics (CP), Political Theory (PT), and International Relations (IR)',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19897',
    checker: includesWithSingleRequirement(
      'GOVT 1111',
      'GOVT 1313',
      'GOVT 1615',
      'GOVT 1616',
      'GOVT 1817'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
  },
  {
    name: 'Government Coursework',
    description:
      'Accumulate an additional 28 credits of government course work at the 2000-level or above.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19897',
    checker: [
      (course: Course): boolean => {
        const { catalogNbr, subject } = course;
        return ifCodeMatch(subject, 'GOVT') && !ifCodeMatch(catalogNbr, '1***');
      },
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [28],
  },
  {
    name: 'Tenth Government Course',
    description:
      'The tenth GOVT course: must be worth a minimum of three credits, can be taken at any level. First-Year Writing Seminars cannot be used.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19897',
    checker: includesWithSingleRequirement('GOVT ****'),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Government Seminar',
    description:
      'Complete at least one seminar-style course at the 4000 level in Government, which can be applied toward the 28-credit requirement above.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19897',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    checkerWarning: 'We do not check the course is a seminar style.',
    allowCourseDoubleCounting: true,
    checker: [
      (course: Course): boolean => {
        const { subject, catalogNbr } = course;
        return (
          ifCodeMatch(subject, 'GOVT') &&
          !(
            ifCodeMatch(catalogNbr, '1***') ||
            ifCodeMatch(catalogNbr, '2***') ||
            ifCodeMatch(catalogNbr, '3***')
          )
        );
      },
    ],
  },
];

export default governmentRequirements;

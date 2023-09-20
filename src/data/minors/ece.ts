import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  courseMatchesCodeOptions,
  ifCodeMatch,
  courseMeetsCreditMinimum,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const eceMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Requirement 1',
    description: 'Choose two courses. ',
    source: 'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/minor',
    checker: includesWithSingleRequirement('ECE 2100', 'ECE 2200', 'ECE 2300'),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Requirement 2',
    description: 'Choose two courses. ',
    source: 'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/minor',
    checker: includesWithSingleRequirement(
      'ECE 3030',
      'ECE 3140',
      'ECE 3100',
      'ECE 3150',
      'ECE 3250',
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: '3000+ Courses',
    description:
      'One other technical ECE lecture course at the 3000 level or above. ECE 3400 cannot be used.',
    source: 'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/minor',
    checker: [
      (course: Course): boolean => {
        if (courseMatchesCodeOptions(course, ['ECE 3400'])) {
          return false;
        }
        return (
          courseMeetsCreditMinimum(course, 3) &&
          ifCodeMatch(course.subject, 'ECE') &&
          !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***'))
        );
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: '4000+ Courses',
    description: 'One other technical ECE lecture course at the 4000 level or above.',
    source: 'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/minor',
    checker: [
      (course: Course): boolean =>
        courseMeetsCreditMinimum(course, 3) &&
        ifCodeMatch(course.subject, 'ECE') &&
        !(
          ifCodeMatch(course.catalogNbr, '1***') ||
          ifCodeMatch(course.catalogNbr, '2***') ||
          ifCodeMatch(course.catalogNbr, '3***')
        ),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
];

export default eceMinorRequirements;

export const eceMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Sharif Ewais-Orozco', email: 'ugrad-coordinator@ece.cornell.edu' }],
};

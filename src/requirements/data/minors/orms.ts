import { CollegeOrMajorRequirement, Course } from '../../types';
import {
  courseMatchesCodeOptions,
  ifCodeMatch,
  includesWithSingleRequirement,
} from '../checkers-common';
import { AdvisorGroup } from '@/requirements/tools-types';

const ormsMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'OR/MS Minor Requirement 1',
    description: 'At least 3 courses from the following list. ',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/ore-minors',
    checker: includesWithSingleRequirement(
      'ENGRD 2700',
      'ORIE 3300',
      'ORIE 3310',
      'ORIE 3500',
      'ORIE 3510',
      'ORIE 4580'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  {
    name: 'OR/MS Minor Requirement 2',
    description: 'Any ORIE courses at the 3000 level or higher including those above.',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/ore-minors',
    checker: [
      (course: Course): boolean => {
        if (
          courseMatchesCodeOptions(course, [
            'ORIE 3300',
            'ORIE 3310',
            'ORIE 3500',
            'ORIE 3510',
            'ORIE 4580',
          ])
        ) {
          return false;
        }
        return (
          ifCodeMatch(course.subject, 'ORIE') &&
          !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***'))
        );
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
];

export default ormsMinorRequirements;

export const ormsMinorAdvisors: AdvisorGroup = {
  advisors: [],
};

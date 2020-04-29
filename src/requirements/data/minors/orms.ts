import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement } from '../checkers-common';

const ormsMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: '3 courses from the following',
    description: 'ENGRD 2700, ORIE 3300, ORIE 3310, ORIE 3500, ORIE 3510, ORIE 4580',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/ore-minors',
    checker: includesWithSingleRequirement(
      'ENGRD 2700',
      'ORIE 3300',
      'ORIE 3310',
      'ORIE 3500',
      'ORIE 3510',
      'ORIE 4580',
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 3
  },
  {
    name: 'Three 3000 level or higher ORIE courses',
    description: 'Any ORIE courses at the 3000 level or higher.',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/ore-minors',
    checker: includesWithSingleRequirement(
      'ORIE 3***',
      'ORIE 4***',
      'ORIE 5***',
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 3
  }
];

export default ormsMinorRequirements;

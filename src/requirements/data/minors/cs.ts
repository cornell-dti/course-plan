import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const csMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Requirement 1',
    description: 'CS/ENGRD 2110 or 2112 or ENGRD 2140 or ECE 2400',
    source: 'https://www.cs.cornell.edu/undergrad/csminor',
    checker: includesWithSingleRequirement(
      'CS 2110',
      'ENGRD 2110',
      'CS 2112',
      'ENGRD 2112',
      'ENGRD 2140',
      'ECE 2400'
    ),
    fulfilledBy: 'courses',
    minCount: 1
  },
  {
    name: 'Requirement 2',
    description: 'CS 3110 or CS 3410 or CS 3420/ECE 3140',
    source: 'https://www.cs.cornell.edu/undergrad/csminor',
    checker: includesWithSingleRequirement(
      'CS 3119',
      'CS 3410',
      'CS 3420',
      'ECE 3140'
    ),
    fulfilledBy: 'courses',
    minCount: 1
  },
  // Fix: Add excludes
  {
    name: '4 CS courses numbered 3000 or higher',
    description: 'CS 4090, CS 4997, CS 4998, CS 4999 and seminars are excluded. CS 2800 is allowed',
    source: 'https://www.cs.cornell.edu/undergrad/csminor',
    checker: includesWithSingleRequirement(
      'CS 3***',
      'CS 2800'
    ),
    fulfilledBy: 'courses',
    minCount: 4
  }
];

export default csMinorRequirements;

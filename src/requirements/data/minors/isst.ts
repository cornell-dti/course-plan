import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const isstMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Required Courses',
    description: 'ENGRD 2700, ORIE 3120, ORIE 4800',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/ore-minors',
    checker: includesWithSubRequirements(
      ['ENGRD 2700'],
      ['ORIE 3120'],
      ['ORIE 4800'],
    ),
    fulfilledBy: 'courses',
    minCount: 3
  },
  // Fix: Add excludes
  {
    name: '3 Courses from the following',
    description: 'ORIE 3150, ORIE 3300, ORIE 4150, ORIE 4580, ORIE 4810, ORIE 4850, ORIE 5100, ORIE 5120, ORIE 5770',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/ore-minors',
    checker: includesWithSubRequirements(
      ['ORIE 3150'],
      ['ORIE 3300'],
      ['ORIE 4150'],
      ['ORIE 4580'],
      ['ORIE 4810'],
      ['ORIE 4850'],
      ['ORIE 5100'],
      ['ORIE 5120'],
      ['ORIE 5770'],
    ),
    fulfilledBy: 'courses',
    minCount: 3
  }
];

export default isstMinorRequirements;

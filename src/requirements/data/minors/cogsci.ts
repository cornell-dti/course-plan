import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement } from '../checkers-common';

const cogsciMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Requirement',
    description: 'Choose COGST 1101 or COGST 2200',
    source: 'https://cogsci.cornell.edu/undergraduate-minor',
    checker: includesWithSingleRequirement('COGST 1101', 'COGST 2200'),
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Lab Requirement',
    description: 'Choose COGST 4700 or COGST 4710',
    source: 'https://cogsci.cornell.edu/undergraduate-minor',
    checker: includesWithSingleRequirement('COGST 4700', 'COGST 4710'),
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Three Courses at the 3000 or 4000 Level',
    description:
      'Three courses at the 3000- and 4000-level in at least two departments (or certain suitable 2000- level courses by petition)',
    source: 'https://cogsci.cornell.edu/undergraduate-minor',
    checker: includesWithSingleRequirement('COGST 3***', 'COGST 4***'),
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'courses',
    minCount: 3,
  },
];

export default cogsciMinorRequirements;

import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSingleRequirement } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/types';

const cogsciMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Requirement',
    description: 'Choose COGST 1101 or COGST 2200',
    source: 'https://cogsci.cornell.edu/undergraduate-minor',
    checker: includesWithSingleRequirement('COGST 1101', 'COGST 2200'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Lab Requirement',
    description: 'Choose COGST 4700 or COGST 4710',
    source: 'https://cogsci.cornell.edu/undergraduate-minor',
    checker: includesWithSingleRequirement('COGST 4700', 'COGST 4710'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Three Courses at the 3000 or 4000 Level',
    description:
      'Three courses at the 3000- and 4000-level in at least two departments (or certain suitable 2000- level courses by petition)',
    source: 'https://cogsci.cornell.edu/undergraduate-minor',
    checker: includesWithSingleRequirement('COGST 3***', 'COGST 4***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
];

export default cogsciMinorRequirements;

export const cogsciMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Julie Simmons-Lynch', email: 'jes257@cornell.edu' }],
};

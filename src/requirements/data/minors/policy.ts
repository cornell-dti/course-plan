import { CollegeOrMajorRequirement, Course } from '../../types';
import { includesWithSingleRequirement, courseMatchesCodeOptions } from '../checkers-common';

const policyMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Gateway Course',
    description: 'GOVT 3032',
    source: 'https://government.cornell.edu/public-policy-minor',
    checker: includesWithSingleRequirement('GOVT 3032'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Methods Course',
    description: 'GOVT 3990 or GOVT 3999',
    source: 'https://government.cornell.edu/public-policy-minor',
    checker: includesWithSingleRequirement('GOVT 3990', 'GOVT 3999'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: '3 Electives',
    description:
      '3 elective courses representing a common or diverse range of themes. A partial list of eligible courses is available online.',
    source: 'https://government.cornell.edu/public-policy-minor',
    checkerWarning: 'We do not check that these are eligible courses.',
    checker: [
      (course: Course): boolean =>
        !courseMatchesCodeOptions(course, ['GOVT 3032', 'AMST 3033', 'GOVT 3990', 'GOVT 3999']),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
];

export default policyMinorRequirements;

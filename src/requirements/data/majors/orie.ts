import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const orieRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Major Required Classes',
    description:
      'The following courses may be substituted for ORIE 3150, if not used to meet other require- ments: ' +
      'MATH 3110 (Introduction to Analysis), MATH 4130 (Honors Real Analysis), MATH 4310 (Linear Algebra), MATH 4330 (Honors Linear Algebra), any 600 level ORIE course.',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/degree-requirements',
    checker: includesWithSubRequirements(
      ['ORIE 3120'],
      ['ORIE 3150'],
      ['ORIE 3300'],
      ['ORIE 3310'],
      ['ORIE 3500'],
      ['ORIE 3510'],
      ['ORIE 4580']
    ),
    subRequirementProgress: 'every-course-needed',
    fulfilledBy: 'courses',
    minCount: 7,
  },
  {
    name: 'ORIE Electives',
    description: 'At least 9 credits of ORIE electives at the 4000 level or above',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/degree-requirements',
    checker: includesWithSingleRequirement('ORIE 4***', 'ORIE 5***', 'ORIE 6***'),
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'credits',
    minCount: 9,
  },
  {
    name: 'Engineering Distribution Courses',
    description: 'ENGRI 1xxx, ENGRD 2700, and ENGRD 2xxx. ENGRD 2110 is recommended',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/degree-requirements',
    checker: includesWithSubRequirements(
      ['ENGRD 2700'],
      ['ENGRD 2***', 'ENGRD 3***'],
      ['ENGRI 1***']
    ),
    subRequirementProgress: 'every-course-needed',
    fulfilledBy: 'courses',
    minCount: 3,
  },
  {
    name: 'Major Approved Electives (Non–ORIE)',
    description:
      'Minimum of 9-12 credits of Major-Approved Electives 3 of which must be outside of ORIE. ' +
      'Technical courses in Engineering at the 2000 level or above.',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/degree-requirements',
    fulfilledBy: 'self-check',
  },
  {
    name: 'Major Approved Elective',
    description:
      'Minimum of 9-12 credits of Major-Approved Electives 3 of which must be outside of ORIE. ' +
      'Technical courses in Engineering at the 2000 level or above.',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/degree-requirements',
    fulfilledBy: 'self-check',
  },
];

export default orieRequirements;

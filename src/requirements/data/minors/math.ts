import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const mathMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Math Minor Prerequisites',
    description:
      'Students are admitted to the minor after successfully completing ' +
      'a semester of linear algebra and a semester of multivariable calculus.',
    source: 'https://math.cornell.edu/minor',
    checker: includesWithSubRequirements(
      ['MATH 2210', 'MATH 2230', 'MATH 2940'],
      ['MATH 2220', 'MATH 2240', 'MATH 1920']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['Linear Algebra', 'Multivariable Calculus'],
  },
  {
    name: 'Four 3000 or 4000 level MATH courses',
    description:
      'Students must complete four 3000- or 4000-level MATH courses. ' +
      'Only courses with a MATH prefix or cross-listed as such are allowed; no substitutions.',
    source: 'https://math.cornell.edu/minor',
    checker: includesWithSingleRequirement('MATH 3***', 'MATH 4***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [4],
    slotNames: ['Course'],
  },
  {
    name: 'At least one 4000 level course',
    description: 'At least one of the four courses must be at the 4000 level or above.',
    source: 'https://math.cornell.edu/minor',
    checker: includesWithSingleRequirement('MATH 4***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'One algebra course',
    description: 'At least one course must be in algebra.',
    source: 'https://math.cornell.edu/minor',
    checker: includesWithSingleRequirement(
      'MATH 3320',
      'MATH 3340',
      'MATH 3360',
      'MATH 4310',
      'MATH 4315',
      'MATH 4330',
      'MATH 4340',
      'MATH 4370',
      'MATH 4500',
      'MATH 4560'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'One analysis course',
    description: 'At least one course must be in analysis.',
    source: 'https://math.cornell.edu/minor',
    checker: includesWithSingleRequirement(
      'MATH 3110',
      'MATH 3210',
      'MATH 3230',
      'MATH 4130',
      'MATH 4140',
      'MATH 4180',
      'MATH 4200',
      'MATH 4210',
      'MATH 4220',
      'MATH 4250',
      'MATH 4260',
      'MATH 4280'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
];

export default mathMinorRequirements;

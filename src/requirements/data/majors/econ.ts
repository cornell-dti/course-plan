import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const economicsRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Admission to the Major',
    description:
      'Before applying for admission to the Economics Major, students must complete ECON 1110, ECON 1120, and MATH 1110 (or equivalents).',
    source: 'https://economics.cornell.edu/major',
    checker: includesWithSubRequirements(['ECON 1110'], ['ECON 1120'], ['MATH 1110']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
  },
  {
    name: 'Core Economics',
    description:
      'All students must take four core economics courses: ECON 3030, ECON 3040, ECON 3110 or ECON 3130, and ECON 3120 or ECON 3140.',
    source: 'https://economics.cornell.edu/major',
    checker: includesWithSubRequirements(
      ['ECON 3030'],
      ['ECON 3040'],
      ['ECON 3110', 'ECON 3130'],
      ['ECON 3120', 'ECON 3140']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
  },
  {
    name: '4000-level Courses',
    description: 'All students must take at least three courses at the 4000-level or higher.',
    source: 'https://economics.cornell.edu/major',
    checker: includesWithSingleRequirement('ECON 4***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
  },
  {
    name: 'Basic Requirements',
    description:
      'Twelve courses listed by the Department of Economics, or approved by the student’s major advisor',
    source: 'https://economics.cornell.edu/major',
    checker: includesWithSingleRequirement('ECON 1110', 'ECON 1120', 'ECON 3***', 'ECON 4***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [12],
  },
];

export default economicsRequirements;

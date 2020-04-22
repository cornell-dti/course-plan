import { CollegeOrMajorRequirement } from '../../types';

const businessRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Major Requirements',
    description:
      'Graduation requirements depend on major. For undergraduates, it is either Dyson or SHA requirements.',
    source: 'https://business.cornell.edu/programs/undergraduate/',
    checker: null,
    fulfilledBy: 'self-check'
  }
];

export default businessRequirements;

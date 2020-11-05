import { CollegeOrMajorRequirement } from '../../types';
import { courseIsAllEligible } from '../checkers-common';

const businessRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Total Academic Credits',
    description: '120 academic credits are required'
      + 'PE courses and courses numbered 1000-1099 do not count towards the 120 credits',
    source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11715',
    checker: courseIsAllEligible,
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 120
  }
];

export default businessRequirements;

import { CollegeOrMajorRequirement } from '../../requirements/types';
import { AdvisorGroup } from '../../tools/advisors/types';

const aapRequirements: readonly CollegeOrMajorRequirement[] = [];
// As of Fall 2020, there are no college-level graduation requirements in addition
// to the university and degree-specified graduation requirements for AAP
export default aapRequirements;

// Note: writing requirement does not accept FWS credit
// This can be accounted for in the checker

export const aapAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Becky Baines', email: 'rb786@cornell.edu' }],
};

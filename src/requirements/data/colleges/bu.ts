import { CollegeOrMajorRequirement } from '../../types';
import { AdvisorGroup } from '@/requirements/tools-types';

const businessRequirements: readonly CollegeOrMajorRequirement[] = [];
// offers two undergraduate majors: AEM and Hotel Admin
export default businessRequirements;

export const businessAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Brooke Tobey', email: 'gm-registrar@cornell.edu' }],
};

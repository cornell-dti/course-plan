import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import { ifCodeMatch, includesWithSubRequirements } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

// from here

const vienScienceRequirement: readonly string[] = ['PBS', 'PBSS', 'OPHLS', 'BIOLS', 'BIO'];

const vienRequirements: readonly CollegeOrMajorRequirement[] = [];

export default vienRequirements;

export const vienAdvisors: AdvisorGroup = {
  advisors: [{ name: '', email: '' }],
};

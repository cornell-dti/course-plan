import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const engMgmtMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Requirement 1',
    description: 'CEE 3230 or ORIE 4150',
    source:
      'https://www.cee.cornell.edu/cee/programs/undergraduate-progams/minors/engineering-management-minor',
    checker: includesWithSingleRequirement('CEE 3230', 'ORIE 4150'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Requirement 2',
    description: 'ORIE 3150',
    source:
      'https://www.cee.cornell.edu/cee/programs/undergraduate-progams/minors/engineering-management-minor',
    checker: includesWithSingleRequirement('ORIE 3150'),
    checkerWarning:
      'ORIE majors must substitute NCC 5560 or NBA 5000. We do not check if you are an ORIE major.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Requirement 3',
    description: 'CEE 3040 or ENGRD 2700 or ECE 3100',
    source:
      'https://www.cee.cornell.edu/cee/programs/undergraduate-progams/minors/engineering-management-minor',
    checker: includesWithSingleRequirement('CEE 3040', 'ENGRD 2700', 'ECE 3100'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Three Additional Courses',
    description:
      'Three additional courses chosen from the following list: CEE 5930 (not for ORIE majors), CEE 5950, CEE 5970, CEE 5980, ENGRG 3600, NBA 5070, MAE/ENGRG 4610/ORIE 4152, BEE 4890. Only one of NBA 5070, MAE/ENGRG 4610/ORIE 4152, and BEE 4890 may be chosen for this requirement.',
    source:
      'https://www.cee.cornell.edu/cee/programs/undergraduate-progams/minors/engineering-management-minor',
    checker: includesWithSingleRequirement(
      'CEE 5930',
      'CEE 5950',
      'CEE 5970',
      'CEE 5980',
      'ENGRG 3600',
      'NBA 5070',
      'MAE 4610',
      'ENGRG 4610',
      'ORIE 4152',
      'BEE 4890'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
];

export default engMgmtMinorRequirements;

// TODO: advisor(s)
export const engMgmtMinorAdvisors: AdvisorGroup = {
  advisors: []
}

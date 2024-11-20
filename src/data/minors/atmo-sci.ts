import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSingleRequirement } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const atmoSciMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Two Core Courses',
    description: 'Any two of these core courses: EAS 3410, EAS 3420, EAS 4470.',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/undergraduate-minors/atmospheric-science-minor',
    checker: includesWithSingleRequirement('EAS 3410', 'EAS 3420', 'EAS 4470'),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Two Courses'],
  },
  {
    name: 'Two Other EAS Courses',
    description:
      'And any two of the following EAS courses: EAS 1310, EAS 2500, EAS 2680, EAS 3050, EAS 3340, EAS 3520 ' +
      'EAS 4350, EAS 4570, EAS 4700, EAS 4860, EAS 6860',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/undergraduate-minors/atmospheric-science-minor',
    checker: includesWithSingleRequirement(
      'EAS 1310',
      'EAS 2500',
      'EAS 2680',
      'EAS 3050',
      'EAS 3340',
      'EAS 3520',
      'EAS 4350',
      'EAS 4510',
      'EAS 4570',
      'EAS 4700',
      'EAS 4860',
      'EAS 6860'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Two Other Courses'],
  },
];

export default atmoSciMinorRequirements;

// TODO: Add Advisors Later
export const atmoSciMinorAdvisors: AdvisorGroup = {
  advisors: [],
};

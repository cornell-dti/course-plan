import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const earthAndAtmosphericSciencesMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'The Earth System',
    description: 'EAS 2250',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/undergraduate-minors/earth-and-atmospheric-sciences-minor',
    checker: includesWithSingleRequirement('EAS 2250'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['EAS 2250'],
  },
  {
    name: 'Additional Core Courses',
    description: 'At least three selections from the following core course options',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/undergraduate-minors/earth-and-atmospheric-sciences-minor',
    checker: includesWithSubRequirements([
      'EAS 3050',
      'EAS 3410',
      'EAS 3420',
      'EAS 3090',
      'EAS 3880 ',
      'EAS 3010',
      'EAS 3030',
      'EAS 3450',
      'EAS 3530',
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  {
    name: 'Additional Courses: 3000 or above',
    description:
      'Additional EAS courses at the 3000-level or higher. These courses may include, but are not limited to, additional courses from the above list, undergraduate research courses, and outdoor field courses.',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/undergraduate-minors/earth-and-atmospheric-sciences-minor',
    fulfilledBy: 'self-check',
  },
];

export default earthAndAtmosphericSciencesMinorRequirements;

export const easMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Annmarie Card', email: 'ac2666@cornell.edu' }],
};

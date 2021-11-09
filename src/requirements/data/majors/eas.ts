import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const easRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Mathematics',
    description: 'At least two courses in calculus: MATH 1110 + MATH 1120 or MATH 1910 + MATH 1920',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/abbs-earth-and-atmospheric-sciences/eas-major-requirements',
    checker: includesWithSubRequirements(['MATH 1110', 'MATH 1120'], ['MATH 1910', 'MATH 1920']),
    fulfilledBy: 'courses',
    perSlotMinCount: [2, 2],
    slotNames: ['MATH 1110 & MATH 1120', 'MATH 1910 & MATH 1920'],
    minNumberOfSlots: 1,
  },
  {
    name: 'Physics',
    description:
      'At least two courses in calculus-based physics: PHYS 2207 + PHYS 2208 or PHYS 1112 + PHYS 2213',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/abbs-earth-and-atmospheric-sciences/eas-major-requirements',
    checker: includesWithSubRequirements(['PHYS 2207', 'PHYS 2208'], ['PHYS 1112', 'PHYS 2213']),
    fulfilledBy: 'courses',
    perSlotMinCount: [2, 2],
    slotNames: ['PHYS 2207 & PHYS 2208', 'PHYS 1112 & PHYS 2213'],
    minNumberOfSlots: 1,
  },
  {
    name: 'Chemistry',
    description:
      'At least two courses in chemistry: CHEM 2070 or CHEM 2090 + CHEM 2080 or CHEM 1570. Students who take PHYS 1112 + PHYS 2213 may substitute PHYS 2214 for their second course in chemistry',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/abbs-earth-and-atmospheric-sciences/eas-major-requirements',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description: 'CHEM 2070 or CHEM 2090 AND CHEM 2080',
        checker: includesWithSubRequirements(['CHEM 2070', 'CHEM 2090'], ['CHEM 2080']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 2070 or CHEM 2090', 'CHEM 2080'],
      },
      'Option 2': {
        description: 'PHYS 2214',
        checker: includesWithSubRequirements(['PHYS 2214']),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
    },
  },
  {
    name: 'Biology',
    description:
      'At least one course in biology, chosen from the following: BIOG 1140, BIOG 1440, BIOEE 1610, BIOEE 1780, BIOMG 1350, BIOSM 1610, or BIOSM 1780',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/abbs-earth-and-atmospheric-sciences/eas-major-requirements',
    fulfilledBy: 'courses',
    checker: includesWithSingleRequirement(
      'BIOG 1140',
      'BIOG 1140',
      'BIOEE 1610',
      'BIOEE 1780',
      'BIOMG 1350',
      'BIOSM 1610',
      'BIOSM 1780'
    ),
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
];

export default easRequirements;

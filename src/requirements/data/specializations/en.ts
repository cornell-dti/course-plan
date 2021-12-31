import { CollegeOrMajorRequirement } from '@/requirements/types';
import { includesWithSubRequirements } from '../checkers-common';

const MATH2940: CollegeOrMajorRequirement = {
  name: 'Mathematics',
  description: 'MATH 1910, 1920, 2940, and a mathematics course chosen by the Major.',
  source:
    'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
  checker: includesWithSubRequirements(['MATH 1910'], ['MATH 1920'], ['MATH 2940']),
  fulfilledBy: 'courses',
  perSlotMinCount: [1, 1, 1],
  slotNames: ['MATH 1910', 'MATH 1920', 'MATH 2940'],
};

const CHEM2080: CollegeOrMajorRequirement = {
  name: 'Chemistry',
  description:
    'CHEM 2090 and CHEM 2080 (can also be substituted by CHEM 2150, PHYS 2214, PHYS 2218, BTRY 3080, ECON 3130, MATH 2930, or MATH 4710)',
  source: 'https://www.cs.cornell.edu/undergrad/rulesandproceduresengineering/engineeringchecklist',
  checker: includesWithSubRequirements(
    ['CHEM 2090'],
    [
      'CHEM 2080',
      'CHEM 2150',
      'PHYS 2214',
      'PHYS 2218',
      'BTRY 3080',
      'ECON 3130',
      'MATH 2930',
      'MATH 4710',
    ]
  ),
  fulfilledBy: 'courses',
  perSlotMinCount: [1, 1],
  slotNames: ['CHEM 2090', 'CHEM 2080'],
};

export { MATH2940, CHEM2080 };

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

export default MATH2940;

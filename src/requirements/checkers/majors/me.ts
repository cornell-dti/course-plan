import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const mechanicalEngineeringEngineeringDistribution = includesWithSingleRequirement('ENGRD 2020');

const mechanicalEngineeringRequiredMajorCourses = includesWithSubRequirements(
  ['MAE 2210'],
  ['MAE 2030'],
  ['MAE 2250'],
  ['MAE 3230'],
  ['MAE 3240'],
  ['MAE 3260'],
  ['MAE 3270'],
  ['MAE 3780', 'ENGRD 2100', 'PHYS 3360'],
  ['MAE 4272'],
  ['MAE 4300']
);

const mechanicalEngineeringMathematicsElective = includesWithSingleRequirement(
  'MAE 3100',
  'ENGRD 2700',
  'CEE 3040',
  'ENGRD 3200',
  'ENGRD 3100',
  'BTRY 3010',
  'CS 2800'
);

export default {
  mechanicalEngineeringEngineeringDistribution,
  mechanicalEngineeringRequiredMajorCourses,
  mechanicalEngineeringMathematicsElective
};

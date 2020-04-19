import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const orieMajorRequiredClasses = includesWithSubRequirements(
  ['ORIE 3120'],
  ['ORIE 3150'],
  ['ORIE 3300'],
  ['ORIE 3310'],
  ['ORIE 3500'],
  ['ORIE 3510'],
  ['ORIE 4580']
);

const orieElectives = includesWithSingleRequirement('ORIE 4***', 'ORIE 5***', 'ORIE 6***');

const orieEngineeringDistributionCourses = includesWithSubRequirements(
  ['ENGRD 2700'],
  ['ENGRD 2***', 'ENGRD 3***'],
  ['ENGRI 1***']
);

export default { orieMajorRequiredClasses, orieElectives, orieEngineeringDistributionCourses };

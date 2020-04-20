import { includesWithSubRequirements } from '../checkers-common';

const isstProbabilityStatisticsAndOptimization = includesWithSubRequirements(
  ['ORIE 3300'],
  ['ORIE 3500']
);

const isstInformationSystems = includesWithSubRequirements(
  ['INFO 2300'],
  ['ORIE 3800'],
  ['INFO 3300', 'INFO 4300']
);

const isstEconomicOrganizationAndSocialContext = includesWithSubRequirements(
  ['INFO 2040'],
  ['INFO 2450', 'ENGRC 3350']
);

const isstEngineeringMathematics = includesWithSubRequirements(
  ['MATH 1910'],
  ['MATH 1920'],
  ['MATH 2940'],
  ['MATH 2930', 'MATH 3040', 'CS 2800']
);

const isstEngineeringDistributions = includesWithSubRequirements(
  ['ENGRD 2110'],
  ['ENGRD 2700']
);

export default {
  isstProbabilityStatisticsAndOptimization,
  isstInformationSystems,
  isstEconomicOrganizationAndSocialContext,
  isstEngineeringMathematics,
  isstEngineeringDistributions
};

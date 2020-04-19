import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const aemManagementRequirements = includesWithSubRequirements(
  ['AEM 2200'],
  ['AEM 2225'],
  ['AEM 2240'],
  ['AEM 2420'],
  ['AEM 2601'],
  ['AEM 3200'],
  ['AEM 3230']
);

const aemEconomicsRequirements = includesWithSubRequirements(
  ['ECON 1110'],
  ['ECON 1120'],
  ['AEM 2600', 'ECON 3030']
);

const aemQuantitativeMethodsRequirements = includesWithSubRequirements(
  ['AEM 2100'],
  ['MATH 1110', 'MATH 1120'],
  ['AEM 2010']
);

const aemQuantitativeMethodsElectivesRequirements = includesWithSingleRequirement(
  'AEM 2770',
  'AEM 2830',
  'AEM 2840',
  'AEM 3100',
  'AEM 3390',
  'AEM 4060',
  'AEM 4110',
  'AEM 4120',
  'AEM 4190',
  'BTRY 3080',
  'ILRST 3080',
  'STSCI 3080',
  'ECON 3130',
  'ECON 3140',
  'ECON 4020',
  'ILRST 2110',
  'ILRST 3110'
);

const aemGradChallengeRequirementPart1 = includesWithSingleRequirement(
  'AEM 2000',
  'AEM 2555',
  'AEM 2800',
  'AEM 2805',
  'AEM 4940'
);

const aemGradChallengeRequirementPart2 = includesWithSingleRequirement('AEM 3000');

const aemGradChallengeRequirementPart3 = includesWithSingleRequirement('AEM 4000');

export default {
  aemManagementRequirements,
  aemEconomicsRequirements,
  aemQuantitativeMethodsRequirements,
  aemQuantitativeMethodsElectivesRequirements,
  aemGradChallengeRequirementPart1,
  aemGradChallengeRequirementPart2,
  aemGradChallengeRequirementPart3
};

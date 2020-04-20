import { courseIsFWS, includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const ilrCoreRequirements = includesWithSubRequirements(
  ['ILROB 1220'],
  ['ILRLR 1100'],
  ['ECON 1110'],
  ['ECON 1120'],
  ['ILRST 2100'],
  ['ILRLR 2010'],
  ['ILRHR 2600'],
  ['ILRLR 2050'],
  ['ILRLE 2400']
);

const ilrFWS = courseIsFWS;

const ilrAdvanceWriting = includesWithSingleRequirement(
  'ILRHR 2360',
  'ILRIC 2390',
  'ILRLE 2400',
  'ILRLR 2060',
  'ILRLR 2070',
  'ILROB 2230',
  'ILROB 2290',
  'ENGL 2880',
  'ENGL 2890'
);

export default { ilrCoreRequirements, ilrFWS, ilrAdvanceWriting };

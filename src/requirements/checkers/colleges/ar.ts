import { courseIsFWS, includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const aapIntroductoryStudioPractice = includesWithSubRequirements(
  ['ART 2201'],
  ['ART 2301'],
  ['ART 2401'],
  ['ART 2501'],
  ['ART 2601'],
  ['ART 2701']
);

const aapElectiveStudioPractice = includesWithSingleRequirement(
  'ART 3201',
  'ART 3301',
  'ART 3401',
  'ART 3501',
  'ART 3601',
  'ART 3705',
  'ART 3001',
  'ART 3003'
);

const aapPreThesisStudioPractice = includesWithSingleRequirement('ART 3006');

const aapThesisStudioPractice = includesWithSubRequirements(['ART 4003'], ['ART 4004']);

const aapShopInstruction = includesWithSingleRequirement('ART 2900');

const aapTheoryAndCriticism = includesWithSubRequirements(['ART 2103'], ['ART 4100']);

const aapFWS = courseIsFWS;

export default {
  aapIntroductoryStudioPractice,
  aapElectiveStudioPractice,
  aapPreThesisStudioPractice,
  aapThesisStudioPractice,
  aapShopInstruction,
  aapTheoryAndCriticism,
  aapFWS
};

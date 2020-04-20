import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const economicsAdmissionToTheMajor = includesWithSubRequirements(
  ['ECON 1110'],
  ['ECON 1120'],
  ['MATH 1110']
);

const economicsCoreEconomics = includesWithSubRequirements(
  ['ECON 3030'],
  ['ECON 3040'],
  ['ECON 3110', 'ECON 3130'],
  ['ECON 3120', 'ECON 3140']
);

const economics4000LevelCourses = includesWithSingleRequirement('ECON 4***');

const econimicsBasicRequirements = includesWithSingleRequirement(
  'ECON 1110',
  'ECON 1120',
  'ECON 3***',
  'ECON 4***'
);

export default {
  economicsAdmissionToTheMajor,
  economicsCoreEconomics,
  economics4000LevelCourses,
  econimicsBasicRequirements
};

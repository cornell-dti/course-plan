import { includesWithSubRequirements } from '../checkers-common';

const infoCoreCourses = includesWithSubRequirements(
  ['INFO 1200'],
  ['INFO 1300'],
  ['INFO 2040'],
  ['INFO 2450'],
  ['INFO 2950']
);

const infoProgrammingAndMathRequirements = includesWithSubRequirements(
  ['CS 1110'],
  ['MATH 1106', 'MATH 1110', 'MATH 1910'],
  [
    'AEM 2100',
    'BTRY 3010',
    'CEE 3040',
    'ECON 3110',
    'ECON 3130',
    'ENGRD 2700',
    'ILRST 2100',
    'MATH 1710',
    'PAM 2100',
    'PSYCH 2500',
    'SOC 3010',
    'STSCI 2100',
    'STSCI 2150',
    'STSCI 2200'
  ]
);

const infoElectives = includesWithSubRequirements(
  ['INFO 2300'],
  ['CS 2110'],
  ['CS 3110'],
  ['CS 3410'],
  ['INFO 3***', 'INFO 4***', 'INFO 5***', 'INFO 6***']
);

export default { infoCoreCourses, infoProgrammingAndMathRequirements, infoElectives };

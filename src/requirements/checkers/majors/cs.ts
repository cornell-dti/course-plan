import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const csIntroProgramming = includesWithSubRequirements(
  ['CS 1110', 'CS 1112', 'CS 1114', 'CS 1115'],
  ['CS 2110', 'CS 2112']
);

const csCore = includesWithSubRequirements(
  ['CS 2800', 'CS 2802'],
  ['CS 3110'],
  ['CS 3410', 'CS 3420'],
  ['CS 4820'],
  ['CS 4410']
);

const csPracticumOrProject = includesWithSingleRequirement(
  'CS 4**1',
  'CS 3152',
  'CS 4152',
  'CS 4154',
  'CS 4740',
  'CS 4752',
  'CS 5150',
  'CS 5152',
  'CS 5412',
  'CS 5414',
  'CS 5431',
  'CS 5625',
  'CS 5643'
);

export default { csIntroProgramming, csCore, csPracticumOrProject };

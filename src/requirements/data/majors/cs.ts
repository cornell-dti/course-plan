import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const csRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Programming',
    description: 'CS 111x (CS 1110, 1112, 1114, or 1115) and CS 2110 (or CS 2112) or equivalent.',
    source: 'https://www.cs.cornell.edu/undergrad/csmajor',
    checker: includesWithSubRequirements(
      ['CS 1110', 'CS 1112', 'CS 1114', 'CS 1115'],
      ['CS 2110', 'CS 2112']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 2
  },
  {
    name: 'Computer Science Core',
    description: 'CS 2800 (or CS 2802), CS 3110, CS 3410 or CS 3420, CS 4410, and CS 4820',
    source: 'https://www.cs.cornell.edu/undergrad/csmajor',
    checker: includesWithSubRequirements(
      ['CS 2800', 'CS 2802'],
      ['CS 3110'],
      ['CS 3410', 'CS 3420'],
      ['CS 4820'],
      ['CS 4410']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 5
  },
  {
    name: 'CS Practicum or Project',
    description: 'CS practicums (CS 4xx1) or CS 3152, CS 4152, CS 4154, CS 4740, CS 4752, CS 5150, CS 5152, CS 5412, CS 5414, CS 5431, CS 5625, or CS 5643.',
    source: 'https://www.cs.cornell.edu/undergrad/csmajor',
    checker: includesWithSingleRequirement(
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
    ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1
  },
  {
    name: 'Technical Electives',
    description: 'The Technical Electives must be made up of three 3000+ level courses.  '
      + 'These courses must be taken for a letter grade, and each must earn three or more credit hours.',
    source: 'https://www.cs.cornell.edu/undergrad/csmajor/technicalelectives',
    checker: null,
    operator: null,
    fulfilledBy: 'self-check'
  },
  {
    name: 'External Specialization',
    description: 'The External Specialization involves nine or more credit hours at the 3000+ level. '
      + 'Absolutely no CS courses are allowed. The three courses must be related to each other. '
      + 'Frequently, the three courses are from the same department, e.g., OR&IE 3300 (Optimization I), OR&IE 3310 (Optimization II), and OR&IE 4330 (Discrete Models). '
      + 'However, a great strength of Cornell is the multitude of interdisciplinary threads that cut across departmental boundaries. '
      + 'Thus, Psychology 4150 (Concepts, Categories, and Word Meanings), Philosophy 3320 (Philosophy of Language), '
      + 'and Linguistics 5530 (Representation of Structure in Vision and Language) define an acceptable Specialization.',
    source: 'https://www.cs.cornell.edu/undergrad/rulesandproceduresengineering/choosingyourelectives',
    checker: null,
    operator: null,
    fulfilledBy: 'self-check'
  },
  {
    name: 'Major-approved Elective(s)',
    description: 'The major elective is any course or courses approved by your CS major advisor. '
      + 'This elective requirement can be met by multiple courses totalling 3 credits, or one course of 3+ credit hours. '
      + 'Phys Ed, courses numbered 10xx, and ROTC courses below the 3000-level, do not qualify for academic credit and can not be used toward the degree requirements in CS.',
    source: 'https://www.cs.cornell.edu/undergrad/rulesandproceduresengineering/choosingyourelectives',
    checker: null,
    operator: null,
    fulfilledBy: 'self-check'
  }
];

export default csRequirements;

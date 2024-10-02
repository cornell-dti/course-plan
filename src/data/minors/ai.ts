import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  courseMatchesCodeOptions,
  ifCodeMatch,
  courseMatchesCode,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';
import { lastNameRange } from '../../tools/advisors/checkers';

const aiMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Foundations of AI: Machine Learning',
    description: 'CS 3780 or ECE 4200 or ORIE 4741 or STSCI 3740',
    source: 'https://prod.cis.cornell.edu/undergraduate-opportunities/minors/artificial-intelligence/ai-minor-requirements',
    checker: includesWithSingleRequirement(
      'CS 3780',
      'ECE 3200',
      'ORIE 3741',
      'STSCI 3740',
      //TODO: add credit for prev codes ie: cs 3780 was formerly 4780
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Foundations of AI: Reasoning',
    description: 'CS 3700',
    source: 'https://prod.cis.cornell.edu/undergraduate-opportunities/minors/artificial-intelligence/ai-minor-requirements',
    checker: includesWithSingleRequirement('CS 3700'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Foundations of AI: Human-AI Interaction',
    description: 'INFO 4940',
    //TODO: add INFO 3450 exception for students grad in dec 2024 or may 2025
    source: 'https://prod.cis.cornell.edu/undergraduate-opportunities/minors/artificial-intelligence/ai-minor-requirements',
    checker: includesWithSingleRequirement('INFO 4940'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Foundations of AI: Ethics, Governance & Policy',
    description: 'ENGRG 3605 or INFO 1260 or PUBPOL 4210',
    source: 'https://prod.cis.cornell.edu/undergraduate-opportunities/minors/artificial-intelligence/ai-minor-requirements',
    checker: includesWithSingleRequirement('ENGRG 3605', 'INFO 1260', 'PUBPOL 4210'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'AI Electives',
    description:
      'Two of the following courses.',
    source:
      'http://www.cs.cornell.edu/undergrad/rulesandproceduresengineering/choosingyourelectives',
      checker: includesWithSingleRequirement('CS 4670', 'CS 4701', 'CS 4740', 'CS 4750', 'CS 4756', 'CS 4782', 'CS 4783', 'CS 4787', 'CS 4789', 'CS 4860', 'ECE 4160', 'ENGRG 3605', 'INFO 1260', 'INFO 3350', 'INFO 3950', 'INFO 4100', 'INFO 4120', 'INFO 4130', 'INFO 4275', 'INFO 4300', 'INFO 4310', 'INFO 4410', 'LING 4424', 'LING 4434', 'MAE 4180', 'MAE 4810', 'NBA 4920', 'ORIE 4160', 'ORIE 4740', 'ORIE 4742', 'PUBPOL 4210', 'PHIL 2621', 'STS 3440', 'STSCI 3110', 'STSCI 4030', 'STSCI 4520', 'STSCI 4750'),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },

];

export default aiMinorRequirements;

// export const aiMinorAdvisors: AdvisorGroup = {
//   advisors: [
//     { name: 'Ryan Marchenese ', email: 'ryan.m@cornell.edu', checker: lastNameRange('A', 'H') },
//     { name: 'Carl Cornell', email: 'cec232@cornell.edu', checker: lastNameRange('I', 'Q') },
//     { name: 'Nicole Roy', email: 'nicole.roy@cornell.edu', checker: lastNameRange('R', 'Z') },
//   ],
// };

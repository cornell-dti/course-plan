import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSubRequirements } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const arthRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Required Courses',
    description:
      'ARTH 1100 (offered every fall; must be passed with a grade of at least B), VISST 2000, and ARTH 4101. ' +
      'Students who declare the major at the end of sophomore year without having taken ARTH 1100 must complete a tutorial with a grade of at least B. ' +
      'These courses count toward the 10 History of Art courses.',
    source: 'https://catalog.cornell.edu/programs/history-art-ba/',
    checker: includesWithSubRequirements(['ARTH 1100'], ['VISST 2000'], ['ARTH 4101']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['ARTH 1100', 'VISST 2000', 'ARTH 4101'],
  },
  {
    name: 'Additional Electives',
    description:
      'Seven additional ARTH electives: at least two courses at the 2000-level, at least one course at the 3000-level, ' +
      'at least two courses at the 4000-level, and two additional ARTH electives at the 3000-level or higher. ' +
      'In total, at least 6 of the 10 History of Art courses must be at the 3000-level or above.',
    source: 'https://catalog.cornell.edu/programs/history-art-ba/',
    checker: includesWithSubRequirements(
      ['ARTH 2***'],
      ['ARTH 3***'],
      ['ARTH 4***'],
      ['ARTH 3***', 'ARTH 4***']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2, 1, 2, 2],
    slotNames: ['2000-level', '3000-level', '4000-level', '3000-level or higher'],
  },
  {
    name: 'Distributional Categories',
    description:
      'At least 4 of the 7 free-choice elective courses must cover distinct distributional categories: ' +
      'Comparative/Global (Theory/Method/Transregional); Museographic (Curatorial/Collections-Collecting/Display); ' +
      'Africa and African Diaspora; Asia; Europe and North America; Indigenous Americas; Latin America/Caribbean; ' +
      'SWANA (Southwest Asia and North Africa). Consult the History of Art webpage to see which courses apply to each category.',
    source: 'https://catalog.cornell.edu/programs/history-art-ba/',
    fulfilledBy: 'self-check',
  },
];

export default arthRequirements;

export const arthAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Ananda Cohen-Aponte', email: 'aic42@cornell.edu' }],
};

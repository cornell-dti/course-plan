import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const fgssRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Courses',
    description:
      'The nine FGSS courses required for the major must include FGSS 2010, FGSS 3000, and FGSS 4000. ' +
      'Every course applied to the major must be completed with a grade of C- or higher.',
    source: 'https://catalog.cornell.edu/programs/fgss-ba/',
    checker: includesWithSubRequirements(['FGSS 2010'], ['FGSS 3000'], ['FGSS 4000']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['FGSS 2010', 'FGSS 3000', 'FGSS 4000'],
  },
  {
    name: 'Additional FGSS Courses',
    description:
      'Six additional FGSS courses (3 or 4 credits each) to reach the nine-course minimum. ' +
      'Courses may be registered under FGSS or under the cross-listing department. ' +
      'A student with a double major may count up to three FGSS courses toward both majors.',
    source: 'https://catalog.cornell.edu/programs/fgss-ba/',
    checker: includesWithSingleRequirement('FGSS 2***', 'FGSS 3***', 'FGSS 4***'),
    checkerWarning:
      'We do not check that cross-listed courses registered under another department count.',
    fulfilledBy: 'courses',
    perSlotMinCount: [6],
    slotNames: ['Course'],
  },
  {
    name: 'Distribution Categories',
    description:
      'The nine courses must include at least one FGSS course with a significant focus on each of the following three categories: ' +
      'lesbian, gay, bisexual, and transgender (LGBT) studies; intersectionality; and geopolitics and transnationality. ' +
      'A single course may satisfy more than one category, but a student must take at least one course in each category. ' +
      'See the FGSS website for the list of courses that fulfill each category.',
    source: 'https://fgss.cornell.edu/fgss-undergraduate-experience',
    fulfilledBy: 'self-check',
  },
];

export default fgssRequirements;

export const fgssAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Juno Salazar Parreñas', email: 'parrenas@cornell.edu' }],
};

import { CollegeOrMajorRequirement } from '@/requirements/types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';
import { AdvisorGroup } from '../../tools-types';

const asRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core',
    description: 'EAS 3050, EAS 3410, EAS 3420, EAS 3520, EAS 4470, and EAS 4510',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/bs-atmospheric-sciences/major-requirements',
    checker: includesWithSubRequirements(
      ['EAS 3050'],
      ['EAS 3410'],
      ['EAS 3420'],
      ['EAS 3520'],
      ['EAS 4470'],
      ['EAS 4510']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1],
    slotNames: ['EAS 3050', 'EAS 3410', 'EAS 3420', 'EAS 3520', 'EAS 4470', 'EAS 4510'],
  },
  {
    name: 'Electives',
    description: 'Choose at least 2 other atmospheric courses',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/bs-atmospheric-sciences/major-requirements',
    checker: includesWithSingleRequirement(
      'EAS 1310',
      'EAS 1330',
      'EAS 1340',
      'EAS 2500',
      'EAS 2680',
      'EAS 3340',
      'EAS 4350',
      'EAS 4570',
      'EAS 4700',
      'EAS 4800',
      'EAS 4860',
      'EAS 4960',
      'EAS 4980'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Mathematics',
    description: 'MATH 1110, MATH 1120, MATH 1920 or MATH 2130, and MATH 2930',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/bs-atmospheric-sciences/major-requirements',
    checker: includesWithSubRequirements(
      ['MATH 1110'],
      ['MATH 1120'],
      ['MATH 1920', 'MATH 2130'],
      ['MATH 2930']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: ['MATH 1110', 'MATH 1120', 'MATH 1920 or MATH 2130', 'MATH 2930'],
  },
  {
    name: 'Statistics',
    description: 'AEM 2100 or equivalent',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/bs-atmospheric-sciences/major-requirements',
    checker: includesWithSingleRequirement('AEM 2100'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['AEM 2100'],
  },
  {
    name: 'Computer Science',
    description: 'EAS 2900 or equivalent',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/bs-atmospheric-sciences/major-requirements',
    checker: includesWithSingleRequirement('EAS 2900'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['EAS 2900'],
  },
  {
    name: 'Basic Physical Sciences',
    description: 'PHYS 2207, PHYS 2208, and CHEM 1560',
    source:
      'https://www.eas.cornell.edu/eas/programs/undergraduate-programs/bs-atmospheric-sciences/major-requirements',
    checker: includesWithSubRequirements(['PHYS 2207'], ['PHYS 2208'], ['CHEM 1560']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['PHYS 2207', 'PHYS 2208', 'CHEM 1560'],
  },
];

export default asRequirements;

export const asAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Art DeGaetano', email: 'atd2@cornell.edu' }],
};

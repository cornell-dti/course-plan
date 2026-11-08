import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSingleRequirement } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const lspRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Course',
    description:
      'LSP 2100: Introduction to Latina-o-x Studies. All courses for the major must be completed with a grade of C- or better. ' +
      'Enrollment under the LSP number is not required; students may register under the cross-listed department or program.',
    source: 'https://catalog.cornell.edu/programs/latina-o-studies-ba/',
    checker: includesWithSingleRequirement('LSP 2100'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['LSP 2100'],
  },
  {
    name: 'Disciplinary Introductory Courses',
    description:
      'A minimum of two disciplinary introductory courses at the 1000/2000 level: LSP 1802, LSP 2031, LSP 2400, or LSP 2720.',
    source: 'https://catalog.cornell.edu/programs/latina-o-studies-ba/',
    checker: includesWithSingleRequirement('LSP 1802', 'LSP 2031', 'LSP 2400', 'LSP 2720'),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: '3000-Level Courses',
    description: 'Three courses at the 3000 level.',
    source: 'https://catalog.cornell.edu/programs/latina-o-studies-ba/',
    checker: includesWithSingleRequirement('LSP 3***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  {
    name: '4000-Level Seminars',
    description:
      'Two seminars at the 4000 level. An optional Latina/o Studies Senior Capstone project may be taken.',
    source: 'https://catalog.cornell.edu/programs/latina-o-studies-ba/',
    checker: includesWithSingleRequirement('LSP 4***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Seminar'],
  },
  {
    name: 'Additional Courses',
    description:
      'Four additional courses to round out your area of interest in the major. In consultation with the Director of Undergraduate Studies, ' +
      'up to two of these courses can be electives not cross-listed with LSP that relate to your area of interest ' +
      '(e.g. Literary and Performance Arts, Caribbean Studies, Migration and Transnational Studies, Labor, Law, and Policy).',
    source: 'https://catalog.cornell.edu/programs/latina-o-studies-ba/',
    checker: includesWithSingleRequirement('LSP ****'),
    checkerWarning:
      'We only check LSP courses. Up to two non-LSP electives may count with approval from the Director of Undergraduate Studies.',
    fulfilledBy: 'courses',
    perSlotMinCount: [4],
    slotNames: ['Course'],
  },
];

export default lspRequirements;

export const lspAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Sofía Villenas', email: 'sav33@cornell.edu' }],
};

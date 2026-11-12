import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const sociologyRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Required Courses',
    description:
      'SOC 1101 (Introduction to Sociology), SOC 3750 (Classical Sociological Theory) or SOC 3190 (Contemporary Sociological Theory), ' +
      'and SOC 3010 (Statistics for Sociological Research).',
    source: 'https://catalog.cornell.edu/programs/sociology-ba/',
    checker: includesWithSubRequirements(['SOC 1101'], ['SOC 3750', 'SOC 3190'], ['SOC 3010']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['SOC 1101', 'SOC 3750 or SOC 3190', 'SOC 3010'],
  },
  {
    name: 'Sociology Electives',
    description:
      'Seven additional (i.e., elective) courses in sociology. Ten courses, a minimum of 30 credits, are required for the major.',
    source: 'https://catalog.cornell.edu/programs/sociology-ba/',
    checker: includesWithSingleRequirement('SOC ****'),
    fulfilledBy: 'courses',
    perSlotMinCount: [7],
    slotNames: ['Course'],
  },
  {
    name: 'Upper-Level Electives',
    description: 'Three of the seven sociology electives must be at the 3000 level or higher.',
    source: 'https://catalog.cornell.edu/programs/sociology-ba/',
    checker: includesWithSingleRequirement('SOC 3***', 'SOC 4***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Grade Requirement',
    description:
      'All courses toward the major must be taken for a letter grade, and students must earn a C- or higher in each course. ' +
      'The ten major courses must total a minimum of 30 credits.',
    source: 'https://catalog.cornell.edu/programs/sociology-ba/',
    fulfilledBy: 'self-check',
  },
];

export default sociologyRequirements;

export const sociologyAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Cristobal Young', email: 'cristobal.young@cornell.edu' }],
};

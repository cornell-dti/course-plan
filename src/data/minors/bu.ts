import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSingleRequirement } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const buMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Statistics Prerequisite',
    description:
      'Choose one: AEM 1200, BTRY 3010, BTRY 3080, CEE 3040, ECON 3110, ECON 3120, ECON 3130, ENGRD 2700' +
      'ILRST 2100, ILRST 3080, ILRST 3110, MATH 1710, MATH 4710, MATH 4720, PAM 2100, PAM 2101, PSYCH 2500' +
      'STSCI 2100, STSCI 2150, STSCI 2200, STSCI 3080, STSCI 3110, SOC 3010',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/business/',
    checker: includesWithSingleRequirement(
      'AEM 1200',
      'BTRY 3010',
      'BTRY 3080',
      'CEE 3040',
      'ECON 3110',
      'ECON 3120',
      'ECON 3130',
      'ENGRD 2700',
      'ILRST 2100',
      'ILRST 3080',
      'ILRST 3110',
      'MATH 1710',
      'MATH 4710',
      'MATH 4720',
      'PAM 2100',
      'PAM 2101',
      'PSYCH 2500',
      'STSCI 2100',
      'STSCI 2150',
      'STSCI 2200',
      'STSCI 3080',
      'STSCI 3110',
      'SOC 3010',
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Microeconomics Prerequisite',
    description: 'Choose one: ECON 1110 or ECON 3030 or PAM 2000',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/business/',
    checker: includesWithSingleRequirement('ECON 1110', 'ECON 3030', 'PAM 2000'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Introduction to Management',
    description: 'Choose one: AEM 1200, HADM 1810, ILRID 1700, NCC 5540',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/business/',
    checker: includesWithSingleRequirement('AEM 1200', 'HADM 1810', 'ILRID 1700', 'NCC 5540'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Introduction to Marketing',
    description: 'Choose one: AEM 2400, NCC 5530, HADM 2410',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/business/',
    checker: includesWithSingleRequirement('AEM 2400', 'NCC 5530', 'HADM 2410'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Financial Accounting',
    description: 'Choose one: AEM 2210, HADM 2230, NCC 5500',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/business/',
    checker: includesWithSingleRequirement('AEM 2210', 'HADM 2230', 'NCC 5500'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Finance',
    description: 'Choose one: AEM 2241/5241, HADM 2250, NCC 5560',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/business/',
    checker: includesWithSingleRequirement('AEM 2241', 'AEM 5241', 'HADM 2250', 'NCC 5560'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
];

export default buMinorRequirements;

export const buMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Jenny VanAtta', email: 'jmv86@cornell.edu' }],
};

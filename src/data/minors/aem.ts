import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSubRequirements } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const appliedEconMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  // prerequisites
  {
    name: 'Introductory Economics',
    description: 'ECON 1110 and ECON 1120',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/applied-economics/',
    checker: includesWithSubRequirements(['ECON 1110'], ['ECON 1120']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['ECON 1110', 'ECON 1120'],
  },
  // core reqs
  {
    name: 'Economic Theory or Practice',
    description: 'Choose one of the following: AEM 2600, ECON 3030, or PAM 2000',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/applied-economics/',
    checker: includesWithSubRequirements(['AEM 2600', 'ECON 3030', 'PAM 2000']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Applied Economics',
    description:
      'Three of the following courses are required.' +
      ' Please note that 3 credits must be Johnson College of Business (JCB) courses, which include any course code of AEM, HADM, NBA, or NCC.',
    source: 'https://business.cornell.edu/programs/undergraduate/minors/applied-economics/',
    checker: includesWithSubRequirements([
      'AEM 4140',
      'AEM 4150',
      'AEM 4160',
      'AEM 4210',
      'AEM 4300',
      'AEM 4315',
      'AEM 4350',
      'AEM 4420',
      'AEM 4450',
      'AEM 4485',
      'AEM 4500',
      'AEM 4510',
      'AEM 4515',
      'AEM 4545',
      'AEM 4550',
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
];

export default appliedEconMinorRequirements;

export const appliedEconMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Dyson Office of Student Services', email: 'Dyson_OSS@cornell.edu' }],
};

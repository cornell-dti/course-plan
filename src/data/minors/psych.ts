import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSingleRequirement } from '../checkers-common';
import { AdvisorGroup } from '../../tools/types';

const psychMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: '18 Credits in Psychology',
    description:
      'A total of 18 credits in psychology. First-year seminars or AP courses cannot be counted towards the credit requirements. ' +
      'It is strongly recommended that students take at least one course from each of the following three areas of psychology: PCD, BEN, S&P.',
    source: 'https://psychology.cornell.edu/minor',
    checker: includesWithSingleRequirement(
      'PSYCH 1***',
      'PSYCH 2***',
      'PSYCH 3***',
      'PSYCH 4***',
      'PSYCH 5***',
      'PSYCH 6***'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [18],
    disallowTransferCredit: true,
  },
];

export default psychMinorRequirements;

export const psychMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Vivian Zayas', email: 'psych-dus@cornell.edu' }],
};

import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSubRequirements } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const appliedMathMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'MATH 2930 and MATH 2940',
    description: 'MATH 2930 and 2940',
    source: 'https://www.mae.cornell.edu/mae/programs/undergraduate-programs/minors',
    checker: includesWithSubRequirements(['MATH 2930'], ['MATH 2940']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['MATH 2930', 'MATH 2940'],
  },
  // FIX: don't currently have a way to show the groups
  {
    name: '6 courses',
    description:
      'At most one course may be chosen from each of groups 1 - 4. ' +
      'At least three courses must be chosen from groups 5 and 6. ' +
      'At most one 2000-level course may be chosen. ' +
      "At most one course may be chosen that is offered by the student's Major department.",
    source:
      'https://www.mae.cornell.edu/sites/default/files/departments/MAE/MAE%20pdfs/Applied%20Math%20Minor%20Application%20Form%201-25-19-VD.pdf',
    fulfilledBy: 'self-check',
  },
];

export default appliedMathMinorRequirements;

export const appliedMathMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'David Bindel', email: 'bindel@cornell.edu' }],
};

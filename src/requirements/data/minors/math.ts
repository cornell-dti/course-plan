import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSubRequirements } from '../checkers-common';

const mathMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'MATH 2930 and MATH 2940',
    description: 'MATH 2930 and 2940',
    source: 'https://www.mae.cornell.edu/mae/programs/undergraduate-programs/minors',
    checker: includesWithSubRequirements(['MATH 2930'], ['MATH 2940']),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  // FIX: don't currently have a way to show the groups
  {
    name: '4 courses',
    description:
      'At most one course may be chosen from each of groups 1 – 4 ' +
      'At least three courses must be chosen from groups 5 and 6' +
      'At most one 2000-level course may be chosen',
    source:
      'https://www.mae.cornell.edu/sites/default/files/departments/MAE/MAE%20pdfs/Applied%20Math%20Minor%20Application%20Form%201-25-19-VD.pdf',
    fulfilledBy: 'self-check',
  },
];

export default mathMinorRequirements;

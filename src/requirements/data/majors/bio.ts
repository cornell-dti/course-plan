import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSubRequirements } from '../checkers-common';

const bioRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Biology Cluster',
    description:
      'Take 2 of the following 3: BIOMG 1350, BIOG 1440 OR BIOG 1445, BIOEE 1610 OR BIOSM 1610',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=36&poid=17535',
    checker: includesWithSubRequirements(
      ['BIOMG 1350'],
      ['BIOG 1440', 'BIOG 1445'],
      ['BIOEE 1610', 'BIOSM 1610']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  {
    name: 'Investigative Laboratory',
    description: 'BIOG 1500 OR BIOSM 1500',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=36&poid=17535',
    checker: includesWithSubRequirements(['BIOG 1500', 'BIOSM 1500']),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Evolutionary Biology and Diversity',
    description: 'BIOEE 1780 OR BIOEE 1781 OR BIOSM 1780',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=36&poid=17535',
    checker: includesWithSubRequirements(['BIOEE 1780', 'BIOEE 1781', 'BIOSM 1780']),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'General Chemistry',
    description: 'Option 1: CHEM 2070 AND CHEM 2080, Option 2: CHEM 2150',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=36&poid=17535',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description: 'CHEM 2070 AND CHEM 2080',
        checker: includesWithSubRequirements(['CHEM 2070'], ['CHEM 2080']),
        counting: 'courses',
        operator: 'and',
        minCount: 2,
      },
      'Option 2': {
        description: 'CHEM 2150',
        checker: includesWithSubRequirements(['CHEM 2150']),
        counting: 'courses',
        operator: 'and',
        minCount: 1,
      },
    },
  },
  {
    name: 'College Mathematics',
    description:
      'Two courses. One semester of calculus (MATH 1106 OR MATH 1110) ' +
      'Another course selected from: (MATH 1120 OR MATH 1910) ' +
      'OR MATH 1105 OR one course in statistics (STSCI 2150 OR BTRY 3010 are preferred)',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=36&poid=17535',
    checker: includesWithSubRequirements(
      ['MATH 1106', 'MATH 1110'],
      [
        'MATH 1120',
        'MATH 1910',
        'MATH 1105',
        'STSCI 2150',
        'BTRY 3010',
        'MATH 1710',
        'AEM 2100',
        'PSYCH 2500',
        'ECON 3130',
        'SOC 3010',
      ]
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  // TODO: problem for reqs w options and diff minCount
  {
    name: 'Organic Chemistry',
    description: 'CHEM 1570 OR CHEM 3570 & 3580 OR CHEM 3590 & 3600 OR CHEM 3530',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=36&poid=17535',
    checker: includesWithSubRequirements(
      ['CHEM 1570'],
      ['CHEM 3570', 'CHEM 3580'],
      ['CHEM 3590', 'CHEM 3600'],
      ['CHEM 3530']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  {
    name: 'Physics',
    description: 'PHYS 1101 & 1102 OR PHYS 2207 & 2208 OR PHY 1112 & 2213',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=36&poid=17535',
    checker: includesWithSubRequirements(
      ['PHYS 1101', 'PHYS 1102'],
      ['PHYS 2207', 'PHYS 2208'],
      ['PHYS 1112', 'PHYS 2213']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  {
    name: 'Genetics and Genomics',
    description: 'Lecture must be taken either concurrently or before the laboratory',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=36&poid=17535',
    checker: includesWithSubRequirements(['BIOMG 2800'], ['BIOMG 2801']),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  // TODO: temp fix for reqs w options and diff minCount
  {
    name: 'Biochemistry and Molecular Biology Part 1',
    description: 'BIOMG 3300 OR BIOMG 3350 OR BIOMG 3310',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=36&poid=17535',
    checker: includesWithSubRequirements(['BIOMG 3300', 'BIOMG 3350', 'BIOMG 3310']),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Biochemistry and Molecular Biology Part 2',
    description: 'BIOMG 3300 OR BIOMG 3350 OR BIOMG 3320',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=36&poid=17535',
    checker: includesWithSubRequirements(['BIOMG 3300', 'BIOMG 3350', 'BIOMG 3320']),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Concentration',
    description:
      'Requires a minimum of 13 additional credits, which must include (1) one course from each of three different concentrations in biology ' +
      ' (2) a course with a laboratory, (3) a minimum of two 3000-level or above courses of 2+ credits each.',
    source: 'http://courses.cornell.edu/content.php?catoid=36&navoid=9186',
    fulfilledBy: 'self-check',
  },
];

export default bioRequirements;

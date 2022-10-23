import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';
import { AdvisorGroup } from '@/requirements/tools-types';

const bioEngineeringRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Engineering Distributions',
    description: 'ENGRD 2020 and ENGRD 2600 or ENGRD 2510',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19795#BiologicalEngineering',
    checker: includesWithSubRequirements(['ENGRD 2020'], ['ENGRD 2600', 'ENGRD 2510']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['ENGRD 2020', 'ENGRD 2600 or ENGRD 2510'],
  },
  {
    name: 'Organic Chemistry',
    description: 'CHEM 1570 or CHEM 3570 or CHEM 3530',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19795#BiologicalEngineering',
    checker: includesWithSubRequirements(['CHEM 1570', 'CHEM 3570', 'CHEM 3530']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Intro Bio',
    description:
      'Choose 2 of the following 4: BIOMG 1350, BIOG 1440, BIOG 1445, and BIOEE/BIOSM 1610',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19795#BiologicalEngineering',
    checker: includesWithSingleRequirement('BIOMG 1350', 'BIOG 1440', 'BIOG 1445', 'BIOEE 1610'),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Biochemistry',
    description: 'BIOMG 3300, BIOMG 3330, BIOMG 3350, or BIOMG 3310 and BIOMG 3320',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19795#BiologicalEngineering',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description: 'CHEM 2070 AND CHEM 2080',
        checker: includesWithSubRequirements(['CHEM 2070'], ['CHEM 2080']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['CHEM 2070', 'CHEM 2080'],
      },
      'Option 2': {
        description: 'CHEM 2150',
        checker: includesWithSubRequirements(['CHEM 2150']),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
    },
  },
  {
    name: 'Required Major Courses',
    description:
      'Major requirements for BE: BIOG/BIOSM 1500, BEE 3500, BEE 3310, BEE 3400, BEE 3600, and BEE 4500',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19795#BiologicalEngineering',
    checker: includesWithSubRequirements(
      ['BIOG 1500', 'BIOSM 1500'],
      ['BEE 3500'],
      ['BEE 3310'],
      ['BEE 3400'],
      ['BEE 3600'],
      ['BEE 4500']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1],
    slotNames: [
      'BIOG 1500 or BIOSM 1500',
      'BEE 3500',
      'BEE 3310',
      'BEE 3400',
      'BEE 3600',
      'BEE 4500',
    ],
  },
  {
    name: 'Engineering Statistics',
    description:
      'BEE 2220 or ENGRD 2210 or CHEME 3130 or MSE 3030 and engineering statistics preferably before semester 6. ' +
      'CEE 3040 is the preferred version of statistics.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19795#BiologicalEngineering',
    checker: includesWithSubRequirements(
      ['BEE 2220', 'ENGRD 2210', 'CHEME 3130', 'MSE 3030'],
      ['CEE 3040', 'ENGRD 2700']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['BEE 2220 or ENGRD 2210 or CHEME 3130 or MSE 3030', 'CEE 3040 or ENGRD 2700'],
  },
  {
    name: 'Focus Area',
    description:
      'Fifteen or more credits of courses chosen from one or more of the 7 focus areas: Molecular and Cellular Systems, Ecological and Microbial Systems, Nanobiotechnology, Computational Biological Engineering, Synthetic Biology, Biomaterials, or Sustainability.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19795#BiologicalEngineering',
    fulfilledBy: 'self-check',
  },
  {
    name: 'BE Focus Area Elective',
    description:
      'BE Focus Area Electives must include a BEE capstone design course. ' +
      'See beadvised.bee.cornell.edu for a current list of approved courses. ' +
      'In place of one focus area course, students may use up to 4 credits of research, project team, teaching, ' +
      'or independent study taken in an engineering department towards the engineering credits in category 8.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19795#BiologicalEngineering',
    checker: includesWithSingleRequirement(
      'BEE 4550',
      'BEE 4590',
      'BEE 4640',
      'BEE 7600',
      'CHEME 4010',
      'CHEME 4020',
      'BEE 3299',
      'BEE 3710',
      'BEE 4270',
      'BEE 4730',
      'BEE 4750',
      'BEE 4760',
      'BEE 4870',
      'BEE 4550',
      'BEE 4590',
      'BEE 7600',
      'CHEME 5940',
      'ECE 4070',
      'ECE 5320',
      'ECE 5350',
      'MAE 5240',
      'MSE 5630',
      'MSE 5890',
      'BEE 4530',
      'BEE 4600',
      'BME 3300',
      'BME 5400',
      'CHEME 5940',
      'CS 4220',
      'CS 4820',
      'ECE 3530',
      'ECE 3200',
      'MAE 3260',
      'ORIE 4350',
      'ORIE 4580',
      'SYSEN 5100',
      'BEE 4550',
      'CHEME 5430',
      'CHEME 5940',
      'ECE 3530',
      'BEE 4530',
      'BEE 4590',
      'BEE 4600',
      'BEE 4810',
      'BME 5200',
      'BME 5390',
      'BME 5710',
      'MSE 4610',
      'MSE 5130',
      'MSE 5620',
      'BEE 3299',
      'BEE 4010',
      'BEE 4350',
      'BEE 4740',
      'BEE 4760',
      'BEE 4810',
      'BEE 4870',
      'BEE 4880',
      'BEE 7540'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [4],
    slotNames: ['Course'],
  },
];

export default bioEngineeringRequirements;

export const bioEngineeringAdvisors: AdvisorGroup = {
  advisors: [],
};

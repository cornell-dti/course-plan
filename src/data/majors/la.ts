import { CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const SOURCE = 'https://catalog.cornell.edu/programs/landscape-architecture-bs/';

const laRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Studio Sequence',
    description:
      'LA 1410, LA 1420, LA 2010, LA 2020, LA 3010, LA 3020, LA 4010, and LA 4020 (38 credits), taken in sequential order. ' +
      'Students must receive a grade of C- or higher to advance to the next studio in sequence.',
    source: SOURCE,
    checker: includesWithSubRequirements(
      ['LA 1410'],
      ['LA 1420'],
      ['LA 2010'],
      ['LA 2020'],
      ['LA 3010'],
      ['LA 3020'],
      ['LA 4010'],
      ['LA 4020']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1],
    slotNames: [
      'LA 1410',
      'LA 1420',
      'LA 2010',
      'LA 2020',
      'LA 3010',
      'LA 3020',
      'LA 4010',
      'LA 4020',
    ],
  },
  {
    name: 'Technical Sequence',
    description:
      'LA 4910, LA 3160, LA 3180, and LA 4120 (17 credits). LA 4100 (Computer Applications in Landscape Architecture) is not required but is encouraged.',
    source: SOURCE,
    checker: includesWithSubRequirements(['LA 4910'], ['LA 3160'], ['LA 3180'], ['LA 4120']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: ['LA 4910', 'LA 3160', 'LA 3180', 'LA 4120'],
  },
  {
    name: 'History and Theory Studies',
    description:
      'Two history/theory courses totaling a minimum of 6 credits: LA 2910 plus another 3-credit history/theory course. ' +
      'Recommended courses: LA 3430, LA 4070, LA 4930, LA 4941. Courses not listed require faculty advisor approval.',
    source: SOURCE,
    checker: includesWithSubRequirements(['LA 2910'], ['LA 3430', 'LA 4070', 'LA 4930', 'LA 4941']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['LA 2910', 'History/Theory Course'],
  },
  {
    name: 'Directed Study Seminar',
    description:
      'LA 4030 (1 credit), taken during the spring semester of senior year after the area of interest has been defined and the three directed study courses have been completed.',
    source: SOURCE,
    checker: includesWithSingleRequirement('LA 4030'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['LA 4030'],
  },
  {
    name: 'Directed Study Courses',
    description:
      'Three courses totaling at least 9 credits in a focus area of interest within landscape architecture, defined by the student in consultation with their faculty advisor.',
    source: SOURCE,
    fulfilledBy: 'self-check',
  },
  {
    name: 'Letter Grade Requirement',
    description:
      'All major requirements must be taken for a letter grade. A grade of C- or better must be earned in every studio to advance to the next studio; ' +
      'a student who receives a D or lower in any studio must meet with the Director of Undergraduate Studies and their faculty advisor.',
    source: SOURCE,
    fulfilledBy: 'self-check',
  },
];

export default laRequirements;

export const laAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Martin Hogue', email: 'mh2448@cornell.edu' }],
};

import { CollegeOrMajorRequirement, Course } from '../../types';
import {
  includesWithSingleRequirement,
  ifCodeMatch,
  courseMeetsCreditMinimum,
} from '../checkers-common';
import { AdvisorGroup } from '../../tools-types';

const spanishMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Advanced Language Course',
    description: 'SPAN 2130 or SPAN 2180.',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#minor-requirements',
    checker: includesWithSingleRequirement('SPAN 2130', 'SPAN 2180'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Perspectives Course',
    description: 'SPAN 2200 or SPAN 2205 or SPAN 2230 or SPAN 2235 or SPAN 2240 or PORT 2800.',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#minor-requirements',
    checker: includesWithSingleRequirement(
      'SPAN 2200',
      'SPAN 2205',
      'SPAN 2230',
      'SPAN 2235',
      'SPAN 2240',
      'PORT 2800'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  // TODO: Email Spanish dept to check if any other courses count.
  {
    name: '3 Electives',
    description:
      '3 electives of at least 3 credits each focusing on the Hispanic world. SPAN 2090, SPAN 2070 and SPAN 2095 are excluded. Only courses beginning at SPAN 2130 count.',
    source: 'https://romancestudies.cornell.edu/spanish-undergraduate#minor-requirements',
    checker: [
      (course: Course): boolean =>
        (ifCodeMatch(course.subject, 'SPAN') || ifCodeMatch(course.subject, 'PORT')) &&
        !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '20**')) &&
        courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
];

export default spanishMinorRequirements;

export const spanishMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Callean Hile', email: 'clh2@cornell.edu' }],
};

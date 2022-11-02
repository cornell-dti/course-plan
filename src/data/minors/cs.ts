import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  courseMatchesCodeOptions,
  ifCodeMatch,
  courseMatchesCode,
} from '../checkers-common';
import { AdvisorGroup } from '../../tools/types';
import { lastNameRange } from '../../tools/advisor-checkers';

const csMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Requirement 1',
    description: 'CS/ENGRD 2110 or 2112 or ENGRD 2140 or ECE 2400',
    source: 'https://www.cs.cornell.edu/undergrad/csminor',
    checker: includesWithSingleRequirement(
      'CS 2110',
      'ENGRD 2110',
      'CS 2112',
      'ENGRD 2112',
      'ENGRD 2140',
      'ECE 2400'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Requirement 2',
    description: 'CS 3110 or CS 3410 or CS 3420/ECE 3140',
    source: 'https://www.cs.cornell.edu/undergrad/csminor',
    checker: includesWithSingleRequirement('CS 3110', 'CS 3410', 'CS 3420', 'ECE 3140'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  // TODO: Temp. excluding courses for Req 2
  {
    name: '4 CS courses numbered 3000 or higher',
    description: 'CS 4090, CS 4997, CS 4998, CS 4999 and seminars are excluded. CS 2800 is allowed',
    source: 'https://www.cs.cornell.edu/undergrad/csminor',
    checker: [
      (course: Course): boolean => {
        if (
          courseMatchesCodeOptions(course, [
            'CS 4090',
            'CS 4997',
            'CS 4998',
            'CS 4999',
            'CS 7***',
            'CS 3110',
            'CS 3410',
            'CS 3420',
          ])
        ) {
          return false;
        }
        return (
          courseMatchesCode(course, 'CS 2800') ||
          (ifCodeMatch(course.subject, 'CS') &&
            !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***')))
        );
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [4],
    slotNames: ['Course'],
  },
];

export default csMinorRequirements;

export const csMinorAdvisors: AdvisorGroup = {
  advisors: [
    { name: 'Ryan Marchenese ', email: 'ryan.m@cornell.edu', checker: lastNameRange('A', 'H') },
    { name: 'Carl Cornell', email: 'cec232@cornell.edu', checker: lastNameRange('I', 'Q') },
    { name: 'Nicole Roy', email: 'nicole.roy@cornell.edu', checker: lastNameRange('R', 'Z') },
  ],
};

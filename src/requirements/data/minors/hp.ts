import { CollegeOrMajorRequirement, Course } from '../../types';
import {
  includesWithSingleRequirement,
  courseMatchesCodeOptions,
  ifCodeMatch,
} from '../checkers-common';

const hpMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'PAM 2350',
    description: 'PAM 2350',
    source: 'https://www.human.cornell.edu/pam/studentlife/advising/minorhealthpolicy',
    checker: includesWithSingleRequirement('PAM 2350'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: '3000/4000+ Level',
    description:
      'Complete at least 9 credit at the 3000 or 4000 level in PAM from the following list.',
    source: 'https://www.human.cornell.edu/pam/studentlife/advising/minorhealthpolicy',
    checker: includesWithSingleRequirement(
      'PAM 3110',
      'PAM 3180',
      'PAM 3280',
      'PAM 3780',
      'PAM 3870',
      'PAM 4110',
      'PAM 4140',
      'PAM 4280',
      'PAM 4230',
      'PAM 5500',
      'PAM 5740',
      'PAM 5760',
      'PAM 5900'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [9],
  },
  {
    name: 'Additional Course',
    description:
      'The minor requires a minimum of 15 credits of PAM courses. Choose one additional PAM course at the 2000, 3000, or 4000 level.',
    source: 'https://www.human.cornell.edu/pam/studentlife/advising/minorhealthpolicy',
    checker: [
      (course: Course): boolean => {
        if (courseMatchesCodeOptions(course, ['PAM 4000', 'PAM 4010', 'PAM 4020', 'PAM 4030'])) {
          return false;
        }
        return ifCodeMatch(course.subject, 'PAM') && !ifCodeMatch(course.catalogNbr, '1***');
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
];

export default hpMinorRequirements;

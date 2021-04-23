import { Course, CollegeOrMajorRequirement } from '../../types';
import { includesWithSubRequirements, ifCodeMatch } from '../checkers-common';

const epRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Required Courses',
    description: 'The major requirements are as follows.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19775',
    checker: includesWithSubRequirements(
      ['AEP 3200'],
      ['AEP 3330'],
      ['AEP 3550'],
      ['AEP 3560'],
      ['AEP 3610'],
      ['AEP 3620'],
      ['AEP 3630'],
      ['AEP 4200'],
      ['AEP 4230'],
      ['AEP 4340'],
      ['PHYS 4410']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    slotNames: [
      'AEP 3200',
      'AEP 3330',
      'AEP 3550',
      'AEP 3560',
      'AEP 3610',
      'AEP 3620',
      'AEP 3630',
      'AEP 4200',
      'AEP 4230',
      'AEP 4340',
      'PHYS 4410',
    ],
  },
  {
    name: 'Major-approved Elective(s)',
    description:
      'Six major-approved electives (18-24 credits). All must be technical courses taken for a letter grade. ' +
      'Five of the six courses must be upper-level courses (3000 level or above).  ' +
      'Nine credits of major-approved electives must be outside of AEP.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19775',
    // Currently, the user must override in order to apply a non-upper-level course
    // TODO implement as compound requirement:
    // at least 18 credits
    // at least 5 courses 3000+ level
    // at least 9 credits outside of aep
    checker: [
      (course: Course): boolean => {
        const { catalogNbr } = course;
        return !(ifCodeMatch(catalogNbr, '1***') || ifCodeMatch(catalogNbr, '2***'));
      },
    ],
    checkerWarning: 'We do not check that the courses are major-approved or considered technical.',
    fulfilledBy: 'courses',
    perSlotMinCount: [6],
    slotNames: ['Course'],
  },
];

export default epRequirements;

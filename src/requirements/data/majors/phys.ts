import { Course, CollegeOrMajorRequirement } from '../../types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
  ifCodeMatch,
} from '../checkers-common';

const physRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Physics Core',
    description: 'A three-semester introductory physics sequence.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19990',
    // Not checked: Students who do not take PHYS 1116 must also complete PHYS 2216.
    checker: includesWithSubRequirements(
      ['PHYS 1112', 'PHYS 1116', 'PHYS 2207'],
      // New requirement not checked: PHYS 1110 Intro. to Experimental Physics
      ['PHYS 2213', 'PHYS 2217'],
      ['PHYS 2214', 'PHYS 2218']
      // New requirement not checked: PHYS 2216 or PHYS 2210
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['Physics I', 'Physics II', 'Physics III'],
  },
  {
    name: 'Mathematics',
    description:
      'Mathematics courses covering single and multivariable calculus, linear algebra, series representations, and complex analysis.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19990',
    checker: includesWithSubRequirements(
      ['MATH 1120', 'MATH 1910', 'MATH 1220'],
      ['MATH 1920', 'MATH 2220', 'MATH 2240'],
      ['MATH 3230', 'MATH 2930'],
      ['MATH 2210', 'MATH 2230', 'MATH 2940']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: [
      'Single-Variable Calculus',
      'Multivariable Calculus',
      'Differential Equations',
      'Linear Algebra',
    ],
  },
  {
    name: 'Modern Physics',
    description: 'The two-course sequence in modern physics: PHYS 3316 and PHYS 3317.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19990',
    checker: includesWithSubRequirements(['PHYS 3316'], ['PHYS 3317']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['PHYS 3316', 'PHYS 3317'],
  },
  {
    name: 'Physics Lab',
    description: 'At least three credits of laboratory work.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19990',
    checker: includesWithSingleRequirement(
      'PHYS 3310',
      'PHYS 3330',
      'PHYS 3360',
      'PHYS 4410',
      'AEP 2640',
      'ASTRO 4410',
      'BEE 4500'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Physics Intermediate Courses',
    description:
      'An intermediate course in analytical mechanics and advanced electricity & magnetism.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19990',
    checker: includesWithSubRequirements(['PHYS 3318'], ['PHYS 3327']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['PHYS 3318', 'PHYS 3327'],
  },
  {
    name: 'Concentration',
    description: 'The Physics Department offers two approaches to the major.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19990',
    fulfilledBy: 'toggleable',
    checkerWarning: 'We do not check that courses are approved by the major faculty advisor.',
    fulfillmentOptions: {
      'Concentration "inside" Physics': {
        description:
          'The concentration within physics ("inside concentration") is the principal path to ' +
          'professional or graduate work in physics and closely related fields, and is also the best choice ' +
          'for students who wish to obtain maximum benefit from rigorous studies in physics. The inside ' +
          'concentration consists of the core physics courses plus electives taken within the Physics Department.',
        counting: 'credits',
        // "Other courses approved by the director of undergraduate studies"
        // do not pass this checker, and must be manually overwritten by the user.
        // "If this activity is done as an independent project, PHYS 4490, up to 4 credits can be applied toward the concentration"
        // must also be manually overwritten by the user.
        // TODO implement as compound requirement:
        // at least two MATH classes at 3000+ level
        // must include PHYS 4230, PHYS 4410, and another lab course listed for the core (allow double-counting)
        checker: [
          (course: Course): boolean =>
            ifCodeMatch(course.subject, 'PHYS') &&
            !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***')),
        ],
        perSlotMinCount: [15],
      },
      'Concentration "outside" Physics': {
        description:
          'The concentration outside physics ("outside concentration") provides more flexibility ' +
          'for those want to develop skills in physics but whose career interests lie elsewhere.',
        counting: 'credits',
        // This is essentially self-check with a weak checker.
        // TODO implement as compound requirement:
        // at least 8 credits at 3000+ level
        checker: [(course: Course): boolean => !ifCodeMatch(course.subject, 'PHYS')],
        perSlotMinCount: [15],
      },
    },
  },
];

export default physRequirements;

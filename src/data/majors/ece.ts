import { Course, CollegeOrMajorRequirement, RequirementMigration } from '../../requirements/types';
import {
  ifCodeMatch,
  includesWithSubRequirements,
  courseMatchesCodeOptions,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const eceRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'ENGRD 2300',
    description: 'ENGRD 2300',
    source:
      'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/majors/program-requirements',
    checker: includesWithSubRequirements(['ENGRD 2300']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Engineering Distribution',
    description: 'Any ENGRD course excluding ENGRD/ECE 2100, ENGRD/ECE 2200, and ENGRD/ECE 2300.',
    source:
      'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/majors/program-requirements',
    checker: [
      (course: Course): boolean =>
        course.subject === 'ENGRD' &&
        !courseMatchesCodeOptions(course, ['ENGRD 2300', 'ENGRD 2100', 'ENGRD 2200']),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Core Courses',
    description: 'ECE 2100, ECE 2720',
    source:
      'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/majors/program-requirements',
    checker: includesWithSubRequirements(['ECE 2100'], ['ECE 2720']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['ECE 2100', 'ECE 2720'],
  },
  {
    name: 'Foundation Courses',
    description: 'ECE 3030 or ECE 3150, ECE 3100 or ECE 3250, and ECE 3140',
    source:
      'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/majors/program-requirements',
    checker: includesWithSubRequirements(
      ['ECE 3030', 'ECE 3150'],
      ['ECE 3100', 'ECE 3250'],
      ['ECE 3140']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['ECE 3030 or ECE 3150', 'ECE 3100 or ECE 3250', 'ECE 3140'],
  },
  {
    name: 'Advanced Programming/Computer Engineering',
    description:
      'At least three credits of computer programming at a level above that of CS 1110/1112/1114/1115 and CS 1130/1132/1133/1142, or an advanced computer engineering course at a level above ECE 3140. ' +
      'Current courses that meet this requirement are CS 2110, ENGRD 3200, AEP 4380, ECE 2400, ECE 4740, ECE 4750, or ECE 4760. Other courses may be allowed by an ECE petition.',
    source:
      'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/majors/program-requirements',
    checker: includesWithSubRequirements([
      'CS 2110',
      'ENGRD 3200',
      'AEP 4380',
      'ECE 2400',
      'ECE 4740',
      'ECE 4750',
      'ECE 4760',
    ]),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Probability and Statistics',
    description:
      'One course with significant probability content. ECE 2720, ECE 3100, ENGRD/ORIE 2700, CEE 3040, and MSE 5730 are appropriate such courses' +
      ' Other courses satisfying the probability and statistics requirement may be allowed by an ECE petition.',
    source:
      'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/majors/program-requirements',
    allowCourseDoubleCounting: true,
    checker: includesWithSubRequirements([
      'ECE 2720',
      'ECE 3100',
      'ENGRD 2700',
      'CEE 3040',
      'MSE 5730',
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Upper-Level ECE Electives',
    description: 'These courses must be technical ECE courses ',
    source:
      'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/majors/program-requirements',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'ECE') &&
        !(ifCodeMatch(course.catalogNbr, '1***') || ifCodeMatch(course.catalogNbr, '2***')),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Upper-Level ECE Electives: 4000 level',
    description:
      'These courses must be technical ECE courses ' +
      'Three (3) courses at the 4000-level or above. ',
    source:
      'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/majors/program-requirements',
    checker: [
      (course: Course): boolean => {
        if (courseMatchesCodeOptions(course, ['CS 4120', 'CS 4410'])) {
          return true;
        }
        return (
          ifCodeMatch(course.subject, 'ECE') &&
          !(
            ifCodeMatch(course.catalogNbr, '1***') ||
            ifCodeMatch(course.catalogNbr, '2***') ||
            ifCodeMatch(course.catalogNbr, '3***')
          )
        );
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  {
    name: 'Culminating Design Experience (CDE)',
    description: 'ECE 4250, ECE 4370, ECE 4530, ECE 4670, ECE 4740, ECE 4750, or ECE 4760',
    source:
      'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/majors/program-requirements',
    checker: includesWithSubRequirements([
      'ECE 4250',
      'ECE 4370',
      'ECE 4530',
      'ECE 4670',
      'ECE 4740',
      'ECE 4750',
      'ECE 4760',
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Outside ECE Technical Electives',
    description:
      '9 credits minimum, among which at least 3 credits must come from lecture course work at 3000-level or above. ' +
      'Almost any non-ECE math, science or engineering course at the 2000-level or above will do.',
    source:
      'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/majors/program-requirements',
    checker: [
      (course: Course): boolean => {
        const { catalogNbr } = course;
        return !ifCodeMatch(catalogNbr, '1***');
      },
    ],
    checkerWarning: 'We do not check that the courses are considered technical.',
    fulfilledBy: 'credits',
    perSlotMinCount: [9],
  },
];

export default eceRequirements;

export const eceAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Sharif Ewais-Orozco', email: 'ugrad-coordinator@ece.cornell.edu' }],
};

export const eceMigrations: RequirementMigration[] = [
  {
    entryYear: 2020, // For students with an entry year of 2020 or earlier, this requirement applies. For students with an entry year of 2021 or later, the above Core Courses requirement applies
    type: 'Modify',
    fieldName: 'Core Courses',
    newValue: {
      name: 'Core Courses',
      description: 'ECE 2100, ECE 2200, & ECE 3400',
      source:
        'https://www.ece.cornell.edu/ece/programs/undergraduate-programs/majors/program-requirements',
      checker: includesWithSubRequirements(['ECE 2100'], ['ECE 2200'], ['ECE 3400']),
      fulfilledBy: 'courses',
      perSlotMinCount: [1, 1, 1],
      slotNames: ['ECE 2100', 'ECE 2200', 'ECE 3400'],
    },
  },
];

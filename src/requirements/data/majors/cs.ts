import { Course, CollegeOrMajorRequirement } from '../../types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
  courseMatchesCodeOptions,
  ifCodeMatch,
} from '../checkers-common';

const csRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Programming',
    description: 'CS 111x (CS 1110, 1112, 1114, or 1115) and CS 2110 (or CS 2112) or equivalent.',
    source: 'https://www.cs.cornell.edu/undergrad/csmajor',
    // Allow double counting, because it overlaps with engineering's requirements.
    allowCourseDoubleCounting: true,
    checker: includesWithSubRequirements(
      ['CS 1110', 'CS 1112', 'CS 1114', 'CS 1115'],
      ['CS 2110', 'CS 2112']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['CS 111x', 'CS 2110 or CS 2112'],
  },
  {
    name: 'Computer Science Core',
    description: 'CS 2800 or CS 2802, CS 3110, CS 3410 or CS 3420, CS 4410, and CS 4820',
    source: 'https://www.cs.cornell.edu/undergrad/csmajor',
    checker: includesWithSubRequirements(
      ['CS 2800', 'CS 2802'],
      ['CS 3110'],
      ['CS 3410', 'CS 3420'],
      ['CS 4820'],
      ['CS 4410', 'CS 4414']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
    slotNames: [
      'CS 2800 or CS 2802',
      'CS 3110',
      'CS 3410 or CS 3420',
      'CS 4820',
      'CS 4410 or CS 4414',
    ],
  },
  {
    name: 'CS Electives',
    description:
      'Three 4000+ CS electives each at 3 credits. CS 4090, CS 4998, and CS 4999 are NOT allowed.',
    source:
      'http://www.cs.cornell.edu/undergrad/rulesandproceduresengineering/choosingyourelectives',
    checker: [
      (course: Course): boolean => {
        if (
          courseMatchesCodeOptions(course, ['CS 4090', 'CS 4998', 'CS 4999', 'CS 4410', 'CS 4820'])
        ) {
          return false;
        }
        return (
          ifCodeMatch(course.subject, 'CS') &&
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
    name: 'CS Practicum or Project',
    description:
      'CS practicums (CS 4xx1) or CS 3152, CS 4152, CS 4154, CS 4740, CS 4752, CS 5150, CS 5152, CS 5412, CS 5414, CS 5431, CS 5625, or CS 5643.',
    source:
      'http://www.cs.cornell.edu/undergrad/rulesandproceduresengineering/choosingyourelectives',
    checker: includesWithSingleRequirement(
      'CS 4**1',
      'CS 3152',
      'CS 4152',
      'CS 4154',
      'CS 4740',
      'CS 4752',
      'CS 5150',
      'CS 5152',
      'CS 5412',
      'CS 5414',
      'CS 5431',
      'CS 5625',
      'CS 5643'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Technical Electives',
    description: 'Three 3000-level or above (3+ credits each) courses with technical content',
    source: 'https://www.cs.cornell.edu/undergrad/csmajor/technicalelectives',
    checker: [
      (course: Course): boolean => {
        const { catalogNbr } = course;
        return !(ifCodeMatch(catalogNbr, '1***') || ifCodeMatch(catalogNbr, '2***'));
      },
    ],
    checkerWarning: 'We do not check that the courses are considered technical.',
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  {
    name: 'External Specialization',
    description:
      'Three 3000+ related courses outside of computer science (3 credit min per course). ' +
      'Frequently, the three courses are from the same department.',
    source:
      'https://www.cs.cornell.edu/undergrad/rulesandproceduresengineering/choosingyourelectives',
    checker: [
      (course: Course): boolean => {
        const { catalogNbr } = course;
        return (
          !(ifCodeMatch(catalogNbr, '1***') || ifCodeMatch(catalogNbr, '2***')) &&
          !ifCodeMatch(course.subject, 'CS')
        );
      },
    ],
    checkerWarning: 'We do not check that the courses are related.',
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  // TODO: Doesn't check for ROTC (PE) above 3000
  {
    name: 'Major-approved Elective(s)',
    description:
      'At least 3 credit hours total. All academic courses count. ' +
      'No PE courses, courses numbered 10xx, and ROTC courses below the 3000-level allowed.',
    source:
      'https://www.cs.cornell.edu/undergrad/rulesandproceduresengineering/choosingyourelectives',
    checker: [
      (course: Course): boolean => {
        const { subject, catalogNbr } = course;
        return !(ifCodeMatch(subject, 'PE') || ifCodeMatch(catalogNbr, '10**'));
      },
    ],
    checkerWarning: 'We do not check that the courses are major approved.',
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Probability',
    description: 'Must take BTRY 3080, CS 4850, ECE 3100, ECON 3130, ENGRD 2700, or MATH 4710.',
    source: 'https://www.cs.cornell.edu/undergrad/csmajor',
    allowCourseDoubleCounting: true,
    checker: includesWithSubRequirements([
      'BTRY 3080',
      'CS 4850',
      'ECE 3100',
      'ECON 3130',
      'ENGRD 2700',
      'MATH 4710',
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
];

export default csRequirements;

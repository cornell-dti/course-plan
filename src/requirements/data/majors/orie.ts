import { CollegeOrMajorRequirement, Course } from '../../types';
import { ifCodeMatch, includesWithSubRequirements } from '../checkers-common';
import { AdvisorGroup } from '@/requirements/tools-types';

const orieRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Engineering Distribution Courses',
    description:
      'ENGRD 2700 and ENGRD 2110 is recommended as the second Engineering Distribution course. ',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/degree-requirements',
    checker: includesWithSubRequirements(['ENGRD 2700']),
    fulfilledBy: 'courses',
    allowCourseDoubleCounting: true,
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Major Required Classes',
    description:
      'The following are required courses: ORIE 3120, 3150 (with possible replacements), 3300, 3310, 3500, 3510, 4580',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/degree-requirements',
    checker: includesWithSubRequirements(
      ['ORIE 3120'],
      ['ORIE 3150', 'MATH 3110', 'MATH 4130', 'MATH 4310', 'MATH 4330', 'ORIE 6***'],
      ['ORIE 3300'],
      ['ORIE 3310'],
      ['ORIE 3500'],
      ['ORIE 3510'],
      ['ORIE 4580']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1],
    slotNames: [
      'ORIE 3120',
      'ORIE 3150 (or replacements)',
      'ORIE 3300',
      'ORIE 3310',
      'ORIE 3500',
      'ORIE 3510',
      'ORIE 4580',
    ],
  },
  {
    name: 'ORIE Electives',
    description: 'At least 9 credits of ORIE electives at the 4000 level or above',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/degree-requirements',
    checker: [
      (course: Course): boolean => {
        const { catalogNbr, subject } = course;
        return (
          subject === 'ORIE' &&
          !(
            ifCodeMatch(catalogNbr, '1***') ||
            ifCodeMatch(catalogNbr, '2***') ||
            ifCodeMatch(catalogNbr, '3***')
          )
        );
      },
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [9],
  },
  // TODO: create special func for broad checker
  {
    name: 'Major Approved Electives (Non–ORIE)',
    description:
      'Minimum 12 credits of Major-Approved Electives, with at least 6 credits from outside of ORIE. ' +
      'Technical courses in Engineering at the 2000 level or above.',
    source: 'https://www.orie.cornell.edu/orie/programs/undergraduate-programs/degree-requirements',
    checker: [
      (course: Course): boolean => {
        const { catalogNbr } = course;
        return !ifCodeMatch(catalogNbr, '1***');
      },
    ],
    checkerWarning: 'We do not check that the courses are considered technical.',
    fulfilledBy: 'credits',
    perSlotMinCount: [12],
  },
];

export default orieRequirements;

export const orieAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Heidi Russell', email: 'hjr27@cornell.edu' }],
};

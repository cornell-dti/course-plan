import { Course, CollegeOrMajorRequirement } from '../../types';
import { courseIsFWS } from '../checkers-common';
import { AdvisorGroup } from '@/requirements/tools-types';

const humanEcologyRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Human Ecology Credits',
    description:
      'Students must complete a minimum of 43 Human Ecology credits from College Distribution, Major Requirements and electives.',
    source: 'https://www.human.cornell.edu/academics/policies/requirements',
    checker: [
      (course: Course): boolean =>
        course.acadGroup.includes('HE') ||
        (course.subject === 'ECON' && course.catalogNbr === '1110'),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [43],
    allowCourseDoubleCounting: true,
  },
  {
    name: '9 Credits In HE Outside Major',
    description:
      'Students must earn 9 credits in Human Ecology departments outside their major department with rules.',
    source: 'https://www.human.cornell.edu/academics/policies/requirements',
    checkerWarning: 'We do not check that the credits are outside your major',
    checker: [(course: Course): boolean => course.acadGroup.includes('HE')],
    fulfilledBy: 'credits',
    perSlotMinCount: [9],
  },
  {
    name: 'First-Year Writing Seminars',
    description: 'All students are required to take two first-year writing seminars.',
    source: 'https://courses.cornell.edu/content.php?catoid=41&navoid=11600',
    checker: [courseIsFWS],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
];

export default humanEcologyRequirements;

export const humanEcologyAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Darryl Scott', email: 'ds42@cornell.edu' }],
};

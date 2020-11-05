import { Course, CollegeOrMajorRequirement } from '../../types';
import { courseIsAllEligible } from '../checkers-common';

const humanEcologyRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Total Academic Credits',
    description:
      '120 academic credits are required' +
      'PE courses and courses numbered 1000-1099 do not count towards the 120 credits',
    source:
      'http://courses.cornell.edu/content.php?catoid=41&navoid=11600#Cornell_Credit_Requirements',
    checker: courseIsAllEligible,
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 120,
  },
  {
    name: 'Human Ecology Credits',
    description:
      'Students must complete a minimum of 43 Human Ecology credits from College Distribution, Major Requirements and electives.',
    source: 'https://www.human.cornell.edu/academics/policies/requirements',
    checker: (course: Course): boolean => course.acadGroup.includes('HE'),
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 43,
  },
  {
    name: 'Technical Communication',
    description:
      'In addition to the first-year writing seminars, ' +
      'a technical writing course must be taken as an engineering distribution, liberal studies, Advisor-approved electives, or Major course.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    fulfilledBy: 'self-check',
  },
  {
    name: '9 Credits In HE Outside Major',
    description:
      'Students must earn 9 credits in Human Ecology departments outside their major department with rules:',
    source: 'https://www.human.cornell.edu/academics/policies/requirements',
    fulfilledBy: 'self-check',
    minCount: 9,
  },
];

export default humanEcologyRequirements;

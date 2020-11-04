import { Course, CollegeOrMajorRequirement } from '../../types';

const humanEcologyRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Human Ecology Credits',
    description: 'Students must complete a minimum of 43 Human Ecology credits from College Distribution, Major Requirements and electives.',
    source: 'https://www.human.cornell.edu/academics/policies/requirements',
    checker: (course: Course): boolean => course.acadGroup.includes('HE'),
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 43,
    progressBar: true
  },
  {
    name: 'Technical Communication',
    description: 'In addition to the first-year writing seminars, '
      + 'a technical writing course must be taken as an engineering distribution, liberal studies, Advisor-approved electives, or Major course.',
    source: 'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    fulfilledBy: 'self-check'
  },
  {
    name: '9 Credits In HE Outside Major',
    description: 'Students must earn 9 credits in Human Ecology departments outside their major department with rules:',
    source: 'https://www.human.cornell.edu/academics/policies/requirements',
    fulfilledBy: 'self-check',
    minCount: 9
  }
];

export default humanEcologyRequirements;

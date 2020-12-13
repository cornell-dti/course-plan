import { Course, CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement } from '../checkers-common';

const universityRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Physical Education',
    description:
      'All incoming freshmen are required to take two credits (two courses) of Physical Education, ' +
      'one credit each semester of the first year on campus.',
    source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11637',
    allowCourseDoubleCounting: true,
    checker: (course: Course): boolean => 'PE'.includes(course.subject),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  {
    name: 'Swim Test',
    description:
      'The Faculty Advisory Committee on Athletics and Physical Education has established a basic swimming ' +
      'and water safety competency requirement for all entering first-year undergraduate students.',
    source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11637',
    checker: includesWithSingleRequirement('PE 1100'),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
  },
];

export default universityRequirements;

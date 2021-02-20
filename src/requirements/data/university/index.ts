import { Course, CollegeOrMajorRequirement } from '../../types';

const universityRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Physical Education',
    description:
      'All incoming freshmen are required to take two credits (two courses) of Physical Education, ' +
      'one credit each semester of the first year on campus.',
    source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11637',
    allowCourseDoubleCounting: true,
    checker: (course: Course): boolean => 'PE'.includes(course.subject),
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'courses',
    minCount: 2,
  },
];

export default universityRequirements;

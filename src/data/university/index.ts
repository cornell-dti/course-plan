import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import { SWIM_TEST_COURSE_ID, SWIM_TEST_REAL_COURSE_ID } from '../constants';

const universityRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Swim Test',
    description:
      'The Faculty Advisory Committee on Athletics and Physical Education has established a basic swimming ' +
      'and water safety competency requirement for all entering first-year undergraduate students.',
    source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11637#swim_test',
    checker: [
      (course: Course): boolean =>
        [SWIM_TEST_COURSE_ID, SWIM_TEST_REAL_COURSE_ID].includes(course.crseId),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Physical Education',
    description:
      'All incoming freshmen are required to take two credits (two courses) of Physical Education, ' +
      'one credit each semester of the first year on campus.',
    source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11637#physical',
    allowCourseDoubleCounting: true,
    checker: [(course: Course): boolean => 'PE'.includes(course.subject)],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
];

export default universityRequirements;

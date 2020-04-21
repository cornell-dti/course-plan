import { Course, CollegeOrMajorRequirement } from '../../types';

const historyRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'History Major Classes',
    description: '9 history courses (with a grade of “C” or better). '
      + '4 of the nine courses must be taken from one each of the following five categories: '
      + 'Asian, North America, European, Global South (Africa/Caribbean/Latin American and Middle East), and Transregional (Transregional, Comparative, and Methodological). '
      + 'Note: a single course may fulfill more than one requirement as long as the total number of history courses is nine. '
      + 'For example, a course in medieval European history that is also a seminar would count for that requirement, '
      + 'as well as both a course in history before 1800 and as a course in European History.',
    source: 'https://history.cornell.edu/undergraduate',
    checker: null,
    fulfilledBy: 'self-check',
    minCount: 9
  },
  {
    name: 'Pre 1800 Classes',
    description: '3 of the nine courses must be in history before 1800 '
      + '(Courses that fulfill the Arts & Sciences historical breadth requirement do not necessarily fulfill the History pre-1800 requirement.)',
    source: 'https://history.cornell.edu/undergraduate',
    checker: (course: Course): boolean => (
      // REQ_TODO: investigate whether course data has this field (catalogCourseSubfield)
      // @ts-ignore
      course.catalogCourseSubfield && course.catalogCourseSubfield.includes('HPE')
    ),
    fulfilledBy: 'courses',
    minCount: 3
  },
  {
    name: 'Seminars',
    description: '2 of the nine courses must be seminars, and one of these seminars must be a 4000-level seminar.  '
      + 'Service-learning 4000-level courses, HIST 4001, HIST 4002, may not be used to fulfill the 4000-level seminar requirement.',
    source: 'https://history.cornell.edu/undergraduate',
    checker: null,
    fulfilledBy: 'self-check',
    minCount: 2
  }
];

export default historyRequirements;

import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import { ifCodeMatch, courseMatchesCodeOptions } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const astronomyMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: '2000+ Level ASTRO Credits',
    description:
      'Complete 15 credits of ASTRO courses at or above the 3000 level, or from ASTRO 2211, 2212, 2290, or 2299. At least 6 of the 15 credits must have a letter grade (not S/U).',
    source: 'https://astro.cornell.edu/undergraduate',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'ASTRO') &&
        (courseMatchesCodeOptions(course, [
          'ASTRO 2211',
          'ASTRO 2212',
          'ASTRO 2290',
          'ASTRO 2299',
        ]) ||
          (!ifCodeMatch(course.catalogNbr, '1***') && !ifCodeMatch(course.catalogNbr, '2***'))),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [15],
  },
  {
    name: '3000+ Level ASTRO Credits',
    description: 'At least 6 of the 15 credits must be at or above the 3000 level.',
    source: 'https://astro.cornell.edu/undergraduate',
    checker: [
      (course: Course): boolean =>
        ifCodeMatch(course.subject, 'ASTRO') &&
        (ifCodeMatch(course.catalogNbr, '3***') || ifCodeMatch(course.catalogNbr, '4***')),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
    allowCourseDoubleCounting: true,
  },
];

export default astronomyMinorRequirements;

export const astronomyMinorAdvisors: AdvisorGroup = {
  advisors: [
    { name: 'Astronomy Director of Undergraduate Studies', email: 'astrodus@cornell.edu' },
  ],
};

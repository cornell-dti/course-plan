import { Course, CollegeOrMajorRequirement } from '../../types';
import { courseMatchesCodeOptions, ifCodeMatch } from '../checkers-common';
import { AdvisorGroup } from '@/requirements/tools-types';

const englishRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    // TODO: Non english courses can also count but we need more info to update
    name: 'Total Credits',
    description:
      'To graduate with a major in English, a student must complete with a grade of C or better 40 credit hours approved for the English major. ' +
      'All 2000-level ENGL courses (with the exception of 2800-2810 and 2880-2890) count for the major, as do all 3000-and 4000-level courses.',
    source:
      'https://english.cornell.edu/majoring-and-minoring-english-cornell#requirements-for-the-major',
    checker: [
      (course: Course): boolean => {
        if (
          courseMatchesCodeOptions(course, ['ENGL 2800', 'ENGL 2810', 'ENGL 2880', 'ENGL 2890'])
        ) {
          return false;
        }
        return courseMatchesCodeOptions(course, [
          'ENGL 2***',
          'ENGL 3***',
          'ENGL 4***',
          'ENGL 5***',
          'ENGL 6***',
        ]);
      },
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [40],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Pre-1800',
    description:
      '12 credits (normally 3 courses) must be from courses in which 50% or more of the material consists of literature originally written in English ' +
      'before 1800 (such courses are indicated in the English course listings)',
    source:
      'https://english.cornell.edu/majoring-and-minoring-english-cornell#requirements-for-the-major',
    checker: [
      (course: Course): boolean =>
        (course.catalogComments?.includes('pre-1800') ?? false) ||
        (course.catalogSatisfiesReq?.includes('pre-1800') ?? false),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [12],
    allowCourseDoubleCounting: true,
  },
  {
    name: '4000 or Above',
    description: '8 credits must be at the 4000 level or above',
    source: 'https://english.cornell.edu/english-major-guide#requirements-for-the-major',
    checker: [
      (course: Course): boolean => {
        const { catalogNbr, subject } = course;
        return (
          ifCodeMatch(subject, 'ENGL') &&
          !(
            ifCodeMatch(catalogNbr, '1***') ||
            ifCodeMatch(catalogNbr, '2***') ||
            ifCodeMatch(catalogNbr, '3***')
          )
        );
      },
    ],
    allowCourseDoubleCounting: true,
    fulfilledBy: 'credits',
    perSlotMinCount: [8],
  },
  {
    // TODO: Checker should be more specific
    name: 'Concentration',
    description:
      '12 credits (3 courses) must form an intellectually coherent concentration (see below).',
    source: 'https://english.cornell.edu/english-major-guide#requirements-for-the-major',
    fulfilledBy: 'credits',
    perSlotMinCount: [12],
    checkerWarning: 'We do not check courses meet the concentration guideline',
    checker: [
      (course: Course): boolean => {
        const { subject, catalogNbr } = course;
        return !(ifCodeMatch(subject, 'PE') || ifCodeMatch(catalogNbr, '10**'));
      },
    ],
  },
];

export default englishRequirements;

export const englishAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Aurora Ricardo', email: 'ar2368@cornell.edu' }],
};

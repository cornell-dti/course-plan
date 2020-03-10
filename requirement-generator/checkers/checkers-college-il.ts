import { Course } from '../types';
import { courseMatchesCode, courseMatchesCodeOptions, courseIsFWS } from './checkers-common';

const ilrCoreRequirements = (course: Course): boolean => (
  courseMatchesCode(course, 'ILROB 1220')
  || courseMatchesCode(course, 'ILRLR 1100')
  || courseMatchesCode(course, 'ECON 1110')
  || courseMatchesCode(course, 'ECON 1120')
  || courseMatchesCode(course, 'ILRST 2100')
  || courseMatchesCode(course, 'ILRLR 2010')
  || courseMatchesCode(course, 'ILRHR 2600')
  || courseMatchesCode(course, 'ILRLR 2050')
  || courseMatchesCode(course, 'ILRLE 2400')
);

const ilrFWS = courseIsFWS;

const ilrAdvanceWriting = (course: Course): boolean => courseMatchesCodeOptions(
  course,
  [
    'ILRHR 2360',
    'ILRIC 2390',
    'ILRLE 2400',
    'ILRLR 2060',
    'ILRLR 2070',
    'ILROB 2230',
    'ILROB 2290',
    'ENGL 2880',
    'ENGL 2890'
  ]
);

export default { ilrCoreRequirements, ilrFWS, ilrAdvanceWriting };

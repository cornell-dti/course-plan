import { Course } from '../types';
import { courseMatchesCode, courseMatchesCodeOptions, courseIsFWS } from './checkers-common';

const aapIntroductoryStudioPractice = (course: Course): boolean => (
  courseMatchesCode(course, 'ART 2201')
  || courseMatchesCode(course, 'ART 2201')
  || courseMatchesCode(course, 'ART 2301')
  || courseMatchesCode(course, 'ART 2401')
  || courseMatchesCode(course, 'ART 2501')
  || courseMatchesCode(course, 'ART 2601')
  || courseMatchesCode(course, 'ART 2701')
);

const aapElectiveStudioPractice = (course: Course): boolean => courseMatchesCodeOptions(
  course,
  [
    'ART 3201',
    'ART 3301',
    'ART 3401',
    'ART 3501',
    'ART 3601',
    'ART 3705',
    'ART 3001',
    'ART 3003'
  ]
);

const aapPreThesisStudioPractice = (course: Course): boolean => courseMatchesCode(course, 'ART 3006');

const aapThesisStudioPractice = (course: Course): boolean => (
  courseMatchesCode(course, 'ART 4003')
  || courseMatchesCode(course, 'ART 4004')
);

const aapShopInstruction = (course: Course): boolean => courseMatchesCode(course, 'ART 2900');

const aapTheoryAndCriticism = (course: Course): boolean => (
  courseMatchesCode(course, 'ART 2103')
  || courseMatchesCode(course, 'ART 4100')
);

const aapFWS = courseIsFWS;

export default {
  aapIntroductoryStudioPractice,
  aapElectiveStudioPractice,
  aapPreThesisStudioPractice,
  aapThesisStudioPractice,
  aapShopInstruction,
  aapTheoryAndCriticism,
  aapFWS
};

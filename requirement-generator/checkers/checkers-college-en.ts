import { Course } from '../types';
import { courseMatchesCode, courseMatchesCodeOptions, courseIsFWS } from './checkers-common';

const engineeringMathematics = (course: Course): boolean => (
  courseMatchesCode(course, 'MATH 1910')
  || courseMatchesCode(course, 'MATH 1920')
  || courseMatchesCodeOptions(course, ['MATH 2930', 'MATH 2940'])
);

const engineeringPhysics = (course: Course): boolean => (
  courseMatchesCode(course, 'PHYS 1112') || courseMatchesCode(course, 'PHYS 2213')
);

const engineeringChemistry = (course: Course): boolean => courseMatchesCode(course, 'CHEM 2090');

const engineeringFWS = courseIsFWS;

const engineeringComputing = (course: Course): boolean => courseMatchesCodeOptions(course, [
  'CS 1110',
  'CS 1112',
  'CS 1114',
  'CS 1115'
]);

const engineeringENGRI = (course: Course): boolean => course.subject === 'ENGRI';

const engineeringDistribution = (course: Course): boolean => course.subject === 'ENGRD';

const engineeringLiberalArts = (course: Course): boolean => (
  ['CA', 'HA', 'LA/LAD', 'KCM', 'SBA', 'FL', 'CE'].some(
    distribution => course.catalogDistr?.includes(distribution) ?? false
  )
);

export default {
  engineeringMathematics,
  engineeringPhysics,
  engineeringChemistry,
  engineeringFWS,
  engineeringComputing,
  engineeringENGRI,
  engineeringDistribution,
  engineeringLiberalArts
};

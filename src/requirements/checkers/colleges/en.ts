import { Course } from '../../types';
import { courseMatchesCode, courseMatchesCodeOptions, courseIsFWS } from '../checkers-common';

const engineeringMathematics = [
  (course: Course): boolean => courseMatchesCode(course, 'MATH 1910'),
  (course: Course): boolean => courseMatchesCode(course, 'MATH 1920'),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['MATH 2930', 'MATH 2940'])
];

const engineeringPhysics = [
  (course: Course): boolean => courseMatchesCode(course, 'PHYS 1112'),
  (course: Course): boolean => courseMatchesCode(course, 'PHYS 2213')
];

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

const engineeringTechnicalCommunication = (course: Course): boolean => courseMatchesCodeOptions(course, [
  'ENGRC 3500',
  'ENGRC 3020',
  'ENGRC 3350',
  'ENGRC 3340',
  'ENGRD 2640',
  'AEP 2640',
  'CHEME 4320',
  'MAE 4272',
  'BEE 4730',
  'BEE 4890',
  'BEE 4530',
  'BEE 4590',
  'CIS 3000',
  'INFO 1200',
  'COMM 3030',
  'COMM 3020',
  'ENGRC 3023',
  'ENGRC 2640',
  'ENGRC 3152',
  'ENGRC 3160',
  'ENGRC 4152',
  'ENGRC 4530',
  'ENGRC 4890'
]) || (courseMatchesCode(course, 'MSE 4030') && courseMatchesCode(course, 'MSE 4040'))
|| (courseMatchesCode(course, 'MSE 4050') && courseMatchesCode(course, 'MSE 4060'));


export default {
  engineeringMathematics,
  engineeringPhysics,
  engineeringChemistry,
  engineeringFWS,
  engineeringComputing,
  engineeringENGRI,
  engineeringDistribution,
  engineeringLiberalArts,
  engineeringTechnicalCommunication
};

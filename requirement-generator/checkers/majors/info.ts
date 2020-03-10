import { Course } from '../../types';
import { courseMatchesCode, courseMatchesCodeOptions } from '../checkers-common';

const infoCoreCourses = [
  (course: Course): boolean => courseMatchesCode(course, 'INFO 1200'),
  (course: Course): boolean => courseMatchesCode(course, 'INFO 1300'),
  (course: Course): boolean => courseMatchesCode(course, 'INFO 2040'),
  (course: Course): boolean => courseMatchesCode(course, 'INFO 2450'),
  (course: Course): boolean => courseMatchesCode(course, 'INFO 2950')
];

const infoProgrammingAndMathRequirements = [
  (course: Course): boolean => courseMatchesCodeOptions(course, ['CS 1110']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['MATH 1106', 'MATH 1110', 'MATH 1910']),
  (course: Course): boolean => courseMatchesCodeOptions(
    course,
    [
      'AEM 2100',
      'BTRY 3010',
      'CEE 3040',
      'ECON 3110',
      'ECON 3130',
      'ENGRD 2700',
      'ILRST 2100',
      'MATH 1710',
      'PAM 2100',
      'PSYCH 2500',
      'SOC 3010',
      'STSCI 2100',
      'STSCI 2150',
      'STSCI 2200'
    ]
  )
];

const infoElectives = [
  (course: Course): boolean => courseMatchesCodeOptions(course, ['INFO 2300']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['CS 2110']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['CS 3110']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['CS 3410']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['INFO 3***', 'INFO 4***', 'INFO 5***', 'INFO 6***'])
];

export default { infoCoreCourses, infoProgrammingAndMathRequirements, infoElectives };

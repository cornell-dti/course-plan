import { Course } from '../types';
import { courseMatchesCode, courseMatchesCodeOptions } from './checkers-common';

const orieMajorRequiredClasses = (course: Course): boolean => (
  courseMatchesCode(course, 'ORIE 3120')
  || courseMatchesCode(course, 'ORIE 3150')
  || courseMatchesCode(course, 'ORIE 3300')
  || courseMatchesCode(course, 'ORIE 3310')
  || courseMatchesCode(course, 'ORIE 3500')
  || courseMatchesCode(course, 'ORIE 3510')
  || courseMatchesCode(course, 'ORIE 4580')
);

const orieElectives = (course: Course): boolean => courseMatchesCodeOptions(
  course, ['ORIE 4***', 'ORIE 5***', 'ORIE 6***']
);

const orieEngineeringDistributionCourses = (course: Course): boolean => (
  courseMatchesCodeOptions(course, ['ENGRD 2700'])
  || courseMatchesCodeOptions(course, ['ENGRD 2***', 'ENGRD 3***'])
  || courseMatchesCodeOptions(course, ['ENGRI 1***'])
);

export default { orieMajorRequiredClasses, orieElectives, orieEngineeringDistributionCourses };

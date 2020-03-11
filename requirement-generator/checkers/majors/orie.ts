import { Course } from '../../types';
import { courseMatchesCode, courseMatchesCodeOptions } from '../checkers-common';

const orieMajorRequiredClasses = [
  (course: Course): boolean => courseMatchesCode(course, 'ORIE 3120'),
  (course: Course): boolean => courseMatchesCode(course, 'ORIE 3150'),
  (course: Course): boolean => courseMatchesCode(course, 'ORIE 3300'),
  (course: Course): boolean => courseMatchesCode(course, 'ORIE 3310'),
  (course: Course): boolean => courseMatchesCode(course, 'ORIE 3500'),
  (course: Course): boolean => courseMatchesCode(course, 'ORIE 3510'),
  (course: Course): boolean => courseMatchesCode(course, 'ORIE 4580')
];

const orieElectives = (course: Course): boolean => courseMatchesCodeOptions(
  course, ['ORIE 4***', 'ORIE 5***', 'ORIE 6***']
);

const orieEngineeringDistributionCourses = [
  (course: Course): boolean => courseMatchesCodeOptions(course, ['ENGRD 2700']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['ENGRD 2***', 'ENGRD 3***']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['ENGRI 1***'])
];

export default { orieMajorRequiredClasses, orieElectives, orieEngineeringDistributionCourses };

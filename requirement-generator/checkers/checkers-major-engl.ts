import { Course } from '../types';
import { courseMatchesCode, courseMatchesCodeOptions } from './checkers-common';

const englishTotalCredits = (course: Course): boolean => {
  if (courseMatchesCodeOptions(course, ['ENGL 2800', 'ENGL 2810', 'ENGL 2880', 'ENGL 2890'])) {
    return false;
  }
  return courseMatchesCodeOptions(
    course,
    ['ENGL 2***', 'ENGL 3***', 'ENGL 4***', 'ENGL 5***', 'ENGL 6***']
  );
};

const englishPre1800 = (course: Course): boolean => (
  (course.catalogComments?.includes('pre-1800') ?? false)
  || (course.catalogSatisfiesReq?.includes('pre-1800') ?? false)
);

const english4000OrAbove = (course: Course): boolean => courseMatchesCode(course, 'ENGL 4***');

export default { englishTotalCredits, englishPre1800, english4000OrAbove };

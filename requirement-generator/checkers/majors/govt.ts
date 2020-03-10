import { Course } from '../../types';
import { courseMatchesCode, courseMatchesCodeOptions } from '../checkers-common';

const governmentIntroductoryGovernmentCourses = (course: Course): boolean => courseMatchesCodeOptions(
  course,
  [
    'GOVT 1111',
    'GOVT 1313',
    'GOVT 1615',
    'GOVT 1616',
    'GOVT 1817',
    'GOVT 1827'
  ]
);

const governmentCourseWork = (course: Course): boolean => courseMatchesCode(course, 'GOVT 2***');

const governmentTenthGovernmentCourse = (course: Course): boolean => courseMatchesCode(course, 'GOVT ****');

export default {
  governmentIntroductoryGovernmentCourses,
  governmentCourseWork,
  governmentTenthGovernmentCourse
};

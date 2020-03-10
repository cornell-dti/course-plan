import { Course } from '../../types';
import { courseMatchesCode, courseMatchesCodeOptions } from '../checkers-common';

const mechanicalEngineeringEngineeringDistribution = (course: Course): boolean => (
  courseMatchesCode(course, 'ENGRD 2020')
);

const mechanicalEngineeringRequiredMajorCourses = (course: Course): boolean => (
  courseMatchesCodeOptions(course, ['MAE 2210'])
  || courseMatchesCodeOptions(course, ['MAE 2030'])
  || courseMatchesCodeOptions(course, ['MAE 2250'])
  || courseMatchesCodeOptions(course, ['MAE 3230'])
  || courseMatchesCodeOptions(course, ['MAE 3240'])
  || courseMatchesCodeOptions(course, ['MAE 3260'])
  || courseMatchesCodeOptions(course, ['MAE 3270'])
  || courseMatchesCodeOptions(course, ['MAE 3780', 'ENGRD 2100', 'PHYS 3360'])
  || courseMatchesCodeOptions(course, ['MAE 4272'])
  || courseMatchesCodeOptions(course, ['MAE 4300'])
);

const mechanicalEngineeringMathematicsElective = (course: Course): boolean => courseMatchesCodeOptions(
  course,
  [
    'MAE 3100',
    'ENGRD 2700',
    'CEE 3040',
    'ENGRD 3200',
    'ENGRD 3100',
    'BTRY 3010',
    'CS 2800'
  ]
);

export default {
  mechanicalEngineeringEngineeringDistribution,
  mechanicalEngineeringRequiredMajorCourses,
  mechanicalEngineeringMathematicsElective
};

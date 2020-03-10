import { Course } from '../types';
import { courseMatchesCode, courseMatchesCodeOptions } from './checkers-common';

const bioEngineeringEngineeringDistributions = (course: Course): boolean => (
  courseMatchesCodeOptions(course, ['ENGRD 2020'])
  || courseMatchesCodeOptions(course, ['ENGRD 2600', 'ENGRD 2510'])
);

const bioEngineeringIntroBio = (course: Course): boolean => courseMatchesCodeOptions(
  course, ['BIOMG 1350', 'BIOG 1440', 'BIOG 1445', 'BIOEE/BIOSM 1610']
);

const bioEngineeringRequiredMajorCourses = (course: Course): boolean => (
  courseMatchesCode(course, 'BIOG/BIOSM 1500')
  || courseMatchesCode(course, 'BEE 3500')
  || courseMatchesCode(course, 'BEE 3310')
  || courseMatchesCode(course, 'BEE 3400')
  || courseMatchesCode(course, 'BEE 3600')
  || courseMatchesCode(course, 'BEE 4500')
);

const bioEngineeringBioChemistry = (course: Course): boolean => (
  courseMatchesCodeOptions(course, ['BIOMG 3300', 'BIOMG 3330', 'BIOMG 3350', 'BIOMG 3310'])
  || courseMatchesCode(course, 'BIOMG 3320')
);

const bioEngineeringEngineeringStatistics = (course: Course): boolean => (
  courseMatchesCodeOptions(course, ['BEE 2220', 'ENGRD 2210', 'CHEME 3130', 'MSE 3030'])
  || courseMatchesCodeOptions(course, ['CEE 3040', 'ENGRD 2700'])
);

const bioEngineeringFocusAreaElective = 'all-eligible' as const;

export default {
  bioEngineeringEngineeringDistributions,
  bioEngineeringIntroBio,
  bioEngineeringRequiredMajorCourses,
  bioEngineeringBioChemistry,
  bioEngineeringEngineeringStatistics,
  bioEngineeringFocusAreaElective
};

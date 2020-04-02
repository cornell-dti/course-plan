import { Course } from '../../types';
import { courseMatchesCode, courseMatchesCodeOptions } from '../checkers-common';

const economicsAdmissionToTheMajor = [
  (course: Course): boolean => courseMatchesCode(course, 'ECON 1110'),
  (course: Course): boolean => courseMatchesCode(course, 'ECON 1120'),
  (course: Course): boolean => courseMatchesCode(course, 'MATH 1110')
];

const economicsCoreEconomics = [
  (course: Course): boolean => courseMatchesCodeOptions(course, ['ECON 3030']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['ECON 3040']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['ECON 3110', 'ECON 3130']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['ECON 3120', 'ECON 3140'])
];

const economics4000LevelCourses = (course: Course): boolean => courseMatchesCode(course, 'ECON 4***');

const econimicsBasicRequirements = (course: Course): boolean => courseMatchesCodeOptions(
  course,
  [
    'ECON 1110',
    'ECON 1120',
    'ECON 3***',
    'ECON 4***'
  ]
);

export default {
  economicsAdmissionToTheMajor,
  economicsCoreEconomics,
  economics4000LevelCourses,
  econimicsBasicRequirements
};

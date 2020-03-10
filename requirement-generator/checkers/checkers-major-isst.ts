import { Course } from '../types';
import { courseMatchesCode, courseMatchesCodeOptions } from './checkers-common';

const isstProbabilityStatisticsAndOptimization = (course: Course): boolean => (
  courseMatchesCode(course, 'ORIE 3300') || courseMatchesCode(course, 'ORIE 3500')
);

const isstInformationSystems = (course: Course): boolean => (
  courseMatchesCodeOptions(course, ['INFO 2300'])
  || courseMatchesCodeOptions(course, ['ORIE 3800'])
  || courseMatchesCodeOptions(course, ['INFO 3300', 'INFO 4300'])
);

const isstEconomicOrganizationAndSocialContext = (course: Course): boolean => (
  courseMatchesCodeOptions(course, ['INFO 2040'])
  || courseMatchesCodeOptions(course, ['INFO 2450', 'ENGRC 3350'])
);

const isstEngineeringMathematics = (course: Course): boolean => (
  courseMatchesCodeOptions(course, ['MATH 1910'])
  || courseMatchesCodeOptions(course, ['MATH 1920'])
  || courseMatchesCodeOptions(course, ['MATH 2940'])
  || courseMatchesCodeOptions(course, ['MATH 2930', 'MATH 3040', 'CS 2800'])
);

const isstEngineeringDistributions = (course: Course): boolean => (
  courseMatchesCode(course, 'ENGRD 2110') || courseMatchesCode(course, 'ENGRD 2700')
);

export default {
  isstProbabilityStatisticsAndOptimization,
  isstInformationSystems,
  isstEconomicOrganizationAndSocialContext,
  isstEngineeringMathematics,
  isstEngineeringDistributions
};

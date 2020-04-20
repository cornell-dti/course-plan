import { includesWithSingleRequirement } from '../checkers-common';

const governmentIntroductoryGovernmentCourses = includesWithSingleRequirement(
  'GOVT 1111',
  'GOVT 1313',
  'GOVT 1615',
  'GOVT 1616',
  'GOVT 1817',
  'GOVT 1827'
);

const governmentCourseWork = includesWithSingleRequirement('GOVT 2***');

const governmentTenthGovernmentCourse = includesWithSingleRequirement('GOVT ****');

export default {
  governmentIntroductoryGovernmentCourses,
  governmentCourseWork,
  governmentTenthGovernmentCourse
};

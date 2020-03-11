import { Course } from '../../types';
import { courseMatchesCode, courseMatchesCodeOptions } from '../checkers-common';

const aemManagementRequirements = [
  (course: Course): boolean => courseMatchesCode(course, 'AEM 2200'),
  (course: Course): boolean => courseMatchesCode(course, 'AEM 2225'),
  (course: Course): boolean => courseMatchesCode(course, 'AEM 2240'),
  (course: Course): boolean => courseMatchesCode(course, 'AEM 2420'),
  (course: Course): boolean => courseMatchesCode(course, 'AEM 2601'),
  (course: Course): boolean => courseMatchesCode(course, 'AEM 3200'),
  (course: Course): boolean => courseMatchesCode(course, 'AEM 3230')
];

const aemEconomicsRequirements = [
  (course: Course): boolean => courseMatchesCodeOptions(course, ['ECON 1110']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['ECON 1120']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['AEM 2600', 'ECON 3030'])
];

const aemQuantitativeMethodsRequirements = [
  (course: Course): boolean => courseMatchesCodeOptions(course, ['AEM 2100']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['MATH 1110', 'MATH 1120']),
  (course: Course): boolean => courseMatchesCodeOptions(course, ['AEM 2010'])
];

const aemQuantitativeMethodsElectivesRequirements = (course: Course): boolean => courseMatchesCodeOptions(
  course,
  [
    'AEM 2770',
    'AEM 2830',
    'AEM 2840',
    'AEM 3100',
    'AEM 3390',
    'AEM 4060',
    'AEM 4110',
    'AEM 4120',
    'AEM 4190',
    'BTRY 3080',
    'ILRST 3080',
    'STSCI 3080',
    'ECON 3130',
    'ECON 3140',
    'ECON 4020',
    'ILRST 2110',
    'ILRST 3110'
  ]
);

const aemGradChallengeRequirementPart1 = (course: Course): boolean => courseMatchesCodeOptions(
  course,
  [
    'AEM 2000',
    'AEM 2555',
    'AEM 2800',
    'AEM 2805',
    'AEM 4940'
  ]
);

const aemGradChallengeRequirementPart2 = (course: Course): boolean => (
  courseMatchesCode(course, 'AEM 3000')
);

const aemGradChallengeRequirementPart3 = (course: Course): boolean => (
  courseMatchesCode(course, 'AEM 4000')
);

export default {
  aemManagementRequirements,
  aemEconomicsRequirements,
  aemQuantitativeMethodsRequirements,
  aemQuantitativeMethodsElectivesRequirements,
  aemGradChallengeRequirementPart1,
  aemGradChallengeRequirementPart2,
  aemGradChallengeRequirementPart3
};

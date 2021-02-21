import { Course, CollegeOrMajorRequirement } from '../../types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
  courseIsFWS,
  courseIsAllEligible,
} from '../checkers-common';

const crpRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Total Academic Credits',
    description:
      '120 academic credits are required' +
      'PE courses and courses numbered 1000-1099 do not count towards the 120 credits',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19824',
    checker: courseIsAllEligible,
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 120,
  },
  {
    name: 'First-Year Writing Seminars (FWS)',
    description:
      'URS students must successfully complete two First-Year Writing Seminars' +
      'A 5 on one English literature and English language exam will receive 3 credits which will be applied toward one First-Year Writing Seminar',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19824',
    checker: courseIsFWS,
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 6,
  },
  {
    name: 'Distribution Requirements: MQR',
    description:
      'At least one class must be classified as mathematics and quantitative reasoning (MQR)',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19824',
    checker: (course: Course): boolean => course.catalogDistr?.includes('MQR-AS') ?? false,
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Distribution Requirements: PBS',
    description: 'At least two classes must be classified as PBS',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19824',
    checker: (course: Course): boolean => course.catalogDistr?.includes('PBS-AS') ?? false,
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  {
    name: 'Distribution Requirements: MQR OR PBS',
    description: 'At least one class must be classified as MQR or PBS',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19824',
    checker: (course: Course): boolean =>
      ['(PBS-AS)', '(PBSS-AS)', '(MQR-AS)'].some(
        distribution => course.catalogDistr?.includes(distribution) ?? false
      ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Distribution Requirements: 5 Courses',
    description:
      'Must be selected from at least four of these five categories (i.e., CA, HA, KCM, LA, and SBA).' +
      'No more than three of these five courses can be taken in any one department.',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19824',
    checker: (course: Course): boolean =>
      ['CA', 'HA', 'LA/LAD', 'KCM', 'SBA'].some(
        distribution => course.catalogDistr?.includes(distribution) ?? false
      ),
    operator: 'or',
    fulfilledBy: 'courses',
    totalCount: 5,
    minCount: 4,
  },
  {
    name: 'Core Classes',
    description: 'CRP 1100, CRP 1101, CRP 2000, CRP 2010, CRP 3210',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19824',
    checker: includesWithSubRequirements(
      ['CRP 1100'],
      ['CRP 1101'],
      ['CRP 2000'],
      ['CRP 2010'],
      ['CRP 3210']
    ),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 5,
  },
  {
    name: 'Microeconomics',
    description: 'Choose one course: AEM 2500 OR CRP 4040 OR ECON 1110 OR ECON 3030 OR PAM 2000',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19824',
    checker: includesWithSubRequirements([
      'AEM 2500',
      'CRP 4040',
      'ECON 1110',
      'ECON 3030',
      'PAM 2000',
    ]),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Statistics',
    description:
      'Choose one course: AEM 2100, AEM 3100, AEM 4100, ECON 3130, ECON 3140, ILRST 2100, MATH 1710' +
      'MATH 4710, PAM 2100, PAM 2101, STSCI 2100, STSCI 3080',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19824',
    checker: includesWithSubRequirements([
      'AEM 2100',
      'AEM 3100',
      'AEM 4100',
      'ECON 3130',
      'ECON 3140',
      'ILRST 2100',
      'MATH 1710',
      'MATH 4710',
      'PAM 2100',
      'PAM 2101',
      'STSCI 2100',
      'STSCI 3080',
    ]),
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Five CRP Classes',
    description:
      'Take five additional CRP classes at the 3000-level or higher, for a minimum of 3 credits each',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=41&poid=19824',
    checker: includesWithSingleRequirement('CRP 3***', 'CRP 4***', 'CRP 5***', 'CRP 6***'),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 5,
  },
];

export default crpRequirements;

import { Course, CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement, includesWithSubRequirements } from '../checkers-common';

const crpRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'PBS and MQR courses',
    description:
      'Students must take 2 courses in Physical & Biological Sciences (PBS/PBSS-AS). ' +
      'Students must take 1 course in Mathematics & Quantitative Reasoning (MQR-AS). ' +
      'Students must take 1 course that is either in PBS-AS or MQR-AS.',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
    checker: [
      (course: Course): boolean =>
        ['PBS-AS', 'PBSS-AS'].some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ),
      (course: Course): boolean => course.catalogDistr?.includes('MQR-AS') ?? false,
      (course: Course): boolean =>
        ['PBS-AS', 'PBSS-AS', 'MQR-AS'].some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2, 1, 1],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Distribution Requirements: 5 Courses',
    description:
      'Must be selected from at least four of these five categories (i.e., CA, HA, KCM, LA, and SBA).' +
      'No more than three of these five courses can be taken in any one department.',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=31&poid=15145',
    checker: [
      (course: Course): boolean =>
        ['CA', 'HA', 'LA/LAD', 'KCM', 'SBA'].some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [5],
  },
  {
    name: 'Core Classes',
    description: 'CRP 1100, CRP 1101, CRP 2000, CRP 2010, CRP 3210',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=31&poid=15145',
    checker: includesWithSubRequirements(
      ['CRP 1100'],
      ['CRP 1101'],
      ['CRP 2000'],
      ['CRP 2010'],
      ['CRP 3210']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
  },
  {
    name: 'Microeconomics',
    description: 'Choose one course: AEM 2500 OR CRP 4040 OR ECON 1110 OR ECON 3030 OR PAM 2000',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=31&poid=15145',
    checker: includesWithSubRequirements([
      'AEM 2500',
      'CRP 4040',
      'ECON 1110',
      'ECON 3030',
      'PAM 2000',
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Statistics',
    description:
      'Choose one course: AEM 2100, AEM 3100, AEM 4100, ECON 3130, ECON 3140, ILRST 2100, MATH 1710' +
      'MATH 4710, PAM 2100, PAM 2101, STSCI 2100, STSCI 3080',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=31&poid=15145',
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
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Five CRP Classes',
    description:
      'Take five additional CRP classes at the 3000-level or higher, for a minimum of 3 credits each',
    source: 'http://courses.cornell.edu/preview_program.php?catoid=31&poid=15145',
    checker: includesWithSingleRequirement('CRP 3***', 'CRP 4***', 'CRP 5***', 'CRP 6***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [5],
  },
];

export default crpRequirements;

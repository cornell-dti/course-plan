import { Course, CollegeOrMajorRequirement } from '../../types';
import {
  courseIsFWS,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../checkers-common';

const crpRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'First-Year Writing Seminars',
    description: 'All students are required to take two first-year writing seminars.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19824#undergraduatestudyinurbanandregionalstudies',
    checker: [courseIsFWS],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'PBS and MQR courses',
    description:
      'Students must take 2 courses in Physical & Biological Sciences (PBS/PBSS-AS). ' +
      'Students must take 1 course in Mathematics & Quantitative Reasoning (MQR-AS). ' +
      'Students must take 1 course that is either in PBS-AS or MQR-AS.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19824#undergraduatestudyinurbanandregionalstudies',
    checker: [
      (course: Course): boolean =>
        ['PBS-AS', 'PBSS-AS', 'BIO-AG', 'BIOLS-AG', 'BIONLS-AG', 'OPHLS-AG', 'PBS', 'PBS-HE'].some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ),
      (course: Course): boolean =>
        ['MQR-AS', 'MQR-AAP', 'MQR-HE'].some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ),
      (course: Course): boolean =>
        [
          'PBS-AS',
          'PBSS-AS',
          'BIO-AG',
          'BIOLS-AG',
          'BIONLS-AG',
          'OPHLS-AG',
          'PBS',
          'PBS-HE',
          'MQR-AS',
          'MQR-AAP',
          'MQR-HE',
        ].some(distribution => course.catalogDistr?.includes(distribution) ?? false),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2, 1, 1],
    slotNames: ['PBS', 'MQR', 'PBS or MQR'],
    disallowTransferCredit: true,
  },
  {
    name: 'Distribution Requirements: 5 Courses',
    description:
      'Must be selected from at least four of these five categories (i.e., CA, HA, KCM, LA, and SBA).' +
      ' No more than three of these five courses can be taken in any one department.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19824#undergraduatestudyinurbanandregionalstudies',
    checker: [
      (course: Course): boolean =>
        [
          'CA-AAP',
          'CA-AG',
          'CA-AS',
          'CA-HE',
          'HA-AAP',
          'HA-AG',
          'HA-AS',
          'HA-HE',
          'KCM-AAP',
          'KCM-AG',
          'KCM-AS',
          'KCM-HE',
          'LA-AAP',
          'LA-AG',
          'LA-AS',
          'LAD-HE',
          'SBA-AAP',
          'SBA-AG',
          'SBA-AS',
          'SBA-HE',
        ].some(distribution => course.catalogDistr?.includes(distribution) ?? false),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [5],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
  {
    name: 'Core Classes',
    description: 'CRP 1100, CRP 1101, CRP 2000, CRP 2010, CRP 3210',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19824#undergraduatestudyinurbanandregionalstudies',
    checker: includesWithSubRequirements(
      ['CRP 1100'],
      ['CRP 1101'],
      ['CRP 2000'],
      ['CRP 2010'],
      ['CRP 3210']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
    slotNames: ['CRP 1100', 'CRP 1101', 'CRP 2000', 'CRP 2010', 'CRP 3210'],
  },
  {
    name: 'Microeconomics',
    description: 'Choose one course: AEM 2500 OR CRP 4040 OR ECON 1110 OR ECON 3030 OR PAM 2000',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19824#undergraduatestudyinurbanandregionalstudies',
    checker: includesWithSubRequirements([
      'AEM 2500',
      'CRP 4040',
      'ECON 1110',
      'ECON 3030',
      'PAM 2000',
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Statistics',
    description:
      'Choose one course: AEM 2100, AEM 3100, AEM 4100, ECON 3130, ECON 3140, ILRST 2100, MATH 1710' +
      ', MATH 4710, PAM 2100, PAM 2101, STSCI 2100, STSCI 3080',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19824#undergraduatestudyinurbanandregionalstudies',
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
    slotNames: ['Course'],
  },
  {
    name: 'Five CRP Classes',
    description:
      'Take five additional CRP classes at the 3000-level or higher, for a minimum of 3 credits each',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19824#undergraduatestudyinurbanandregionalstudies',
    checker: includesWithSingleRequirement('CRP 3***', 'CRP 4***', 'CRP 5***', 'CRP 6***'),
    fulfilledBy: 'courses',
    perSlotMinCount: [5],
    slotNames: ['Course'],
  },
];

export default crpRequirements;

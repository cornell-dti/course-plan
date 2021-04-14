import { Course, CollegeOrMajorRequirement } from '../../types';
import { courseIsForeignLang, courseIsFWS, ifCodeMatch } from '../checkers-common';

const casPreFA2020Requirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'A&S Credits',
    description:
      '100 credits in Arts & Sciences are required. ' +
      'Students can take more than 20 credits outside of the College as long as they take 100 credits within; ' +
      'they can also take all their credits in Arts & Sciences and accumulate more than 120. ' +
      'Note: AP, IB, and A-Level credits count toward the 120 total credits but not toward the 100 A&S credits.',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
    checker: [
      (course: Course): boolean =>
        course.acadGroup.includes('AS') ||
        course.subject === 'CS' ||
        (course.catalogDistr?.includes('-AS') ?? false),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [100],
    allowCourseDoubleCounting: true,
    disallowTransferCredit: true,
  },
  {
    name: 'First-Year Writing Seminars (FWS)',
    description:
      'A 5 on either the AP English Composition or Literature exam, or a 7 on the IB HL English Literature or Language exam will count towards one of these seminars. ' +
      'First-year students should plan to take an FWS during their first semester at Cornell.',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
    checker: [courseIsFWS],
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
  },
  {
    name: 'Foreign Language',
    description:
      'Pass an intermediate Cornell language course at the 2000-level or above or complete at least 11 credits in a single foreign language at Cornell. ' +
      'Note: Native speakers of a foreign language may be exempted from this requirement.',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description:
          'Complete one intermediate course of 3 or more credits at Cornell at the 2000 level or above.',
        checker: [
          (course: Course): boolean =>
            courseIsForeignLang(course) && !ifCodeMatch(course.catalogNbr, '1***'),
        ],
        counting: 'courses',
        perSlotMinCount: [1],
      },
      'Option 2': {
        description:
          'Complete at least 11 credits of study (2 or 3 semesters) in a single foreign language taken in the appropriate sequence at Cornell.',
        checker: [(course: Course): boolean => courseIsForeignLang(course)],
        counting: 'credits',
        perSlotMinCount: [11],
      },
      // TODO:
      // 'Option 3': {
      //   description:
      //     'Exemptions may be granted for completion of secondary education at a foreign institution where the language of instruction was not English '
      //     + 'or native or near-native proficiency in speaking, reading, and writing a second language, as determined by examination.',
      //   fulfilledBy: 'self-check',
      // },
    },
  },
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
    disallowTransferCredit: true,
  },
  {
    name: 'Distribution Requirement',
    description:
      'Five Arts & Sciences courses of 3 or more credits from at least 4 of the following social sciences, humanities, and arts categories: ' +
      'CA-AS, HA-AS, KCM-AS, LA-AS, SBA-AS',
    source: 'https://courses.cornell.edu/content.php?catoid=41&navoid=12684',
    checker: [
      (course: Course): boolean => course.catalogDistr?.includes('CA-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('HA-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('KCM-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('LA-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('SBA-AS') ?? false,
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
    allowCourseDoubleCounting: true,
    disallowTransferCredit: true,
  },
  {
    name: 'Geographic Breadth Requirement (GB)',
    description:
      'One course that focuses on an area or a people other than those of the United States, Canada, or Europe. ' +
      'Courses fulfilling this requirement are marked with a GB/GHB in the Class Roster.',
    source: 'https://courses.cornell.edu/content.php?catoid=41&navoid=12684',
    checker: [
      (course: Course): boolean =>
        ['GB', 'GHB'].some(breadth => course.catalogBreadth?.includes(breadth) ?? false),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    allowCourseDoubleCounting: true,
    disallowTransferCredit: true,
  },
  {
    name: 'Historic Breadth Requirement (HB)',
    description:
      'One course that focuses on an historic period before the 20th century. ' +
      'Courses fulfilling this requirement are marked with an HB/GHB in the Class Roster.',
    source: 'https://courses.cornell.edu/content.php?catoid=41&navoid=12684',
    checker: [
      (course: Course): boolean =>
        ['HB', 'GHB'].some(breadth => course.catalogBreadth?.includes(breadth) ?? false),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    allowCourseDoubleCounting: true,
    disallowTransferCredit: true,
  },
];

export default casPreFA2020Requirements;

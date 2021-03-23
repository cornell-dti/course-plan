import { Course, CollegeOrMajorRequirement } from '../../types';
import { courseIsFWS, includesWithSingleRequirement } from '../checkers-common';

const casFA2020Requirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'A&S Credits',
    description:
      '100 credits in Arts & Sciences are required. ' +
      'Students can take more than 20 credits outside of the College as long as they take 100 credits within; ' +
      'they can also take all their credits in Arts & Sciences and accumulate more than 120. ' +
      'Note: AP, IB, and A-Level credits count toward the 120 total credits but not toward the 100 A&S credits.',
    source: 'https://as.cornell.edu/education/degree-requirements',
    checker: [
      (course: Course): boolean =>
        course.acadGroup.includes('AS') ||
        course.subject === 'CS' ||
        (course.catalogDistr?.includes('-AS') ?? false),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [100],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'First-Year Writing Seminars (FWS)',
    description:
      'A 5 on either the AP English Composition or Literature exam, or a 7 on the IB HL English Literature or Language exam will count towards one of these seminars. ' +
      'First-year students should plan to take an FWS during their first semester at Cornell.',
    source: 'https://as.cornell.edu/education/degree-requirements',
    checker: [courseIsFWS],
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
  },
  {
    name: 'Foreign Language',
    description:
      'AP and IB credits cannot complete this requirement, but usually indicate that a student can place into a higher level course. ' +
      'Note: Native speakers of a foreign language may be exempted from this requirement.',
    source: 'https://as.cornell.edu/education/degree-requirements',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Option 1': {
        description:
          'Complete one intermediate course of 3 or more credits at Cornell at the 2000 level or above.',
        checker: includesWithSingleRequirement(
          'ARAB 2***',
          'BENGL 2***',
          'BURM 2***',
          'CHIN 2***',
          'FREN 2***',
          'GERST 2***',
          'GREEK 2***',
          'HEBRW 2***',
          'HINDI 2***',
          'INDO 2***',
          'ITAL 2***',
          'JAPAN 2***',
          'KHMER 2***',
          'KOREA 2***',
          'LATIN 2***',
          'NEPAL 2***',
          'PERSN 2***',
          'POLSH 2***',
          'PORT 2***',
          'RUSSA 2***',
          'SANSK 2***',
          'SINHA 2***',
          'SPAN 2***',
          'SWAHL 2***',
          'TAG 2***',
          'THAI 2***',
          'TURK 2***',
          'VIET 2***',
          'YORUB 2***',
          'ZULU 2***'
        ),
        counting: 'courses',
        perSlotMinCount: [1],
      },
      'Option 2': {
        description:
          'Complete at least 11 credits of study (2 or 3 semesters) in a single foreign language taken in the appropriate sequence at Cornell.',
        checker: [
          (course: Course): boolean =>
            [
              'ARAB',
              'BENGL',
              'BURM',
              'CHIN',
              'FREN',
              'GERST',
              'GREEK',
              'HEBRW',
              'HINDI',
              'INDO',
              'ITAL',
              'JAPAN',
              'KHMER',
              'KOREA',
              'LATIN',
              'NEPAL',
              'PERSN',
              'POLSH',
              'PORT',
              'RUSSA',
              'SANSK',
              'SINHA',
              'SPAN',
              'SWAHL',
              'TAG',
              'THAI',
              'TURK',
              'VIET',
              'YORUB',
              'ZULU',
            ].includes(course.subject),
        ],
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
  // TODO: do not check students can only double-count distribution requirements on a maximum of two courses
  {
    name: 'Distribution Requirements',
    description:
      'A minimum of 8 courses must be taken to fulfill all distribution categories:' +
      ' ALC-AS, BIO-AS, ETM-AS, GLC-AS, HST-AS, PHS-AS, SCD-AS, SSC-AS, SMR-AS. ' +
      'A course may satisfy a maximum of two distribution categories. ' +
      'Students can only double-count distribution requirements on a maximum of two courses.',
    source: 'https://courses.cornell.edu/content.php?catoid=41&navoid=12685',
    checker: [
      (course: Course): boolean => course.catalogDistr?.includes('ALC-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('BIO-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('ETM-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('GLC-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('HST-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('PHS-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('SCD-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('SSC-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('SDS-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('SMR-AS') ?? false,
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    allowCourseDoubleCounting: true,
    minNumberOfSlots: 8,
    disallowTransferCredit: true,
  },
];

export default casFA2020Requirements;

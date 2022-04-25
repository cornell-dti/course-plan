import { Course, CollegeOrMajorRequirement } from '../../types';
import {
  courseIsFWS,
  ifCodeMatch,
  courseIsForeignLang,
  courseCountsForASCredit,
} from '../checkers-common';

const casFA2020Requirements: readonly CollegeOrMajorRequirement[] = [
  // {
  //   name: '120 Total Credits',
  //   description:
  //     'Students must earn a minimum of 120 academic credits, which may include AP/test credits. ' +
  //     'However, courses in military training, service as a teaching assistant, physical education, remedial or developmental training, ' +
  //     'precalculus mathematics, supplemental science and mathematics, and offered by the Learning Strategies Center and English as a second language do not count. ' +
  //     'The College\'s "Courses That Won\'t Count" website has a full list of excluded courses.',
  //   source: 'https://as.cornell.edu/education/degree-requirements',
  //   checker: [(course: Course): boolean => courseCountsForASCredit(course)],
  //   fulfilledBy: 'credits',
  //   perSlotMinCount: [120],
  //   allowCourseDoubleCounting: true,
  // },
  {
    name: 'A&S Credits',
    description:
      'Of the 120 Total Credits, a minimum of 100 credits must be taken in the College of Arts & Sciences. ' +
      'Note: AP, IB, and A-Level credits do not count.',
    source: 'https://as.cornell.edu/education/degree-requirements',
    checker: [
      (course: Course): boolean =>
        courseCountsForASCredit(course) &&
        (course.acadGroup.includes('AS') ||
          course.subject === 'CS' ||
          (course.catalogDistr?.includes('-AS') ?? false)),
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
        checker: [
          (course: Course): boolean =>
            courseIsForeignLang(course) && !ifCodeMatch(course.catalogNbr, '1***'),
        ],
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
      'Option 2': {
        description:
          'Complete at least 11 credits of study (2 or 3 semesters) in a single foreign language taken in the appropriate sequence at Cornell.',
        checker: [courseIsForeignLang],
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
      ' ALC-AS, BIO-AS, ETM-AS, GLC-AS, HST-AS, PHS-AS, SCD-AS, SSC-AS, SDS-AS, and SMR-AS. ' +
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
    slotNames: ['ALC', 'BIO', 'ETM', 'GLC', 'HST', 'PHS', 'SCD', 'SSC', 'SDS', 'SMR'],
    allowCourseDoubleCounting: true,
    minNumberOfSlots: 8,
    disallowTransferCredit: true,
  },
];

export default casFA2020Requirements;

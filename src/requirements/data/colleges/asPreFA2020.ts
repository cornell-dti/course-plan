import { Course, CollegeOrMajorRequirement } from '../../types';
import { courseIsFWS, includesWithSingleRequirement } from '../checkers-common';

const casPreFA2020Requirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'A&S Credits',
    description:
      '100 credits in Arts & Sciences are required. ' +
      'Students can take more than 20 credits outside of the College as long as they take 100 credits within; ' +
      'they can also take all their credits in Arts & Sciences and accumulate more than 120. ' +
      'Note: AP, IB, and A-Level credits count toward the 120 total credits but not toward the 100 A&S credits.',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
    checker: (course: Course): boolean =>
      course.acadGroup.includes('AS') ||
      course.subject === 'CS' ||
      (course.catalogDistr?.includes('-AS') ?? false),
    fulfilledBy: 'credits',
    minCount: 100,
    allowCourseDoubleCounting: true,
  },
  {
    name: 'First-Year Writing Seminars (FWS)',
    description:
      'A 5 on either the AP English Composition or Literature exam, or a 7 on the IB HL English Literature or Language exam will count towards one of these seminars. ' +
      'First-year students should plan to take an FWS during their first semester at Cornell.',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
    checker: courseIsFWS,
    fulfilledBy: 'credits',
    minCount: 6,
  },

  {
    name: 'Foreign Language',
    description:
      'AP and IB credits cannot complete this requirement, but usually indicate that a student can place into a higher level course. ' +
      'Note: Native speakers of a foreign language may be exempted from this requirement.',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
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
        subRequirementProgress: 'any-can-count',
        minCount: 1,
      },
      'Option 2': {
        description:
          'Complete at least 11 credits of study (2 or 3 semesters) in a single foreign language taken in the appropriate sequence at Cornell.',
        checker: (course: Course): boolean =>
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
        counting: 'credits',
        minCount: 11,
      },
    },
  },
  {
    name: 'Physical & Biological Sceiences (PBS-AS/PBSS-AS)',
    description: 'Students must take 2 courses in Physical & Biological Sciences (PBS/PBSS-AS).',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
    checker: (course: Course): boolean =>
      ['PBS-AS', 'PBSS-AS'].some(
        distribution => course.catalogDistr?.includes(distribution) ?? false
      ),
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'courses',
    minCount: 2,
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Mathematics & Quantitative Reasoning (MQR-AS)',
    description: 'Students must take 1 course in Mathematics & Quantitative Reasoning (MQR-AS).',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
    checker: (course: Course): boolean => course.catalogDistr?.includes('MQR-AS') ?? false,
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'courses',
    minCount: 1,
    allowCourseDoubleCounting: true,
  },
  {
    name: 'PBS-AS or MQR-AS',
    description: 'Students must take 1 course that is either in PBS-AS or MQR-AS',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
    checker: (course: Course): boolean =>
      ['PBS-AS', 'PBSS-AS', 'MQR-AS'].some(
        distribution => course.catalogDistr?.includes(distribution) ?? false
      ),
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Distribution Requirement',
    description:
      'Five Arts & Sciences courses of 3 or more credits from at least 4 of the following social sciences, humanities, and arts categories: ' +
      'CA-AS, HA-AS, KCM-AS, LA-AS, SBA-AS',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
    checker: [
      (course: Course): boolean => course.catalogDistr?.includes('CA-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('HA-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('KCM-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('LA-AS') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('SBA-AS') ?? false,
    ],
    subRequirementProgress: 'every-course-needed',
    fulfilledBy: 'courses',
    minCount: 5,
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Geographic Breadth Requirement (GB)',
    description:
      'One course that focuses on an area or a people other than those of the United States, Canada, or Europe. ' +
      'Courses fulfilling this requirement are marked with a GB/GHB in the Class Roster.',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
    checker: (course: Course): boolean =>
      ['GB', 'GHB'].some(breadth => course.catalogBreadth?.includes(breadth) ?? false),
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'courses',
    minCount: 1,
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Historic Breadth Requirement (HB)',
    description:
      'One course that focuses on an historic period before the 20th century. ' +
      'Courses fulfilling this requirement are marked with an HB/GHB in the Class Roster.',
    source: 'https://as.cornell.edu/education/old-degree-requirements',
    checker: (course: Course): boolean =>
      ['HB', 'GHB'].some(breadth => course.catalogBreadth?.includes(breadth) ?? false),
    subRequirementProgress: 'any-can-count',
    fulfilledBy: 'courses',
    minCount: 1,
    allowCourseDoubleCounting: true,
  },
];

export default casPreFA2020Requirements;

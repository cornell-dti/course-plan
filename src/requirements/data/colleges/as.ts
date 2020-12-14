import { Course, CollegeOrMajorRequirement } from '../../types';
import {
  courseIsFWS,
  includesWithSingleRequirement,
  courseIsAllEligible,
} from '../checkers-common';

const casRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Total Academic Credits',
    description:
      '120 academic credits are required' +
      'PE courses and courses numbered 1000-1099 do not count towards the 120 credits',
    source: 'http://courses.cornell.edu/content.php?catoid=41&navoid=11570#credit-req',
    checker: courseIsAllEligible,
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 120,
  },
  {
    name: 'A&S Credits',
    description:
      '100 credits in Arts & Sciences are required.' +
      'Students can take more than 20 credits outside of the College as long as they take 100 credits within; ' +
      'they can also take all their credits in Arts & Sciences and accumulate more than 120. ' +
      'Note: AP, IB, and A-Level credits count toward the 120 total credits but not toward the 100 A&S credits.',
    source: 'https://as.cornell.edu/degree-requirements',
    checker: (course: Course): boolean => course.catalogDistr?.includes('-AS') ?? false,
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 100,
  },
  {
    name: 'First-Year Writing Seminars (FWS)',
    description:
      'A 5 on either the AP English Composition or Literature exam, or a 7 on the IB HL English Literature or Language exam will count towards one of these seminars. ' +
      'First-year students should plan to take an FWS during their first semester at Cornell.',
    source: 'https://as.cornell.edu/degree-requirements',
    checker: courseIsFWS,
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 6,
  },
  {
    name: 'Intermediate Language Course',
    description:
      'Option 1 - Successfully complete one intermediate course of 3 or more credits at Cornell at the 2000 level or above.',
    source: 'https://as.cornell.edu/Foreign-Language',
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
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Language Course Credits',
    description:
      'Option 2 - Successfully complete at least 11 credits of study (2 or 3 semesters) in a single foreign language taken in the appropriate sequence at Cornell.',
    source: 'https://as.cornell.edu/Foreign-Language',
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
    operator: 'or',
    fulfilledBy: 'credits',
    minCount: 11,
  },
  {
    name: '(PBS-AS) or (MQR-AS)',
    description:
      'Four courses in Physical & Biological Sciences (PBS-AS/PBSS-AS), and Mathematics & Quantitative Reasoning (MQR-AS).',
    source: 'https://as.cornell.edu/degree-requirements',
    checker: (course: Course): boolean =>
      ['(PBS-AS)', '(PBSS-AS)', '(MQR-AS)'].some(
        distribution => course.catalogDistr?.includes(distribution) ?? false
      ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 4,
  },
  {
    name: 'Physical & Biological Sceiences (PBS-AS)',
    description: 'Students must take 2 courses in Physical & Biological Sciences (PBS).',
    source: 'https://as.cornell.edu/degree-requirements',
    checker: (course: Course): boolean =>
      ['(PBS-AS)', '(PBSS-AS)'].some(
        distribution => course.catalogDistr?.includes(distribution) ?? false
      ),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 2,
  },
  {
    name: 'Mathematics & Quantitative Reasoning (MQR-AS)',
    description: 'Students must take 1 in Mathematics & Quantitative Reasoning (MQR).',
    source: 'https://as.cornell.edu/degree-requirements',
    checker: (course: Course): boolean => course.catalogDistr?.includes('(MQR-AS)') ?? false,
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Liberal Arts',
    description:
      'Five Arts & Sciences courses of 3 or more credits from at least 4 of the following social sciences, humanities, and arts categories:',
    source: 'https://as.cornell.edu/degree-requirements',
    checker: [
      (course: Course): boolean => course.catalogDistr?.includes('(CA-AS)') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('(HA-AS)') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('(KCM-AS)') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('(LA-AS)') ?? false,
      (course: Course): boolean => course.catalogDistr?.includes('(SBA-AS)') ?? false,
    ],
    operator: 'and',
    fulfilledBy: 'courses',
    minCount: 5,
  },
  {
    name: 'Geographic Breadth Requirement (GB)',
    description:
      'One course that focuses on an area or a people other than those of the United States, Canada, or Europe. ' +
      'Courses fulfilling this requirement are marked with a GB in the Class Roster.',
    source: 'https://as.cornell.edu/degree-requirements',
    checker: (course: Course): boolean =>
      ['GB', 'GHB'].some(breadth => course.catalogBreadth?.includes(breadth) ?? false),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
  },
  {
    name: 'Historic catalogBreadth Requirement (HB)',
    description:
      'One course that focuses on an historic period before the 20th century. ' +
      'Courses fulfilling this requirement are marked with an HB in the Class Roster.',
    source: 'https://as.cornell.edu/degree-requirements',
    checker: (course: Course): boolean =>
      ['HB', 'GHB'].some(breadth => course.catalogBreadth?.includes(breadth) ?? false),
    operator: 'or',
    fulfilledBy: 'courses',
    minCount: 1,
  },
];

export default casRequirements;

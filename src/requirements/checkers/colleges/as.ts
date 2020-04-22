import { Course } from '../../types';
import { courseMatchesCodeOptions, courseIsFWS } from '../checkers-common';

const casCredits = (course: Course): boolean => course.acadGroup.includes('AS');

const casFWS = courseIsFWS;

const casIntermediateLanguageCourse = (course: Course): boolean => courseMatchesCodeOptions(
  course,
  [
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
  ]
);

const casLanguageCourseCredits = (course: Course): boolean => [
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
  'ZULU'
].includes(course.subject);

const casPBSOrMQR = (course: Course): boolean => ['(PBS-AS)', '(PBSS-AS)', '(MQR-AS)'].some(
  distribution => course.catalogDistr?.includes(distribution) ?? false
);

const casPhysicalAndBiologicalSciences = (course: Course): boolean => ['(PBS-AS)', '(PBSS-AS)'].some(
  distribution => course.catalogDistr?.includes(distribution) ?? false
);

const casMathematicsAndQuantitativeAndReasoning = (course: Course): boolean => (
  course.catalogDistr?.includes('(MQR-AS)') ?? false
);

const casLiberalArts = [
  (course: Course): boolean => course.catalogDistr?.includes('(CA-AS)') ?? false,
  (course: Course): boolean => course.catalogDistr?.includes('(HA-AS)') ?? false,
  (course: Course): boolean => course.catalogDistr?.includes('(KCM-AS)') ?? false,
  (course: Course): boolean => course.catalogDistr?.includes('(LA-AS)') ?? false,
  (course: Course): boolean => course.catalogDistr?.includes('(SBA-AS)') ?? false
];

const casGeographicBreadthRequirement = (course: Course): boolean => ['GB', 'GHB'].some(
  breadth => course.catalogBreadth?.includes(breadth) ?? false
);

const casHistoricBreadthRequirement = (course: Course): boolean => ['HB', 'GHB'].some(
  breadth => course.catalogBreadth?.includes(breadth) ?? false
);

export default {
  casCredits,
  casFWS,
  casIntermediateLanguageCourse,
  casLanguageCourseCredits,
  casPBSOrMQR,
  casPhysicalAndBiologicalSciences,
  casMathematicsAndQuantitativeAndReasoning,
  casLiberalArts,
  casGeographicBreadthRequirement,
  casHistoricBreadthRequirement
};

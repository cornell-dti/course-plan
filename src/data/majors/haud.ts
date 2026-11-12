import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseIsFWS,
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const SOURCE =
  'https://catalog.cornell.edu/programs/history-architecture-urban-development-bs-haud/';

/** Whether the course carries any distribution category with one of the given prefixes (e.g. "CA" matches "CA-AS", "CA-AAP"). */
const hasDistributionCategory = (course: Course, prefixes: readonly string[]): boolean =>
  (course.catalogDistr?.match(/[A-Z]+-[A-Z]+/g) ?? []).some(category =>
    prefixes.includes(category.split('-')[0])
  );

const HUMANITIES_CATEGORIES = [
  'CA',
  'FL',
  'HA',
  'KCM',
  'LA',
  'SBA',
  'ALC',
  'ETM',
  'GLC',
  'HST',
  'SCD',
  'SSC',
];
const SCIENCE_AND_MQR_CATEGORIES = [
  'BIO',
  'BIOLS',
  'BIONLS',
  'OPHLS',
  'PBS',
  'PBSS',
  'PHS',
  'MQR',
  'SDS',
  'SMR',
];

/** Catalog table: "Any eight architecture history electives from the following: ARCH 3810 - ARCH 3896". */
const isHistoryElective = (course: Course): boolean => {
  const number = Number(course.catalogNbr);
  return course.subject === 'ARCH' && number >= 3810 && number <= 3896;
};

const haudRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introduction to History of Architecture',
    description:
      'ARCH 1801 and ARCH 2802, to be completed in the first year of study if not already completed at matriculation.',
    source: SOURCE,
    checker: includesWithSubRequirements(['ARCH 1801'], ['ARCH 2802']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['ARCH 1801', 'ARCH 2802'],
  },
  {
    name: '3000-Level History of Architecture and Urban Development Electives',
    description:
      'Eight 3000-level history of architecture and urban development electives (ARCH 3810 through ARCH 3896). ' +
      'Independent study classes (e.g. ARCH 3897) cannot be applied toward this requirement.',
    source: SOURCE,
    checker: [isHistoryElective],
    fulfilledBy: 'courses',
    perSlotMinCount: [8],
    slotNames: ['Course'],
  },
  {
    name: 'Advanced History of Architecture and Urban Development Seminars',
    description:
      'Two advanced history and urban development seminars (ARCH 6800 through ARCH 6819), plus one additional ' +
      '6000-level seminar or ARCH 4901.',
    source: SOURCE,
    checker: includesWithSubRequirements(['ARCH 680*', 'ARCH 681*'], ['ARCH 6***', 'ARCH 4901']),
    fulfilledBy: 'courses',
    perSlotMinCount: [2, 1],
    slotNames: ['Advanced Seminar (ARCH 6800-6819)', 'Additional 6000-level Seminar or ARCH 4901'],
  },
  {
    name: 'Architectural Theory',
    description:
      'One theory elective: ARCH 3308 or ARCH 4300. An independent study class cannot be applied toward this requirement.',
    source: SOURCE,
    checker: includesWithSingleRequirement('ARCH 3308', 'ARCH 4300'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Diversity and Inclusion',
    description: 'AAP 1100 (The Worlds We Make), required of all AAP undergraduates.',
    source: SOURCE,
    checker: includesWithSingleRequirement('AAP 1100'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['AAP 1100'],
  },
  {
    name: 'Writing',
    description:
      'Two approved writing classes totaling 6 credits by the end of the first year: any First-Year Writing ' +
      'Seminar (FWS) or ENGL 2880 (Expository Writing). Advanced placement credit may count toward at most one ' +
      'writing class.',
    source: SOURCE,
    checker: [
      (course: Course): boolean =>
        courseIsFWS(course) || courseMatchesCodeOptions(course, ['ENGL 2880']),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Humanities and Social Sciences',
    description:
      'Four classes under the categories CA, FL, HA, KCM, LA, SBA or ALC, ETM, GLC, HST, SCD, SSC. ' +
      'Advanced placement credit cannot be applied; approved transfer credit may be.',
    source: SOURCE,
    checker: [(course: Course): boolean => hasDistributionCategory(course, HUMANITIES_CATEGORIES)],
    fulfilledBy: 'courses',
    perSlotMinCount: [4],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
  {
    name: 'Physical/Biological Sciences and Mathematics/Quantitative Reasoning',
    description:
      'Two classes under the physical and biological sciences categories (BIO-AG, BIO-AS, BIOLS-AG, BIONLS-AG, ' +
      'OPHLS-AG, PBS, PBS-AS, PBS-HE, PBSS-AS, PHS-AS) or the mathematics and quantitative reasoning categories ' +
      '(MQR-AAP, MQR-AS, MQR-HE, SDS-AS, SMR-AS). Advanced placement credit cannot be applied; approved transfer ' +
      'credit may be.',
    source: SOURCE,
    checker: [
      (course: Course): boolean => hasDistributionCategory(course, SCIENCE_AND_MQR_CATEGORIES),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
    disallowTransferCredit: true,
  },
  {
    name: 'Qualification in Foreign Language',
    description:
      'Demonstrate qualification in one foreign language by: three courses in one foreign language in high ' +
      'school; advanced standing through the Cornell Advanced Standing Examination (CASE); a non-introductory ' +
      'foreign language course of 3 or more credits at the 2000 level or above; any other non-introductory 2000+ ' +
      'course conducted in a foreign language; or 11 credits of study in a single foreign language. Students ' +
      'fully competent in a language other than English are exempt.',
    source: SOURCE,
    fulfilledBy: 'self-check',
  },
  {
    name: 'Elective Plan',
    description:
      '24 credits forming a cross-disciplinary cluster of electives, planned with the faculty advisor.',
    source: SOURCE,
    fulfilledBy: 'self-check',
  },
  {
    name: 'Free Electives',
    description:
      '15-27 credits of free electives in any academic department on campus (or approved transfer credit), ' +
      'bringing the total to 120 academic credits. Up to nine credits may be taken S/U.',
    source: SOURCE,
    fulfilledBy: 'self-check',
  },
];

export default haudRequirements;

export const haudAdvisors: AdvisorGroup = {
  advisors: [
    { name: 'Michael Jefferson', email: 'mnj23@cornell.edu' },
    { name: 'Beth Demmings', email: 'emt32@cornell.edu' },
  ],
};

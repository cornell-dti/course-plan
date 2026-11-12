import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseIsFWS,
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const SOURCE = 'https://catalog.cornell.edu/programs/architecture-barch/';

/** Whether the course carries any distribution category with one of the given prefixes (e.g. "CA" matches "CA-AS", "CA-AAP"). */
const hasDistributionCategory = (course: Course, prefixes: readonly string[]): boolean =>
  (course.catalogDistr?.match(/[A-Z]+-[A-Z]+/g) ?? []).some(category =>
    prefixes.includes(category.split('-')[0])
  );

const MQR_CATEGORIES = ['MQR', 'MQL', 'SDS', 'SMR'];
const PBS_CATEGORIES = ['PBS', 'PBSS', 'BIO', 'BIOLS', 'BIONLS', 'OPHLS', 'PHS'];
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

const ART_STUDIO_COURSES = [
  'ART 1201',
  'ART 1501',
  'ART 1504',
  'ART 1601',
  'ART 1602',
  'ART 1901',
  'ART 2201',
  'ART 2301',
  'ART 2401',
  'ART 2501',
  'ART 2601',
  'ART 2701',
  'ART 3001',
  'ART 3011',
  'ART 3201',
  'ART 3202',
  'ART 3203',
  'ART 3205',
  'ART 3299',
  'ART 3301',
  'ART 3305',
  'ART 3307',
  'ART 3399',
  'ART 3404',
  'ART 3499',
  'ART 3501',
  'ART 3502',
  'ART 3503',
  'ART 3599',
  'ART 3699',
  'ART 3705',
  'ART 3707',
  'ART 3708',
  'ART 3799',
  'PMA 2701',
];

const archRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Design Studios',
    description:
      'Ten semesters of design studio: ARCH 1101, ARCH 1102, ARCH 2101, ARCH 2102, ARCH 3101, ARCH 3102, ' +
      'ARCH 4101, ARCH 4102, ARCH 5101, and ARCH 5902 (Design X Thesis).',
    source: SOURCE,
    checker: includesWithSubRequirements(
      ['ARCH 1101'],
      ['ARCH 1102'],
      ['ARCH 2101'],
      ['ARCH 2102'],
      ['ARCH 3101'],
      ['ARCH 3102'],
      ['ARCH 4101'],
      ['ARCH 4102'],
      ['ARCH 5101'],
      ['ARCH 5902']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    slotNames: [
      'ARCH 1101',
      'ARCH 1102',
      'ARCH 2101',
      'ARCH 2102',
      'ARCH 3101',
      'ARCH 3102',
      'ARCH 4101',
      'ARCH 4102',
      'ARCH 5101',
      'ARCH 5902',
    ],
  },
  {
    name: 'Structures, Environmental Systems, and Building Technology',
    description:
      'Structures: ARCH 1612 and ARCH 2613. Environmental systems: ARCH 1611 and ARCH 2616. ' +
      'Building technology: ARCH 2614 and ARCH 3615.',
    source: SOURCE,
    checker: includesWithSubRequirements(
      ['ARCH 1612'],
      ['ARCH 2613'],
      ['ARCH 1611'],
      ['ARCH 2616'],
      ['ARCH 2614'],
      ['ARCH 3615']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1],
    slotNames: ['ARCH 1612', 'ARCH 2613', 'ARCH 1611', 'ARCH 2616', 'ARCH 2614', 'ARCH 3615'],
  },
  {
    name: 'Analysis, History, and Representation',
    description:
      'Analysis: ARCH 2302 and ARCH 3302. History: ARCH 1801 and ARCH 2802. ' +
      'Architectural representation: ARCH 1501 and ARCH 2502.',
    source: SOURCE,
    checker: includesWithSubRequirements(
      ['ARCH 2302'],
      ['ARCH 3302'],
      ['ARCH 1801'],
      ['ARCH 2802'],
      ['ARCH 1501'],
      ['ARCH 2502']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1],
    slotNames: ['ARCH 2302', 'ARCH 3302', 'ARCH 1801', 'ARCH 2802', 'ARCH 1501', 'ARCH 2502'],
  },
  {
    name: 'Professional Practice and Pre-thesis Methods',
    description: 'ARCH 5201 (Professional Practice) and ARCH 5911 (Prethesis Methods Workshop).',
    source: SOURCE,
    checker: includesWithSubRequirements(['ARCH 5201'], ['ARCH 5911']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['ARCH 5201', 'ARCH 5911'],
  },
  {
    name: 'Diversity',
    description: 'AAP 1100 (The Worlds We Make), required of all AAP undergraduates.',
    source: SOURCE,
    checker: includesWithSingleRequirement('AAP 1100'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['AAP 1100'],
  },
  {
    name: 'History of Architecture Electives',
    description:
      'Two history electives chosen from ARCH courses offered under ARCH 3819 through ARCH 3823 ' +
      '(Special Topics in the History of Architecture and Urbanism). Must be taken for a letter grade. ' +
      'Students with an average of B+ or higher in ARCH 1801, ARCH 2802, and a 3000-level history elective may ' +
      'substitute a 6000-level history elective for the second 3000-level course with permission of the instructor.',
    source: SOURCE,
    checker: includesWithSingleRequirement(
      'ARCH 3819',
      'ARCH 3820',
      'ARCH 3821',
      'ARCH 3822',
      'ARCH 3823'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Architectural Theory Elective',
    description:
      'One theory elective: any ARCH course offered under ARCH 3308 (Special Topics in the Theory of Architecture) ' +
      'or ARCH 4300 (Architectural Publications). Must be taken for a letter grade.',
    source: SOURCE,
    checker: includesWithSingleRequirement('ARCH 3308', 'ARCH 4300'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Building Technology Elective',
    description:
      'One building technology elective: ARCH 4601 (Ecological Literacy and Design) or any ARCH course offered ' +
      'under ARCH 4605 through ARCH 4619 (Special Topics in Building Technology). Must be taken for a letter grade.',
    source: SOURCE,
    checker: includesWithSingleRequirement(
      'ARCH 4601',
      'ARCH 4605',
      'ARCH 4609',
      'ARCH 4613',
      'ARCH 4618',
      'ARCH 4619'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Free Departmental Electives',
    description:
      'A minimum of 9 credits from any academic course under the ARCH subject code, in addition to the required ' +
      'history, theory, and building technology electives. May be taken for a letter or S/U grade and may be of any ' +
      'credit amount. ARCH 1901 may not count; ARCH 5203 can only count once.',
    source: SOURCE,
    checker: [
      (course: Course): boolean =>
        courseMatchesCodeOptions(course, ['ARCH ****']) &&
        !courseMatchesCodeOptions(course, ['ARCH 1901']),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [9],
  },
  {
    name: 'Art Studio',
    description:
      'One studio art course: ART 1201, ART 1501, ART 1504, ART 1601, ART 1602, ART 1901, or any class with the ' +
      'ART-STU attribute. Must be taken for a letter grade.',
    source: SOURCE,
    checker: includesWithSingleRequirement(...ART_STUDIO_COURSES),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Free In-College Electives',
    description:
      'A minimum of 12 in-college credits (counting the required Art studio) from courses under the AAP, ARCH, ' +
      'ART, CRP, DESIGN, and REAL subject codes; this slot tracks the 8 or more credits beyond the Art studio. ' +
      'May be taken for a letter or S/U grade.',
    source: SOURCE,
    checker: includesWithSingleRequirement(
      'AAP ****',
      'ARCH ****',
      'ART ****',
      'CRP ****',
      'DESIGN ****',
      'REAL ****'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [8],
  },
  {
    name: 'First-Year Writing Seminar',
    description:
      'Any approved writing class totaling 3 credits by the end of the first year: all First-Year Writing ' +
      'Seminars (FWS) and ENGL 2880 (Expository Writing).',
    source: SOURCE,
    checker: [
      (course: Course): boolean =>
        courseIsFWS(course) || courseMatchesCodeOptions(course, ['ENGL 2880']),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Mathematics and Quantitative Reasoning',
    description: 'One approved MQR, MQL, SDS, or SMR course.',
    source: SOURCE,
    checker: [(course: Course): boolean => hasDistributionCategory(course, MQR_CATEGORIES)],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Additional Mathematics and Quantitative Reasoning or Physical and Biological Sciences',
    description:
      'One approved physical or biological sciences class or an additional mathematics and quantitative ' +
      'reasoning course (MQR, MQL, SDS, SMR, OPHLS, PBS, BIO, PHS).',
    source: SOURCE,
    checker: [
      (course: Course): boolean =>
        hasDistributionCategory(course, [...MQR_CATEGORIES, ...PBS_CATEGORIES]),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Humanities',
    description:
      'One approved humanities course designated CA, FL, HA, KCM, LA, SBA, ALC, ETM, GLC, HST, SCD, or SSC. ' +
      'ART 3803, CRP 1103, CRP 1104, and any additional approved art studio course of 3 or more credits also apply.',
    source: SOURCE,
    checker: [
      (course: Course): boolean =>
        hasDistributionCategory(course, HUMANITIES_CATEGORIES) ||
        courseMatchesCodeOptions(course, ['ART 3803', 'CRP 1103', 'CRP 1104']),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'University Free Electives',
    description:
      'Counting the writing, MQR, humanities, and additional MQR/science courses, B.Arch. students must complete ' +
      'a minimum of 15 total out-of-college credits. Any additional elective(s) needed must be offered by a college ' +
      'outside of AAP and may be taken for a letter or S/U grade; test credit may apply.',
    source: SOURCE,
    fulfilledBy: 'self-check',
  },
];

export default archRequirements;

export const archAdvisors: AdvisorGroup = {
  advisors: [
    { name: 'Michael Jefferson', email: 'mnj23@cornell.edu' },
    { name: 'Beth Demmings', email: 'emt32@cornell.edu' },
  ],
};

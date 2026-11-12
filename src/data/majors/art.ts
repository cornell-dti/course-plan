import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseIsFWS,
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const SOURCE = 'https://catalog.cornell.edu/programs/art-bfa/';

/** Classes with the ART-STU attribute at the 2000 level (catalog "Art Studio Courses (ART-STU)" list). */
const STUDIOS_2000 = [
  'ART 2201',
  'ART 2301',
  'ART 2401',
  'ART 2501',
  'ART 2601',
  'ART 2701',
  'PMA 2701',
];

/** Classes with the ART-STU attribute at the 3000 level (ART 3006 is listed separately as Advanced Practice). */
const STUDIOS_3000 = [
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
];

const THEORY_AND_CRITICISM_ELECTIVES = [
  'AMST 2000',
  'AMST 2160',
  'ANTHR 3420',
  'ARCH 3397',
  'ARCH 3308',
  'ARCH 5402',
  'ART 3102',
  'ART 3104',
  'ART 3105',
  'ARTH 2000',
  'ARTH 3600',
  'ARTH 4151',
  'ARTH 4310',
  'ARTH 4695',
  'ARTH 4720',
  'ARTH 4852',
  'ARTH 5993',
  'ARTH 5994',
  'ASIAN 4442',
  'COML 2000',
  'ENGL 2160',
  'FGSS 2010',
  'FGSS 2160',
  'FGSS 4835',
  'JWST 4310',
  'MEDVL 4310',
  'NES 4700',
  'PMA 2540',
  'PMA 2660',
  'PMA 3104',
  'PMA 3105',
  'PMA 3550',
  'PMA 4835',
  'RELST 3420',
  'RELST 4310',
  'SPAN 4570',
  'STS 4511',
  'VISST 2000',
  'VISST 2160',
  'VISST 2174',
  'VISST 3175',
  'VISST 3600',
  'VISST 4151',
  'VISST 4835',
  'VISST 4852',
];

const MODERN_CONTEMPORARY_ART_HISTORY = [
  'AMST 2000',
  'AMST 2760',
  'ART 3803',
  'ARTH 1100',
  'ARTH 2000',
  'ARTH 2600',
  'ARTH 2750',
  'ARTH 3550',
  'ARTH 3600',
  'ARTH 3650',
  'ARTH 3651',
  'ARTH 4151',
  'ARTH 4153',
  'ARTH 4510',
  'ARTH 4545',
  'ARTH 4625',
  'ARTH 4695',
  'ARTH 4816',
  'ARTH 4844',
  'ASIAN 4473',
  'COML 2000',
  'ENGL 2761',
  'INFO 3660',
  'PMA 2560',
  'PMA 3550',
  'SHUM 4916',
  'VISST 2300',
  'VISST 3600',
  'VISST 3650',
  'VISST 4151',
];

const GLOBAL_UNDERREPRESENTED_ART_HISTORY = [
  'ARKEO 2800',
  'ARKEO 3566',
  'ART 3804',
  'ARTH 2255',
  'ARTH 2550',
  'ARTH 2800',
  'ARTH 2805',
  'ARTH 3250',
  'ARTH 3565',
  'ARTH 3566',
  'ARTH 3651',
  'ARTH 3803',
  'ARTH 3820',
  'ARTH 3850',
  'ARTH 4153',
  'ARTH 4155',
  'ARTH 4556',
  'ARTH 4695',
  'ARTH 4816',
  'ARTH 4852',
  'ARTH 4855',
  'ASIAN 2252',
  'ASIAN 2285',
  'ASIAN 2288',
  'ASIAN 3350',
  'ASIAN 3381',
  'ASIAN 4442',
  'ASIAN 4487',
  'LATA 3566',
  'PMA 2452',
  'PMA 3550',
  'PMA 3750',
  'VISST 2805',
  'VISST 3566',
  'VISST 3696',
  'VISST 4852',
  'VISST 4855',
];

/** Catalog prose: "ART 3803 (Cornell in Rome) or an approved art history/visual studies elective". */
const ART_HISTORY_VISUAL_STUDIES_ELECTIVES = [
  'ART 3803',
  'ARTH 3***',
  'ARTH 4***',
  'ARTH 5***',
  'ARTH 6***',
  'AMST 2000',
  'ARCH 3819',
  'ARCH 3820',
  'ARCH 3823',
  'ARKEO 2700',
  'ART 3105',
  'ARTH 2000',
  'ARTH 2200',
  'ARTH 2355',
  'ARTH 2400',
  'ARTH 2500',
  'COGST 3420',
  'COML 2000',
  'PMA 3105',
  'PSYCH 3420',
  'VISST 2645',
  'VISST 3342',
];

const artRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory 2000-Level Studios',
    description:
      'ART 2501 (first fall semester) plus three additional 2000-level art studios (ART-STU) by the end of the ' +
      'third semester. Art studios must be taken for four credits and a letter grade.',
    source: SOURCE,
    checker: includesWithSubRequirements(['ART 2501'], STUDIOS_2000),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 3],
    slotNames: ['ART 2501', '2000-level Studio'],
  },
  {
    name: 'Advanced 3000-Level Studios',
    description:
      'Four 3000-level art studios (ART-STU) in addition to ART 3006. Art studios must be taken for four credits ' +
      'and a letter grade. Completing all four is a prerequisite for ART 4004.',
    source: SOURCE,
    checker: includesWithSingleRequirement(...STUDIOS_3000),
    fulfilledBy: 'courses',
    perSlotMinCount: [4],
    slotNames: ['3000-level Studio'],
  },
  {
    name: 'Elective Studios',
    description:
      'Two additional art studios (ART-STU) at the 2000 and/or 3000 level, taken for four credits and a letter grade.',
    source: SOURCE,
    checker: includesWithSingleRequirement(...STUDIOS_2000, ...STUDIOS_3000),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Studio'],
  },
  {
    name: 'Advanced Practice',
    description:
      'ART 3006, taken in the spring of the third year. ART 3006 is a prerequisite for ART 4003.',
    source: SOURCE,
    checker: includesWithSingleRequirement('ART 3006'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['ART 3006'],
  },
  {
    name: 'Thesis',
    description:
      'ART 4003 and ART 4004 in the final year of study. ART 3006 must be completed before ART 4003, and all ' +
      'other studio requirements before ART 4004.',
    source: SOURCE,
    checker: includesWithSubRequirements(['ART 4003'], ['ART 4004']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['ART 4003', 'ART 4004'],
  },
  {
    name: 'Theory and Criticism',
    description:
      'ART 2103 (first spring semester), ART 4100 (final fall semester), and one approved theory and criticism ' +
      'elective such as ART 3102 (Cornell in Rome), for a minimum of 11 credits. ART 2103 and ART 4100 cannot be ' +
      'fulfilled with transfer credit. Other courses may be applied by petition.',
    source: SOURCE,
    checker: includesWithSubRequirements(
      ['ART 2103'],
      ['ART 4100'],
      THEORY_AND_CRITICISM_ELECTIVES
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['ART 2103', 'ART 4100', 'Theory and Criticism Elective'],
  },
  {
    name: 'Art History and Visual Studies',
    description:
      'Three classes for a minimum of 9 credits: one approved modern/contemporary art history course (or ART 3803 ' +
      'in Rome), one approved global/underrepresented art history course, and one additional approved art ' +
      'history/visual studies elective (any ARTH course at the 3000 level or above, or an approved elective). ' +
      'Other courses may be applied by petition.',
    source: SOURCE,
    checker: includesWithSubRequirements(
      MODERN_CONTEMPORARY_ART_HISTORY,
      GLOBAL_UNDERREPRESENTED_ART_HISTORY,
      ART_HISTORY_VISUAL_STUDIES_ELECTIVES
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['Modern/Contemporary', 'Global/Underrepresented', 'Art History Elective'],
  },
  {
    name: 'Diversity and Inclusion',
    description: 'AAP 1100 (The Worlds We Make) in the first fall semester of study.',
    source: SOURCE,
    checker: includesWithSingleRequirement('AAP 1100'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['AAP 1100'],
  },
  {
    name: 'Writing',
    description:
      'Two approved writing classes totaling 6 credits by the end of the second year and before off-campus study: ' +
      'any First-Year Writing Seminar (FWS) or ENGL 2880 (Expository Writing). Advanced placement credit may ' +
      'count toward at most one writing class.',
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
    name: 'Elective Curricular Plan',
    description:
      '34-37 credits of electives forming a cross-disciplinary cluster developed with the faculty advisor. ' +
      'Up to nine credits of electives may be taken S/U.',
    source: SOURCE,
    fulfilledBy: 'self-check',
  },
];

export default artRequirements;

export const artAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Keith Obadike', email: 'kao83@cornell.edu' }],
};

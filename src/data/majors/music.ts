import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import {
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

/** MUSIC 1100 and MUSIC 1199 do not count toward the major. */
const NON_MAJOR_MUSIC_NUMBERS: readonly string[] = ['1100', '1199'];

/** History and Culture (MUSIC-HC) courses. MUSIC 2201 is excluded because it is a required core course. */
const historyAndCulture = [
  'AMST 1312',
  'AMST 1332',
  'AMST 2006',
  'AMST 2105',
  'AMST 2232',
  'AMST 2260',
  'AMST 2340',
  'AMST 2371',
  'AMST 2372',
  'AMST 3322',
  'ANTHR 2352',
  'ANTHR 3318',
  'ANTHR 4139',
  'ASIAN 2245',
  'ASIAN 2259',
  'ASRC 1932',
  'ASRC 2260',
  'ASRC 2370',
  'ASRC 2528',
  'ASRC 3322',
  'ASRC 4258',
  'COGST 1212',
  'COML 2006',
  'COML 2703',
  'COML 3327',
  'ENGL 2150',
  'ENGL 2703',
  'ENGL 2906',
  'FGSS 2232',
  'FGSS 2352',
  'FGSS 2372',
  'FGSS 3316',
  'FGSS 3318',
  'FGSS 3322',
  'GERST 2703',
  'LATA 2361',
  'LGBT 2232',
  'LGBT 3318',
  'MUSIC 1205',
  'MUSIC 1212',
  'MUSIC 1213',
  'MUSIC 1312',
  'MUSIC 1332',
  'MUSIC 1343',
  'MUSIC 1701',
  'MUSIC 2006',
  'MUSIC 2140',
  'MUSIC 2221',
  'MUSIC 2232',
  'MUSIC 2244',
  'MUSIC 2250',
  'MUSIC 2260',
  'MUSIC 2290',
  'MUSIC 2311',
  'MUSIC 2330',
  'MUSIC 2340',
  'MUSIC 2341',
  'MUSIC 2352',
  'MUSIC 2361',
  'MUSIC 2370',
  'MUSIC 2372',
  'MUSIC 2528',
  'MUSIC 2701',
  'MUSIC 2703',
  'MUSIC 3316',
  'MUSIC 3318',
  'MUSIC 3322',
  'MUSIC 3327',
  'MUSIC 3331',
  'MUSIC 3370',
  'MUSIC 4181',
  'MUSIC 4233',
  'MUSIC 4239',
  'MUSIC 4252',
  'MUSIC 4258',
  'MUSIC 4313',
  'MUSIC 4341',
  'MUSIC 4355',
  'MUSIC 4667',
  'PMA 2650',
  'PMA 2703',
  'PMA 3418',
  'PSYCH 4180',
  'RELST 3322',
  'SHUM 2006',
  'SHUM 2244',
  'SHUM 2260',
  'SHUM 2352',
  'SHUM 2528',
  'SHUM 2701',
  'SHUM 2703',
  'SHUM 3370',
  'SHUM 4233',
  'SHUM 4252',
  'SHUM 4258',
  'SHUM 4639',
  'SHUM 4667',
  'STS 4667',
  'VISST 2744',
];

/**
 * Materials and Techniques (MUSIC-MT) courses. MUSIC 1101 is excluded because it is a required core course,
 * and MUSIC 1199 is excluded because it does not count toward the major requirements.
 */
const materialsAndTechniques = [
  'ASRC 2380',
  'CS 1610',
  'ENGRI 1610',
  'MUSIC 1105',
  'MUSIC 1106',
  'MUSIC 1421',
  'MUSIC 1465',
  'MUSIC 1466',
  'MUSIC 2101',
  'MUSIC 2102',
  'MUSIC 2111',
  'MUSIC 2112',
  'MUSIC 2130',
  'MUSIC 2380',
  'MUSIC 2421',
  'MUSIC 2440',
  'MUSIC 2441',
  'MUSIC 3111',
  'MUSIC 3112',
  'MUSIC 3122',
  'MUSIC 3141',
  'MUSIC 3142',
  'MUSIC 3423',
  'MUSIC 3431',
  'MUSIC 4121',
  'MUSIC 4124',
  'MUSIC 4410',
  'MUSIC 4412',
  'PHYS 1204',
  'PMA 2380',
  'PMA 3680',
  'PSYCH 1650',
];

/** Performance and Lessons (MUSIC-PL) courses. */
const performanceAndLessons = [
  'AMST 3617',
  'LATA 3613',
  'MUSIC 3511',
  'MUSIC 3513',
  'MUSIC 3514',
  'MUSIC 3602',
  'MUSIC 3603',
  'MUSIC 3604',
  'MUSIC 3610',
  'MUSIC 3613',
  'MUSIC 3615',
  'MUSIC 3616',
  'MUSIC 3621',
  'MUSIC 3631',
  'MUSIC 3634',
  'MUSIC 3660',
  'MUSIC 3701',
  'MUSIC 3902',
  'MUSIC 4501',
  'MUSIC 4615',
  'MUSIC 4616',
  'MUSIC 4621',
  'MUSIC 4631',
  'MUSIC 4633',
  'MUSIC 4641',
  'MUSIC 4651',
];

/** Keeps only the codes whose catalog number is at or above the given thousands level. */
const atLeastLevel = (codes: readonly string[], level: number): string[] =>
  codes.filter(code => Number(code.split(' ')[1][0]) >= level);

const electives = [...historyAndCulture, ...materialsAndTechniques];

const musicRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Required Courses',
    description:
      'MUSIC 1101: Elements of Music and MUSIC 2201: Introduction to Music Studies. ' +
      'Majors are expected to meet all curriculum requirements with a grade of C- or better (or S if offered S/U).',
    source: 'https://catalog.cornell.edu/programs/music-ba/',
    checker: includesWithSubRequirements(['MUSIC 1101'], ['MUSIC 2201']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['MUSIC 1101', 'MUSIC 2201'],
  },
  {
    name: 'Performance and Lessons',
    description:
      'Two semesters of Performance and Lessons (MUSIC-PL) courses. One must involve collaborative music making; ' +
      'the other may be private lessons or other approved music-related performance experiences such as dance, DJing, ' +
      'or participation in a student ensemble approved for this purpose by your major advisor and a member of the performance faculty.',
    source: 'https://catalog.cornell.edu/programs/music-ba/',
    checker: includesWithSingleRequirement(...performanceAndLessons),
    checkerWarning:
      'We do not check that one of the two semesters involves collaborative music making, or that other performance experiences were approved.',
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Electives',
    description:
      'A minimum of seven elective courses chosen in consultation with your music major faculty advisor: ' +
      'two electives at any level, one of which must be a Materials and Techniques (MUSIC-MT) course; ' +
      'three electives at the 2000-level or higher, including at least one MUSIC-MT course and at least one History and Culture (MUSIC-HC) course; ' +
      'and two electives at the 3000-level or higher, one of which must be a MUSIC-HC course and one of which may be either MUSIC-HC or MUSIC-MT. ' +
      'Students are strongly encouraged to explore at least two musical traditions. ' +
      'With advisor permission, at most two electives may be satisfied by MUSIC-PL courses taken for a grade (one collaborative and one individual instruction); ' +
      'no MUSIC-PL course may satisfy two 3000-level or higher electives. MUSIC 1100 and MUSIC 1199 do not count toward the major.',
    source: 'https://catalog.cornell.edu/programs/music-ba/',
    // Courses are assigned to the first unfilled slot they match, so the most restrictive slots come
    // first; otherwise a 3000-level MUSIC-HC course would be consumed by an any-level slot.
    checker: includesWithSubRequirements(
      atLeastLevel(historyAndCulture, 3),
      atLeastLevel(electives, 3),
      atLeastLevel(materialsAndTechniques, 2),
      atLeastLevel(historyAndCulture, 2),
      atLeastLevel(electives, 2),
      materialsAndTechniques,
      electives
    ),
    checkerWarning:
      'We do not check MUSIC-PL courses used as electives with advisor permission; add those to your plan and confirm with your advisor.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1],
    slotNames: [
      'MUSIC-HC (3000+)',
      'MUSIC-HC or MUSIC-MT (3000+)',
      'MUSIC-MT (2000+)',
      'MUSIC-HC (2000+)',
      'MUSIC-HC or MUSIC-MT (2000+)',
      'MUSIC-MT (any level)',
      'MUSIC-HC or MUSIC-MT (any level)',
    ],
  },
  {
    name: 'Minimum Credits',
    description: 'The minimum number of credits needed for the music major is 32.',
    source: 'https://catalog.cornell.edu/programs/music-ba/',
    checker: [
      (course: Course): boolean =>
        (course.subject === 'MUSIC' && !NON_MAJOR_MUSIC_NUMBERS.includes(course.catalogNbr)) ||
        courseMatchesCodeOptions(course, [
          ...historyAndCulture,
          ...materialsAndTechniques,
          ...performanceAndLessons,
        ]),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [32],
    allowCourseDoubleCounting: true,
  },
];

export default musicRequirements;

export const musicAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Xak Bjerken', email: 'xb10@cornell.edu' }],
};

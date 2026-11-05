import {
  courseMatchesCodeOptions,
  courseMeetsCreditMinimum,
  includesWithSingleRequirement,
} from '../../requirements/checkers';
import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import { AdvisorGroup } from '../../tools/advisors/types';

/** List of Materials and Technique Music courses as defined in the Cornell course roster */
const mtCourses = [
  'MUSIC 1100',
  'MUSIC 1101',
  'MUSIC 1105',
  'MUSIC 1106',
  'MUSIC 1199',
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
  'MUSIC 3115',
  'MUSIC 3121',
  'MUSIC 3122',
  'MUSIC 3140',
  'MUSIC 3141',
  'MUSIC 3142',
  'MUSIC 3152',
  'MUSIC 3423',
  'MUSIC 3424',
  'MUSIC 3431',
  'MUSIC 4112',
  'MUSIC 4121',
  'MUSIC 4124',
  'MUSIC 4410',
  'MUSIC 4412',
  'MUSIC 4421',
  'MUSIC 4440',
  'MUSIC 4442',
];

/** List of History and Culture Music courses as defined in the Cornell course roster */
const hcCourses = [
  'MUSIC 1202',
  'MUSIC 1205',
  'MUSIC 1212',
  'MUSIC 1213',
  'MUSIC 1312',
  'MUSIC 1313',
  'MUSIC 1332',
  'MUSIC 1343',
  'MUSIC 2006',
  'MUSIC 2140',
  'MUSIC 2201',
  'MUSIC 2221',
  'MUSIC 2232',
  'MUSIC 2241',
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
  'MUSIC 3212',
  'MUSIC 3242',
  'MUSIC 3302',
  'MUSIC 3305',
  'MUSIC 3313',
  'MUSIC 3316',
  'MUSIC 3318',
  'MUSIC 3322',
  'MUSIC 3324',
  'MUSIC 3325',
  'MUSIC 3327',
  'MUSIC 3331',
  'MUSIC 3370',
  'MUSIC 3480',
  'MUSIC 3490',
  'MUSIC 4233',
  'MUSIC 4252',
  'MUSIC 4258',
  'MUSIC 4270',
  'MUSIC 4313',
  'MUSIC 4331',
  'MUSIC 4332',
  'MUSIC 4341',
  'MUSIC 4345',
  'MUSIC 4355',
  'MUSIC 4454',
  'MUSIC 4667',
];

/** List of Performance and Lessons Music courses as defined in the Cornell course roster */
const plCourses = [
  'MUSIC 3511',
  'MUSIC 3512',
  'MUSIC 3513',
  'MUSIC 3514',
  'MUSIC 3602',
  'MUSIC 3603',
  'MUSIC 3604',
  'MUSIC 3609',
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
  'MUSIC 4601',
  'MUSIC 4615',
  'MUSIC 4616',
  'MUSIC 4621',
  'MUSIC 4631',
  'MUSIC 4633',
  'MUSIC 4641',
  'MUSIC 4651',
];

/** List of all music courses */
const allMusicCourses = [...mtCourses, ...hcCourses, ...plCourses];

const musicMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Materials and Techniques (M&T)',
    description: 'At least one three to four credit course.',
    source: 'https://music.cornell.edu/minor',
    checker: [
      (course: Course): boolean =>
        courseMatchesCodeOptions(course, mtCourses) && courseMeetsCreditMinimum(course, 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Add M&T Course'],
  },
  {
    name: 'History and Culture (H&C)',
    description: 'At least one three credit course.',
    source: 'https://music.cornell.edu/minor',
    checker: [
      (course: Course): boolean =>
        courseMatchesCodeOptions(course, hcCourses) &&
        course.enrollGroups.some(group => group.unitsMinimum === 3 && group.unitsMaximum === 3),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Add H&C Course'],
  },
  // TODO: Doesn't check for courses that involve collaborative music making
  {
    name: 'Performance and Lessons (P&L)',
    description:
      'At least three credits of courses, of which at least one credit must involve collaborative music making.',
    source: 'https://music.cornell.edu/minor',
    checker: includesWithSingleRequirement(...plCourses),
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
    checkerWarning: 'We do not check whether a course involves collaborative music making',
  },
  /* TODO: Does not check whether 5 credits were maximized by P&L courses or, if more than 4 credits of P&L were fufilled, does not check if two of those courses 
  involved collaborative music making
  */
  {
    name: 'Electives',
    description:
      'Eight credits from any other Materials and Techniques (MT), History and Culture (HC), or Performance and Lessons (PL) courses. A maximum of five of these credits may be earned from PL courses; if more than four credits are to be counted, at least two must involve collaborative music making.',
    source: 'https://music.cornell.edu/minor',
    checker: includesWithSingleRequirement(...allMusicCourses),
    fulfilledBy: 'credits',
    perSlotMinCount: [8],
    checkerWarning:
      'A maximum of five credits can be earned from P&L courses; if more than four credits are counted at least two must ' +
      'involve collaborative music making',
  },
];

export default musicMinorRequirements;

export const musicMinorAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Xak Bjerken', email: 'xb10@cornell.edu' }],
};

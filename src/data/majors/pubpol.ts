import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseHasAttribute,
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const isPubpolElective = (course: Course): boolean =>
  courseMatchesCodeOptions(course, ['PUBPOL 2***', 'PUBPOL 3***', 'PUBPOL 4***']) &&
  !courseMatchesCodeOptions(course, ['PUBPOL 4030', 'PUBPOL 4980', 'PUBPOL 4990']);

const pubpolRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Program Prerequisites',
    description:
      'PUBPOL 2301 (Introduction to Public Policy); ECON 1110 (or AP Microeconomics score of 5 / IB HL Economics score of 7); ' +
      'one of GOVT 1111, GOVT 1313, GOVT 1817; one of PUBPOL 2250 or SOC 1101; ' +
      'and one statistics course from ECON 3110, ECON 3130, PUBPOL 2101, or SOC 3010.',
    source: 'https://catalog.cornell.edu/programs/public-policy-ba/',
    checker: includesWithSubRequirements(
      ['PUBPOL 2301'],
      ['ECON 1110'],
      ['GOVT 1111', 'GOVT 1313', 'GOVT 1817'],
      ['PUBPOL 2250', 'SOC 1101'],
      ['ECON 3110', 'ECON 3130', 'PUBPOL 2101', 'SOC 3010']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
    slotNames: [
      'PUBPOL 2301',
      'Introductory Microeconomics',
      'Introductory Government',
      'Introductory Sociology',
      'Statistics',
    ],
  },
  {
    name: 'Public Policy Core Courses',
    description:
      'PUBPOL 2000 or ECON 3030; PUBPOL 2030; PUBPOL 2040; PUBPOL 2370; PUBPOL 2830; and PUBPOL 3100.',
    source: 'https://catalog.cornell.edu/programs/public-policy-ba/',
    checker: includesWithSubRequirements(
      ['PUBPOL 2000', 'ECON 3030'],
      ['PUBPOL 2030'],
      ['PUBPOL 2040'],
      ['PUBPOL 2370'],
      ['PUBPOL 2830'],
      ['PUBPOL 3100']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1],
    slotNames: [
      'PUBPOL 2000 or ECON 3030',
      'PUBPOL 2030',
      'PUBPOL 2040',
      'PUBPOL 2370',
      'PUBPOL 2830',
      'PUBPOL 3100',
    ],
  },
  {
    name: 'Global and Comparative Policy',
    description: 'Select two of PUBPOL 2320, PUBPOL 2857, and PUBPOL 3583.',
    source: 'https://catalog.cornell.edu/programs/public-policy-ba/',
    checker: includesWithSingleRequirement('PUBPOL 2320', 'PUBPOL 2857', 'PUBPOL 3583'),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Engaged Learning',
    description:
      'Take at least 3 credits of PUBPOL coursework that has the CU-CEL attribute. ' +
      'The Engaged Learning Requirement may overlap with another major requirement.',
    source: 'https://catalog.cornell.edu/programs/public-policy-ba/',
    checker: [
      (course: Course): boolean =>
        courseMatchesCodeOptions(course, ['PUBPOL ****']) && courseHasAttribute(course, 'CU-CEL'),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Public Policy Electives',
    description:
      'Take 22 credits of PUBPOL courses at the 2000, 3000, or 4000 level. No more than 8 credits of electives may be completed abroad per semester. ' +
      'A maximum of 3 credits of special studies coursework (PUBPOL 4000, PUBPOL 4010, PUBPOL 4020) can count. ' +
      'PUBPOL 4030, PUBPOL 4980, and PUBPOL 4990 may not be used.',
    source: 'https://catalog.cornell.edu/programs/public-policy-ba/',
    checker: [isPubpolElective],
    checkerWarning:
      'We do not check the 3-credit cap on special studies coursework or the limit on credits taken abroad.',
    fulfilledBy: 'credits',
    perSlotMinCount: [22],
  },
  {
    name: 'Grade Requirement',
    description:
      'Students must receive a C- or better in all major requirements. S/U grades may not be used for any major requirement unless it is ' +
      'the only grading option, in which case a grade of SX must be received. Each course may only meet one major requirement unless otherwise stated.',
    source: 'https://catalog.cornell.edu/programs/public-policy-ba/',
    fulfilledBy: 'self-check',
  },
];

export default pubpolRequirements;

export const pubpolAdvisors: AdvisorGroup = {
  advisors: [],
};

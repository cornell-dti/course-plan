import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseHasAttribute,
  courseMatchesCodeOptions,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const healthPolicyElectiveCourses = [
  'AMST 3230',
  'AMST 3261',
  'ECON 3711',
  'ECON 3720',
  'ECON 3910',
  'FGSS 3260',
  'GDEV 3280',
  'GOVT 3251',
  'NS 4570',
  'PUBPOL 2050',
  'PUBPOL 3011',
  'PUBPOL 3110',
  'PUBPOL 3180',
  'PUBPOL 3230',
  'PUBPOL 3260',
  'PUBPOL 3280',
  'PUBPOL 3320',
  'PUBPOL 3490',
  'PUBPOL 3650',
  'PUBPOL 3720',
  'PUBPOL 3780',
  'PUBPOL 4281',
  'PUBPOL 4370',
  'SOC 3180',
  'SOC 3230',
];

const preMedElectiveCourses = [
  'BIOG 1440',
  'BIOG 1445',
  'BIOG 1500',
  'BIOMG 1350',
  'BIOMG 3300',
  'BIOMG 3310',
  'BIOMG 3320',
  'BIOMG 3350',
  'BIOMI 2900',
  'CHEM 2070',
  'CHEM 2071',
  'CHEM 2080',
  'CHEM 2081',
  'CHEM 3530',
  'CHEM 3570',
  'CHEM 3580',
  'NS 3200',
  'PHYS 2207',
  'PHYS 2208',
];

const isHealthPolicyElective = (course: Course): boolean =>
  courseHasAttribute(course, 'HCP-EL') ||
  courseMatchesCodeOptions(course, healthPolicyElectiveCourses);

const isPubpolElective = (course: Course): boolean =>
  courseMatchesCodeOptions(course, ['PUBPOL 2***', 'PUBPOL 3***', 'PUBPOL 4***']) &&
  !courseMatchesCodeOptions(course, ['PUBPOL 4030', 'PUBPOL 4980', 'PUBPOL 4990']);

const hcpRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Public Policy Core Courses',
    description:
      'PUBPOL 1111, PUBPOL 2000 (or ECON 3030), PUBPOL 2101, PUBPOL 2301, PUBPOL 2350, PUBPOL 2370, PUBPOL 2830, and PUBPOL 3100.',
    source: 'https://catalog.cornell.edu/programs/health-care-policy-major-bs/',
    checker: includesWithSubRequirements(
      ['PUBPOL 1111'],
      ['PUBPOL 2000', 'ECON 3030'],
      ['PUBPOL 2101'],
      ['PUBPOL 2301'],
      ['PUBPOL 2350'],
      ['PUBPOL 2370'],
      ['PUBPOL 2830'],
      ['PUBPOL 3100']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1],
    slotNames: [
      'PUBPOL 1111',
      'PUBPOL 2000 or ECON 3030',
      'PUBPOL 2101',
      'PUBPOL 2301',
      'PUBPOL 2350',
      'PUBPOL 2370',
      'PUBPOL 2830',
      'PUBPOL 3100',
    ],
  },
  {
    name: 'Demography',
    description:
      'PUBPOL 2030 (Population and Public Policy) or PUBPOL 3280 (Fundamentals of Population Health).',
    source: 'https://catalog.cornell.edu/programs/health-care-policy-major-bs/',
    checker: includesWithSingleRequirement('PUBPOL 2030', 'PUBPOL 3280'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Introductory Microeconomics',
    description:
      'ECON 1110, or a score of 5 on the AP Microeconomics exam, or a score of 7 on the IB HL Economics exam.',
    source: 'https://catalog.cornell.edu/programs/health-care-policy-major-bs/',
    checker: includesWithSingleRequirement('ECON 1110'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Introduction to Sociology',
    description:
      'PUBPOL 2250 (Social Problems in the United States) or SOC 1101 (Introduction to Sociology).',
    source: 'https://catalog.cornell.edu/programs/health-care-policy-major-bs/',
    checker: includesWithSingleRequirement('PUBPOL 2250', 'SOC 1101'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Engaged Learning',
    description:
      'Take at least 3 credits of PUBPOL coursework that has the CU-CEL attribute. ' +
      'The Engaged Learning Requirement may overlap with another major requirement.',
    source: 'https://catalog.cornell.edu/programs/health-care-policy-major-bs/',
    checker: [
      (course: Course): boolean =>
        courseMatchesCodeOptions(course, ['PUBPOL ****']) && courseHasAttribute(course, 'CU-CEL'),
    ],
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Health Care and Health Policy Electives',
    description:
      'Select at least 12 credits of coursework with the HCP-EL attribute (e.g. PUBPOL 2050, PUBPOL 3110, PUBPOL 3180, PUBPOL 3280, ' +
      'PUBPOL 3320, PUBPOL 3780, PUBPOL 4370, and their cross-listings).',
    source: 'https://catalog.cornell.edu/programs/health-care-policy-major-bs/',
    checker: [isHealthPolicyElective],
    fulfilledBy: 'credits',
    perSlotMinCount: [12],
  },
  {
    name: 'Public Policy Electives',
    description:
      'Select at least 9 credits of 2000, 3000, or 4000 level PUBPOL coursework. PUBPOL 4030, PUBPOL 4980, and PUBPOL 4990 may not be used.',
    source: 'https://catalog.cornell.edu/programs/health-care-policy-major-bs/',
    checker: [isPubpolElective],
    fulfilledBy: 'credits',
    perSlotMinCount: [9],
  },
  {
    name: 'Additional Health and Policy Electives',
    description:
      'The remaining 14 credits of electives (35 total Health and Policy elective credits) can be from any Health and Policy elective category: ' +
      'Health Care and Health Policy electives, Public Policy electives (2000-4000 level PUBPOL), or Pre-Med electives (BIOG 1440, BIOG 1445, ' +
      'BIOG 1500, BIOMG 1350, BIOMG 3300, BIOMG 3310, BIOMG 3320, BIOMG 3350, BIOMI 2900, CHEM 2070, CHEM 2071, CHEM 2080, CHEM 2081, ' +
      'CHEM 3530, CHEM 3570, CHEM 3580, NS 3200, PHYS 2207, PHYS 2208). A maximum of 3 credits of special studies coursework ' +
      '(PUBPOL 4000, PUBPOL 4010, PUBPOL 4020) can count. Only one course within a forbidden overlap may be completed. ' +
      'No more than 8 credits of Health and Policy or Public Policy electives combined may be taken abroad in place of PUBPOL coursework.',
    source: 'https://catalog.cornell.edu/programs/health-care-policy-major-bs/',
    checker: [
      (course: Course): boolean =>
        isHealthPolicyElective(course) ||
        isPubpolElective(course) ||
        courseMatchesCodeOptions(course, preMedElectiveCourses),
    ],
    checkerWarning:
      'We do not check the 3-credit cap on special studies coursework, forbidden overlaps, or the limit on credits taken abroad.',
    fulfilledBy: 'credits',
    perSlotMinCount: [14],
  },
  {
    name: 'Grade Requirement',
    description:
      'Required cumulative GPA: 2.0. Students must complete requirements with a letter grade whenever possible and receive a C- or higher. ' +
      'If a course is offered exclusively S/U (SX/UX), a grade of SX must be obtained. Each course may only count towards one requirement unless otherwise stated.',
    source: 'https://catalog.cornell.edu/programs/health-care-policy-major-bs/',
    fulfilledBy: 'self-check',
  },
];

export default hcpRequirements;

export const hcpAdvisors: AdvisorGroup = {
  advisors: [],
};

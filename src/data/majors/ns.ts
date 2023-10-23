import { CollegeOrMajorRequirement, Course } from '../../requirements/types';
import {
  courseIsFWS,
  hasCategory,
  ifCodeMatch,
  includesWithSubRequirements,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const nsSocialSciencesHumanities: readonly string[] = ['CA', 'D', 'FL', 'HA', 'KCM', 'LA', 'SBA'];

const nsRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Introductory Chemistry',
    description: 'Must take both CHEM2070 & CHEM2080',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28314#majorrequire',
    checker: includesWithSubRequirements(['CHEM2070'], ['CHEM2080']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['CHEM 2070', 'CHEM 2080'],
    minNumberOfSlots: 2,
  },
  {
    name: 'Introductory Biology',
    description:
      'Must complete one bio lab and two bio lectures. One of the following labs: BIOG1500, BIOSM1500. Two of the following three lecture options: 1) BIOMG1350 2) BIOG1440 OR BIOG1445 (cannot take both 1440 and 1445 to fulfill this requirement) 3) BIOEE1610 OR BIOEE1780 (cannot take both 1610 and 1780 to fulfill this requirement) ',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28314#majorrequire',
    checker: includesWithSubRequirements(
      ['BIOG1500', 'BIOSM1500'],
      ['BIOMG1350', 'BIOG1440', 'BIOG1445', 'BIOEE1610', 'BIOEE1780']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 2],
    slotNames: ['Introductory Biology Laboratory', 'Introductory Biology Lecture'],
  },
  {
    name: 'Organic Chemistry Lecture',
    description: 'CHEM 1570 OR CHEM 3570 & 3580 OR CHEM 3590 & 3600 OR CHEM 3530',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=41&poid=19800',
    checker: includesWithSubRequirements(
      ['CHEM 1570'],
      ['CHEM 3570', 'CHEM 3580'],
      ['CHEM 3590', 'CHEM 3600'],
      ['CHEM 3530']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 2, 2, 1],
    slotNames: ['CHEM 1570', 'CHEM 3570 or CHEM 3580', 'CHEM 3590 or CHEM 3600', 'CHEM 3530'],
    minNumberOfSlots: 1,
  },
  {
    name: 'Organic Chemistry Lab',
    description: 'Either CHEM2510 (Intro to Exp Org. Chem) or CHEM3010 (Honors Exp. Chem I)',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28314',
    checker: includesWithSubRequirements(['CHEM2510', 'CHEM3010']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Organic Chem Lab'],
  },
  {
    name: 'Physiology',
    description: 'Choose one of the two physiology courses: NS3410, BIOAP3110',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28314',
    checker: includesWithSubRequirements(['NS 3410', 'BIOAP 3110']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Physiology'],
  },
  {
    name: 'Biochemistry',
    description: 'NS3200 OR BIOMG3300 OR BIOMG3310 & 3320 OR BIOMG3310 & 2900 OR BIOMG3350',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28314',
    checker: includesWithSubRequirements(
      ['NS 3200'],
      ['BIOMG 3300'],
      ['BIOMG 3310', 'BIOMG 3320'],
      ['BIOMG 3310', 'BIOMG 2900'],
      ['BIOMG 3350']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 2, 2, 1],
    slotNames: [
      'NS3200',
      'BIOMG 3300',
      'BIOMG3310 & BIOMG3320',
      'BIOMG3310 & BIOMG3320',
      'BIOMG3350',
    ],
    minNumberOfSlots: 1,
  },
  {
    name: 'Nutritional Sciences Core Courses',
    description: '5 core courses required for the nutritional sciences major.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28314',
    checker: includesWithSubRequirements(
      ['NS 1150'],
      ['NS 2450'],
      ['NS 3450'],
      ['NS 3310'],
      ['NS3320']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
    slotNames: ['NS 1150', 'NS 2450', 'NS 3450', 'NS 3310', 'NS 3320'],
    minNumberOfSlots: 5,
  },
  {
    name: 'Advanced Electives in Nutrition',
    description: 'At least 9 credits of NS courses 3000 level or above.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28314',
    checkerWarning:
      'May include no more than a total of 3 credits from NS4000, NS4010, NS4020, NS4990. May include NS3410 only if BIOAP3110 is used to fulfill the physiology requirement.',
    checker: includesWithSubRequirements([
      'NS 4450',
      'NS 4480',
      'NS 4570',
      'NS 3600',
      'NS 4300',
      'NS 4500',
      'NS 4600',
      'NS 4880',
      'NS 3150',
      'PSYCH 3150',
      'NS 3420',
      'NS 4200',
      'NS 4410',
      'NS 4420',
      'NS 4300',
      'NS 6310',
      'NS 6320',
      'NS 4250',
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Advanced Electives'],
  },
  {
    name: 'Communications',
    description:
      'Complete 9 credits of courses in written and oral expression, at least 6 of which must be written expression. FWS, COMM, and ENGL classes fulfill this requirement',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28314#majorrequire',
    checker: [
      (course: Course): boolean => {
        if (
          !(
            ifCodeMatch(course.subject, 'ENGL') ||
            ifCodeMatch(course.subject, 'COMM') ||
            courseIsFWS
          )
        ) {
          return false;
        }
        return true;
      },
    ],
    perSlotMinCount: [3],
    slotNames: ['Communcations Courses'],
    minNumberOfSlots: 1,
    fulfilledBy: 'courses',
    additionalRequirements: {
      'Courses must have at least 9 credits.': {
        checker: [
          (course: Course): boolean =>
            nsSocialSciencesHumanities.some(
              distribution => hasCategory(course, distribution) ?? false
            ),
        ],
        fulfilledBy: 'credits',
        perSlotMinCount: [9],
      },
    },
  },
  {
    name: 'Social Sciences and Humanities',
    description: 'Complete 12 credits, including four courses of at least 3 cr each.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28314',
    checker: [
      (course: Course): boolean =>
        nsSocialSciencesHumanities.some(distribution => hasCategory(course, distribution) ?? false),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [4],
    slotNames: ['Course'],
    additionalRequirements: {
      'Courses must be from 3 categories.': {
        checker: [
          (course: Course): boolean => course.catalogDistr?.includes('D') ?? false,
          ...nsSocialSciencesHumanities
            .filter(it => it !== 'D')
            .map(distribution => (course: Course): boolean =>
              hasCategory(course, distribution) ?? false
            ),
        ],
        fulfilledBy: 'courses',
        perSlotMinCount: [1, 1, 1, 1],
        slotNames: ['D', ...nsSocialSciencesHumanities.filter(it => it !== 'D')],
        minNumberOfSlots: 3,
      },
      'Courses must have at least 12 credits.': {
        checker: [
          (course: Course): boolean =>
            nsSocialSciencesHumanities.some(
              distribution => hasCategory(course, distribution) ?? false
            ),
        ],
        fulfilledBy: 'credits',
        perSlotMinCount: [12],
      },
    },
  },
  {
    name: 'Calculus/Advanced Math',
    description:
      'Choose one of the following math courses: MATH 1105, MATH 1106, MATH 1110, MATH 1120',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28314',
    checker: includesWithSubRequirements(['MATH 1105', 'MATH 1106', 'MATH 1110', 'MATH 1120']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['MATH 1105 OR MATH 1106 OR MATH 1110 OR MATH 1120'],
    minNumberOfSlots: 1,
  },
  {
    name: 'Statistics',
    description:
      'Choose one of the following statistics courses: STSCI 2150, PUBPOL 2100, AEM 2100, BTRY 3010, ILRST 2100, STSCI 2100, MATH 1710, PSYCH 2500, SOC 3010',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28314',
    checker: includesWithSubRequirements([
      'STSCI 2150',
      'PUBPOL 2100',
      'AEM 2100',
      'BTRY 3010',
      'ILRST 2100',
      'STSCI 2100',
      'MATH 1710',
      'PSYCH 2500',
      'SOC 3010',
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: [
      'STSCI 2150, PUBPOL 2100, AEM 2100, BTRY 3010, ILRST 2100, STSCI 2100, MATH 1710, PSYCH 2500, OR SOC 3010',
    ],
  },
  {
    name: 'Electives',
    description: 'Any courses that are not applied to the requirements above count as Electives.',
    source:
      'https://www.human.cornell.edu/sites/default/files/Academics/Registrar/Curriculum%20sheets/2020-2021/HD%20Curriculum%20Sheet%202020-2021.pdf',
    fulfilledBy: 'self-check',
  },
];

export default nsRequirements;

export const nsAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Emily Fenuccio', email: 'dnsstudentservices@cornell.edu' }],
};

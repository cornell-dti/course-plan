import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  courseIsFWS,
  includesWithSingleRequirement,
  includesWithSubRequirements,
  ifCodeMatch,
  courseIsForeignLang,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';
import { lastNameRange, lastNameRanges } from '../../tools/advisors/checkers';

const engineeringLiberalArtsDistributions: readonly string[] = [
  'CA',
  'HA',
  'LA',
  'LAD',
  'KCM',
  'SBA',
  'FL',
  'CE',
  'ALC',
  'SCD',
  'HST',
  'ETM',
  'SSC',
  'GLC',
];

const engineeringRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Mathematics',
    description: 'MATH 1910, 1920, 2930 or 2940, and a mathematics course chosen by the Major.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: includesWithSubRequirements(['MATH 1910'], ['MATH 1920'], ['MATH 2930', 'MATH 2940']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['MATH 1910', 'MATH 1920', 'MATH 2930 or MATH 2940'],
  },
  {
    name: 'Physics',
    description:
      'PHYS 1112 and 2213, or the corresponding honors courses (PHYS 1116 and PHYS 2217). ' +
      'Depending on the Major, also either PHYS 2214 / PHYS 2218 or a designated mathematics or science course.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: includesWithSubRequirements(['PHYS 1112', 'PHYS 1116'], ['PHYS 2213', 'PHYS 2217']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['PHYS 1112 or PHYS 1116', 'PHYS 2213 or PHYS 2217'],
  },
  {
    name: 'Chemistry',
    description:
      'CHEM 2090. Majors in Chemical Engineering or those planning on a health-related career should take CHEM 2090 and then 2080. ' +
      'Students in Environmental Engineering should take CHEM 2090 and CHEM 1570/3570. ' +
      'Earth and Atmospheric Sciences majors should take CHEM 2090 and then 2080/1570.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: includesWithSingleRequirement('CHEM 2090'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'First-Year Writing Seminars',
    description: 'All students are required to take two first-year writing seminars.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: [courseIsFWS],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  {
    name: 'Computing',
    description: 'CS 1110, 1112, 1114, or 1115.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: includesWithSingleRequirement('CS 1110', 'CS 1112', 'CS 1114', 'CS 1115'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Introduction to Engineering',
    description: 'One introduction to engineering (ENGRI) course.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: [(course: Course): boolean => course.subject === 'ENGRI'],
    fulfilledBy: 'credits',
    perSlotMinCount: [3],
  },
  {
    name: 'Engineering Distribution',
    description:
      'Two different category distribution courses (ENGRD), one of which may be required by the Major.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: [(course: Course): boolean => course.subject === 'ENGRD'],
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Liberal Studies: 6 courses',
    description: 'A minimum of six courses must be taken.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/advising/liberal-studies',
    checker: [
      (course: Course): boolean =>
        engineeringLiberalArtsDistributions.some(
          distribution => course.catalogDistr?.includes(distribution) ?? false
        ) || courseIsForeignLang(course),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [6],
    slotNames: ['Course'],
    additionalRequirements: {
      'Courses must be from 3 categories.': {
        checker: [
          (course: Course): boolean =>
            (course.catalogDistr?.includes('LA') || course.catalogDistr?.includes('LAD')) ?? false,
          ...engineeringLiberalArtsDistributions
            .filter(it => it !== 'LA' && it !== 'LAD')
            .map(distribution => (course: Course): boolean =>
              course.catalogDistr?.includes(distribution) ?? false
            ),
        ],
        fulfilledBy: 'courses',
        perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        slotNames: [
          'LA',
          ...engineeringLiberalArtsDistributions.filter(it => it !== 'LA' && it !== 'LAD'),
        ],
        minNumberOfSlots: 3,
      },
      'Courses must have at least 18 credits.': {
        checker: [
          (course: Course): boolean =>
            engineeringLiberalArtsDistributions.some(
              distribution => course.catalogDistr?.includes(distribution) ?? false
            ) || courseIsForeignLang(course),
        ],
        fulfilledBy: 'credits',
        perSlotMinCount: [18],
      },
      'Two courses must be at the 2000 level or higher.': {
        checker: [
          (course: Course): boolean => {
            const { catalogNbr } = course;
            return (
              !ifCodeMatch(catalogNbr, '1***') &&
              (engineeringLiberalArtsDistributions.some(
                category => course.catalogDistr?.includes(category) ?? false
              ) ||
                courseIsForeignLang(course))
            );
          },
        ],
        fulfilledBy: 'courses',
        perSlotMinCount: [2],
        slotNames: ['Course'],
      },
    },
  },

  // TODO: Create special function for this as it is the same as Advisor-Approved Electives for CS checker
  {
    name: 'Advisor-Approved Electives',
    description:
      'At least 6 credit hours total. All academic courses count. ' +
      'No PE courses, courses numbered 10xx, and ROTC courses below the 3000-level allowed.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements',
    checker: [
      (course: Course): boolean => {
        const { subject, catalogNbr } = course;
        return !(ifCodeMatch(subject, 'PE') || ifCodeMatch(catalogNbr, '10**'));
      },
    ],
    checkerWarning: 'We do not check that the courses are advisor approved.',
    fulfilledBy: 'credits',
    perSlotMinCount: [6],
  },
  // TODO: Remove warning once we can filter reqs based on majors (ISST) and petitions
  {
    name: 'Engineering Communications',
    description:
      'Students can fulfill the requirement in one of the six ways including taking a Engineering Communications course (ENGRC), ' +
      'Writing-Intensive Co-op, Writing/Communication Intensive engineering course, COMM 3030/3020, ENGRC 3023, 1cr partner course, or petition for credit.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/engineering-communications-program/technical',
    checker: includesWithSingleRequirement(
      'ENGRC 3500',
      'ENGRC 3020',
      'ENGRC 3350',
      'ENGRC 3340',
      'ENGRD 2640',
      'AEP 2640',
      'CHEME 4320',
      'MAE 4272',
      'BEE 4730',
      'BEE 4890',
      'BEE 4530',
      'BEE 4590',
      'CIS 3000',
      'INFO 1200',
      'COMM 3030',
      'COMM 3020',
      'ENGRC 3023',
      'ENGRC 2640',
      'ENGRC 3152',
      'ENGRC 3160',
      'ENGRC 4152',
      'ENGRC 4530',
      'ENGRC 4890',
      'MSE 4030',
      'MSE 4040',
      'MSE 4050',
      'MSE 4060'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    checkerWarning:
      'We do not check that your selected course fulfills the guidelines of this requirement.',
    allowCourseDoubleCounting: true,
  },
];

export default engineeringRequirements;

export const engineeringAdvisors: AdvisorGroup = {
  advisors: [
    {
      name: 'Liane Fitzgerald',
      email: 'lnf27@cornell.edu',
      checker: lastNameRange('E', 'J'),
    },
    {
      name: 'Ryan DeLany',
      email: 'rd525@cornell.edu',
      checker: lastNameRanges([
        ['C', 'D'],
        ['Q', 'Z'],
      ]),
    },
    {
      name: 'Benjamin Martin',
      email: 'bem87@cornell.edu',
      checker: lastNameRanges([
        ['A', 'B'],
        ['K', 'P'],
      ]),
    },
    {
      name: 'Alexandria Pizzola',
      email: 'anp63@cornell.edu',
    },
  ],
  source: 'https://www.engineering.cornell.edu/students/undergraduate-students/advising/meet-staff',
};

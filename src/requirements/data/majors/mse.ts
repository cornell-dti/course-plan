import { Course, CollegeOrMajorRequirement } from '../../types';

import {
  ifCodeMatch,
  includesWithSubRequirements,
  includesWithSingleRequirement,
} from '../checkers-common';

// courses that can be used for the materials elective
const materialsElectives = [
  'MSE 4100',
  'MSE 4610',
  'MSE 5210',
  'MSE 5310',
  'MSE 5320',
  'MSE 5430',
  'MSE 5550',
];

// 2d array of the 5 application categories and the courses that apply.
// The last one includes the research courses that can count for that category
const applicationElectives = [
  [
    'BEE 3400',
    'BEE 3650',
    'BME 3210',
    'BME 5810',
    'BME 5830',
    'BME 5850',
    'BME 6210',
    'BME 6670',
    'CHEME 4810',
    'FSAD 4390',
    'MAE 4640',
    'MSE 5230',
    'MSE 5620',
  ],
  [
    'CEE 3710',
    'CEE 4750',
    'CEE 6725',
    'CHEME 6660',
    'CHEME 6662',
    'EAS 4530',
    'ECE 4840',
    'MAE 4580',
    'MSE 4330',
    'MSE 5150',
    'MSE 5250',
    'MSE 5740',
  ],
  ['CHEME 6440', 'ECE 4320', 'MAE 4130', 'MSE 4890', 'MSE 5120', 'MSE 5410', 'MSE 5880'],
  [
    'CHEME 4800',
    'ECE 4070',
    'ECE 4300',
    'ECE 4360',
    'ECE 4370',
    'ECE 4570',
    'ECE 4820',
    'ECE 5350',
    'ECE 5390',
    'MSE 5420',
    'MSE 5450',
    'MSE 5460',
  ],
  [
    'MSE 2910',
    'MSE 2920',
    'MSE 3910',
    'MSE 3920',
    'MSE 4910',
    'MSE 4920',
    'AEP 4400',
    'AEP 4500',
    'CHEM 3890',
    'CHEME 6400',
    'CHEME 7740',
    'FSAD 3350',
    'FSAD 4360',
    'FSAD 6160',
    'FSAD 6200',
    'FSAD 6660',
    'FSAD 6860',
    'MAE 4670',
    'MSE 5240',
    'MSE 5320',
    'MSE 5710',
    'MSE 5715',
    'MSE 5720',
    'MSE 5730',
    'MSE 6550',
    'PHYS 3316',
  ],
];

const mseRequirements: readonly CollegeOrMajorRequirement[] = [
  // TODO: Require one of these courses to be MSE, one to be ENGRD
  {
    name: 'MSE Engineering Distributions',
    description:
      'One of MSE 2610 and MSE 2620 should be taken as an ENGRD to satisfy affiliation requirements, the other as an MSE core course.',
    source:
      'https://www.mse.cornell.edu/mse/programs/undergraduate-programs/major/major-curriculum',
    checker: includesWithSubRequirements(['MSE 2610', 'ENGRD 2610'], ['MSE 2620', 'ENGRD 2620']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['MSE 2610', 'MSE 2620'],
  },
  {
    name: 'Core Courses',
    description: 'MSE 2060, MSE 3010, MSE 3030, MSE 3040, MSE 3050, and MSE 4020.',
    source:
      'https://www.mse.cornell.edu/mse/programs/undergraduate-programs/major/major-curriculum',
    checker: includesWithSubRequirements(
      ['MSE 2060'],
      ['MSE 3010'],
      ['MSE 3030'],
      ['MSE 3040'],
      ['MSE 3050'],
      ['MSE 4020']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1],
    slotNames: ['MSE 2060', 'MSE 3010', 'MSE 3030', 'MSE 3040', 'MSE 3050', 'MSE 4020'],
  },
  {
    name: 'Junior Courses',
    description:
      'All juniors take laboratory courses, courses in technical and professional skills, and design courses.',
    source:
      'https://www.mse.cornell.edu/mse/programs/undergraduate-programs/major/major-curriculum',
    checker: includesWithSubRequirements(['MSE 3110'], ['MSE 3120'], ['ENGRC 3111'], ['MSE 3070']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: ['MSE 3110', 'MSE 3120', 'ENGRC 3111', 'MSE 3070'],
  },
  {
    name: 'Senior Lab or Thesis',
    description:
      'Seniors may decide between an intensive one semester senior laboratory course or a two semester senior thesis project.',
    source:
      'https://www.mse.cornell.edu/mse/programs/undergraduate-programs/major/major-curriculum',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Laboratory Course': {
        description: 'MSE 4030, offered in fall term only.',
        checker: includesWithSingleRequirement('MSE 4030'),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['Course'],
      },
      'Thesis Project': {
        description: 'MSE 4050 and MSE 4060.',
        checker: includesWithSubRequirements(['MSE 4050'], ['MSE 4060']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['MSE 4050', 'MSE 4060'],
      },
    },
  },
  {
    name: 'Senior Design',
    description:
      'Seniors must take a design course in the fall (MSE 5070, 4 credits) or spring (MSE 4070, 3 credits).',
    source:
      'https://www.mse.cornell.edu/mse/programs/undergraduate-programs/major/major-curriculum',
    checker: includesWithSingleRequirement('MSE 5070', 'MSE 4070'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
  },
  {
    name: 'Materials Electives',
    description:
      'Two material electives to provide depth of knowledge in at least two different classes of materials.',
    source:
      'https://www.mse.cornell.edu/mse/programs/undergraduate-programs/major/major-curriculum',
    checker: includesWithSubRequirements(materialsElectives),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['Course'],
  },
  // TODO - We do not have a way of checking if they took only 1 course under MSE, at least for cross-listed courses
  // TODO - Limit to only 1 semester of research involvement
  {
    name: 'Materials Applications Electives: 3 courses',
    description:
      'Students are required to take 3 Materials Applications courses. One of these must be an MSE course and two must be taken from other departments (non-MSE number). ' +
      'All Materials Electives can be used, and one semester of research involvement may be used.',
    source:
      'https://www.mse.cornell.edu/mse/programs/undergraduate-programs/major/major-curriculum/electives',
    checker: [
      (course: Course): boolean => {
        if (materialsElectives.includes(`${course.subject} ${course.catalogNbr}`)) {
          return true;
        }

        let courseApplicable = false;
        applicationElectives.forEach(category => {
          if (category.includes(`${course.subject} ${course.catalogNbr}`)) {
            courseApplicable = true;
          }
        });

        return courseApplicable;
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  {
    name: 'Materials Applications Electives: 2 categories',
    description:
      'Students are required to take Materials Applications courses from at least two different categories. One of these must be an MSE course ' +
      'and two must be taken from other departments (non-MSE number). One semester of research involvement may be used in the Materials Research category.',
    source:
      'https://www.mse.cornell.edu/mse/programs/undergraduate-programs/major/major-curriculum/electives',
    checker: [
      ...applicationElectives.map(categoryCourses => (course: Course): boolean =>
        categoryCourses?.includes(`${course.subject} ${course.catalogNbr}`) ?? false
      ),
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1],
    slotNames: [
      'Biotechnology and Life Sciences',
      'Energy and the Environment',
      'Nanotechnology',
      'Information Science and Technology',
      'Materials Research',
    ],
    minNumberOfSlots: 2,
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Outside Technical Elective',
    description:
      "Any advanced (2000 level or above) technical (engineering or physical science) course that fits into the student's educational objectives outside MSE.",
    source:
      'https://www.mse.cornell.edu/mse/programs/undergraduate-programs/major/major-curriculum',
    checker: [
      (course: Course): boolean => {
        const { subject, catalogNbr } = course;
        return !ifCodeMatch(catalogNbr, '1***') && !ifCodeMatch(subject, 'MSE');
      },
    ],
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    checkerWarning:
      "We do not check that the course is considered technical or fits into the student's educational objectives.",
  },
  {
    name: 'Advanced Math',
    description:
      'At least one elective course must meet the advanced mathematics or mathematical/computational modeling requirement. Courses that count will normally ' +
      'be at the 3000 level or above (with some 2000 level exceptions) and are beyond MATH 2930 or 2940 (having 2930/2940 as prerequisites is common).',
    source:
      'https://www.mse.cornell.edu/mse/programs/undergraduate-programs/major/major-curriculum/advanced-math-requirements',
    checker: includesWithSingleRequirement(
      'AEP 4210',
      'AEP 4380',
      'BEE 4600',
      'BME 5400',
      'BTRY 3080',
      'CEE 3040',
      'CEE 3710',
      'CS 2024',
      'CS 2800',
      'CS 3110',
      'CS 4220',
      'CS 4780',
      'CS 4787',
      'ECE 3250',
      'ECE 4110',
      'ENGRD 2110',
      'ENGRD 2700',
      'ENGRD 3100',
      'ENGRD 3200',
      'ENGRD 3220',
      'MAE 3100',
      'MAE 4700',
      'MAE 4730',
      'MAE 5930',
      'MATH 4720',
      'MSE 5720',
      'MSE 5730',
      'ORIE 3500',
      'ORIE 4580',
      'ORIE 5581',
      'PHYS 6553',
      'STSCI 3080',
      'STSCI 3100',
      'STSCI 4120'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Course'],
    allowCourseDoubleCounting: true,
  },
];

export default mseRequirements;

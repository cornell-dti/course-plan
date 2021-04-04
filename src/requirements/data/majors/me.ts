import { CollegeOrMajorRequirement, Course } from '../../types';
import {
  ifCodeMatch,
  includesWithSingleRequirement,
  includesWithSubRequirements,
} from '../checkers-common';

const mechnicalEngineeringRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Engineering Distriubtions',
    description: 'ENGRD 2020',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=20022#MechanicalEngineering',
    checker: includesWithSingleRequirement('ENGRD 2020'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    allowCourseDoubleCounting: true,
  },
  {
    name: 'Required Major Courses',
    description:
      'MAE 2250, MAE 2030, MAE 3230, MAE 3240, MAE 3260, MAE 3270, (MAE 3780, ENGRD 2100, or PHYS 3360), MAE 4272, and MAE 4300',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=20022#MechanicalEngineering',
    checker: includesWithSubRequirements(
      ['MAE 2250'],
      ['MAE 2030'],
      ['MAE 3230'],
      ['MAE 3240'],
      ['MAE 3260'],
      ['MAE 3270'],
      ['MAE 3780', 'ENGRD 2100', 'PHYS 3360'],
      ['MAE 4272'],
      ['MAE 4300']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    name: 'M.E. Major Electives',
    description:
      'A list of approved Major-approved Electives is available online at www.mae.cornell.edu',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=20022#MechanicalEngineering',
    checker: includesWithSingleRequirement(
      'MAE 3050',
      'MAE 4060',
      'MAE 4150',
      'MAE 4160',
      'MAE 4230',
      'MAE 5070',
      'MAE 4640',
      'MAE 4650',
      'MAE 4660',
      'MAE 5680',
      'MAE 4020',
      'MAE 4120',
      'MAE 4230',
      'MAE 4580',
      'MAE 4590',
      'MAE 5010',
      'MAE 5430',
      'MAE 3120',
      'MAE 3130',
      'MAE 4130',
      'MAE 4640',
      'MAE 4700',
      'MAE 5130',
      'MAE 4150',
      'MAE 4180',
      'MAE 4320',
      'MAE 4340',
      'MAE 4700',
      'MAE 4710',
      'MAE 4730',
      'MAE 4760',
      'MAE 4770',
      'MAE 4780',
      'MAE 5120',
      'MAE 5200',
      'MAE 5770',
      'MAE 5910',
      'MAE 4230',
      'MAE 4510',
      'MAE 4530',
      'MAE 5010',
      'MAE 5430',
      'MAE 3050',
      'MAE 4250',
      'MAE 4860',
      'MAE 5070'
    ),
    fulfilledBy: 'credits',
    perSlotMinCount: [9],
  },
  {
    name: 'Design Requirement',
    description:
      'Each Mechanical Engineering student must complete a senior design elective. One way of satisfying this requirement is to take a 3+ credit section of MAE 4291, directed by a faculty member as an individual or team exercise. ' +
      'The other option is to take a 4-credit senior design elective course (MAE 4021,  MAE 4121, MAE 4131 , MAE 4141,MAE 4161, MAE 4231, MAE 4341, MAE 4641, MAE 4651, MAE 4701, or MAE 4861).',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=20022#MechanicalEngineering',
    checker: includesWithSingleRequirement(
      'MAE 4291',
      'MAE 4021',
      'MAE 4121',
      'MAE 4131',
      'MAE 4141',
      'MAE 4161',
      'MAE 4231',
      'MAE 4341',
      'MAE 4641',
      'MAE 4651',
      'MAE 4701',
      'MAE 4861'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    name: 'Mathematics Elective',
    description:
      'Must be an upper-level mathematics course, which includes statistics, taken after Math 2940. A list of approved math electives is available online at www.mae.cornell.edu',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=20022#MechanicalEngineering',
    checker: includesWithSingleRequirement(
      'MAE 3100',
      'ENGRD 2700',
      'CEE 3040',
      'ENGRD 3100',
      'ENGRD 3200',
      'BTRY 3010',
      'CS 2800',
      'CS 4750'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
  {
    // TODO: update checker based on more information (ex: filter out humanities)
    name: 'Technical Elective',
    description:
      'The technical elective may be any course at an appropriate level, chosen from engineering, math, or science (physics, chemistry, or biological sciences). Appropriate level is interpreted as being at a level beyond the required courses of the college curriculum.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=41&poid=20022#MechanicalEngineering',
    checker: [
      (course: Course): boolean => {
        const { catalogNbr } = course;
        return !ifCodeMatch(catalogNbr, '1***');
      },
    ],
    checkerWarning: 'We do not check that the courses are considered technical.',
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
  },
];

export default mechnicalEngineeringRequirements;

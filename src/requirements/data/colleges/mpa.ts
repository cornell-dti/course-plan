import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSubRequirements } from '../checkers-common';

const mpaRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Core Competency Foundation Coursework',
    description:
      'Two courses in each of the three foundation areas listed below with one course in each of the foundation sub-areas.',
    source: 'https://www.human.cornell.edu/cipa/academics/curriculum/guide',
    checker: includesWithSubRequirements(
      ['PADM 5110', 'PADM 5410', 'PADM 5450', 'PADM 5414'],
      ['PADM 5130', 'PADM 5380', 'PADM 5619', 'PADM 5570', 'PADM 5634'],
      ['PADM 5210', 'PADM 5470'],
      ['PADM 5220', 'PAM 5130', 'PAM 5170', 'PAM 5400'],
      ['PADM 5310', 'PAM 5690'],
      ['PADM 5320', 'PADM 5340', 'PADM 5345', 'PAM 5300']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1],
    slotNames: [
      'Administrative, Political and Policy Processes 1',
      'Administrative, Political and Policy Processes 2',
      'Economic Analysis and Public Sector Economics 1',
      'Economic Analysis and Public Sector Economics 2',
      'Quantitative Methods and Analytics 1',
      'Quantitative Methods and Analytics 2',
    ],
    minNumberOfSlots: 6,
  },
  {
    name: 'Additional Foundation Coursework',
    description: 'Three additional semester-length courses (or equivalent) in any of the three Foundation Areas',
    source: 'https://www.human.cornell.edu/cipa/academics/curriculum/guide',
    checker: includesWithSubRequirements([
      'PADM 5110', 'PADM 5410', 'PADM 5450', 'PADM 5414','PADM 5130', 'PADM 5380', 'PADM 5619', 'PADM 5570', 'PADM 5634’,’PADM 5210', 'PADM 5470’,’PADM 5220', 'PAM 5130', 'PAM 5170', 'PAM 5400’,’PADM 5310', 'PAM 5690’, ‘PADM 5320', 'PADM 5340', 'PADM 5345', 'PAM 5300'
    ]),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  // // Five courses within one of the eight concentration areas offered in the program.
  // {
  //   name: 'Concentration Coursework',
  //   description: 'Must take BTRY 3080, CS 4850, ECE 3100, ECON 3130, ENGRD 2700, or MATH 4710.',
  //   source: 'https://www.cs.cornell.edu/undergrad/csmajor',
  //   allowCourseDoubleCounting: true,
  //   checker: includesWithSubRequirements([
  //     'BTRY 3080',
  //     'CS 4850',
  //     'ECE 3100',
  //     'ECON 3130',
  //     'ENGRD 2700',
  //     'MATH 4710',
  //   ]),
  //   fulfilledBy: 'courses',
  //   perSlotMinCount: [1],
  //   slotNames: ['Course'],
  // },
  // {
  //   name: 'Professional Development Coursework',
  //   description: 'Must take BTRY 3080, CS 4850, ECE 3100, ECON 3130, ENGRD 2700, or MATH 4710.',
  //   source: 'https://www.cs.cornell.edu/undergrad/csmajor',
  //   allowCourseDoubleCounting: true,
  //   checker: includesWithSubRequirements([
  //     'BTRY 3080',
  //     'CS 4850',
  //     'ECE 3100',
  //     'ECON 3130',
  //     'ENGRD 2700',
  //     'MATH 4710',
  //   ]),
  //   fulfilledBy: 'courses',
  //   perSlotMinCount: [1],
  //   slotNames: ['Course'],
  // },
];

export default mpaRequirements;

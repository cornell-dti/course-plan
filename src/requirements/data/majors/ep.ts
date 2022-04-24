import { Course, CollegeOrMajorRequirement } from '../../types';
import { includesWithSubRequirements, ifCodeMatch } from '../checkers-common';

const epRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Required Courses',
    description: 'The major requirements are as follows.',
    source:
      'https://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/fall2021/#pg76',
    checker: includesWithSubRequirements(
      ['AEP 3200'],
      ['AEP 4200'],
      ['AEP 3330'],
      ['AEP 3550'],
      ['AEP 3610'],
      ['AEP 4230'],
      ['AEP 3560', 'AEP 3620', 'AEP 4340']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1, 1, 1, 2],
    slotNames: [
      'AEP 3200',
      'AEP 4200',
      'AEP 3330',
      'AEP 3550',
      'AEP 3610',
      'AEP 4230',
      'Intermediate Mechanics Course',
    ],
  },
  {
    name: 'Electronic Circuits Lab',
    description: 'Students can either take AEP 3630 or take ECE 2100 and ECE 2300.',
    source:
      'https://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/fall2021/#pg79',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'AEP 3630': {
        description: '',
        checker: includesWithSubRequirements(['AEP 3630']),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['AEP 3630'],
      },
      'ECE 2100 and ECE 2300': {
        description: '',
        checker: includesWithSubRequirements(['ECE 2100'], ['ECE 2300']),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['ECE 2100', 'ECE 2300'],
      },
    },
  },
  {
    name: 'Experimental Physics Lab',
    description: 'Students can either take either PHYS 4410 or a combination of two courses.',
    source:
      'https://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/fall2021/#pg79',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'PHYS 4410': {
        description: '',
        checker: includesWithSubRequirements(['PHYS 4410']),
        counting: 'courses',
        perSlotMinCount: [1],
        slotNames: ['PHYS 4410'],
      },
      'Alternate Option': {
        description:
          'Two of the four credits of PHYS 4410 can be satisfied by completing AEP 3300/PHYS 3330, ASTRO 4410, or PHYS 3310. ' +
          'The remaining two credits can be satisfied by taking PHYS 4400 for two credits, provided that the experiments in PHYS 4400 do not overlap with those in AEP 3300/PHYS 3330 or ASTRO 4410 or PHYS 3310.',
        checker: includesWithSubRequirements(
          ['AEP 3300', 'ASTRO 4410', 'PHYS 3310'],
          ['PHYS 4400']
        ),
        counting: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['AEP 3300, ASTRO 4410, or PHYS 3310', 'PHYS 4400'],
      },
    },
  },
  {
    name: 'Major-approved Elective(s)',
    description:
      'Six major-approved electives (18-24 credits). All must be technical courses taken for a letter grade. ' +
      'Five of the six courses must be upper-level courses (3000 level or above). ' +
      'Nine credits of major-approved electives must be outside of AEP.',
    source: 'https://cornellengineeringhandbook.freeflowdp.com/cornellengineeringhandbook/fall2021/#pg79',
    // Currently, the user must override in order to apply a non-upper-level course
    // TODO implement as compound requirement:
    // at least 18 credits
    // at least 5 courses 3000+ level
    // at least 9 credits outside of AEP
    checker: [
      (course: Course): boolean => {
        const { catalogNbr } = course;
        return !(ifCodeMatch(catalogNbr, '1***') || ifCodeMatch(catalogNbr, '2***'));
      },
    ],
    checkerWarning: 'We do not check that the courses are major-approved or considered technical.',
    fulfilledBy: 'courses',
    perSlotMinCount: [6],
    slotNames: ['Course'],
  },
];

export default epRequirements;
